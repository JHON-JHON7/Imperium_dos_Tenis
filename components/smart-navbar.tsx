'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, Menu, X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export function SmartNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `?busca=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/95 backdrop-blur-sm border-b border-yellow-600/20 shadow-xl shadow-yellow-500/5 py-3'
          : 'bg-gradient-to-b from-black to-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-black rounded-lg p-2">
                <ShoppingBag className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
            <span className="hidden sm:inline font-bold text-lg bg-gradient-to-r from-yellow-300 to-yellow-600 bg-clip-text text-transparent">
              SneakersHub
            </span>
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-sm mx-8 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-full blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-500/60 w-5 h-5 z-10" />
            <Input
              type="text"
              placeholder="Buscar tênis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-10 rounded-full bg-white/5 border-2 border-yellow-600/30 hover:border-yellow-500/50 focus:border-yellow-500 text-white placeholder:text-gray-400 relative z-10 transition-all duration-300"
            />
          </form>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-6">
            <Link
              href="#esportivo"
              className="text-white hover:text-yellow-500 transition-colors duration-300 font-medium text-sm"
            >
              Esportivo
            </Link>
            <Link
              href="#casual"
              className="text-white hover:text-yellow-500 transition-colors duration-300 font-medium text-sm"
            >
              Casual
            </Link>
            <Button
              size="sm"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold rounded-full px-6 shadow-lg shadow-yellow-500/30"
            >
              Carrinho
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-2 hover:bg-yellow-500/10 rounded-lg transition-colors duration-300 text-yellow-500"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden mt-4 space-y-4 pb-4 border-t border-yellow-600/20 pt-4">
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-500/60 w-5 h-5 z-10" />
              <Input
                type="text"
                placeholder="Buscar tênis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-10 rounded-full bg-white/5 border-2 border-yellow-600/30 hover:border-yellow-500/50 focus:border-yellow-500 text-white placeholder:text-gray-400 relative z-10 transition-all duration-300 w-full"
              />
            </form>
            <Link
              href="#esportivo"
              className="block text-white hover:text-yellow-500 transition-colors duration-300 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Tênis Esportivos
            </Link>
            <Link
              href="#casual"
              className="block text-white hover:text-yellow-500 transition-colors duration-300 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Tênis Casuais
            </Link>
            <Button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold rounded-full shadow-lg shadow-yellow-500/30">
              Carrinho
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
