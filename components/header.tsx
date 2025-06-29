"use client"

import { Search, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Bloomberg</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Markets</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Technology</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Politics</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Opinion</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Wealth</a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search news, quotes, companies..."
                className="pl-10 w-80 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              Subscribe
            </Button>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}