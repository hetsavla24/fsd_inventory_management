import { NextResponse } from "next/server"
import { createAdminUser } from "@/app/auth/actions"

export async function GET() {
  try {
    const result = await createAdminUser()

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error("Create admin error:", error)
    return NextResponse.json({ error: "Failed to create admin user" }, { status: 500 })
  }
}
