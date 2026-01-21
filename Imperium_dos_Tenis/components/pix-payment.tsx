// components/pix-payment.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Copy, Check, Loader2 } from "lucide-react"; // Adicionei Loader2

// Interface atualizada para aceitar isLoading
interface PixPaymentProps {
  amount: number;
  onPaymentConfirmed: () => void;
  isLoading?: boolean;
}

export function PixPayment({ amount, onPaymentConfirmed, isLoading = false }: PixPaymentProps) {
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"pending" | "confirmed">("pending");

  useEffect(() => {
    const mock = `00020126580014BR.GOV.BCB.PIX0136IMP${Math.random().toString(36).slice(2, 10).toUpperCase()}5204000053039865802BR5925IMPERIUM6009SAO PAULO62230503***6304${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;
    setCode(mock);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // no-op
    }
  };

  // Função atualizada para usar o loading do pai
  const handleConfirm = () => {
    // Chama a função do pai imediatamente
    onPaymentConfirmed();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-400"><QrCode /> PIX</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-white">R$ {amount.toFixed(2).replace(".", ",")}</div>
          <Badge className="mt-2 bg-yellow-400 text-black hover:bg-yellow-500">Aprovação Imediata</Badge>
        </div>

        <div className="flex justify-center mb-4">
          <div className="w-48 h-48 bg-white rounded flex items-center justify-center">
            {/* QR Code em preto para contraste no fundo branco */}
            <QrCode className="h-32 w-32 text-black" />
          </div>
        </div>

        <div className="mb-4">
          <div className="font-mono text-sm break-words p-3 bg-white/5 border border-white/10 rounded text-white/70">{code}</div>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" onClick={copy} className="text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-black">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold" 
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Confirmando...</>
              ) : (
                "Já fiz o pagamento"
              )}
            </Button>
          </div>
          {copied && <p className="text-sm text-green-400 mt-2 text-center">Código copiado!</p>}
        </div>

        <div className="text-xs text-white/50 text-center">
          <p>Abra seu app bancário e escaneie o QR ou cole o código.</p>
        </div>
      </CardContent>
    </Card>
  );
}