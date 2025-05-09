import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-md">
        You don&apos;t have permission to access this page. Please contact your administrator if you believe this is an
        error.
      </p>
      <div className="mt-8">
        <Link href="/">
          <Button>Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
