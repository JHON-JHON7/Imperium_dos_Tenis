"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send } from "lucide-react"

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Olá! Sou o assistente virtual da Imperium dos Tênis. Como posso ajudar você hoje?",
      isBot: true,
    },
  ])
  const [inputMessage, setInputMessage] = useState("")

  const quickQuestions = [
    "Como rastrear meu pedido?",
    "Qual o prazo de entrega?",
    "Como fazer uma troca?",
    "Guia de tamanhos",
  ]

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
    }

    setMessages((prev) => [...prev, newMessage])

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        isBot: true,
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)

    setInputMessage("")
  }

  const getBotResponse = (message: string) => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("rastrear") || lowerMessage.includes("pedido")) {
      return "Para rastrear seu pedido, você pode usar o número do pedido na página 'Rastrear Pedido' ou verificar o e-mail de confirmação que enviamos."
    }
    if (lowerMessage.includes("entrega") || lowerMessage.includes("prazo")) {
      return "Nossos prazos de entrega são: Entrega Normal (5-7 dias úteis), Entrega Expressa (2-3 dias úteis) ou Retirada na Loja (disponível no mesmo dia)."
    }
    if (lowerMessage.includes("troca") || lowerMessage.includes("devolução")) {
      return "Você tem até 30 dias para trocar ou devolver produtos. O item deve estar em perfeitas condições com etiquetas originais."
    }
    if (lowerMessage.includes("tamanho")) {
      return "Consulte nosso Guia de Tamanhos na página do produto ou entre em contato conosco para ajuda personalizada na escolha do tamanho ideal."
    }
    if (lowerMessage.includes("pagamento")) {
      return "Aceitamos PIX (aprovação imediata) e cartão de crédito (parcelamento em até 6x sem juros)."
    }

    return "Obrigado pela sua pergunta! Para questões mais específicas, recomendo entrar em contato com nosso atendimento pelo telefone (11) 9999-8888 ou email contato@imperiumtenis.com.br"
  }

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question)
    handleSendMessage()
  }

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-80 h-96 shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Assistente Virtual</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col h-full p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.isBot ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="p-4 border-t">
                <p className="text-xs text-muted-foreground mb-2">Perguntas frequentes:</p>
                <div className="space-y-1">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs h-auto p-2"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite sua mensagem..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="text-sm"
                />
                <Button size="icon" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
