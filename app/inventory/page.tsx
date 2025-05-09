import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter } from "lucide-react"
import clientPromise from "@/lib/mongodb"
import { requireAuth } from "@/lib/auth-utils"

// Function to calculate days left until expiry
function getDaysLeft(expiryDate: string): number {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Server component to fetch products
export default async function InventoryPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  // Require authentication
  requireAuth()

  const category = searchParams.category || "all"

  // Connect to MongoDB and fetch products
  const client = await clientPromise
  const db = client.db("inventory")

  let query = {}
  if (category && category !== "all") {
    query = { category }
  }

  // Fetch products from MongoDB
  const products = await db.collection("products").find(query).sort({ expiryDate: 1 }).limit(20).toArray()

  // Fetch categories for the filter
  const categories = await db.collection("products").distinct("category")

  // Process products to add daysLeft
  const processedProducts = products.map((product) => ({
    ...product,
    daysLeft: getDaysLeft(product.expiryDate),
  }))

  return (
    <div className="flex flex-col p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <Link href="/inventory/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search products..." className="pl-8 w-full" />
        </div>
        <div className="flex gap-2">
          <Select defaultValue={category}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Purchase Date</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="hidden lg:table-cell">Supplier</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedProducts.length > 0 ? (
              processedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{product.category}</TableCell>
                  <TableCell className="hidden md:table-cell">{product.purchaseDate}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{product.expiryDate}</span>
                      <Badge variant={product.daysLeft <= 2 ? "destructive" : "outline"} className="w-fit mt-1">
                        {product.daysLeft} days left
                      </Badge>
                    </div>
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
                  No products found. Add some products to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
