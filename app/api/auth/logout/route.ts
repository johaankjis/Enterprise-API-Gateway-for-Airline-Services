import { NextResponse } from "next/server"
import { logout } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST() {
  try {
    await logout()

    const cookieStore = await cookies()
    cookieStore.delete("auth_token")

    return NextResponse.json({ message: "Logout successful" })
  } catch (error) {
    console.error("[v0] Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
