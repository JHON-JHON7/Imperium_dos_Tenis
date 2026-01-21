import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-background via-background to-accent/5 py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="text-sm font-medium text-accent mb-4">Linha Tênis Premium</div>
              <h1 className="text-3xl lg:text-5xl font-bold text-balance leading-tight">
                NOVA GERAÇÃO
                <span className="block text-accent">de Tênis</span>
              </h1>
              <p className="text-base text-muted-foreground text-pretty max-w-md">
                Descubra nossa coleção exclusiva de tênis premium das melhores marcas do mundo, com entrega rápida e
                garantia de qualidade.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                <a href="/loja">
                  COMPRE AGORA
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/loja?promocoes=true">Ver Promoções</a>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-card shadow-2xl">
              <img
                src="/premium-sneakers-collection-display.jpg"
                alt="Coleção Premium de Tênis"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground rounded-full p-6 shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm">Modelos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
