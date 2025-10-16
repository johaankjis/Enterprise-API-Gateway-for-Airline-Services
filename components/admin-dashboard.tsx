"use client"

import { useState, useEffect } from "react"
import { Settings, Shield, Zap, Globe, Save, RefreshCw, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface APIConfig {
  id: string
  apiName: string
  endpointUrl: string
  rateLimit: number
  authRequired: boolean
  enabled: boolean
  description: string
}

interface APIStats {
  totalRequests: number
  successRate: number
  avgResponseTime: number
  activeConnections: number
}

export function AdminDashboard() {
  const [configs, setConfigs] = useState<APIConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [stats] = useState<APIStats>({
    totalRequests: 45678,
    successRate: 99.2,
    avgResponseTime: 145,
    activeConnections: 234,
  })

  useEffect(() => {
    fetchConfigs()
  }, [])

  const fetchConfigs = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/config")
      const data = await response.json()
      setConfigs(data.configs || [])
    } catch (error) {
      console.error("[v0] Error fetching configs:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateConfig = async (id: string, updates: Partial<APIConfig>) => {
    setSaving(id)
    try {
      const response = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      })

      if (response.ok) {
        setConfigs((prev) => prev.map((config) => (config.id === id ? { ...config, ...updates } : config)))
      }
    } catch (error) {
      console.error("[v0] Error updating config:", error)
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalRequests.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold text-foreground">{stats.successRate}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
              <Zap className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Response</p>
              <p className="text-2xl font-bold text-foreground">{stats.avgResponseTime}ms</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <Globe className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Connections</p>
              <p className="text-2xl font-bold text-foreground">{stats.activeConnections}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-bold text-foreground">API Gateway Configuration</h2>
              <p className="text-sm text-muted-foreground">Manage endpoints, rate limits, and authentication</p>
            </div>
          </div>
          <Button onClick={fetchConfigs} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="space-y-4">
          {configs.map((config) => (
            <Card key={config.id} className="border-2 p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-lg font-bold text-foreground">{config.apiName}</h3>
                      <Badge variant={config.enabled ? "default" : "secondary"}>
                        {config.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                      {config.authRequired && (
                        <Badge variant="outline" className="gap-1">
                          <Shield className="h-3 w-3" />
                          Auth Required
                        </Badge>
                      )}
                    </div>
                    <p className="mb-2 text-sm text-muted-foreground">{config.description}</p>
                    <code className="rounded bg-muted px-2 py-1 text-xs text-foreground">{config.endpointUrl}</code>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor={`rateLimit-${config.id}`}>Rate Limit (req/hour)</Label>
                    <Input
                      id={`rateLimit-${config.id}`}
                      type="number"
                      value={config.rateLimit}
                      onChange={(e) =>
                        setConfigs((prev) =>
                          prev.map((c) =>
                            c.id === config.id ? { ...c, rateLimit: Number.parseInt(e.target.value) } : c,
                          ),
                        )
                      }
                      className="mt-1"
                    />
                  </div>

                  <div className="flex items-end">
                    <div className="flex w-full items-center justify-between rounded-lg border border-border p-3">
                      <Label htmlFor={`auth-${config.id}`} className="cursor-pointer">
                        Authentication
                      </Label>
                      <Switch
                        id={`auth-${config.id}`}
                        checked={config.authRequired}
                        onCheckedChange={(checked) =>
                          setConfigs((prev) =>
                            prev.map((c) => (c.id === config.id ? { ...c, authRequired: checked } : c)),
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-end">
                    <div className="flex w-full items-center justify-between rounded-lg border border-border p-3">
                      <Label htmlFor={`enabled-${config.id}`} className="cursor-pointer">
                        Endpoint Status
                      </Label>
                      <Switch
                        id={`enabled-${config.id}`}
                        checked={config.enabled}
                        onCheckedChange={(checked) =>
                          setConfigs((prev) => prev.map((c) => (c.id === config.id ? { ...c, enabled: checked } : c)))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button onClick={() => updateConfig(config.id, config)} disabled={saving === config.id} size="sm">
                    <Save className="mr-2 h-4 w-4" />
                    {saving === config.id ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-bold text-foreground">Security & Monitoring</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="font-medium text-foreground">API Key Rotation</p>
              <p className="text-sm text-muted-foreground">Automatically rotate API keys every 90 days</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="font-medium text-foreground">Request Logging</p>
              <p className="text-sm text-muted-foreground">Log all API requests for audit purposes</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="font-medium text-foreground">DDoS Protection</p>
              <p className="text-sm text-muted-foreground">Enable advanced DDoS protection and rate limiting</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="font-medium text-foreground">Real-time Alerts</p>
              <p className="text-sm text-muted-foreground">Send alerts for suspicious activity or downtime</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>
    </div>
  )
}
