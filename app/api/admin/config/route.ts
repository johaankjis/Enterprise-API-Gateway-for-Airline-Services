import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { mockAPIConfigs } from "@/lib/mock-data"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    return NextResponse.json({ configs: mockAPIConfigs })
  } catch (error) {
    console.error("[v0] Get API configs error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    const { id, ...updates } = await request.json()

    const configIndex = mockAPIConfigs.findIndex((c) => c.id === id)

    if (configIndex === -1) {
      return NextResponse.json({ error: "API configuration not found" }, { status: 404 })
    }

    mockAPIConfigs[configIndex] = {
      ...mockAPIConfigs[configIndex],
      ...updates,
    }

    return NextResponse.json({
      config: mockAPIConfigs[configIndex],
      message: "Configuration updated successfully",
    })
  } catch (error) {
    console.error("[v0] Update API config error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
