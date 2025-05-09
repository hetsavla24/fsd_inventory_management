import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requireAuth } from "@/lib/auth-utils"
import clientPromise from "@/lib/mongodb"

export default async function ProfilePage() {
  // Require authentication
  const user = requireAuth()

  // Connect to MongoDB
  const client = await clientPromise
  const db = client.db("inventory")

  // Get user details
  const userDetails = await db.collection("users").findOne({ email: user.email })

  if (!userDetails) {
    return <div>User not found</div>
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="font-medium">{userDetails.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="font-medium">{userDetails.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Role</p>
                <p className="font-medium capitalize">{userDetails.role}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                <p className="font-medium">{new Date(userDetails.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Activity</CardTitle>
            <CardDescription>Your recent activity</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Activity tracking will be implemented in a future update.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
