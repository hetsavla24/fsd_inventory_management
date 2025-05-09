import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import clientPromise from "@/lib/mongodb"

// Function to calculate days left until expiry
function getDaysLeft(expiryDate: string): number {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export default async function ExpiringProductsPage() {
  // Connect to MongoDB
  const client = await clientPromise
  const db = client.db("inventory")

  // Get expiring products (within 30 days)
  const today = new Date()
  const thirtyDaysLater = new Date()
  thirtyDaysLater.setDate(today.getDate() + 30)

  const expiringProducts = await db
    .collection("products")
    .find({
      expiryDate: {
        $gte: today.toISOString().split("T")[0],
        $lte: thirtyDaysLater.toISOString().split("T")[0],
      },
    })
    .sort({ expiryDate: 1 })
    .toArray()

  // Process expiring products to add daysLeft
  const processedExpiringProducts = expiringProducts.map((product) => ({
    ...product,
    daysLeft: getDaysLeft(product.expiryDate),
  }))

  return (
    <div className="flex flex-col p-4 md:p-8 space-y-6">
      <div className="flex items-center">
        <Link href="/inventory" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Expiring Products</h1>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Days Left</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="hidden lg:table-cell">Supplier</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedExpiringProducts.length > 0 ? (
              processedExpiringProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{product.category}</TableCell>
                  <TableCell>{product.expiryDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={product.daysLeft <= 2 ? "destructive" : product.daysLeft <= 7 ? "default" : "outline"}
                    >
                      {product.daysLeft} days
                    </Badge>
                  </TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell className="hidden lg:table-cell">{product.supplier}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/inventory/edit/${product.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/inventory/view/${product.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No products expiring in the next 30 days.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
