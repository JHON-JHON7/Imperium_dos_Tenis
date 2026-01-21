"use client"

import { useState, useEffect } from "react"
import { Heart, X, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useFavorites } from "@/lib/favorites-context"
import { useCart } from "@/lib/cart-context"

export function FavoritesDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  // 1. Add state to track if component is mounted
  const [isMounted, setIsMounted] = useState(false)
  
  const { state, removeFromFavorites, getFavoritesCount } = useFavorites()
  const { addToCart } = useCart()

  // 2. Set isMounted to true only after the client has loaded
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      brand: item.brand,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      color: "Padrão",
      size: "40",
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hidden md:flex">
          <Heart className="h-5 w-5" />
          {/* 3. Only render the badge if mounted on the client */}
          {isMounted && getFavoritesCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {getFavoritesCount()}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Meus Favoritos ({isMounted ? getFavoritesCount() : 0})</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {/* 4. Ensure the list also waits for mount to avoid flicker/mismatch */}
          {!isMounted || state.items.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum item nos favoritos</p>
            </div>
          ) : (
            state.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">{item.brand}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="font-bold text-sm">R$ {item.price.toFixed(2)}</span>
                    {item.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        R$ {item.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button size="sm" onClick={() => handleAddToCart(item)} className="h-8 px-2">
                    <ShoppingCart className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => removeFromFavorites(item.id)} className="h-8 px-2">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}