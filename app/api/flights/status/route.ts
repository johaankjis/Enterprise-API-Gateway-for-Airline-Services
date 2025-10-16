import { type NextRequest, NextResponse } from "next/server"
import { mockFlights } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const flightNumber = searchParams.get("flightNumber")

    let filteredFlights = mockFlights.map((flight) => ({
      ...flight,
      gate:
        flight.status === "boarding" || flight.status === "departed"
          ? `${Math.floor(Math.random() * 50) + 1}`
          : undefined,
      terminal:
        flight.status === "boarding" || flight.status === "departed"
          ? String.fromCharCode(65 + Math.floor(Math.random() * 4))
          : undefined,
    }))

    if (flightNumber) {
      filteredFlights = filteredFlights.filter((flight) =>
        flight.flightNumber.toLowerCase().includes(flightNumber.toLowerCase()),
      )
    }

    return NextResponse.json({ flights: filteredFlights })
  } catch (error) {
    console.error("[v0] Get flight status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
