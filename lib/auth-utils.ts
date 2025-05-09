import { compare, hash } from "bcrypt"
import { sign, verify } from "jsonwebtoken"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { User, UserSession } from "./models/user"

// Secret key for JWT signing
const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set")
}

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10)
}

// Compare a password with a hash
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

// Generate a JWT token
export function generateToken(user: UserSession): string {
  return sign(user, JWT_SECRET, { expiresIn: "7d" })
}

// Verify a JWT token
export function verifyToken(token: string): UserSession | null {
  try {
    return verify(token, JWT_SECRET) as UserSession
  } catch (error) {
    return null
  }
}

// Get the current user from cookies
export function getCurrentUser(): UserSession | null {
  const cookieStore = cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return null
  }

  try {
    return verifyToken(token)
  } catch (error) {
    return null
  }
}

// Middleware to check if user is authenticated
export function requireAuth() {
  const user = getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return user
}

// Middleware to check if user has required role
export function requireRole(allowedRoles: string[]) {
  const user = getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized")
  }

  return user
}

// Format user for session (remove sensitive data)
export function formatUserForSession(user: User): UserSession {
  return {
    id: user._id?.toString() || user.id || "",
    email: user.email,
    name: user.name,
    role: user.role,
  }
}
