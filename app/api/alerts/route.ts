import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("inventory")

    const today = new Date()
    const sevenDaysLater = new Date()
    sevenDaysLater.setDate(today.getDate() + 7)

    // Get expiring products
    const expiringProducts = await db
      .collection("products")
      .find({
        expiryDate: {
          $gte: today.toISOString().split("T")[0],
          $lte: sevenDaysLater.toISOString().split("T")[0],
        },
      })
      .sort({ expiryDate: 1 })
      .toArray()

    // Get low stock products
    const lowStockProducts = await db
      .collection("products")
      .find({
        quantity: { $lte: 10 }, // Assuming 10 is the threshold
      })
      .sort({ quantity: 1 })
      .toArray()

    return NextResponse.json({
      expiring: expiringProducts,
      lowStock: lowStockProducts,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}
