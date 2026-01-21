"use client"

import { useState } from "react"
import { Eye, EyeOff, Crown, Mail, Lock, ArrowRight, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simula requisição de login
    setTimeout(() => {
      console.log("Login:", { email, password, rememberMe })
      // Aqui você adiciona a lógica de autenticação real
      // Ex: await signIn(email, password)
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
            Bem-vindo de volta
          </h1>
          <p className="text-gray-400 text-sm">
            Entre para acessar sua conta imperial
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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

          {/* Lembrar-me e Esqueci a senha */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-gray-600 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
              />
              <Label
                htmlFor="remember"
                className="text-sm text-gray-400 cursor-pointer hover:text-white transition-colors"
              >
                Lembrar-me
              </Label>
            </div>
            <Link
              href="/recuperar-senha"
              className="text-sm text-yellow-500 hover:text-yellow-400 transition-colors"
            >
              Esqueceu a senha?
            </Link>
          </div>

          {/* Botão de Login */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold rounded-xl shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                Entrando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="h-5 w-5" />
                Entrar
              </span>
            )}
          </Button>
        </form>

        {/* Link para Registro */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Ainda não tem uma conta?{" "}
            <Link
              href="/registro"
              className="text-yellow-500 hover:text-yellow-400 font-medium transition-colors inline-flex items-center gap-1 group"
            >
              Criar conta imperial
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Ao continuar, você concorda com nossos{" "}
            <Link href="/termos" className="text-yellow-500 hover:text-yellow-400">
              Termos de Serviço
            </Link>{" "}
            e{" "}
            <Link href="/privacidade" className="text-yellow-500 hover:text-yellow-400">
              Política de Privacidade
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}