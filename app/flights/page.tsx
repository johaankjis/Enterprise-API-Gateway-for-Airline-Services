import { getCurrentUser } from "@/lib/auth"
import { Header } from "@/components/header"
import { FlightSearch } from "@/components/flight-search"
import { redirect } from "next/navigation"

export default async function FlightsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Flight Booking</h1>
          <p className="text-muted-foreground">Search and book flights through our secure API gateway</p>
        </div>
        <FlightSearch />
      </main>
    </div>
  )
}
