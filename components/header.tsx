"use client"

import type React from "react"
import { useState, useRef, useEffect, useMemo } from "react"
import { Search, User, Menu, Crown, X, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CartDrawer } from "@/components/cart-drawer"
import { FavoritesDrawer } from "@/components/favorites-drawer"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Interface para sugestões
interface SearchSuggestion {
  type: "brand" | "model" | "category"
  value: string
  label: string
  count?: number
}

// Produtos mockados - SUBSTITUA pelos seus produtos reais
const mockProducts = [
  {
    id: 1,
    name: "Air Max Revolution Pro",
    brand: "Nike",
    price: 899.9,
    type: "Esportivo",
  },
  {
    id: 2,
    name: "Ultraboost 22 Performance",
    brand: "Adidas",
    price: 749.9,
    type: "Esportivo",
  },
  {
    id: 3,
    name: "Chuck Taylor All Star High",
    brand: "Converse",
    price: 299.9,
    type: "Casual",
  },
  {
    id: 4,
    name: "Old Skool Classic Skate",
    brand: "Vans",
    price: 399.9,
    type: "Casual",
  },
  {
    id: 5,
    name: "Air Force 1 Low White",
    brand: "Nike",
    price: 599.9,
    type: "Casual",
  },
  {
    id: 6,
    name: "Stan Smith Classic",
    brand: "Adidas",
    price: 449.9,
    type: "Casual",
  },
  {
    id: 7,
    name: "Gel-Kayano 29",
    brand: "Asics",
    price: 899.9,
    type: "Esportivo",
  },
  {
    id: 8,
    name: "Fresh Foam X 1080v12",
    brand: "New Balance",
    price: 799.9,
    type: "Esportivo",
  },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const mobileSearchInputRef = useRef<HTMLInputElement>(null)
  const mobileSuggestionsRef = useRef<HTMLDivElement>(null)

  const availableBrands = useMemo(
    () => Array.from(new Set(mockProducts.map((p) => p.brand))).sort(),
    []
  )

  // Gera sugestões baseadas na busca
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    const results: SearchSuggestion[] = []

    // Sugestões de marcas
    availableBrands.forEach((brand) => {
      if (brand.toLowerCase().includes(query)) {
        const count = mockProducts.filter((p) => p.brand === brand).length
        results.push({
          type: "brand",
          value: brand,
          label: brand,
          count,
        })
      }
    })

    // Sugestões de modelos
    const uniqueModels = new Set<string>()
    mockProducts.forEach((product) => {
      if (
        product.name.toLowerCase().includes(query) &&
        !uniqueModels.has(product.name)
      ) {
        uniqueModels.add(product.name)
        results.push({
          type: "model",
          value: product.name,
          label: product.name,
        })
      }
    })

    // Sugestões de categorias
    const categories = ["Esportivo", "Casual"]
    categories.forEach((category) => {
      if (category.toLowerCase().includes(query)) {
        const count = mockProducts.filter((p) => p.type === category).length
        results.push({
          type: "category",
          value: category,
          label: `Tênis ${category}`,
          count,
        })
      }
    })

    return results.slice(0, 8)
  }, [searchQuery, availableBrands])

  // Fecha sugestões ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      
      // Desktop
      if (
        suggestionsRef.current &&
        searchInputRef.current &&
        !suggestionsRef.current.contains(target) &&
        !searchInputRef.current.contains(target)
      ) {
        setShowSuggestions(false)
      }
      
      // Mobile
      if (
        mobileSuggestionsRef.current &&
        mobileSearchInputRef.current &&
        !mobileSuggestionsRef.current.contains(target) &&
        !mobileSearchInputRef.current.contains(target)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Navegação por teclado
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
      e.preventDefault()
      handleSuggestionClick(suggestions[selectedSuggestionIndex])
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.value)
    setShowSuggestions(false)
    setSelectedSuggestionIndex(-1)
    window.location.href = `/loja?busca=${encodeURIComponent(suggestion.value)}`
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowSuggestions(false)
      window.location.href = `/loja?busca=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setShowSuggestions(false)
  }

  const getSuggestionIcon = (type: SearchSuggestion["type"]) => {
    switch (type) {
      case "brand":
        return <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />
      case "model":
        return <Search className="w-4 h-4 text-blue-400 flex-shrink-0" />
      case "category":
        return <TrendingUp className="w-4 h-4 text-green-400 flex-shrink-0" />
    }
  }

  const getSuggestionLabel = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case "brand":
        return "Marca"
      case "model":
        return "Modelo"
      case "category":
        return "Categoria"
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-yellow-600/20 bg-gradient-to-r from-black via-gray-900 to-black backdrop-blur-md shadow-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo + Nome */}
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-3 group">
                {/* Logo */}
                <div className="relative w-12 h-12 md:w-14 md:h-14 flex-shrink-0">
                  <Image
                    src="/logo.jpg"
                    alt="Imperium dos Tênis"
                    fill
                    className="object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] group-hover:drop-shadow-[0_0_25px_rgba(234,179,8,0.8)] transition-all duration-300"
                    priority
                  />
                </div>
                
                {/* Nome da Loja */}
                <div className="hidden sm:block">
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(234,179,8,0.3)] group-hover:drop-shadow-[0_2px_20px_rgba(234,179,8,0.5)] transition-all duration-300">
                    IMPÉRIUM
                  </h1>
                  <p className="text-xs md:text-sm text-yellow-500/80 font-light tracking-[0.2em] uppercase">
                    dos Tênis
                  </p>
                </div>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <a 
                href="/" 
                className="relative text-sm font-medium text-white hover:text-yellow-500 transition-colors duration-300 group"
              >
                Início
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a 
                href="/loja" 
                className="relative text-sm font-medium text-white hover:text-yellow-500 transition-colors duration-300 group"
              >
                Loja
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a 
                href="/contato" 
                className="relative text-sm font-medium text-white hover:text-yellow-500 transition-colors duration-300 group"
              >
                Contato
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            </nav>

            {/* Search Bar com Sugestões - Desktop */}
            <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative w-full group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-500/60 group-hover:text-yellow-500 h-4 w-4 transition-colors duration-300 z-10" />
                <Input
                  ref={searchInputRef}
                  placeholder="Buscar tênis..."
                  className="pl-11 pr-10 h-11 rounded-full bg-white/5 border-2 border-yellow-600/30 hover:border-yellow-500/50 focus:border-yellow-500 text-white placeholder:text-gray-400 backdrop-blur-sm transition-all duration-300 relative z-10"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSuggestions(true)
                    setSelectedSuggestionIndex(-1)
                  }}
                  onFocus={() => {
                    if (searchQuery.trim()) {
                      setShowSuggestions(true)
                    }
                  }}
                  onKeyDown={handleKeyDown}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-yellow-500/60 hover:text-yellow-500 transition-colors duration-300 z-10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                {/* Dropdown de Sugestões - Desktop */}
                {showSuggestions && suggestions.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border-2 border-yellow-600/30 rounded-2xl shadow-2xl overflow-hidden z-[100] backdrop-blur-xl"
                  >
                    <div className="py-2">
                      <div className="px-4 py-2 text-xs text-yellow-500/70 border-b border-yellow-600/20">
                        {suggestions.length}{" "}
                        {suggestions.length === 1
                          ? "sugestão encontrada"
                          : "sugestões encontradas"}
                      </div>
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={`${suggestion.type}-${suggestion.value}-${index}`}
                          onClick={() => handleSuggestionClick(suggestion)}
                          type="button"
                          className={cn(
                            "w-full px-4 py-3 flex items-center gap-3 hover:bg-yellow-500/10 transition-colors text-left",
                            selectedSuggestionIndex === index && "bg-yellow-500/10"
                          )}
                        >
                          {getSuggestionIcon(suggestion.type)}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-white truncate">
                              {suggestion.label}
                            </div>
                            <div className="text-xs text-gray-400">
                              {getSuggestionLabel(suggestion)}
                              {suggestion.count && ` • ${suggestion.count} produtos`}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden md:flex text-white hover:text-yellow-500 hover:bg-yellow-500/10 transition-all duration-300 rounded-full"
                asChild
              >
                <Link href="/login">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              
              <div className="text-white hover:text-yellow-500 transition-colors duration-300">
                <FavoritesDrawer />
              </div>
              
              <div className="text-white hover:text-yellow-500 transition-colors duration-300">
                <CartDrawer />
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden text-white hover:text-yellow-500 hover:bg-yellow-500/10 transition-all duration-300 rounded-full" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-yellow-600/20 py-6 animate-in slide-in-from-top duration-300">
              <nav className="flex flex-col gap-4">
                <a 
                  href="/" 
                  className="text-sm font-medium text-white hover:text-yellow-500 transition-colors duration-300 py-2"
                >
                  Início
                </a>
                <a 
                  href="/loja" 
                  className="text-sm font-medium text-white hover:text-yellow-500 transition-colors duration-300 py-2"
                >
                  Loja
                </a>
                <a 
                  href="/contato" 
                  className="text-sm font-medium text-white hover:text-yellow-500 transition-colors duration-300 py-2"
                >
                  Contato
                </a>
                
                {/* Mobile Search com Sugestões */}
                <div className="pt-4 border-t border-yellow-600/20">
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-500/60 h-4 w-4 z-10" />
                    <Input
                      ref={mobileSearchInputRef}
                      placeholder="Buscar tênis..."
                      className="pl-11 pr-10 h-11 rounded-full bg-white/5 border-2 border-yellow-600/30 focus:border-yellow-500 text-white placeholder:text-gray-400"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setShowSuggestions(true)
                        setSelectedSuggestionIndex(-1)
                      }}
                      onFocus={() => {
                        if (searchQuery.trim()) {
                          setShowSuggestions(true)
                        }
                      }}
                      onKeyDown={handleKeyDown}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-yellow-500/60 hover:text-yellow-500 transition-colors z-10"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}

                    {/* Dropdown de Sugestões - Mobile */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div
                        ref={mobileSuggestionsRef}
                        className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border-2 border-yellow-600/30 rounded-2xl shadow-2xl overflow-hidden z-[100] backdrop-blur-xl"
                      >
                        <div className="py-2 max-h-64 overflow-y-auto">
                          <div className="px-4 py-2 text-xs text-yellow-500/70 border-b border-yellow-600/20">
                            {suggestions.length}{" "}
                            {suggestions.length === 1
                              ? "sugestão"
                              : "sugestões"}
                          </div>
                          {suggestions.map((suggestion, index) => (
                            <button
                              key={`mobile-${suggestion.type}-${suggestion.value}-${index}`}
                              onClick={() => handleSuggestionClick(suggestion)}
                              type="button"
                              className={cn(
                                "w-full px-4 py-3 flex items-center gap-3 hover:bg-yellow-500/10 transition-colors text-left",
                                selectedSuggestionIndex === index && "bg-yellow-500/10"
                              )}
                            >
                              {getSuggestionIcon(suggestion.type)}
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-white truncate text-sm">
                                  {suggestion.label}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {getSuggestionLabel(suggestion)}
                                  {suggestion.count && ` • ${suggestion.count}`}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </form>
                </div>

                {/* Mobile User Button */}
                <Button 
                  variant="outline" 
                  className="w-full mt-4 border-yellow-600/30 text-white hover:bg-yellow-500/10 hover:text-yellow-500 hover:border-yellow-500 transition-all duration-300 rounded-full"
                  asChild
                >
                  <Link href="/login">
                    <User className="mr-2 h-4 w-4" />
                    Minha Conta
                  </Link>
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Barra decorativa */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
    </>
  )
}