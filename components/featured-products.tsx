import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart } from "lucide-react"

export function FeaturedProducts() {
  const products = [
    {
      id: 1,
      name: "Air Max Revolution",
      brand: "Nike",
      price: "R$ 899,90",
      originalPrice: "R$ 1.199,90",
      image: "/nike-air-max-sneakers-white-and-blue.jpg",
      isNew: true,
      discount: "25%",
    },
    {
      id: 2,
      name: "Ultraboost 22",
      brand: "Adidas",
      price: "R$ 749,90",
      image: "/adidas-ultraboost-running-shoes-black.jpg",
      isNew: false,
    },
    {
      id: 3,
      name: "Chuck Taylor All Star",
      brand: "Converse",
      price: "R$ 299,90",
      image: "/converse-chuck-taylor-high-top-sneakers-red.jpg",
      isNew: false,
    },
    {
      id: 4,
      name: "Old Skool Classic",
      brand: "Vans",
      price: "R$ 399,90",
      image: "/vans-old-skool-skateboard-shoes-black-white.jpg",
      isNew: true,
    },
  ]

  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Produtos Mais Vendidos</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra os tênis favoritos dos nossos clientes
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  <a href={`/produto/${product.id}`}>
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    />
                  </a>
                  <div className="absolute top-3 left-3 flex gap-2">
                    {product.isNew && <Badge className="bg-accent text-accent-foreground">Novo</Badge>}
                    {product.discount && <Badge variant="destructive">-{product.discount}</Badge>}
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                    <a href={`/produto/${product.id}`}>
                      <h3 className="font-semibold text-balance hover:text-primary transition-colors cursor-pointer">
                        {product.name}
                      </h3>
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                    )}
                  </div>
                  <Button className="w-full group">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Adicionar ao Carrinho
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <a href="/loja">Ver Todos os Produtos</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
