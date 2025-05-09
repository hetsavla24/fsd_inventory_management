import clientPromise from "./mongodb"
import { productSchema, supplierSchema, userSchema } from "./mongodb-schemas"

export async function initializeDatabase() {
  try {
    const client = await clientPromise
    const db = client.db("inventory")

    // Get list of collections
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((c) => c.name)

    // Create products collection if it doesn't exist
    if (!collectionNames.includes("products")) {
      await db.createCollection("products", productSchema)
      console.log("Created products collection")

      // Create indexes
      await db.collection("products").createIndex({ name: 1 })
      await db.collection("products").createIndex({ category: 1 })
      await db.collection("products").createIndex({ expiryDate: 1 })
      await db.collection("products").createIndex({ supplier: 1 })
    }

    // Create suppliers collection if it doesn't exist
    if (!collectionNames.includes("suppliers")) {
      await db.createCollection("suppliers", supplierSchema)
      console.log("Created suppliers collection")

      // Create indexes
      await db.collection("suppliers").createIndex({ name: 1 }, { unique: true })
    }

    // Create users collection if it doesn't exist
    if (!collectionNames.includes("users")) {
      await db.createCollection("users", userSchema)
      console.log("Created users collection")

      // Create indexes
      await db.collection("users").createIndex({ email: 1 }, { unique: true })
    }

    return { success: true, message: "Database initialized successfully" }
  } catch (error) {
    console.error("Failed to initialize database:", error)
    return { success: false, error }
  }
}
