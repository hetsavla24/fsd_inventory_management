export interface User {
  _id?: string
  id?: string
  email: string
  name: string
  passwordHash: string
  role: "admin" | "manager" | "staff"
  createdAt: string
  updatedAt?: string
}

export interface UserSession {
  id: string
  email: string
  name: string
  role: string
}
