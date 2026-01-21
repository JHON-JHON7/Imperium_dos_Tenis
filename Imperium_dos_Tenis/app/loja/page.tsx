"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation" 
import { Header } from "@/components/header"
import { ProductGrid } from "@/components/product-grid"
import { Footer } from "@/components/footer"
import { ChatbotWidget } from "@/components/chatbot-widget"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Search, Filter, X, Star, Crown, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/cart-context"
import { useFavorites } from "@/lib/favorites-context"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Product {
  id: number
  name: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviewCount: number
  isNew: boolean
  discount?: number
  colors: string[]
  sizes: string[]
  type: string
}


const mockProducts: Product[] = [
  {
    id: 1,
    name: "Tênis Nike Air Max 90",
    brand: "Nike",
    price: 569.99,
    originalPrice: 899.99,
    image: "/90-1P.avif",
    rating: 4.8,
    reviewCount: 124,
    isNew: true,
    discount: 25,
    colors: ["Preto", "Branco"],
    sizes: ["38", "39", "40", "41", "42"],
    type: "Esportivo",
  },
  {
    id: 2,
    name: "Tênis Vans SK8-HI",
    brand: "Vans",
    price: 399.99,
    originalPrice: 499.99,
    image: "/SK8-1B.webp",
    rating: 4.6,
    reviewCount: 89,
    isNew: false,
    colors: ["Branco"],
    sizes: ["39", "40", "41", "42", "43"],
    type: "Casual",
  },
  {
    id: 3,
    name: "Tênis Asics Court FF 3 Novak",
    brand: "Asics",
    price: 1199.99,
    originalPrice: 1499.99,
    image: "/CF-1B.webp", // Primeira imagem do Asics
    rating: 4.9,
    reviewCount: 45,
    isNew: true,
    discount: 20,
    colors: ["Branco", "Azul"],
    sizes: ["39", "40", "41", "42", "43", "44"],
    type: "Esportivo",
  },
  {
    id: 4,
    name: "Tênis Vans Ultrarange EXO",
    brand: "Vans",
    price: 649.99,
    originalPrice: 799.99,
    image: "/UEF-IC.webp", // Primeira imagem do Ultrarange
    rating: 4.7,
    reviewCount: 210,
    isNew: false,
    discount: 18,
    colors: ["Cinza", "Branco"],
    sizes: ["37", "38", "39", "40", "41", "42"],
    type: "Híbrido",
  },
  {
    id: 5,
    name: "Tênis Nike Air Max Excee",
    brand: "Nike",
    price: 549.99,
    originalPrice: 749.99,
    image: "/AME-1V.avif", // Primeira imagem do Excee
    rating: 4.5,
    reviewCount: 156,
    isNew: false,
    discount: 26,
    colors: ["Branco", "Verde", "Preto"],
    sizes: ["38", "39", "40", "41", "42", "43"],
    type: "Casual Esportivo",
  },
  {
    id: 6,
    name: "Stan Smith Classic",
    brand: "Adidas",
    price: 449.9,
    image: "/adidas-stan-smith-classic-white-green-sneakers.jpg",
    rating: 4.5,
    reviewCount: 178,
    isNew: false,
    colors: ["Branco", "Verde"],
    sizes: ["36", "37", "38", "39", "40", "41"],
    type: "Casual",
  },
  {
    id: 7,
    name: "Gel-Kayano 29",
    brand: "Asics",
    price: 899.9,
    image: "/asics-gel-kayano-running-shoes-blue-grey-premium.jpg",
    rating: 4.6,
    reviewCount: 67,
    isNew: true,
    colors: ["Azul", "Cinza"],
    sizes: ["39", "40", "41", "42", "43", "44"],
    type: "Esportivo",
  },
  {
    id: 8,
    name: "Fresh Foam X 1080v12",
    brand: "New Balance",
    price: 799.9,
    image: "/new-balance-fresh-foam-running-shoes-black-grey.jpg",
    rating: 4.4,
    reviewCount: 94,
    isNew: false,
    colors: ["Preto", "Cinza"],
    sizes: ["38", "39", "40", "41", "42"],
    type: "Esportivo",
  },
]

interface SearchSuggestion {
  type: "brand" | "model" | "category"
  value: string
  label: string
  count?: number
}

export default function LojaPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  // Definindo valor inicial para evitar bugs de filtro vazio
  const [priceRange, setPriceRange] = useState([0, 1200]) 
  const [minRating, setMinRating] = useState(0)
  const [showOnlyNew, setShowOnlyNew] = useState(false)
  const [showOnlyDiscount, setShowOnlyDiscount] = useState(false)
  const [sortBy, setSortBy] = useState("popularity")
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)

  const availableBrands = Array.from(new Set(mockProducts.map(p => p.brand))).sort()
  const availableSizes = Array.from(new Set(mockProducts.flatMap(p => p.sizes))).sort()
  const availableColors = Array.from(new Set(mockProducts.flatMap(p => p.colors))).sort()

  // Lógica de Sugestões de Busca
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return []
    
    const query = searchQuery.toLowerCase()
    const results: SearchSuggestion[] = []

    availableBrands.forEach(brand => {
      if (brand.toLowerCase().includes(query)) {
        const count = mockProducts.filter(p => p.brand === brand).length
        results.push({
          type: "brand",
          value: brand,
          label: brand,
          count
        })
      }
    })

    const uniqueModels = new Set<string>()
    mockProducts.forEach(product => {
      if (product.name.toLowerCase().includes(query) && !uniqueModels.has(product.name)) {
        uniqueModels.add(product.name)
        results.push({
          type: "model",
          value: product.name,
          label: product.name
        })
      }
    })

    const categories = ["Esportivo", "Casual"]
    categories.forEach(category => {
      if (category.toLowerCase().includes(query)) {
        const count = mockProducts.filter(p => p.type === category).length
        results.push({
          type: "category",
          value: category,
          label: `Tênis ${category}`,
          count
        })
      }
    })

    return results.slice(0, 8)
  }, [searchQuery, availableBrands])

  useEffect(() => {
    const busca = searchParams.get("busca")
    if (busca) {
      setSearchQuery(busca)
    }
  }, [searchParams])

  // Fecha sugestões ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        searchInputRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Navegação pelo teclado na busca
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedSuggestionIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1)
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
  }

  // Lógica Principal de Filtro
  const filteredProducts = useMemo(() => {
    let filtered = mockProducts.filter((product) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.type.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      if (selectedCategory !== "Todos" && product.type !== selectedCategory) {
        return false
      }

      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false
      }

      if (selectedSizes.length > 0 && !product.sizes.some(size => selectedSizes.includes(size))) {
        return false
      }

      if (selectedColors.length > 0 && !product.colors.some(color => selectedColors.includes(color))) {
        return false
      }

      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false
      }

      if (product.rating < minRating) {
        return false
      }

      if (showOnlyNew && !product.isNew) {
        return false
      }

      if (showOnlyDiscount && !product.discount) {
        return false
      }

      return true
    })

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      default:
        filtered.sort((a, b) => b.reviewCount - a.reviewCount)
    }

    return filtered
  }, [selectedCategory, selectedBrands, selectedSizes, selectedColors, priceRange, minRating, showOnlyNew, showOnlyDiscount, sortBy, searchQuery])

  // Navegação para Detalhes
  const handleProductClick = (productId: number) => {
    router.push(`/produto/${productId}`)
  }

  const handleAddToCart = (productId: number) => {
    const product = mockProducts.find((p) => p.id === productId)
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        color: product.colors[0] || "Padrão",
        size: product.sizes[0] || "40",
      })
    }
  }

  const handleToggleFavorite = (productId: number) => {
    const product = mockProducts.find((p) => p.id === productId)
    if (product) {
      if (isFavorite(productId)) {
        removeFromFavorites(productId)
      } else {
        addToFavorites({
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
        })
      }
    }
  }

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (selectedBrands.length > 0) count++
    if (selectedSizes.length > 0) count++
    if (selectedColors.length > 0) count++
    if (minRating > 0) count++
    if (showOnlyNew) count++
    if (showOnlyDiscount) count++
    return count
  }, [selectedBrands, selectedSizes, selectedColors, minRating, showOnlyNew, showOnlyDiscount])

  const favoriteIds = mockProducts.filter((p) => isFavorite(p.id)).map((p) => p.id)

  const clearAllFilters = () => {
    setSelectedBrands([])
    setSelectedSizes([])
    setSelectedColors([])
    setPriceRange([0, 1200])
    setMinRating(0)
    setShowOnlyNew(false)
    setShowOnlyDiscount(false)
  }

  // === CONTEÚDO DO FILTRO (CORRIGIDO PARA MANTER O FOCO) ===
  const filterContent = (
    <div className="space-y-6">
      {/* Estilo Global para remover setas do input number neste contexto */}
      <style jsx global>{`
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>

      {activeFiltersCount > 0 && (
        <div className="flex items-center justify-between pb-4 border-b border-yellow-600/20">
          <span className="text-sm font-medium text-yellow-500">{activeFiltersCount} filtro(s) ativo(s)</span>
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-white hover:text-yellow-500 hover:bg-yellow-500/10">
            <X className="w-4 h-4 mr-2" />
            Limpar Tudo
          </Button>
        </div>
      )}

      {/* Marca */}
      <div>
        <h3 className="font-bold text-yellow-500 mb-3 flex items-center gap-2">
          <Crown className="w-4 h-4" />
          Marca
        </h3>
        <div className="space-y-2">
          {availableBrands.map((brand) => (
            <div key={brand} className="flex items-center group">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => {
                  setSelectedBrands(
                    checked
                      ? [...selectedBrands, brand]
                      : selectedBrands.filter((b) => b !== brand)
                  )
                }}
                className="border-yellow-600/50 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
              />
              <Label htmlFor={`brand-${brand}`} className="ml-2 cursor-pointer text-white group-hover:text-yellow-500 transition-colors">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Faixa de Preço (NOVO VISUAL & CORRIGIDO) */}
      <div>
        <h3 className="font-bold text-yellow-500 mb-3">Faixa de Preço</h3>
        <div className="flex items-center justify-between gap-3 p-1">
          {/* MÍNIMO */}
          <div className="relative group w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500 font-bold text-sm pointer-events-none group-focus-within:text-yellow-400 transition-colors">
              R$
            </div>
            <Input
              type="number"
              min={0}
              placeholder="0"
              value={priceRange[0] === 0 ? "" : priceRange[0]}
              onChange={(e) => {
                const val = Number(e.target.value);
                setPriceRange([val, priceRange[1]]);
              }}
              className="pl-10 h-11 bg-gray-900/50 border-gray-700 rounded-xl text-white placeholder:text-gray-600 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all font-medium"
            />
          </div>

          <div className="text-gray-600 font-light text-lg">
            -
          </div>

          {/* MÁXIMO */}
          <div className="relative group w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500 font-bold text-sm pointer-events-none group-focus-within:text-yellow-400 transition-colors">
              R$
            </div>
            <Input
              type="number"
              min={0}
              placeholder="Max"
              value={priceRange[1] === 0 ? "" : priceRange[1]}
              onChange={(e) => {
                const val = Number(e.target.value);
                setPriceRange([priceRange[0], val]);
              }}
              className="pl-10 h-11 bg-gray-900/50 border-gray-700 rounded-xl text-white placeholder:text-gray-600 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all font-medium"
            />
          </div>
        </div>
      </div>

      {/* Tamanho */}
      <div>
        <h3 className="font-bold text-yellow-500 mb-3">Tamanho</h3>
        <div className="grid grid-cols-4 gap-2">
          {availableSizes.map((size) => (
            <Button
              key={size}
              variant={selectedSizes.includes(size) ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedSizes(
                  selectedSizes.includes(size)
                    ? selectedSizes.filter((s) => s !== size)
                    : [...selectedSizes, size]
                )
              }}
              className={selectedSizes.includes(size) 
                ? "bg-yellow-500 hover:bg-yellow-600 text-black font-bold border-0" 
                : "bg-transparent border-2 border-yellow-600/30 text-white hover:border-yellow-500 hover:text-yellow-500 hover:bg-yellow-500/10"
              }
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* Cor */}
      <div>
        <h3 className="font-bold text-yellow-500 mb-3">Cor</h3>
        <div className="space-y-2">
          {availableColors.map((color) => (
            <div key={color} className="flex items-center group">
              <Checkbox
                id={`color-${color}`}
                checked={selectedColors.includes(color)}
                onCheckedChange={(checked) => {
                  setSelectedColors(
                    checked
                      ? [...selectedColors, color]
                      : selectedColors.filter((c) => c !== color)
                  )
                }}
                className="border-yellow-600/50 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
              />
              <Label htmlFor={`color-${color}`} className="ml-2 cursor-pointer text-white group-hover:text-yellow-500 transition-colors">
                {color}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Avaliação Mínima */}
      <div>
        <h3 className="font-bold text-yellow-500 mb-3">Avaliação Mínima</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <Button
              key={rating}
              variant={minRating === rating ? "default" : "outline"}
              size="sm"
              className={`w-full justify-start ${
                minRating === rating
                  ? "bg-yellow-500 hover:bg-yellow-600 text-black font-bold border-0"
                  : "bg-transparent border-2 border-yellow-600/30 text-white hover:border-yellow-500 hover:text-yellow-500 hover:bg-yellow-500/10"
              }`}
              onClick={() => setMinRating(minRating === rating ? 0 : rating)}
            >
              <div className="flex items-center gap-1">
                {[...Array(rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Outros Filtros */}
      <div className="space-y-3 pt-4 border-t border-yellow-600/20">
        <div className="flex items-center group">
          <Checkbox
            id="only-new"
            checked={showOnlyNew}
            onCheckedChange={(checked) => setShowOnlyNew(checked as boolean)}
            className="border-yellow-600/50 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
          />
          <Label htmlFor="only-new" className="ml-2 cursor-pointer text-white group-hover:text-yellow-500 transition-colors">
            Apenas Novidades
          </Label>
        </div>
        <div className="flex items-center group">
          <Checkbox
            id="only-discount"
            checked={showOnlyDiscount}
            onCheckedChange={(checked) => setShowOnlyDiscount(checked as boolean)}
            className="border-yellow-600/50 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
          />
          <Label htmlFor="only-discount" className="ml-2 cursor-pointer text-white group-hover:text-yellow-500 transition-colors">
            Apenas Promoções
          </Label>
        </div>
      </div>
    </div>
  )

  // Funções Auxiliares de Sugestão
  const getSuggestionIcon = (type: SearchSuggestion["type"]) => {
    switch (type) {
      case "brand":
        return <Crown className="w-4 h-4 text-yellow-500" />
      case "model":
        return <Search className="w-4 h-4 text-blue-400" />
      case "category":
        return <TrendingUp className="w-4 h-4 text-green-400" />
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
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent blur-3xl"></div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 bg-clip-text text-transparent relative z-10">
            {/* Título pode ser adicionado aqui */}
          </h1>
          
          {/* Tabs de Categoria */}
          <div className="flex justify-center mb-8 relative z-10">
            <div className="inline-flex gap-2 bg-white/5 backdrop-blur-sm border border-yellow-600/20 rounded-full p-2">
              {["Todos", "Esportivo", "Casual"].map((cat) => (
                <button
                  key={cat}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg shadow-yellow-500/50"
                      : "text-white hover:text-yellow-500 hover:bg-white/5"
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === "Todos" ? "Todos os Produtos" : `Tênis ${cat}s`}
                </button>
              ))}
            </div>
          </div>

          {/* Barra de Busca Premium */}
          <div className="flex justify-center relative z-10">
            <div className="relative w-full max-w-xl group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-yellow-500/60 group-hover:text-yellow-500 h-5 w-5 transition-colors duration-300 z-10" />
                <Input
                  ref={searchInputRef}
                  placeholder="Buscar por marca, modelo ou categoria..."
                  className="pl-14 pr-12 h-14 rounded-full bg-white/5 border-2 border-yellow-600/30 hover:border-yellow-500/50 focus:border-yellow-500 text-white placeholder:text-gray-400 backdrop-blur-md transition-all duration-300 relative z-10 text-base shadow-lg"
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
                    onClick={() => {
                      setSearchQuery("")
                      setShowSuggestions(false)
                      searchInputRef.current?.focus()
                    }}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition-colors z-20"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Dropdown de Sugestões */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-yellow-600/20 rounded-2xl shadow-2xl shadow-black overflow-hidden z-[9999] backdrop-blur-xl"
                  style={{ maxHeight: '400px', overflowY: 'auto' }}
                >
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs text-yellow-500/70 border-b border-white/10">
                      {suggestions.length} {suggestions.length === 1 ? 'sugestão encontrada' : 'sugestões encontradas'}
                    </div>
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={`${suggestion.type}-${suggestion.value}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={cn(
                          "w-full px-4 py-3 flex items-center gap-3 hover:bg-yellow-500/10 transition-colors text-left",
                          selectedSuggestionIndex === index && "bg-yellow-500/10"
                        )}
                      >
                        {getSuggestionIcon(suggestion.type)}
                        <div className="flex-1">
                          <div className="font-medium text-white">{suggestion.label}</div>
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
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Premium */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 bg-gradient-to-b from-gray-900 to-black rounded-2xl border-2 border-yellow-600/20 p-6 shadow-2xl shadow-yellow-500/10 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2 bg-gradient-to-r from-yellow-300 to-yellow-600 bg-clip-text text-transparent">
                  <Filter className="w-6 h-6 text-yellow-500" />
                  Filtros
                </h2>
              </div>
              {/* RENDERIZAÇÃO DA VARIÁVEL filterContent (Corrigido) */}
              {filterContent}
            </div>
          </aside>

          {/* Conteúdo Principal */}
          <div className="flex-1">
            {/* Barra de Controle Premium */}
            <div className="flex items-center justify-between mb-8 p-6 bg-gradient-to-r from-gray-900 to-black rounded-2xl border-2 border-yellow-600/20 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-4">
                {/* Botão Filtros Mobile */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden border-yellow-600/30 text-white hover:border-yellow-500 hover:text-yellow-500 hover:bg-yellow-500/10">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtros
                      {activeFiltersCount > 0 && (
                        <Badge className="ml-2 bg-yellow-500 text-black">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto bg-gradient-to-b from-gray-900 to-black border-yellow-600/20">
                    <SheetHeader>
                      <SheetTitle className="flex items-center gap-2 text-yellow-500">
                        <Filter className="w-5 h-5" />
                        Filtros
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      {/* RENDERIZAÇÃO DA VARIÁVEL filterContent (Corrigido) */}
                      {filterContent}
                    </div>
                  </SheetContent>
                </Sheet>

                <span className="text-sm text-yellow-400 font-medium">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                </span>
              </div>

              {/* Ordenação Premium */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-56 bg-white/5 border-yellow-600/30 text-white hover:border-yellow-500 focus:border-yellow-500">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-yellow-600/20">
                  <SelectItem value="popularity" className="text-white hover:text-yellow-500 hover:bg-yellow-500/10">Popularidade</SelectItem>
                  <SelectItem value="newest" className="text-white hover:text-yellow-500 hover:bg-yellow-500/10">Novidades</SelectItem>
                  <SelectItem value="price-low" className="text-white hover:text-yellow-500 hover:bg-yellow-500/10">Preço: Menor para Maior</SelectItem>
                  <SelectItem value="price-high" className="text-white hover:text-yellow-500 hover:bg-yellow-500/10">Preço: Maior para Menor</SelectItem>
                  <SelectItem value="rating" className="text-white hover:text-yellow-500 hover:bg-yellow-500/10">Melhor Avaliação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Grid de Produtos */}
            <ProductGrid
              products={filteredProducts}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              favorites={favoriteIds}
              onProductClick={handleProductClick}
            />
          </div>
        </div>
      </main>
      
      <Footer />
      <ChatbotWidget />
    </div>
  )
}