"use client"

import { useState, useEffect } from "react" // Import useState and useEffect
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Star, Sparkles } from "lucide-react"

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

interface ProductGridProps {
  products: Product[]
  onAddToCart: (productId: number) => void
  onToggleFavorite: (productId: number) => void
  favorites: number[]
  onProductClick?: (productId: number) => void 
}

export function ProductGrid({ 
  products, 
  onAddToCart, 
  onToggleFavorite, 
  favorites,
  onProductClick 
}: ProductGridProps) {
  
  // 1. Add state to track if component is mounted
  const [isMounted, setIsMounted] = useState(false)

  // 2. Set isMounted to true only after the client has loaded
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-8xl mb-6 opacity-50">👟</div>
        <h3 className="text-2xl font-bold mb-3 text-white">Nenhum produto encontrado</h3>
        <p className="text-gray-400">Tente ajustar os filtros para encontrar o que procura</p>
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      {products.map((product) => (
        <Card 
          key={product.id} 
          className="group relative overflow-hidden bg-gradient-to-b from-gray-900 to-black border-2 border-yellow-600/20 hover:border-yellow-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/20 hover:scale-105"
        >
          <CardContent className="p-0">
            {/* Imagem do Produto com Click Handler */}
            <div 
              className="relative aspect-square overflow-hidden cursor-pointer"
              onClick={() => onProductClick && onProductClick(product.id)}
            >
              <div className="relative w-full h-full group-hover:scale-110 transition-transform duration-700">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {/* Overlay gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              {/* Badges Superior */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold px-3 py-1 shadow-lg shadow-yellow-500/50 border-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    NOVO
                  </Badge>
                )}
                {product.discount && (
                  <Badge className="bg-gradient-to-r from-red-500 to-red-700 text-white font-bold px-3 py-1 shadow-lg shadow-red-500/50 border-0">
                    -{product.discount}% OFF
                  </Badge>
                )}
              </div>
              
              {/* Botão Favorito */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Button
                  size="icon"
                  className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border-2 border-yellow-500/30 hover:border-yellow-500 hover:bg-yellow-500/20 transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleFavorite(product.id)
                  }}
                >
                  {/* 3. Use isMounted to check favorite status only on client */}
                  <Heart 
                    className={`h-5 w-5 transition-all duration-300 ${
                      isMounted && favorites.includes(product.id) 
                        ? "fill-red-500 text-red-500 scale-110" 
                        : "text-white"
                    }`} 
                  />
                </Button>
              </div>

              {/* Brilho decorativo */}
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/0 via-yellow-500/20 to-yellow-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
            </div>

            {/* Informações do Produto */}
            <div className="p-6 space-y-4 bg-gradient-to-b from-transparent to-black/50">
              {/* Marca */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-yellow-500 uppercase tracking-wider">
                  {product.brand}
                </span>
                {/* Avaliação */}
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(product.rating) 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 ml-1">({product.reviewCount})</span>
                </div>
              </div>

              {/* Nome do Produto com Click Handler */}
              <div 
                className="cursor-pointer"
                onClick={() => onProductClick && onProductClick(product.id)}
              >
                <h3 className="font-bold text-lg text-white line-clamp-2 group-hover:text-yellow-500 transition-colors duration-300 min-h-[3.5rem]">
                  {product.name}
                </h3>
              </div>

              {/* Preço */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-600 bg-clip-text text-transparent">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                  </span>
                )}
              </div>

              {/* Cores e Tamanhos */}
              <div className="flex items-center gap-3 text-xs text-gray-400 pt-2 border-t border-yellow-600/10">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span>{product.colors.length} {product.colors.length === 1 ? 'cor' : 'cores'}</span>
                </div>
                <span className="text-yellow-600/50">•</span>
                <span>Tam: {product.sizes.slice(0, 3).join(", ")}{product.sizes.length > 3 ? '...' : ''}</span>
              </div>

              {/* Botão Adicionar ao Carrinho */}
              <Button 
                className="w-full h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105 group/btn" 
                onClick={(e) => {
                  e.stopPropagation()
                  onAddToCart(product.id)
                }}
              >
                <ShoppingCart className="mr-2 h-5 w-5 group-hover/btn:scale-110 transition-transform duration-300" />
                Adicionar ao Carrinho
              </Button>
            </div>
          </CardContent>

          {/* Borda decorativa animada */}
          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-500/20 via-transparent to-yellow-500/20"></div>
          </div>
        </Card>
      ))}
    </div>
  )
}