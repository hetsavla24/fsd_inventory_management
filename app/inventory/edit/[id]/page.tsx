import { notFound } from "next/navigation"
import clientPromise from "@/lib/mongodb"
import { EditProductForm } from "./edit-form"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params

  // Fetch product from MongoDB
  const client = await clientPromise
  const db = client.db("inventory")

  const product = await db.collection("products").findOne({ id })

  if (!product) {
    notFound()
  }

  return <EditProductForm product={product} />
}
