import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { getCurrentUser } from "@/lib/auth-utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Perishable Food Inventory Management",
  description: "A comprehensive inventory management platform for perishable food products",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = getCurrentUser()

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-10 border-b bg-background">
              <div className="flex h-16 items-center px-4 md:px-6">
                <MainNav />
                <div className="ml-auto flex items-center space-x-4">
                  <UserNav user={user} />
                </div>
              </div>
            </header>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
