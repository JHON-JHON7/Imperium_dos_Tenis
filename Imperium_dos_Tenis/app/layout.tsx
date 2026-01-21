import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { CartProvider } from "@/lib/cart-context"
import { FavoritesProvider } from "@/lib/favorites-context"
// @ts-ignore: Ignorar erro de módulo CSS
import "./globals.css"

export const metadata: Metadata = {
  title: "Imperium dos Tênis - Loja Premium de Tênis",
  description: "A melhor seleção de tênis premium com entrega rápida e segura",
  generator: "",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <FavoritesProvider>
          <CartProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </CartProvider>
        </FavoritesProvider>
        <Analytics />
      </body>
    </html>
  )
}
