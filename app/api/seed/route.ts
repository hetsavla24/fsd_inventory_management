import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { initializeDatabase } from "@/lib/db-init"

export async function GET() {
  try {
    // Initialize database collections and indexes
    const initResult = await initializeDatabase()

    if (!initResult.success) {
      return NextResponse.json({ error: "Failed to initialize database" }, { status: 500 })
    }

    // Check if we already have products
    const client = await clientPromise
    const db = client.db("inventory")

    const existingProducts = await db.collection("products").countDocuments()

    if (existingProducts > 0) {
      return NextResponse.json({
        message: "Database already contains products. Skipping seed data.",
        initialized: true,
        seeded: false,
      })
    }

    // Sample product data
    const products = [
      {
        id: "P001",
        name: "Organic Strawberries",
        category: "fruits",
        purchaseDate: new Date().toISOString().split("T")[0],
        expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        quantity: 15,
        supplier: "fresh-farms",
        price: 4.99,
        storageLocation: "Refrigerator A1",
        notes: "Premium quality, locally sourced",
        createdAt: new Date().toISOString(),
      },
      {
        id: "P002",
        name: "Fresh Milk",
        category: "dairy",
        purchaseDate: new Date().toISOString().split("T")[0],
        expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        quantity: 8,
        supplier: "dairy-delights",
        price: 3.49,
        storageLocation: "Refrigerator B2",
        notes: "Pasteurized, homogenized",
        createdAt: new Date().toISOString(),
      },
      {
        id: "P003",
        name: "Chicken Breast",
        category: "meat",
        purchaseDate: new Date().toISOString().split("T")[0],
        expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        quantity: 5,
        supplier: "premium-poultry",
        price: 8.99,
        storageLocation: "Freezer C3",
        notes: "Boneless, skinless",
        createdAt: new Date().toISOString(),
      },
      {
        id: "P004",
        name: "Spinach",
        category: "vegetables",
        purchaseDate: new Date().toISOString().split("T")[0],
        expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        quantity: 10,
        supplier: "green-gardens",
        price: 2.99,
        storageLocation: "Refrigerator A2",
        notes: "Organic, pre-washed",
        createdAt: new Date().toISOString(),
      },
      {
        id: "P005",
        name: "Greek Yogurt",
        category: "dairy",
        purchaseDate: new Date().toISOString().split("T")[0],
        expiryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        quantity: 12,
        supplier: "dairy-delights",
        price: 5.49,
        storageLocation: "Refrigerator B1",
        notes: "Plain, no added sugar",
        createdAt: new Date().toISOString(),
      },
      {
        id: "P006",
        name: "Atlantic Salmon",
        category: "seafood",
        purchaseDate: new Date().toISOString().split("T")[0],
        expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        quantity: 7,
        supplier: "ocean-harvest",
        price: 12.99,
        storageLocation: "Freezer C1",
        notes: "Wild caught, fillets",
        createdAt: new Date().toISOString(),
      },
      {
        id: "P007",
        name: "Avocados",
        category: "fruits",
        purchaseDate: new Date().toISOString().split("T")[0],
        expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        quantity: 20,
        supplier: "fresh-farms",
        price: 1.99,
        storageLocation: "Shelf D1",
        notes: "Hass variety, ripe",
        createdAt: new Date().toISOString(),
      },
    ]

    // Insert sample products
    await db.collection("products").insertMany(products)

    return NextResponse.json({
      message: "Database initialized and seeded successfully",
      initialized: true,
      seeded: true,
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
