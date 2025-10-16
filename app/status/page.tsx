import { Header } from "@/components/header"
import { FlightStatus } from "@/components/flight-status"
import { getCurrentUser } from "@/lib/auth"

export default async function StatusPage() {
  const user = await getCurrentUser()

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Flight Status</h1>
          <p className="text-muted-foreground">Real-time flight status information via our API gateway</p>
        </div>
        <FlightStatus />
      </main>
    </div>
  )
}
