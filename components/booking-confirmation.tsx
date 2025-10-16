"use client"

import { CheckCircle, Plane, Calendar, User, Mail, MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface BookingConfirmationProps {
  booking: {
    id: string
    flightNumber: string
    origin: string
    destination: string
    departureTime: string
    passengerName: string
    passengerEmail: string
    seatNumber: string
  }
  onClose: () => void
}

export function BookingConfirmation({ booking, onClose }: BookingConfirmationProps) {
  const departureDate = new Date(booking.departureTime)

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Booking Confirmed!</h3>
          <p className="text-sm text-muted-foreground">Your flight has been successfully booked</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Booking Reference</span>
            <Badge variant="secondary" className="font-mono">
              {booking.id}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Plane className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold text-foreground">{booking.flightNumber}</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Route</p>
              <p className="text-base font-semibold text-foreground">
                {booking.origin} → {booking.destination}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="mt-1 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Departure</p>
              <p className="text-base font-semibold text-foreground">
                {departureDate.toLocaleDateString()}{" "}
                {departureDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <User className="mt-1 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Passenger</p>
              <p className="text-base font-semibold text-foreground">{booking.passengerName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="mt-1 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-base font-semibold text-foreground">{booking.passengerEmail}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-4 text-center">
          <p className="text-sm font-medium text-muted-foreground">Seat Assignment</p>
          <p className="text-3xl font-bold text-primary">{booking.seatNumber}</p>
        </div>

        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-blue-900">
            A confirmation email has been sent to <strong>{booking.passengerEmail}</strong> with your booking details
            and e-ticket.
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Button onClick={onClose} className="flex-1">
          Book Another Flight
        </Button>
        <Button variant="outline" className="flex-1 bg-transparent">
          View My Bookings
        </Button>
      </div>
    </Card>
  )
}
