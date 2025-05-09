import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db-init"

export async function GET() {
  try {
    const result = await initializeDatabase()

    if (result.success) {
      return NextResponse.json({ message: result.message })
    } else {
      return NextResponse.json({ error: "Failed to initialize database" }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
