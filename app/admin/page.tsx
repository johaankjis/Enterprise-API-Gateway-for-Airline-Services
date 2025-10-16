import { getCurrentUser } from "@/lib/auth"
import { Header } from "@/components/header"
import { AdminDashboard } from "@/components/admin-dashboard"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "admin") {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Admin Portal</h1>
          <p className="text-muted-foreground">Manage API configurations and gateway settings</p>
        </div>
        <AdminDashboard />
      </main>
    </div>
  )
}
