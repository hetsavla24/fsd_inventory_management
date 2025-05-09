import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit } from "lucide-react"
import clientPromise from "@/lib/mongodb"
import { DeleteProductButton } from "@/components/delete-product-button"

// Function to calculate days left until expiry
function getDaysLeft(expiryDate: string): number {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export default async function ViewProductPage({ params }: { params: { id: string } }) {
  const { id } = params

  // Fetch product from MongoDB
  const client = await clientPromise
  const db = client.db("inventory")

  const product = await db.collection("products").findOne({ id })

  if (!product) {
    notFound()
  }

  const daysLeft = getDaysLeft(product.expiryDate)

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center mb-6">
        <Link href="/inventory" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Product Details</h1>
        <div className="ml-auto flex gap-2">
          <Link href={`/inventory/edit/${id}`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <DeleteProductButton id={id} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Product details and specifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Product ID</p>
                <p className="font-medium">{product.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Category</p>
                <p className="font-medium">{product.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Quantity</p>
                <p className="font-medium">{product.quantity}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Price</p>
                <p className="font-medium">${product.price?.toFixed(2) || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Storage Location</p>
                <p className="font-medium">{product.storageLocation || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Supplier</p>
                <p className="font-medium">{product.supplier || "Not specified"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expiration Information</CardTitle>
            <CardDescription>Dates and expiration details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Purchase Date</p>
                <p className="font-medium">{product.purchaseDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expiry Date</p>
                <p className="font-medium">{product.expiryDate}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Days Until Expiry</p>
                <p
                  className={`font-medium ${
                    daysLeft <= 2 ? "text-rose-500" : daysLeft <= 7 ? "text-amber-500" : "text-green-500"
                  }`}
                >
                  {daysLeft} days left
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Notes and other details</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{product.notes || "No additional notes available."}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
