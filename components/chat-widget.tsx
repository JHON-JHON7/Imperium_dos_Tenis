"use client"

import type React from "react"

import { useState } from "react"
import { X, Send, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
}

interface ChatWidgetProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Olá! Bem-vindo ao Imperium dos Tênis! Como posso ajudá-lo hoje?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")

  const faqResponses: Record<string, string> = {
    frete:
      "Oferecemos frete grátis para compras acima de R$ 299,99. Para outras compras, o frete varia de R$ 15 a R$ 35 dependendo da sua localização.",
    entrega:
      "O prazo de entrega é de 3 a 7 dias úteis para a região Sudeste e de 5 a 10 dias úteis para outras regiões.",
    troca:
      "Você tem até 30 dias para trocar ou devolver seu produto. O tênis deve estar em perfeitas condições com a caixa original.",
    tamanho:
      "Temos uma tabela de medidas disponível em cada produto. Em caso de dúvida, recomendamos medir o pé e consultar nossa tabela.",
    pagamento: "Aceitamos PIX (com 5% de desconto), cartão de crédito em até 12x sem juros e boleto bancário.",
    garantia: "Todos os nossos tênis têm garantia de 90 dias contra defeitos de fabricação.",
    promoção: "Temos promoções semanais! Cadastre-se em nossa newsletter para receber ofertas exclusivas.",
    estoque: "Nosso estoque é atualizado em tempo real. Se o produto está disponível no site, temos em estoque.",
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate bot response
    setTimeout(() => {
      let botResponse =
        "Desculpe, não entendi sua pergunta. Você pode tentar perguntar sobre: frete, entrega, troca, tamanho, pagamento, garantia, promoções ou estoque."

      const lowerInput = inputValue.toLowerCase()
      for (const [key, response] of Object.entries(faqResponses)) {
        if (lowerInput.includes(key)) {
          botResponse = response
          break
        }
      }

      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1000)

    setInputValue("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 h-96 bg-background border rounded-lg shadow-xl flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-accent" />
          <h3 className="font-semibold">Atendimento</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  message.isUser ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            placeholder="Digite sua mensagem..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
