"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import clientPromise from "@/lib/mongodb"
import { comparePassword, formatUserForSession, generateToken, hashPassword } from "@/lib/auth-utils"
import type { User } from "@/lib/models/user"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { success: false, error: "Email and password are required" }
  }

  try {
    const client = await clientPromise
    const db = client.db("inventory")

    const user = await db.collection<User>("users").findOne({ email })

    if (!user) {
      return { success: false, error: "Invalid email or password" }
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash)

    if (!isPasswordValid) {
      return { success: false, error: "Invalid email or password" }
    }

    // Create session
    const userSession = formatUserForSession(user)
    const token = generateToken(userSession)

    // Set cookie
    cookies().set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return { success: true, user: userSession }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An error occurred during login" }
  }
}

export async function register(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!name || !email || !password || !confirmPassword) {
    return { success: false, error: "All fields are required" }
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match" }
  }

  if (password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters" }
  }

  try {
    const client = await clientPromise
    const db = client.db("inventory")

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })

    if (existingUser) {
      return { success: false, error: "Email already in use" }
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const newUser: User = {
      email,
      name,
      passwordHash,
      role: "staff", // Default role for new users
      createdAt: new Date().toISOString(),
    }

    const result = await db.collection("users").insertOne(newUser)

    if (!result.acknowledged) {
      return { success: false, error: "Failed to create user" }
    }

    // Create session
    const userSession = formatUserForSession({
      ...newUser,
      _id: result.insertedId.toString(),
    })

    const token = generateToken(userSession)

    // Set cookie
    cookies().set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return { success: true, user: userSession }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "An error occurred during registration" }
  }
}

export async function logout() {
  cookies().set({
    name: "token",
    value: "",
    expires: new Date(0),
    path: "/",
  })

  redirect("/auth/login")
}

export async function createAdminUser() {
  try {
    const client = await clientPromise
    const db = client.db("inventory")

    // Check if admin already exists
    const adminExists = await db.collection("users").findOne({ role: "admin" })

    if (adminExists) {
      return { success: false, message: "Admin user already exists" }
    }

    // Create admin user
    const passwordHash = await hashPassword("admin123")

    const adminUser: User = {
      email: "admin@example.com",
      name: "Admin User",
      passwordHash,
      role: "admin",
      createdAt: new Date().toISOString(),
    }

    await db.collection("users").insertOne(adminUser)

    return {
      success: true,
      message: "Admin user created successfully",
      credentials: {
        email: "admin@example.com",
        password: "admin123",
      },
    }
  } catch (error) {
    console.error("Create admin error:", error)
    return { success: false, error: "Failed to create admin user" }
  }
}
