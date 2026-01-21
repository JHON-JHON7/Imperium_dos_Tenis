"use client"

import { useEffect, useState } from "react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingCart, Plus, Minus, X } from "lucide-react"

export function CartDrawer() {
  const { state, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const cartCount = getCartCount()
  const cartTotal = getCartTotal()

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null


  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {cartCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Carrinho de Compras</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {state.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Seu carrinho está vazio</h3>
              <p className="text-muted-foreground mb-4">Adicione alguns produtos incríveis!</p>
              <Button onClick={() => setIsOpen(false)}>Continuar Comprando</Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-4">
                  {state.items.map((item, index) => (
                    <div
                      key={`${item.id}-${item.color}-${item.size}-${index}`}
                      className="flex gap-4 p-4 border rounded-lg"
                    >
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 space-y-2">
                        <div>
                          <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">{item.brand}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.color} • Tam. {item.size}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 bg-transparent"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 bg-transparent"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold text-sm">
                              R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                            </p>
                            {item.originalPrice && (
                              <p className="text-xs text-muted-foreground line-through">
                                R$ {(item.originalPrice * item.quantity).toFixed(2).replace(".", ",")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                {state.coupon && (
                  <div className="flex items-center justify-between text-sm">
                    <span>Desconto ({state.coupon}):</span>
                    <span className="text-green-600">-{state.discount}%</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>R$ {cartTotal.toFixed(2).replace(".", ",")}</span>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" size="lg" onClick={() => setIsOpen(false)}>
                    <a href="/carrinho" className="w-full">
                      Ver Carrinho Completo
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => setIsOpen(false)}>
                    Continuar Comprando
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
