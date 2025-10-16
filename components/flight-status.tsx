"use client"

import { useState, useEffect } from "react"
import { Search, Plane, Clock, MapPin, AlertCircle, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

interface Flight {
  id: string
  flightNumber: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  status: "scheduled" | "boarding" | "departed" | "arrived" | "delayed" | "cancelled"
  gate?: string
  terminal?: string
}

export function FlightStatus() {
  const [flightNumber, setFlightNumber] = useState("")
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchFlights = async (searchQuery?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append("flightNumber", searchQuery)

      const response = await fetch(`/api/flights/status?${params}`)
      const data = await response.json()
      setFlights(data.flights || [])
      setLastUpdated(new Date())
    } catch (error) {
      console.error("[v0] Error fetching flight status:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchFlights(flightNumber)
  }

  useEffect(() => {
    fetchFlights()
  }, [])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchFlights(flightNumber || undefined)
    }, 30000)

    return () => clearInterval(interval)
  }, [autoRefresh, flightNumber])

  const getStatusIcon = (status: Flight["status"]) => {
    switch (status) {
      case "scheduled":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "boarding":
        return <Plane className="h-5 w-5 text-orange-500" />
      case "departed":
        return <Plane className="h-5 w-5 rotate-45 text-green-500" />
      case "arrived":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "delayed":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusColor = (status: Flight["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "boarding":
        return "bg-orange-100 text-orange-800"
      case "departed":
        return "bg-green-100 text-green-800"
      case "arrived":
        return "bg-green-100 text-green-800"
      case "delayed":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Flight Status Tracker</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchFlights(flightNumber || undefined)}
              disabled={loading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              Auto-refresh {autoRefresh ? "ON" : "OFF"}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-3">
            <Label htmlFor="flightNumber">Flight Number</Label>
            <Input
              id="flightNumber"
              placeholder="e.g., AA101"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="mt-1"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleSearch} disabled={loading} className="w-full">
              <Search className="mr-2 h-4 w-4" />
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          Last updated: {lastUpdated.toLocaleTimeString()} {autoRefresh && "• Auto-refreshing every 30 seconds"}
        </p>
      </Card>

      {flights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            {flightNumber ? "Search Results" : "All Flights"} ({flights.length})
          </h3>
          {flights.map((flight) => (
            <Card key={flight.id} className="overflow-hidden">
              <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(flight.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-foreground">{flight.flightNumber}</span>
                        <Badge className={getStatusColor(flight.status)}>{flight.status.toUpperCase()}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(flight.departureTime).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Departure</span>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-foreground">{flight.origin}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(flight.departureTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        {flight.terminal && (
                          <p className="text-xs text-muted-foreground">
                            Terminal {flight.terminal} {flight.gate && `• Gate ${flight.gate}`}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Arrival</span>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-foreground">{flight.destination}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(flight.arrivalTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {flight.status === "delayed" && (
                    <div className="rounded-lg bg-yellow-50 p-3">
                      <p className="text-sm text-yellow-900">
                        <strong>Delay Notice:</strong> This flight is experiencing delays. Please check with airline
                        staff for updated departure time.
                      </p>
                    </div>
                  )}

                  {flight.status === "cancelled" && (
                    <div className="rounded-lg bg-red-50 p-3">
                      <p className="text-sm text-red-900">
                        <strong>Flight Cancelled:</strong> Please contact the airline for rebooking options or refund
                        information.
                      </p>
                    </div>
                  )}

                  {flight.status === "boarding" && (
                    <div className="rounded-lg bg-orange-50 p-3">
                      <p className="text-sm text-orange-900">
                        <strong>Now Boarding:</strong> Please proceed to gate {flight.gate || "TBA"} for boarding.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center justify-center rounded-lg bg-muted p-4 md:w-32">
                  <Clock className="mb-2 h-6 w-6 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-lg font-bold text-foreground">
                    {Math.floor(
                      (new Date(flight.arrivalTime).getTime() - new Date(flight.departureTime).getTime()) /
                        (1000 * 60 * 60),
                    )}
                    h{" "}
                    {Math.floor(
                      ((new Date(flight.arrivalTime).getTime() - new Date(flight.departureTime).getTime()) /
                        (1000 * 60)) %
                        60,
                    )}
                    m
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {flights.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <Plane className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold text-foreground">No flights found</h3>
          <p className="text-sm text-muted-foreground">
            {flightNumber ? "Try searching with a different flight number" : "No flight data available"}
          </p>
        </Card>
      )}
    </div>
  )
}
