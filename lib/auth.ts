import { cookies } from "next/headers"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
}

export interface AuthToken {
  token: string
  userId: string
  expiresAt: number
  scopes: string[]
}

// Mock user database
const users: User[] = [
  { id: "1", email: "admin@airline.com", name: "Admin User", role: "admin" },
  { id: "2", email: "user@airline.com", name: "Regular User", role: "user" },
]

// Mock token storage (in production, use Redis or database)
const tokens = new Map<string, AuthToken>()

export async function generateToken(userId: string, scopes: string[]): Promise<string> {
  const token = `jwt_${Math.random().toString(36).substring(2)}_${Date.now()}`
  const expiresAt = Date.now() + 3600000 // 1 hour

  tokens.set(token, {
    token,
    userId,
    expiresAt,
    scopes,
  })

  return token
}

export async function validateToken(token: string): Promise<AuthToken | null> {
  const authToken = tokens.get(token)

  if (!authToken) {
    return null
  }

  if (authToken.expiresAt < Date.now()) {
    tokens.delete(token)
    return null
  }

  return authToken
}

export async function login(email: string, password: string): Promise<{ user: User; token: string } | null> {
  // Mock authentication (in production, verify password hash)
  const user = users.find((u) => u.email === email)

  if (!user || password !== "password123") {
    return null
  }

  const scopes = user.role === "admin" ? ["read", "write", "admin"] : ["read"]
  const token = await generateToken(user.id, scopes)

  return { user, token }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) {
    return null
  }

  const authToken = await validateToken(token)
  if (!authToken) {
    return null
  }

  const user = users.find((u) => u.id === authToken.userId)
  return user || null
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (token) {
    tokens.delete(token)
  }
}
