"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Package } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Package className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">FreshTrack</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/inventory"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/inventory") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Inventory
        </Link>
        <Link
          href="/suppliers"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/suppliers") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Suppliers
        </Link>
        <Link
          href="/reports"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/reports") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Reports
        </Link>
      </nav>
    </div>
  )
}
