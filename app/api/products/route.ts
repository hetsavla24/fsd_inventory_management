import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const expiringIn = searchParams.get("expiringIn")

    const client = await clientPromise
    const db = client.db("inventory")

    let query = {}

    if (category && category !== "all") {
      query = { ...query, category }
    }

    if (expiringIn) {
      const today = new Date()
      const futureDate = new Date()
      futureDate.setDate(today.getDate() + Number.parseInt(expiringIn))

      query = {
        ...query,
        expiryDate: {
          $gte: today.toISOString().split("T")[0],
          $lte: futureDate.toISOString().split("T")[0],
        },
      }
    }

    const products = await db.collection("products").find(query).sort({ expiryDate: 1 }).toArray()

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const product = await request.json()

    // Validate required fields
    const requiredFields = ["name", "category", "purchaseDate", "expiryDate", "quantity"]
    for (const field of requiredFields) {
      if (!product[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const client = await clientPromise
    const db = client.db("inventory")

    // Generate a product ID
    const lastProduct = await db.collection("products").find().sort({ _id: -1 }).limit(1).toArray()

    const productId =
      lastProduct.length > 0
        ? `P${(Number.parseInt(lastProduct[0].id.substring(1)) + 1).toString().padStart(3, "0")}`
        : "P001"

    const newProduct = {
      ...product,
      id: productId,
      createdAt: new Date().toISOString(),
    }

    const result = await db.collection("products").insertOne(newProduct)

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 })
  }
}
