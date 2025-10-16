export interface Flight {
  id: string
  flightNumber: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  price: number
  availableSeats: number
  status: "scheduled" | "boarding" | "departed" | "arrived" | "delayed" | "cancelled"
}

export interface Booking {
  id: string
  flightId: string
  passengerId: string
  passengerName: string
  passengerEmail: string
  status: "confirmed" | "cancelled"
  bookingDate: string
  seatNumber: string
}

export interface APIConfig {
  id: string
  apiName: string
  endpointUrl: string
  rateLimit: number
  authRequired: boolean
  enabled: boolean
  description: string
}

export const mockFlights: Flight[] = [
  {
    id: "FL001",
    flightNumber: "AA101",
    origin: "JFK",
    destination: "LAX",
    departureTime: "2025-10-20T08:00:00",
    arrivalTime: "2025-10-20T11:30:00",
    price: 350,
    availableSeats: 45,
    status: "scheduled",
  },
  {
    id: "FL002",
    flightNumber: "AA202",
    origin: "LAX",
    destination: "ORD",
    departureTime: "2025-10-20T14:00:00",
    arrivalTime: "2025-10-20T20:00:00",
    price: 280,
    availableSeats: 32,
    status: "scheduled",
  },
  {
    id: "FL003",
    flightNumber: "AA303",
    origin: "ORD",
    destination: "MIA",
    departureTime: "2025-10-20T09:30:00",
    arrivalTime: "2025-10-20T13:45:00",
    price: 220,
    availableSeats: 18,
    status: "boarding",
  },
  {
    id: "FL004",
    flightNumber: "AA404",
    origin: "MIA",
    destination: "JFK",
    departureTime: "2025-10-20T16:00:00",
    arrivalTime: "2025-10-20T19:15:00",
    price: 310,
    availableSeats: 0,
    status: "departed",
  },
  {
    id: "FL005",
    flightNumber: "AA505",
    origin: "SFO",
    destination: "SEA",
    departureTime: "2025-10-20T11:00:00",
    arrivalTime: "2025-10-20T13:30:00",
    price: 180,
    availableSeats: 56,
    status: "delayed",
  },
]

export const mockBookings: Booking[] = [
  {
    id: "BK001",
    flightId: "FL001",
    passengerId: "P001",
    passengerName: "John Doe",
    passengerEmail: "john@example.com",
    status: "confirmed",
    bookingDate: "2025-10-15T10:30:00",
    seatNumber: "12A",
  },
  {
    id: "BK002",
    flightId: "FL002",
    passengerId: "P002",
    passengerName: "Jane Smith",
    passengerEmail: "jane@example.com",
    status: "confirmed",
    bookingDate: "2025-10-14T14:20:00",
    seatNumber: "8C",
  },
]

export const mockAPIConfigs: APIConfig[] = [
  {
    id: "API001",
    apiName: "Flight Booking API",
    endpointUrl: "/api/bookings",
    rateLimit: 1000,
    authRequired: true,
    enabled: true,
    description: "Create and manage flight bookings",
  },
  {
    id: "API002",
    apiName: "Flight Status API",
    endpointUrl: "/api/flights/status",
    rateLimit: 5000,
    authRequired: false,
    enabled: true,
    description: "Query real-time flight status information",
  },
  {
    id: "API003",
    apiName: "Admin Configuration API",
    endpointUrl: "/api/admin/config",
    rateLimit: 100,
    authRequired: true,
    enabled: true,
    description: "Manage API configurations and settings",
  },
]
