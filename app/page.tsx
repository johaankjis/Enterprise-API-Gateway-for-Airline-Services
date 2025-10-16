import { getCurrentUser } from "@/lib/auth"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, Shield, Zap, BarChart3 } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  const user = await getCurrentUser()

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main>
        {/* Hero Section */}
        <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 py-20">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-5xl font-bold text-balance text-foreground">
                Enterprise API Gateway for Airline Services
              </h1>
              <p className="mb-8 text-xl text-muted-foreground text-pretty leading-relaxed">
                Secure, scalable, and high-performance API gateway supporting 10K+ concurrent requests with OAuth2/JWT
                authentication
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/flights">Book a Flight</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/status">Check Status</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground">Platform Features</h2>
              <p className="text-muted-foreground">Built for enterprise-grade performance and security</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Plane className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Flight Services</CardTitle>
                  <CardDescription>
                    REST endpoints for booking and status queries with 45% faster response times
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                    <Shield className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle>OAuth2 Security</CardTitle>
                  <CardDescription>
                    JWT authentication with 100% elimination of token replay vulnerabilities
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <Zap className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>High Performance</CardTitle>
                  <CardDescription>Handles 10K+ concurrent requests with containerized microservices</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Admin Portal</CardTitle>
                  <CardDescription>Self-service API configuration reducing manual setup time by 60%</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-border bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-primary">45%</div>
                <div className="text-sm text-muted-foreground">Faster API Response</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-secondary">10K+</div>
                <div className="text-sm text-muted-foreground">Concurrent Requests</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-accent">60%</div>
                <div className="text-sm text-muted-foreground">Reduced Config Time</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="flex flex-col items-center gap-6 p-12 text-center">
                <h2 className="text-3xl font-bold text-balance">Ready to Get Started?</h2>
                <p className="max-w-2xl text-primary-foreground/90 text-pretty leading-relaxed">
                  Access our secure API gateway with OAuth2 authentication. Book flights, check status, and manage
                  configurations through our enterprise platform.
                </p>
                <div className="flex gap-4">
                  <Button asChild variant="secondary" size="lg">
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    <Link href="/flights">Browse Flights</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 AirlineAPI Enterprise Gateway. Built with Next.js and OAuth2/JWT security.</p>
        </div>
      </footer>
    </div>
  )
}
