import { Card, CardContent } from "@/components/ui/card"

export function CategorySection() {
  const categories = [
    {
      title: "Tênis Esportivos",
      description: "Para corrida, academia e atividades físicas",
      image: "/nike-air-max-sneakers-white-and-blue-premium.jpg",
      href: "/loja?categoria=esportivos",
    },
    {
      title: "Tênis Casuais",
      description: "Para o dia a dia com estilo e conforto",
      image: "/adidas-ultraboost-running-shoes-black-premium.jpg",
      href: "/loja?categoria=casuais",
    },
    {
      title: "Tênis Premium",
      description: "Edições limitadas e modelos exclusivos",
      image: "/converse-chuck-taylor-high-top-sneakers-red-classi.jpg",
      href: "/loja?categoria=premium",
    },
  ]

  return (
    <section className="py-16 lg:py-24 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <a key={index} href={category.href}>
              <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-background">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] overflow-hidden bg-secondary/10">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-2xl font-bold mb-2 text-foreground">{category.title}</h3>
                    <p className="text-muted-foreground text-sm">{category.description}</p>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
