"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Truck, Clock, MapPin } from "lucide-react"

interface ShippingOption {
  name: string
  price: number
  days: string
  icon: React.ReactNode
}

export function ShippingCalculator() {
  const [cep, setCep] = useState("")
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const calculateShipping = async () => {
    if (!cep || cep.length !== 8) {
      setError("Digite um CEP válido com 8 dígitos")
      return
    }

    setIsLoading(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      const mockOptions: ShippingOption[] = [
        {
          name: "Entrega Normal",
          price: 15.9,
          days: "5-7 dias úteis",
          icon: <Truck className="h-4 w-4" />,
        },
        {
          name: "Entrega Expressa",
          price: 29.9,
          days: "2-3 dias úteis",
          icon: <Clock className="h-4 w-4" />,
        },
        {
          name: "Retirar na Loja",
          price: 0,
          days: "Disponível hoje",
          icon: <MapPin className="h-4 w-4" />,
        },
      ]
      setShippingOptions(mockOptions)
      setIsLoading(false)
    }, 1000)
  }

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.slice(0, 8)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4">Calcular Frete</h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Digite seu CEP"
              value={cep}
              onChange={(e) => setCep(formatCep(e.target.value))}
              maxLength={8}
            />
            <Button onClick={calculateShipping} disabled={isLoading}>
              {isLoading ? "Calculando..." : "Calcular"}
            </Button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {shippingOptions.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Opções de entrega:</h4>
              {shippingOptions.map((option, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {option.icon}
                    <div>
                      <p className="font-medium text-sm">{option.name}</p>
                      <p className="text-xs text-muted-foreground">{option.days}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {option.price === 0 ? "Grátis" : `R$ ${option.price.toFixed(2).replace(".", ",")}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
