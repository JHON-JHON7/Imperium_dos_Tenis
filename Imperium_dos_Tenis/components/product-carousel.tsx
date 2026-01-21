"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useFavorites } from "@/lib/favorites-context"

export function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { addToCart } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()

  const products = [
    {
      id: 1,
      name: "Air Max Revolution",
      brand: "Nike",
      price: 899.9,
      originalPrice: 1199.9,
      image: "/nike-air-max-sneakers-white-and-blue.jpg",
      isNew: true,
      discount: "25%",
    },
    {
      id: 2,
      name: "Air Max Revolution",
      brand: "Nike",
      price: 899.9,
      originalPrice: 1199.9,
      image: "/nike-air-max-side-view.jpg",
      isNew: true,
      discount: "25%",
    },
    {
      id: 3,
      name: "Air Max Revolution",
      brand: "Nike",
      price: 899.9,
      originalPrice: 1199.9,
      image: "/nike-air-max-back-view.jpg",
      isNew: true,
      discount: "25%",
    },
    {
      id: 4,
      name: "Air Max Revolution",
      brand: "Nike",
      price: 899.9,
      originalPrice: 1199.9,
      image: "/nike-air-max-sole-view.jpg",
      isNew: true,
      discount: "25%",
    },
  ]

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length)
  }

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      color: "Padrão",
      size: "40",
    })
  }

  const handleToggleFavorite = (product: any) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id)
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

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [])

  // Get 3 products to display (current and next 2)
  const getVisibleProducts = () => {
    const visible = []
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % products.length
      visible.push(products[index])
    }
    return visible
  }

  const visibleProducts = getVisibleProducts()

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-accent/5 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-primary">Produtos em Destaque</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Os tênis mais desejados da temporada</p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border-accent hover:bg-accent hover:text-accent-foreground"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border-accent hover:bg-accent hover:text-accent-foreground"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Carousel Content */}
          <div className="grid md:grid-cols-3 gap-6 px-16">
            {visibleProducts.map((product, index) => (
              <Card
                key={`${product.id}-${currentIndex}-${index}`}
                className={`group hover:shadow-xl transition-all duration-500 border-2 ${
                  index === 1 ? "border-accent shadow-lg scale-105" : "border-border hover:border-accent/50"
                }`}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <a href={`/produto/${product.id}`}>
                      <img
                        src={product.image || "/placeholder.svg?height=400&width=400&query=premium sneakers"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                      />
                    </a>
                    <div className="absolute top-3 left-3 flex gap-2">
                      {product.isNew && <Badge className="bg-accent text-accent-foreground font-semibold">Novo</Badge>}
                      {product.discount && (
                        <Badge variant="destructive" className="font-semibold">
                          -{product.discount}
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                        onClick={() => handleToggleFavorite(product)}
                      >
                        <Heart className={`h-4 w-4 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : ""}`} />
                      </Button>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">{product.brand}</p>
                      <a href={`/produto/${product.id}`}>
                        <h3 className="font-bold text-lg text-balance hover:text-accent transition-colors cursor-pointer">
                          {product.name}
                        </h3>
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-primary">
                        R$ {product.price.toFixed(2).replace(".", ",")}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                        </span>
                      )}
                    </div>
                    <Button
                      className="w-full bg-primary hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Adicionar ao Carrinho
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {products.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-accent scale-125" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
            asChild
          >
            <a href="/loja">Ver Todos os Produtos</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
