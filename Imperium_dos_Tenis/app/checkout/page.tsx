"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ChatbotWidget } from "@/components/chatbot-widget";
import { CheckoutSteps } from "@/components/checkout-steps";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, CreditCard, Check, Package, Truck, Calendar, Clock } from "lucide-react";

import { useCart } from "@/lib/cart-context";

const addressSchema = z.object({
  cep: z.string().min(8, "CEP inválido"),
  state: z.string().min(2, "Estado inválido"),
  street: z.string().min(2, "Rua inválida"),
  number: z.string().min(1, "Número inválido"),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Bairro inválido"),
  city: z.string().min(2, "Cidade inválida"),
});

const paymentSchema = z.object({
  cardNumber: z.string().min(13, "Número do cartão inválido").max(19, "Número do cartão inválido"),
  cardName: z.string().min(3, "Nome inválido"),
  cardExpiry: z.string().regex(/^\d{2}\/\d{2}$/, "Formato inválido (MM/AA)"),
  cardCvv: z.string().min(3, "CVV inválido").max(3, "CVV inválido"),
  installments: z.string().min(1, "Selecione o parcelamento"),
});

type AddressForm = z.infer<typeof addressSchema>;
type PaymentForm = z.infer<typeof paymentSchema>;

const CheckoutLoading = () => (
  <div className="min-h-screen bg-black text-white">
    <Header />
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4 text-yellow-400">Carregando...</h1>
        <p className="text-white/70 mb-8">Aguarde enquanto preparamos seu checkout.</p>
      </div>
    </main>
    <Footer />
    <ChatbotWidget />
  </div>
);

export default function CheckoutPage() {
  const router = useRouter();
  const { state, getCartTotal, getCartCount, clearCart } = useCart();

  const [hasHydrated, setHasHydrated] = useState(false);
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [deliveryMethod, setDeliveryMethod] = useState<"normal" | "express" | "pickup">("pickup");
  const [paymentMethod, setPaymentMethod] = useState<"debit" | "credit">("credit");
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [orderDate, setOrderDate] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [lastCardDigits, setLastCardDigits] = useState("");
  
  const [addressData, setAddressData] = useState<AddressForm | null>(null);
  
  // SALVAR DADOS DO PEDIDO ANTES DE LIMPAR O CARRINHO
  const [savedOrderItems, setSavedOrderItems] = useState<any[]>([]);
  const [savedOrderTotal, setSavedOrderTotal] = useState(0);
  const [savedOriginalSubtotal, setSavedOriginalSubtotal] = useState(0);
  const [savedDiscountAmount, setSavedDiscountAmount] = useState(0);
  const [savedShippingCost, setSavedShippingCost] = useState(0);
  const [savedCartCount, setSavedCartCount] = useState(0);
  const [savedHasDiscount, setSavedHasDiscount] = useState(false);

  // Detecta se há cupom aplicado
  const hasDiscount = state.items.some((item: any) => item.originalPrice && item.originalPrice > item.price);
  
  // Calcula subtotal original (sem desconto)
  const originalSubtotal = state.items.reduce((sum: number, item: any) => {
    const price = item.originalPrice || item.price;
    return sum + (Number(price) * item.quantity);
  }, 0);
  
  const cartTotal = getCartTotal();
  const discountAmount = originalSubtotal - cartTotal;
  const cartCount = getCartCount();
  const shippingCost = deliveryMethod === "pickup" ? 0 : deliveryMethod === "express" ? 29.9 : 15.9;
  const finalTotal = Number((cartTotal + shippingCost).toFixed(2));

  const { register: registerAddress, handleSubmit: handleSubmitAddress, formState: formStateAddress, setValue: setValueAddress } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      cep: "",
      state: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
    },
  });

  const { register: registerPayment, handleSubmit: handleSubmitPayment, formState: formStatePayment, setValue } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: "",
      cardName: "",
      cardExpiry: "",
      cardCvv: "",
      installments: "",
    },
  });

  const onAddressSubmit = (data: AddressForm) => {
    setAddressData(data);
    setCurrentStep(2);
  };

  // Função para calcular data de entrega estimada
  const calculateDeliveryDate = (method: "normal" | "express" | "pickup") => {
    const today = new Date();
    let daysToAdd = 0;
    
    if (method === "normal") daysToAdd = 6;
    else if (method === "express") daysToAdd = 3;
    else return "Disponível para retirada hoje";
    
    const deliveryDate = new Date(today);
    deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);
    
    return deliveryDate.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const onPaymentSubmit = async (data: PaymentForm) => {
    setIsSending(true);
    
    // Salva os últimos 4 dígitos do cartão
    const cardNumber = data.cardNumber.replace(/\s/g, '');
    setLastCardDigits(cardNumber.slice(-4));
    
    // SALVAR DADOS DO PEDIDO ANTES DE LIMPAR
    setSavedOrderItems([...state.items]);
    setSavedOrderTotal(finalTotal);
    setSavedOriginalSubtotal(originalSubtotal);
    setSavedDiscountAmount(discountAmount);
    setSavedShippingCost(shippingCost);
    setSavedCartCount(cartCount);
    setSavedHasDiscount(hasDiscount);
    
    // Simula processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Gera número de pedido realista
    const orderNum = `IMP${Date.now().toString().slice(-8)}`;
    setOrderNumber(orderNum);
    
    // Define data do pedido
    const now = new Date();
    setOrderDate(now.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }));
    
    // Calcula data de entrega
    setEstimatedDelivery(calculateDeliveryDate(deliveryMethod));
    
    setOrderConfirmed(true);
    setCurrentStep(3);
    
    // Limpa o carrinho DEPOIS de salvar os dados
    clearCart();
    setIsSending(false);
  };

  // Máscara para número do cartão
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Máscara para validade MM/AA
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  // Máscara para CVV (apenas números)
  const formatCVV = (value: string) => {
    return value.replace(/[^0-9]/gi, '').slice(0, 3);
  };

  // Máscara para CEP
  const formatCEP = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 5) {
      return v.slice(0, 5) + '-' + v.slice(5, 8);
    }
    return v;
  };

  if (!hasHydrated) {
    return <CheckoutLoading />;
  }

  if (state.items.length === 0 && !orderConfirmed) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4 text-white">Carrinho Vazio</h1>
            <p className="text-white/70 mb-8">Adicione produtos ao carrinho para continuar.</p>
            <Button size="lg" onClick={() => router.push("/loja")} className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold hover:from-yellow-500 hover:to-yellow-600">
              Continuar Comprando
            </Button>
          </div>
        </main>
        <Footer />
        <ChatbotWidget />
      </div>
    );
  }

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            
            {/* Header de Confirmação */}
            <div className="text-center mb-8">
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ duration: 0.5, type: "spring" }}
                className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/50"
              >
                <Check className="h-12 w-12 text-white" strokeWidth={3} />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h1 className="text-5xl font-bold mb-3 text-white">Pedido Confirmado!</h1>
                <p className="text-xl text-gray-300 mb-4">Obrigado pela sua compra. Estamos processando seu pedido.</p>
                <p className="text-sm text-gray-400">{orderDate}</p>
              </motion.div>
            </div>

            {/* Card do Número do Pedido */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-2 border-yellow-500/50 rounded-2xl p-8 mb-8 text-center shadow-xl"
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                <Package className="h-6 w-6 text-yellow-400" />
                <div className="text-sm text-gray-300 uppercase tracking-wider font-semibold">Número do Pedido</div>
              </div>
              <div className="text-4xl font-bold text-yellow-400 tracking-wider mb-3">#{orderNumber}</div>
              <div className="text-sm text-gray-400">Guarde este número para rastrear seu pedido</div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              
              {/* Detalhes do Pedido */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.7, duration: 0.5 }}
                className="lg:col-span-2"
              >
                <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-yellow-400" />
                      </div>
                      Itens do Pedido
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {savedOrderItems.map((item: any, i: number) => (
                        <div className="flex gap-4 p-4 bg-zinc-800 rounded-xl border border-zinc-700 hover:bg-zinc-750 transition-colors" key={`${item.id}-${i}`}>
                          <Image 
                            src={item.image || "/placeholder.svg"} 
                            alt={item.name} 
                            width={80} 
                            height={80} 
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="font-bold text-white text-lg mb-1">{item.name}</div>
                            <div className="text-sm text-gray-400 mb-2">
                              <span className="inline-block bg-zinc-700 px-2 py-0.5 rounded mr-2">{item.color || "Padrão"}</span>
                              <span className="inline-block bg-zinc-700 px-2 py-0.5 rounded">Tam. {item.size || "Padrão"}</span>
                            </div>
                            <div className="text-sm text-gray-300">Quantidade: <span className="font-semibold">{item.quantity}</span></div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-white text-lg">R$ {(Number(item.price) * item.quantity).toFixed(2).replace(".", ",")}</div>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <div className="text-sm text-gray-500 line-through">R$ {(Number(item.originalPrice) * item.quantity).toFixed(2).replace(".", ",")}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Resumo Financeiro */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <Card className="bg-zinc-900 border-zinc-800 shadow-xl sticky top-6">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-yellow-400">Resumo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between text-gray-400">
                        <span>Subtotal ({savedCartCount} {savedCartCount === 1 ? 'item' : 'itens'})</span>
                        <span className="text-white font-medium">R$ {savedOriginalSubtotal.toFixed(2).replace(".", ",")}</span>
                      </div>
                      
                      {savedHasDiscount && savedDiscountAmount > 0 && (
                        <div className="flex justify-between text-green-400 font-semibold bg-green-500/10 p-2 rounded">
                          <span>💰 Desconto</span>
                          <span>-R$ {savedDiscountAmount.toFixed(2).replace(".", ",")}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-gray-400">
                        <span>Frete</span>
                        <span className="text-white font-medium">{savedShippingCost === 0 ? "Grátis" : `R$ ${savedShippingCost.toFixed(2).replace(".", ",")}`}</span>
                      </div>

                      <Separator className="bg-zinc-700" />

                      <div className="flex justify-between text-xl font-bold bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 p-3 rounded-lg">
                        <span className="text-white">Total Pago</span>
                        <span className="text-yellow-400">R$ {savedOrderTotal.toFixed(2).replace(".", ",")}</span>
                      </div>

                      <Separator className="bg-zinc-700" />

                      {/* Informações de Pagamento */}
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center gap-2 text-gray-400">
                          <CreditCard className="h-4 w-4" />
                          <span className="text-sm">
                            {paymentMethod === "debit" ? "Débito" : "Crédito"} •••• {lastCardDigits}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Truck className="h-4 w-4" />
                          <span className="text-sm">
                            {deliveryMethod === "pickup" ? "Retirada na Loja" : deliveryMethod === "express" ? "Entrega Expressa" : "Entrega Normal"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Informações de Entrega */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.9, duration: 0.5 }}
              className="grid md:grid-cols-2 gap-6 mb-8"
            >
              <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500 shadow-xl">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-white mb-1 text-lg">Previsão de Entrega</div>
                      <div className="text-white text-sm mb-2">{estimatedDelivery}</div>
                      <div className="text-xs text-blue-100">Você receberá atualizações por e-mail</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-purple-500 shadow-xl">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-white mb-1 text-lg">Endereço de Entrega</div>
                      {addressData && (
                        <>
                          <div className="text-white text-sm">
                            {addressData.street}, {addressData.number}
                            {addressData.complement && ` - ${addressData.complement}`}
                          </div>
                          <div className="text-white text-sm">
                            {addressData.neighborhood} - {addressData.city}/{addressData.state}
                          </div>
                          <div className="text-white text-sm">CEP: {addressData.cep}</div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Próximos Passos */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 1.1, duration: 0.5 }}
              className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-xl p-6 mb-8"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white mb-3 text-lg">Próximos Passos</div>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>Você receberá um e-mail de confirmação em instantes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>Seu pedido será processado e preparado para envio</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>Enviaremos o código de rastreamento quando o pedido for despachado</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Botões de Ação */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 1.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                size="lg" 
                onClick={() => router.push("/loja")} 
                className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold hover:from-yellow-500 hover:to-yellow-600 shadow-lg shadow-yellow-500/30"
              >
                Continuar Comprando
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => window.print()} 
                className="flex-1 border-zinc-700 text-white hover:bg-zinc-800"
              >
                Imprimir Comprovante
              </Button>
            </motion.div>
          </div>
        </main>
        <Footer />
        <ChatbotWidget />
      </div>
    );
  }

  const inputStyles = "bg-zinc-900 border-zinc-700 text-white placeholder:text-gray-500 focus:border-yellow-400 ring-offset-black focus:ring-yellow-400";
  const labelStyles = "text-gray-300 font-medium";

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Image src="/logo.jpg" alt="Logo" width={64} height={64} className="rounded-full" />
            <h1 className="text-3xl font-bold text-yellow-400">Finalizar Compra</h1>
          </div>

          <CheckoutSteps currentStep={currentStep} />

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {currentStep === 1 && (
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-400"><MapPin className="h-5 w-5" /> Endereço de Entrega</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitAddress(onAddressSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cep" className={labelStyles}>CEP</Label>
                          <Input 
                            id="cep" 
                            className={inputStyles} 
                            placeholder="00000-000"
                            maxLength={9}
                            onChange={(e) => {
                              const formatted = formatCEP(e.target.value);
                              e.target.value = formatted;
                              setValueAddress("cep", formatted);
                            }}
                          />
                          {formStateAddress.errors.cep && <p className="text-sm text-red-400 mt-1">{formStateAddress.errors.cep.message}</p>}
                        </div>
                        <div>
                          <Label htmlFor="state" className={labelStyles}>Estado</Label>
                          <Input id="state" {...registerAddress("state")} className={inputStyles} placeholder="MG" />
                          {formStateAddress.errors.state && <p className="text-sm text-red-400 mt-1">{formStateAddress.errors.state.message}</p>}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="street" className={labelStyles}>Rua</Label>
                        <Input id="street" {...registerAddress("street")} className={inputStyles} placeholder="Nome da Rua" />
                        {formStateAddress.errors.street && <p className="text-sm text-red-400 mt-1">{formStateAddress.errors.street.message}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="number" className={labelStyles}>Número</Label>
                          <Input id="number" {...registerAddress("number")} className={inputStyles} placeholder="123" />
                          {formStateAddress.errors.number && <p className="text-sm text-red-400 mt-1">{formStateAddress.errors.number.message}</p>}
                        </div>
                        <div>
                          <Label htmlFor="complement" className={labelStyles}>Complemento</Label>
                          <Input id="complement" {...registerAddress("complement")} className={inputStyles} placeholder="Apto, Bloco..." />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="neighborhood" className={labelStyles}>Bairro</Label>
                          <Input id="neighborhood" {...registerAddress("neighborhood")} className={inputStyles} placeholder="Nome do Bairro" />
                          {formStateAddress.errors.neighborhood && <p className="text-sm text-red-400 mt-1">{formStateAddress.errors.neighborhood.message}</p>}
                        </div>
                        <div>
                          <Label htmlFor="city" className={labelStyles}>Cidade</Label>
                          <Input id="city" {...registerAddress("city")} className={inputStyles} placeholder="Nome da Cidade" />
                          {formStateAddress.errors.city && <p className="text-sm text-red-400 mt-1">{formStateAddress.errors.city.message}</p>}
                        </div>
                      </div>

                      <div className="pt-4">
                        <Label className={labelStyles}>Método de Entrega</Label>
                        <div className="space-y-3 mt-2">
                          <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors ${deliveryMethod === "normal" ? "border-yellow-400 bg-yellow-900/20" : "border-zinc-700"}`}>
                            <input type="radio" name="delivery" value="normal" checked={deliveryMethod === "normal"} onChange={() => setDeliveryMethod("normal")} className="accent-yellow-400" />
                            <div className="ml-3 text-white">
                              <div className="font-medium">Entrega Normal</div>
                              <div className="text-sm text-gray-400">5-7 dias • R$ 15,90</div>
                            </div>
                          </label>
                          <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors ${deliveryMethod === "express" ? "border-yellow-400 bg-yellow-900/20" : "border-zinc-700"}`}>
                            <input type="radio" name="delivery" value="express" checked={deliveryMethod === "express"} onChange={() => setDeliveryMethod("express")} className="accent-yellow-400" />
                            <div className="ml-3 text-white">
                              <div className="font-medium">Expressa</div>
                              <div className="text-sm text-gray-400">2-3 dias • R$ 29,90</div>
                            </div>
                          </label>
                          <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors ${deliveryMethod === "pickup" ? "border-yellow-400 bg-yellow-900/20" : "border-zinc-700"}`}>
                            <input type="radio" name="delivery" value="pickup" checked={deliveryMethod === "pickup"} onChange={() => setDeliveryMethod("pickup")} className="accent-yellow-400" />
                            <div className="ml-3 text-white">
                              <div className="font-medium">Retirar na Loja</div>
                              <div className="text-sm text-gray-400">Disponível hoje • Grátis</div>
                            </div>
                          </label>
                        </div>
                      </div>

                      <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold hover:from-yellow-500 hover:to-yellow-600 mt-6">
                        Continuar para Pagamento
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <CardTitle className="text-yellow-400">Forma de Pagamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 mb-6">
                        <label className={`p-4 border rounded-lg flex items-center cursor-pointer hover:bg-zinc-800 transition-colors ${paymentMethod === "credit" ? "border-yellow-400 bg-yellow-900/20" : "border-zinc-700"}`}>
                          <input type="radio" name="payment" value="credit" checked={paymentMethod === "credit"} onChange={() => setPaymentMethod("credit")} className="accent-yellow-400" />
                          <span className="ml-3 font-medium flex items-center gap-2 text-white"><CreditCard className="h-5 w-5" /> Cartão de Crédito</span>
                        </label>
                        <label className={`p-4 border rounded-lg flex items-center cursor-pointer hover:bg-zinc-800 transition-colors ${paymentMethod === "debit" ? "border-yellow-400 bg-yellow-900/20" : "border-zinc-700"}`}>
                          <input type="radio" name="payment" value="debit" checked={paymentMethod === "debit"} onChange={() => setPaymentMethod("debit")} className="accent-yellow-400" />
                          <span className="ml-3 font-medium flex items-center gap-2 text-white"><CreditCard className="h-5 w-5" /> Cartão de Débito</span>
                        </label>
                      </div>

                      <form onSubmit={handleSubmitPayment(onPaymentSubmit)} className="space-y-4">
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
                          <p className="text-xs text-blue-300 flex items-center gap-2">
                            <span>🔒</span>
                            <span>Suas informações estão seguras e protegidas</span>
                          </p>
                        </div>
                        
                        <div>
                          <Label htmlFor="cardNumber" className={labelStyles}>Número do Cartão</Label>
                          <div className="relative">
                            <Input 
                              id="cardNumber" 
                              className={`${inputStyles} pr-12`}
                              placeholder="0000 0000 0000 0000"
                              maxLength={19}
                              onChange={(e) => {
                                const formatted = formatCardNumber(e.target.value);
                                e.target.value = formatted;
                                setValue("cardNumber", formatted.replace(/\s/g, ''));
                              }}
                            />
                            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                          </div>
                          {formStatePayment.errors.cardNumber && <p className="text-sm text-red-400 mt-1">{formStatePayment.errors.cardNumber.message}</p>}
                        </div>

                        <div>
                          <Label htmlFor="cardName" className={labelStyles}>Nome no Cartão</Label>
                          <Input 
                            id="cardName" 
                            {...registerPayment("cardName")} 
                            className={inputStyles} 
                            placeholder="NOME COMO ESTÁ NO CARTÃO"
                            style={{ textTransform: 'uppercase' }}
                          />
                          {formStatePayment.errors.cardName && <p className="text-sm text-red-400 mt-1">{formStatePayment.errors.cardName.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="cardExpiry" className={labelStyles}>Validade</Label>
                            <Input 
                              id="cardExpiry" 
                              className={inputStyles} 
                              placeholder="MM/AA"
                              maxLength={5}
                              onChange={(e) => {
                                const formatted = formatExpiry(e.target.value);
                                e.target.value = formatted;
                                setValue("cardExpiry", formatted);
                              }}
                            />
                            {formStatePayment.errors.cardExpiry && <p className="text-sm text-red-400 mt-1">{formStatePayment.errors.cardExpiry.message}</p>}
                          </div>
                          <div>
                            <Label htmlFor="cardCvv" className={labelStyles}>CVV</Label>
                            <Input 
                              id="cardCvv" 
                              className={inputStyles} 
                              placeholder="000"
                              maxLength={3}
                              type="text"
                              onChange={(e) => {
                                const formatted = formatCVV(e.target.value);
                                e.target.value = formatted;
                                setValue("cardCvv", formatted);
                              }}
                            />
                            <p className="text-xs text-gray-500 mt-1">3 dígitos no verso</p>
                            {formStatePayment.errors.cardCvv && <p className="text-sm text-red-400 mt-1">{formStatePayment.errors.cardCvv.message}</p>}
                          </div>
                        </div>

                        {paymentMethod === "credit" && (
                          <div>
                            <Label htmlFor="installments" className={labelStyles}>Parcelamento</Label>
                            <Select onValueChange={(value) => setValue("installments", value)}>
                              <SelectTrigger className={inputStyles}>
                                <SelectValue placeholder="Selecione o parcelamento" />
                              </SelectTrigger>
                              <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                                <SelectItem value="1">1x de R$ {finalTotal.toFixed(2).replace(".", ",")} sem juros</SelectItem>
                                <SelectItem value="2">2x de R$ {(finalTotal / 2).toFixed(2).replace(".", ",")} sem juros</SelectItem>
                                <SelectItem value="3">3x de R$ {(finalTotal / 3).toFixed(2).replace(".", ",")} sem juros</SelectItem>
                                <SelectItem value="4">4x de R$ {(finalTotal / 4).toFixed(2).replace(".", ",")} sem juros</SelectItem>
                                <SelectItem value="5">5x de R$ {(finalTotal / 5).toFixed(2).replace(".", ",")} sem juros</SelectItem>
                                <SelectItem value="6">6x de R$ {(finalTotal / 6).toFixed(2).replace(".", ",")} sem juros</SelectItem>
                              </SelectContent>
                            </Select>
                            {formStatePayment.errors.installments && <p className="text-sm text-red-400 mt-1">{formStatePayment.errors.installments.message}</p>}
                          </div>
                        )}

                        <Button 
                          type="submit" 
                          size="lg" 
                          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold hover:from-yellow-500 hover:to-yellow-600 mt-6 relative"
                          disabled={isSending}
                        >
                          {isSending ? (
                            <span className="flex items-center justify-center gap-2">
                              <span className="inline-block h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                              Processando pagamento...
                            </span>
                          ) : (
                            `💳 Pagar R$ ${finalTotal.toFixed(2).replace(".", ",")}`
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            <aside>
              <Card className="sticky top-6 bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {state.items.map((item: any, i: number) => (
                      <div className="flex gap-3" key={`${item.id}-${i}`}>
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} width={48} height={48} className="w-12 h-12 object-cover rounded" />
                        <div className="flex-1 text-sm text-white">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-gray-400 text-xs">{item.color || "Padrão"} • Tam. {item.size || "Padrão"}</div>
                          <div className="font-medium text-gray-300">Qty: {item.quantity}</div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-medium text-white">R$ {(Number(item.price) * item.quantity).toFixed(2).replace(".", ",")}</div>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <div className="text-xs text-gray-500 line-through">R$ {(Number(item.originalPrice) * item.quantity).toFixed(2).replace(".", ",")}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4 bg-zinc-700" />

                  <div className="text-sm text-gray-400 space-y-2">
                    <div className="flex justify-between"><span>Subtotal ({cartCount} itens)</span><span className="text-white">R$ {originalSubtotal.toFixed(2).replace(".", ",")}</span></div>
                    
                    {hasDiscount && discountAmount > 0 && (
                      <div className="flex justify-between text-green-400 font-semibold">
                        <span>Desconto</span>
                        <span>-R$ {discountAmount.toFixed(2).replace(".", ",")}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between"><span>Frete</span><span className="text-white">{shippingCost === 0 ? "Grátis" : `R$ ${shippingCost.toFixed(2).replace(".", ",")}`}</span></div>
                  </div>

                  <Separator className="my-4 bg-zinc-700" />

                  <div className="flex justify-between text-lg font-bold text-white"><span>Total</span><span className="text-yellow-400">R$ {finalTotal.toFixed(2).replace(".", ",")}</span></div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
      <ChatbotWidget />
    </div>
  );
}