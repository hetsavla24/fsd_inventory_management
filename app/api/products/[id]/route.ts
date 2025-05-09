import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const client = await clientPromise
    const db = client.db("inventory")

    const product = await db.collection("products").findOne({ id })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const updates = await request.json()

    const client = await clientPromise
    const db = client.db("inventory")

    const result = await db
      .collection("products")
      .updateOne({ id }, { $set: { ...updates, updatedAt: new Date().toISOString() } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const updatedProduct = await db.collection("products").findOne({ id })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const client = await clientPromise
    const db = client.db("inventory")

    const result = await db.collection("products").deleteOne({ id })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
