import { type NextRequest, NextResponse } from "next/server"
import { mockFlights } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const origin = searchParams.get("origin")
    const destination = searchParams.get("destination")

    let filteredFlights = mockFlights

    if (origin) {
      filteredFlights = filteredFlights.filter((flight) => flight.origin.toLowerCase().includes(origin.toLowerCase()))
    }

    if (destination) {
      filteredFlights = filteredFlights.filter((flight) =>
        flight.destination.toLowerCase().includes(destination.toLowerCase()),
      )
    }

    return NextResponse.json({ flights: filteredFlights })
  } catch (error) {
    console.error("[v0] Get flights error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
