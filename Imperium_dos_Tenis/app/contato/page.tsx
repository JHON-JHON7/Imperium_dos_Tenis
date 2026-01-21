"use client"

import { useState, useCallback } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Mail, Clock, Instagram, MessageCircle } from "lucide-react"

// Formulário inicial fora do componente ()
const initialFormData = {
  nome: "",
  email: "",
  telefone: "",
  assunto: "",
  mensagem: "",
}

export default function ContatoPage() {
  const [formData, setFormData] = useState(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Atualiza os inputs com useCallback (evita recriação)
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
    },
    []
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 800))

    setSubmitted(true)
    setIsSubmitting(false)
    setFormData(initialFormData)

    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* EFETOS DE LUXO NO FUNDO */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.25),transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,140,0,0.18),transparent_70%)]"></div>

      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-yellow-400 drop-shadow-[0_0_25px_rgba(255,215,0,0.9)] tracking-wide">
            ENTRE EM CONTATO
          </h1>
          <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto">
            Precisa de algo? Estamos aqui para ajudar. Envie sua dúvida, sugestão ou reclamação.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* FORMULÁRIO  */}
          <Card className="bg-[#0f0f0f]/80 backdrop-blur-xl border border-yellow-500/20 rounded-2xl shadow-[0_0_25px_rgba(255,215,0,0.15)] text-white">
            <CardHeader>
              <CardTitle className="text-yellow-400 text-2xl">Envie sua Mensagem</CardTitle>
              <CardDescription className="text-gray-400">
                Preencha o formulário e nossa equipe retornará em breve.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Mensagem enviada */}
              {submitted && (
                <div className="mb-6 p-4 bg-green-600/20 border border-green-500/40 rounded-lg text-green-400 animate-fade">
                  ✔ Mensagem enviada com sucesso!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome + E-mail */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nome" className="block text-sm mb-1">Nome Completo *</label>
                    <Input
                      id="nome"
                      name="nome"
                      required
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="bg-black/40 border-yellow-500/40 focus:border-yellow-400 text-yellow-100 placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm mb-1">E-mail *</label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      pattern="^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-black/40 border-yellow-500/40 focus:border-yellow-400 text-yellow-100 placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Telefone + Assunto */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="telefone" className="block text-sm mb-1">Telefone</label>
                    <Input
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      className="bg-black/40 border-yellow-500/40 focus:border-yellow-400 text-yellow-100 placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="assunto" className="block text-sm mb-1">Assunto *</label>
                    <Input
                      id="assunto"
                      name="assunto"
                      required
                      value={formData.assunto}
                      onChange={handleInputChange}
                      className="bg-black/40 border-yellow-500/40 focus:border-yellow-400 text-yellow-100 placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Mensagem */}
                <div>
                  <label htmlFor="mensagem" className="block text-sm mb-1">Mensagem *</label>
                  <Textarea
                    id="mensagem"
                    name="mensagem"
                    rows={5}
                    required
                    value={formData.mensagem}
                    onChange={handleInputChange}
                    className="bg-black/40 border-yellow-500/40 focus:border-yellow-400 text-yellow-100 placeholder-gray-500"
                  />
                </div>

                {/* Botão */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-xl text-black font-bold bg-gradient-to-r from-yellow-500 to-orange-500 shadow-[0_0_25px_rgba(255,165,0,0.4)] hover:brightness-110 transition-all ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Enviando..." : "ENVIAR MENSAGEM "}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* CONTATOS + FAQ */}
          <div className="space-y-8">
            <Card className="bg-[#0f0f0f]/80 backdrop-blur-xl border border-yellow-500/20 rounded-2xl shadow-[0_0_25px_rgba(255,215,0,0.15)] text-white">
              <CardHeader>
                <CardTitle className="text-yellow-400 text-2xl">Canais de Atendimento</CardTitle>
                <CardDescription className="text-gray-400">
                  Conecte-se conosco instantaneamente.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 text-gray-300">
                <div className="flex gap-4">
                  <MapPin className="text-yellow-400" />
                  <div>
                    <h3 className="font-semibold text-yellow-300">Endereço</h3>
                    <p>

                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Mail className="text-yellow-400" />
                  <div>
                    <h3 className="font-semibold text-yellow-300">E-mail</h3>
                    <p>contato@imperium.com.br<br />vendas@imperium.com.br</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock className="text-yellow-400" />
                  <div>
                    <h3 className="font-semibold text-yellow-300">Horário</h3>
                    <p>
                      Seg-Sex: 10h às 18h <br />
                      Sáb: 10h às 14h
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <a
                    href=""
                    target="_blank"
                    className="flex items-center justify-center gap-2 bg-green-500/90 hover:bg-green-600 text-white py-3 rounded-xl font-semibold shadow-lg w-full sm:w-1/2"
                  >
                    <MessageCircle /> WhatsApp
                  </a>

                  <a
                    href="https://www.instagram.com/imperiumdostenis_patos1/"
                    target="_blank"
                    className="flex items-center justify-center gap-2 bg-pink-600/90 hover:bg-pink-700 text-white py-3 rounded-xl font-semibold shadow-lg w-full sm:w-1/2"
                  >
                    <Instagram /> Instagram
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card className="bg-[#0f0f0f]/80 backdrop-blur-xl border border-yellow-500/20 rounded-2xl shadow-[0_0_25px_rgba(255,215,0,0.15)] text-white p-6">
              <h2 className="text-xl font-bold text-yellow-400 mb-4">Perguntas Frequentes (FAQ)</h2>

              <details className="border-b border-yellow-500/20 py-3 cursor-pointer">
                <summary className="flex justify-between items-center text-lg font-medium">
                  Qual o prazo de entrega?
                </summary>
                <p className="text-gray-400 mt-2">Entregamos em até 5 dias úteis.</p>
              </details>

              <details className="border-b border-yellow-500/20 py-3 cursor-pointer">
                <summary className="flex justify-between items-center text-lg font-medium">
                  Posso trocar se não servir?
                </summary>
                <p className="text-gray-400 mt-2">
                  Sim! Até 30 dias para troca.
                </p>
              </details>

              <details className="border-b border-yellow-500/20 py-3 cursor-pointer">
                <summary className="flex justify-between items-center text-lg font-medium">
                  Vocês têm loja física?
                </summary>
                <p className="text-gray-400 mt-2">
                  Sim, em Patos de Minas - MG.
                </p>
              </details>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
