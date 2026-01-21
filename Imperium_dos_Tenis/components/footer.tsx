import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Facebook, Instagram, MessageCircle, Mail, Phone, MapPin, Clock } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Imperium dos Tênis</h3>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              A melhor seleção de tênis premium das marcas mais desejadas do mundo. Qualidade, estilo e conforto para
              todos os momentos da sua vida.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Categorias</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/loja?categoria=esportivas"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Tênis Esportivos
                </a>
              </li>
              <li>
                <a
                  href="/loja?categoria=casuais"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Tênis Casuais
                </a>
              </li>
              <li>
                <a
                  href="/loja?categoria=lancamentos"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Lançamentos
                </a>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Ajuda</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/rastrear-pedido"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Rastrear Pedido
                </a>
              </li>
              <li>
                <a
                  href="/devolucoes"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Devoluções
                </a>
              </li>
              <li>
                <a href="/envio" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Informações de Envio
                </a>
              </li>
              <li>
                <a href="/faq" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Perguntas Frequentes
                </a>
              </li>
              <li>
                <a
                  href="/guia-tamanhos"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Guia de Tamanhos
                </a>
              </li>
              <li>
                <a
                  href="/contato"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Fale Conosco
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Entre em Contato</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  <br />
                  <br />
                
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="text-primary-foreground/80">(34) 9999-8888</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="text-primary-foreground/80">contato@imperiumtenis.com.br</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div className="text-primary-foreground/80">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="font-medium">Newsletter</h5>
              <p className="text-xs text-primary-foreground/80">
                Receba ofertas exclusivas e novidades em primeira mão
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="seu@email.com"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                />
                <Button variant="secondary" size="sm">
                  Inscrever
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/20" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/80">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p>&copy; {currentYear} Imperium dos Tênis. Todos os direitos reservados.</p>
            <div className="flex gap-4">
              <a href="/privacidade" className="hover:text-primary-foreground transition-colors">
                Política de Privacidade
              </a>
              <a href="/termos" className="hover:text-primary-foreground transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span>Formas de Pagamento:</span>
            <div className="flex gap-2">
              <div className="w-8 h-5 bg-primary-foreground/20 rounded text-xs flex items-center justify-center">
                PIX
              </div>
              <div className="w-8 h-5 bg-primary-foreground/20 rounded text-xs flex items-center justify-center">
                💳
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
