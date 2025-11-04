"use client"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const pathname = usePathname()
  const isRO = pathname === "/" || pathname?.startsWith("/ro")
  return (
    <nav className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="block dark:hidden">
              <Image
                src="/logo-black.svg"
                alt="Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </div>
            <div className="hidden dark:block">
              <Image
                src="/logo-white.svg"
                alt="Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </div>
          </div>
          
          {/* Theme + Language */}
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className={isRO ? "bg-gray-100 dark:bg-gray-800" : ""}>
              <Link href="/">RO</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className={!isRO ? "bg-gray-100 dark:bg-gray-800" : ""}>
              <Link href="/ru">RU</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}