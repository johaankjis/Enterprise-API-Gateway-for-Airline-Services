import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { mockBookings, mockFlights } from "@/lib/mock-data"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ bookings: mockBookings })
  } catch (error) {
    console.error("[v0] Get bookings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { flightId, passengerName, passengerEmail, seatNumber } = await request.json()

    if (!flightId || !passengerName || !passengerEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const flight = mockFlights.find((f) => f.id === flightId)

    if (!flight) {
      return NextResponse.json({ error: "Flight not found" }, { status: 404 })
    }

    if (flight.availableSeats === 0) {
      return NextResponse.json({ error: "No available seats" }, { status: 400 })
    }

    const booking = {
      id: `BK${String(mockBookings.length + 1).padStart(3, "0")}`,
      flightId,
      passengerId: user.id,
      passengerName,
      passengerEmail,
      status: "confirmed" as const,
      bookingDate: new Date().toISOString(),
      seatNumber:
        seatNumber || `${Math.floor(Math.random() * 30) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 6))}`,
    }

    mockBookings.push(booking)
    flight.availableSeats -= 1

    return NextResponse.json({ booking, message: "Booking created successfully" })
  } catch (error) {
    console.error("[v0] Create booking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
