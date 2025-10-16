"use client"

import { useState } from "react"
import { Search, Plane, Clock, DollarSign, Users, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { BookingConfirmation } from "@/components/booking-confirmation"

interface Flight {
  id: string
  flightNumber: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  price: number
  availableSeats: number
  status: string
}

export function FlightSearch() {
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [passengerName, setPassengerName] = useState("")
  const [passengerEmail, setPassengerEmail] = useState("")
  const [bookingLoading, setBookingLoading] = useState(false)
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null)

  const searchFlights = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (origin) params.append("origin", origin)
      if (destination) params.append("destination", destination)

      const response = await fetch(`/api/flights?${params}`)
      const data = await response.json()
      setFlights(data.flights || [])
    } catch (error) {
      console.error("[v0] Error searching flights:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookFlight = async () => {
    if (!selectedFlight || !passengerName || !passengerEmail) {
      return
    }

    setBookingLoading(true)
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flightId: selectedFlight.id,
          passengerName,
          passengerEmail,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setConfirmedBooking({
          id: data.booking.id,
          flightNumber: selectedFlight.flightNumber,
          origin: selectedFlight.origin,
          destination: selectedFlight.destination,
          departureTime: selectedFlight.departureTime,
          passengerName: data.booking.passengerName,
          passengerEmail: data.booking.passengerEmail,
          seatNumber: data.booking.seatNumber,
        })
        setSelectedFlight(null)
        setPassengerName("")
        setPassengerEmail("")
      } else {
        alert(data.error || "Booking failed")
      }
    } catch (error) {
      console.error("[v0] Error booking flight:", error)
      alert("Failed to book flight")
    } finally {
      setBookingLoading(false)
    }
  }

  if (confirmedBooking) {
    return (
      <BookingConfirmation
        booking={confirmedBooking}
        onClose={() => {
          setConfirmedBooking(null)
          searchFlights()
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-bold text-foreground">Search Flights</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="origin">Origin</Label>
            <Input
              id="origin"
              placeholder="e.g., JFK"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              placeholder="e.g., LAX"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={searchFlights} disabled={loading} className="w-full">
              <Search className="mr-2 h-4 w-4" />
              {loading ? "Searching..." : "Search Flights"}
            </Button>
          </div>
        </div>
      </Card>

      {flights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Available Flights ({flights.length})</h3>
          {flights.map((flight) => (
            <Card key={flight.id} className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="font-mono">
                      {flight.flightNumber}
                    </Badge>
                    <Badge
                      variant={
                        flight.status === "scheduled"
                          ? "default"
                          : flight.status === "delayed"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {flight.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Plane className="h-5 w-5 text-muted-foreground" />
                      <span className="text-lg font-semibold text-foreground">
                        {flight.origin} → {flight.destination}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(flight.departureTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {new Date(flight.arrivalTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(flight.departureTime).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{flight.availableSeats} seats available</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold text-foreground">{flight.price}</span>
                  </div>
                  <Button
                    onClick={() => setSelectedFlight(flight)}
                    disabled={flight.availableSeats === 0}
                    variant={selectedFlight?.id === flight.id ? "secondary" : "default"}
                  >
                    {selectedFlight?.id === flight.id ? "Selected" : "Select Flight"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedFlight && (
        <Card className="border-2 border-primary p-6">
          <h3 className="mb-4 text-xl font-bold text-foreground">Passenger Information</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="passengerName">Full Name</Label>
              <Input
                id="passengerName"
                placeholder="John Doe"
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="passengerEmail">Email Address</Label>
              <Input
                id="passengerEmail"
                type="email"
                placeholder="john@example.com"
                value={passengerEmail}
                onChange={(e) => setPassengerEmail(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="rounded-lg bg-muted p-4">
              <h4 className="mb-2 font-semibold text-foreground">Booking Summary</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  Flight: <strong className="text-foreground">{selectedFlight.flightNumber}</strong>
                </p>
                <p>
                  Route:{" "}
                  <strong className="text-foreground">
                    {selectedFlight.origin} → {selectedFlight.destination}
                  </strong>
                </p>
                <p>
                  Price: <strong className="text-foreground">${selectedFlight.price}</strong>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleBookFlight}
                disabled={!passengerName || !passengerEmail || bookingLoading}
                className="flex-1"
              >
                {bookingLoading ? "Processing..." : "Confirm Booking"}
              </Button>
              <Button variant="outline" onClick={() => setSelectedFlight(null)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {flights.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <Plane className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold text-foreground">No flights found</h3>
          <p className="text-sm text-muted-foreground">Try searching with different origin and destination</p>
        </Card>
      )}
    </div>
  )
}
