import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Package, AlertTriangle, ShoppingCart, TrendingDown } from "lucide-react"
import clientPromise from "@/lib/mongodb"
import { requireAuth } from "@/lib/auth-utils"

// Function to calculate days left until expiry
function getDaysLeft(expiryDate: string): number {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export default async function Home() {
  // Require authentication
  const user = requireAuth()

  // Connect to MongoDB
  const client = await clientPromise
  const db = client.db("inventory")

  // Get total products count
  const totalProducts = await db.collection("products").countDocuments()

  // Get expiring products (within 7 days)
  const today = new Date()
  const sevenDaysLater = new Date()
  sevenDaysLater.setDate(today.getDate() + 7)

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

  // Get low stock products (quantity <= 10)
  const lowStockProducts = await db.collection("products").countDocuments({
    quantity: { $lte: 10 },
  })

  // Get recent orders (placeholder for now)
  const recentOrders = 12

  // Process expiring products to add daysLeft
  const processedExpiringProducts = expiringProducts.map((product) => ({
    ...product,
    daysLeft: getDaysLeft(product.expiryDate),
  }))

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
          <p className="text-sm text-muted-foreground">Role: {user.role}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">All products in inventory</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{expiringProducts.length}</div>
              <p className="text-xs text-muted-foreground">Items expiring in 7 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <TrendingDown className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStockProducts}</div>
              <p className="text-xs text-muted-foreground">Items below threshold</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentOrders}</div>
              <p className="text-xs text-muted-foreground">Orders in last 24 hours</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Inventory Overview</CardTitle>
              <CardDescription>Product categories and their current stock levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground" />
                <span className="ml-4 text-muted-foreground">Chart visualization will appear here</span>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Expiring Soon</CardTitle>
              <CardDescription>Products that need attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processedExpiringProducts.length > 0 ? (
                  processedExpiringProducts.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.category}</div>
                      </div>
                      <div className="text-sm text-right">
                        <div className={`font-medium ${item.daysLeft <= 2 ? "text-rose-500" : "text-amber-500"}`}>
                          Expires in {item.daysLeft} days
                        </div>
                        <div className="text-muted-foreground">Qty: {item.quantity}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">No products expiring soon</div>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <Link href="/inventory?expiringIn=7">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-end">
          <Link href="/inventory/add">
            <Button>Add New Product</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
