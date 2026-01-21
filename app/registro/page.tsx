"use client"

import { useState } from "react"
import { Eye, EyeOff, Crown, Mail, Lock, User, Phone, ArrowRight, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import Link from "next/link"

export default function RegistroPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!")
      return
    }

    if (!acceptTerms) {
      alert("Você precisa aceitar os termos de serviço")
      return
    }

    setIsLoading(true)

    // Simula requisição de registro
    setTimeout(() => {
      console.log("Registro:", formData)
      // Aqui você adiciona a lógica de registro real
      // Ex: await signUp(formData)
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      {/* Formulário Centralizado */}
      <div className="w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="relative w-16 h-16">
              <Image
                src="/logo.jpg"
                alt="Impérium dos Tênis"
                fill
                className="object-contain drop-shadow-[0_0_20px_rgba(234,179,8,0.5)] group-hover:drop-shadow-[0_0_30px_rgba(234,179,8,0.8)] transition-all duration-300"
              />
            </div>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-2">
            Junte-se ao Impérium
          </h1>
          <p className="text-gray-400 text-sm">
            Crie sua conta e tenha acesso à coleção exclusiva
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nome Completo */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300 text-sm font-medium">
              Nome Completo
            </Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-500/60 h-5 w-5" />
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                className="pl-12 h-12 bg-white/5 border-2 border-gray-700 hover:border-yellow-500/50 focus:border-yellow-500 text-white placeholder:text-gray-500 rounded-xl transition-all duration-300"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300 text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-500/60 h-5 w-5" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                className="pl-12 h-12 bg-white/5 border-2 border-gray-700 hover:border-yellow-500/50 focus:border-yellow-500 text-white placeholder:text-gray-500 rounded-xl transition-all duration-300"
              />
            </div>
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-300 text-sm font-medium">
              Telefone (opcional)
            </Label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-500/60 h-5 w-5" />
              <Input
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="pl-12 h-12 bg-white/5 border-2 border-gray-700 hover:border-yellow-500/50 focus:border-yellow-500 text-white placeholder:text-gray-500 rounded-xl transition-all duration-300"
              />
            </div>
          </div>

          {/* Senha */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300 text-sm font-medium">
              Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-500/60 h-5 w-5" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
                minLength={8}
                className="pl-12 pr-12 h-12 bg-white/5 border-2 border-gray-700 hover:border-yellow-500/50 focus:border-yellow-500 text-white placeholder:text-gray-500 rounded-xl transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirmar Senha */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-300 text-sm font-medium">
              Confirmar Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-500/60 h-5 w-5" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Digite a senha novamente"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                required
                className="pl-12 pr-12 h-12 bg-white/5 border-2 border-gray-700 hover:border-yellow-500/50 focus:border-yellow-500 text-white placeholder:text-gray-500 rounded-xl transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Termos e Condições */}
          <div className="flex items-start space-x-2 pt-2">
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
              className="border-gray-600 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500 mt-1"
            />
            <Label
              htmlFor="terms"
              className="text-sm text-gray-400 cursor-pointer hover:text-white transition-colors leading-relaxed"
            >
              Eu concordo com os{" "}
              <Link href="/termos" className="text-yellow-500 hover:text-yellow-400">
                Termos de Serviço
              </Link>{" "}
              e{" "}
              <Link href="/privacidade" className="text-yellow-500 hover:text-yellow-400">
                Política de Privacidade
              </Link>
            </Label>
          </div>

          {/* Botão de Registro */}
          <Button
            type="submit"
            disabled={isLoading || !acceptTerms}
            className="w-full h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold rounded-xl shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                Criando conta...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Criar Conta Imperial
              </span>
            )}
          </Button>
        </form>

        {/* Link para Login */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="text-yellow-500 hover:text-yellow-400 font-medium transition-colors inline-flex items-center gap-1 group"
            >
              Fazer login
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}