"use server"

import clientPromise from "@/lib/mongodb"
import { revalidatePath } from "next/cache"

export async function addProduct(formData: FormData) {
  try {
    const product = {
      name: formData.get("name"),
      category: formData.get("category"),
      quantity: Number(formData.get("quantity")),
      price: Number(formData.get("price")),
      purchaseDate: formData.get("purchaseDate"),
      expiryDate: formData.get("expiryDate"),
      supplier: formData.get("supplier"),
      storageLocation: formData.get("storageLocation"),
      notes: formData.get("notes"),
    }

    // Validate required fields
    const requiredFields = ["name", "category", "purchaseDate", "expiryDate", "quantity"]
    for (const field of requiredFields) {
      if (!product[field]) {
        return { success: false, error: `Missing required field: ${field}` }
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

    await db.collection("products").insertOne(newProduct)

    revalidatePath("/inventory")
    return { success: true, product: newProduct }
  } catch (error) {
    console.error("Failed to add product:", error)
    return { success: false, error: "Failed to add product" }
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const updates = {
      name: formData.get("name"),
      category: formData.get("category"),
      quantity: Number(formData.get("quantity")),
      price: Number(formData.get("price")),
      purchaseDate: formData.get("purchaseDate"),
      expiryDate: formData.get("expiryDate"),
      supplier: formData.get("supplier"),
      storageLocation: formData.get("storageLocation"),
      notes: formData.get("notes"),
      updatedAt: new Date().toISOString(),
    }

    const client = await clientPromise
    const db = client.db("inventory")

    const result = await db.collection("products").updateOne({ id }, { $set: updates })

    if (result.matchedCount === 0) {
      return { success: false, error: "Product not found" }
    }

    revalidatePath("/inventory")
    revalidatePath(`/inventory/view/${id}`)
    return { success: true }
  } catch (error) {
    console.error("Failed to update product:", error)
    return { success: false, error: "Failed to update product" }
  }
}

export async function deleteProduct(id: string) {
  try {
    const client = await clientPromise
    const db = client.db("inventory")

    const result = await db.collection("products").deleteOne({ id })

    if (result.deletedCount === 0) {
      return { success: false, error: "Product not found" }
    }

    revalidatePath("/inventory")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete product:", error)
    return { success: false, error: "Failed to delete product" }
  }
}
