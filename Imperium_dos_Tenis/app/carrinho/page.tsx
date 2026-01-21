"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/lib/cart-context" // Assumindo que seu Contexto de Carrinho está aqui
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChatbotWidget } from "@/components/chatbot-widget"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, X, Tag, ShoppingCart } from "lucide-react"

export default function CarrinhoPage() {
  const { state, updateQuantity, removeFromCart, applyCoupon, removeCoupon, getCartTotal, getCartCount } = useCart()

  const [couponCode, setCouponCode] = useState("")
  const [couponError, setCouponError] = useState("")

  // --- CORREÇÃO DE HYDRATION ---
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    // Este código só roda no cliente, após a primeira renderização (hidratação)
    setHasHydrated(true);
  }, []);
  // -----------------------------

  const cartCount = getCartCount()
  const subtotal = state.items.reduce((total: number, item: any) => total + item.price * item.quantity, 0)
  const discountAmount = (subtotal * state.discount) / 100
  const cartTotal = getCartTotal()

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError("Digite um código de cupom")
      return
    }

    const success = applyCoupon(couponCode)
    if (success) {
      setCouponCode("")
      setCouponError("")
    } else {
      setCouponError("Cupom inválido ou expirado")
    }
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    setCouponError("")
  }

  // --- CORREÇÃO DE HYDRATION: Mostra um estado de carregamento inicial ---
  if (!hasHydrated) {
    return (
      // Aplicando o tema escuro aqui
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <p className="text-center py-12 text-lg text-white/70">Carregando carrinho...</p>
        </main>
        <Footer />
        <ChatbotWidget />
      </div>
    );
  }
  // ---------------------------------------------------------------------

  if (state.items.length === 0) {
    return (
      // Aplicando o tema escuro aqui
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            {/* Estilizando o ícone, título e parágrafo */}
            <ShoppingCart className="h-24 w-24 mx-auto text-yellow-400 mb-6" />
            <h1 className="text-3xl font-bold mb-4 text-white">Seu carrinho está vazio</h1>
            <p className="text-white/70 mb-8">
              Parece que você ainda não adicionou nenhum item ao seu carrinho.
            </p>
            {/* Estilizando o botão principal */}
            <Button size="lg" asChild className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold hover:from-yellow-500 hover:to-yellow-600">
              <a href="/loja">Continuar Comprando</a>
            </Button>
          </div>
        </main>
        <Footer />
        <ChatbotWidget />
      </div>
    )
  }

  return (
    // Aplicando o tema escuro aqui
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          {/* Estilizando títulos */}
          <h1 className="text-3xl font-bold mb-2 text-yellow-400">Carrinho de Compras</h1>
          <p className="text-white/70">
            {cartCount} {cartCount === 1 ? "item" : "itens"} no seu carrinho
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item: any, index: number) => (
              // Estilizando o Card do item
              <Card key={`${item.id}-${item.color}-${item.size}-${index}`} className="bg-white/5 border-white/10 text-white">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg text-white">{item.name}</h3>
                        <p className="text-white/70">{item.brand}</p>
                        <div className="flex gap-2 mt-1">
                          {/* Estilizando Badges */}
                          <Badge variant="outline" className="text-white/70 border-white/20">{item.color}</Badge>
                          <Badge variant="outline" className="text-white/70 border-white/20">Tam. {item.size}</Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Estilizando Botões de Quantidade */}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-medium w-12 text-center text-white">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="text-xl font-bold text-white">
                            R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                          </p>
                          _           {item.originalPrice && (
                            <p className="text-sm text-white/70 line-through">
                              R$ {(item.originalPrice * item.quantity).toFixed(2).replace(".", ",")}
                            </p>
                          )}
                          <p className="text-sm text-white/70">
                            R$ {item.price.toFixed(2).replace(".", ",")} cada
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white/60 hover:text-red-500"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Coupon */}
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-400">
                  <Tag className="h-5 w-5" />
                  Cupom de Desconto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {state.coupon ? (
                  // Estilizando o cupom aplicado
                  <div className="flex items-center justify-between p-3 bg-green-900/30 border border-green-700 rounded-lg">
                    <div>
                      <p className="font-medium text-green-300">{state.coupon}</p>
                      <p className="text-sm text-green-400">Desconto de {state.discount}% aplicado</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleRemoveCoupon} className="text-green-300 hover:text-white">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Digite o código do cupom"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value)
                          setCouponError("")
                        }}
                        // Estilizando o Input
                        className="bg-transparent border-white/20 text-white placeholder:text-gray-500 focus:border-yellow-400 ring-offset-black focus:ring-yellow-400"
                      />
                      {/* Estilizando o Botão */}
                      <Button onClick={handleApplyCoupon} className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold hover:from-yellow-500 hover:to-yellow-600">Aplicar</Button>
                    </div>
                    {couponError && <p className="text-sm text-red-400">{couponError}</p>}
                    <div className="text-xs text-white/60">
                      
                      <p>• DESCONTO10 (10% off)</p>
                      <p>• PRIMEIRACOMPRA (15% off)</p>
                      <p>• BLACKFRIDAY (25% off)</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <CardTitle className="text-yellow-400">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-white/80">
                  <span>
                    Subtotal ({cartCount} {cartCount === 1 ? "item" : "itens"})
                  </span>
                  <span className="text-white">R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                </div>

                {state.discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Desconto ({state.coupon})</span>
                    <span>-R$ {discountAmount.toFixed(2).replace(".", ",")}</span>
                  </div>
                )}

                <Separator className="bg-white/20" />

                <div className="flex justify-between text-xl font-bold text-white">
                  <span>Total</span>
                  <span className="text-yellow-400">R$ {cartTotal.toFixed(2).replace(".", ",")}</span>
                </div>

                {/* Estilizando Botão Principal */}
                <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold hover:from-yellow-500 hover:to-yellow-600" size="lg" asChild>
                  <a href="/checkout">Finalizar Compra</a>
                </Button>

                {/* Estilizando Botão Secundário */}
                <Button variant="outline" className="w-full bg-transparent text-white/90 border-white/30 hover:bg-white/10 hover:text-white" asChild>
                  <a href="/loja">Continuar Comprando</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
      <ChatbotWidget />
    </div>
  )
}