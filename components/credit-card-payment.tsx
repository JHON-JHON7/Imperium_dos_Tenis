// components/credit-card-payment.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CreditCard, Lock, Loader2 } from "lucide-react"; // Adicionei Loader2

// Interface atualizada para aceitar isLoading
interface CreditCardPaymentProps {
  amount: number;
  onPaymentConfirmed: () => void;
  isLoading?: boolean;
}

export function CreditCardPayment({ amount, onPaymentConfirmed, isLoading = false }: CreditCardPaymentProps) {
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "", installments: "1" });
  const [localProcessing, setLocalProcessing] = useState(false);

  const formatCard = (v: string) => v.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();

  const handle = (field: string, value: string) => {
    let val = value;
    if (field === "number") val = formatCard(value).slice(0, 19);
    if (field === "cvv") val = value.replace(/\D/g, "").slice(0, 4);
    setCard((p) => ({ ...p, [field]: val }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalProcessing(true);
    
    // Simula delay do gateway de pagamento local antes de chamar o backend
    setTimeout(() => {
      setLocalProcessing(false);
      onPaymentConfirmed();
    }, 1500);
  };

  // Combina o loading local com o loading do pai (envio do email/backend)
  const isBusy = localProcessing || isLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-yellow-400 flex items-center gap-2">
          <CreditCard /> Cartão de Crédito
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="cardNumber" className="text-gray-300">Número</Label>
            <Input 
              id="cardNumber" 
              value={card.number} 
              onChange={(e) => handle("number", e.target.value)} 
              placeholder="0000 0000 0000 0000" 
              required 
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div>
            <Label htmlFor="cardName" className="text-gray-300">Nome</Label>
            <Input 
              id="cardName" 
              value={card.name} 
              onChange={(e) => handle("name", e.target.value.toUpperCase())} 
              required 
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry" className="text-gray-300">Validade</Label>
              <Input 
                id="expiry" 
                value={card.expiry} 
                onChange={(e) => handle("expiry", e.target.value)} 
                placeholder="MM/AA" 
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <Label htmlFor="cvv" className="text-gray-300">CVV</Label>
              <Input 
                id="cvv" 
                value={card.cvv} 
                onChange={(e) => handle("cvv", e.target.value)} 
                placeholder="000" 
                required 
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>

          <div>
            <Label className="text-gray-300">Parcelamento</Label>
            <Select onValueChange={(v) => setCard((p) => ({ ...p, installments: v }))} value={card.installments}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}x de R$ {(amount / n).toFixed(2).replace(".", ",")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/70">
            <Lock className="h-4 w-4" />
            <span>Pagamento seguro (SSL)</span>
          </div>

          <Button 
            type="submit" 
            disabled={isBusy} 
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold h-12"
          >
            {isBusy ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Processando...</>
            ) : (
              `Pagar R$ ${amount.toFixed(2).replace(".", ",")}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}