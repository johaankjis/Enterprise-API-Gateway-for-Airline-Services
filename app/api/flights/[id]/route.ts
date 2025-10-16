import { type NextRequest, NextResponse } from "next/server"
import { mockFlights } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const flight = mockFlights.find((f) => f.id === id)

    if (!flight) {
      return NextResponse.json({ error: "Flight not found" }, { status: 404 })
    }

    return NextResponse.json({ flight })
  } catch (error) {
    console.error("[v0] Get flight error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
