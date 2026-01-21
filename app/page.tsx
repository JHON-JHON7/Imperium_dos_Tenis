"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Crown, Zap, TrendingUp, Star, Sparkles, Award, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

// ========================================
// 🌟 PRODUTOS EM DESTAQUE (ATUALIZADO)
// ========================================
// Aqui usamos o ID 1, 2 e 6 para não repetir os bestsellers
const featuredProducts = [
  {
    id: 1, // Nike Air Max 90
    name: "Tênis Nike Air Max 90",
    price: 569.99,
    image: "/90-1P.avif",
    link: "/produto/1",
    badge: "Clássico"
  },
  {
    id: 2, // Vans SK8-HI
    name: "Tênis Vans SK8-HI",
    price: 399.99,
    image: "/SK8-1B.webp",
    link: "/produto/2",
    badge: "Estilo Skate"
  },
  {
    id: 6, // Stan Smith (Da sua lista antiga para completar 3)
    name: "Stan Smith Classic",
    price: 449.90,
    image: "/adidas-stan-smith-classic-white-green-sneakers.jpg", // Certifique-se de ter essa imagem ou troque
    link: "/produto/6",
    badge: "Casual"
  }
];

// ========================================
// 🔥 PRODUTOS MAIS VENDIDOS
// ========================================
// Mantendo Asics(3), Vans Ultra(4) e Nike Excee(5)
const bestsellerProducts = [
  {
    id: 3, 
    name: "Tênis Asics Court FF 3 Novak",
    price: 1199.99,
    image: "/CF-1B.webp", 
    link: "/produto/3",
    rank: 1, 
    sales: 412,
    rating: 4.9
  },
  {
    id: 4, 
    name: "Tênis Vans Ultrarange EXO",
    price: 649.99,
    image: "/UEF-IC.webp",
    link: "/produto/4",
    rank: 2,
    sales: 385,
    rating: 4.7
  },
  {
    id: 5, 
    name: "Tênis Nike Air Max Excee",
    price: 549.99,
    image: "/AME-1V.avif",
    link: "/produto/5",
    rank: 3,
    sales: 320,
    rating: 4.5
  }
];

export default function HomePage() {
  const [currentBanner, setCurrentBanner] = useState(0);

  // ========================================
  // 🎬 BANNERS DO CARROSSEL
  // ========================================
  const banners = [
    {
      id: 1,
      title: "Elegância em Movimento",
      subtitle: "O icônico Nike Free em um tom bordô exclusivo. Leveza para o seu dia.",
      image: "06.avif",
      link: "/loja?model=nikefree",
      buttonText: "Descubra a Leveza"
    },
    {
      id: 2,
      title: "Estilo Clássico Renovado",
      subtitle: "O lendário Samba, agora com um toque moderno. Edição Especial.",
      image: "20A.avif",
      link: "/loja?model=samba",
      buttonText: "Comprar Agora"
    },
    {
      id: 3,
      title: "Performance e Força",
      subtitle: "Domine seu treino com conforto e o design arrojado da Adidas.",
      image: "01A.avif",
      link: "/loja?category=running",
      buttonText: "Ver Tênis de Treino"
    },
    {
      id: 4,
      title: "Tons Pastéis: Doce Tendência",
      subtitle: "O Air Force 1 Shadow em cores suaves. O toque de cor que faltava no seu look.",
      image: "08.avif",
      link: "/loja?category=feminino&tendencia=pastel",
      buttonText: "Explorar Estilos"
    }
  ];

  // ========================================
  // 🏷️ CARDS DE CATEGORIAS
  // ========================================
  const categories = [
    {
      name: "Tênis Esportivos",
      subtitle: "Performance e conforto máximo",
      image: "/05A.avif",
      link: "/loja?category=esportivo",
      icon: Zap,
      gradient: "from-blue-600 to-cyan-400"
    },
    {
      name: "Tênis Casuais",
      subtitle: "Estilo para o dia a dia",
      image: "/12.avif",
      link: "/loja?category=casual",
      icon: Crown,
      gradient: "from-amber-500 to-orange-400"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main>
        {/* Banner Rotativo */}
        <section className="relative h-[600px] md:h-[750px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              <Image
                src={banners[currentBanner].image}
                alt={banners[currentBanner].title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-2xl">
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="inline-flex items-center gap-2 bg-yellow-400/20 backdrop-blur-sm border border-yellow-400/30 rounded-full px-4 py-2 mb-6"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold text-sm">Coleção Exclusiva</span>
                    </motion.div>
                    
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
                    >
                      {banners[currentBanner].title}
                    </motion.h1>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl md:text-2xl text-gray-200 mb-8 font-light leading-relaxed"
                    >
                      {banners[currentBanner].subtitle}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Link href={banners[currentBanner].link}>
                        <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg h-14 px-8 shadow-2xl hover:shadow-yellow-400/50 transition-all hover:scale-105">
                          {banners[currentBanner].buttonText}
                          <ArrowRight className="ml-3 w-6 h-6" />
                        </Button>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Indicadores de Banner */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentBanner 
                    ? "bg-yellow-400 w-12 shadow-lg shadow-yellow-400/50" 
                    : "bg-white/40 w-2 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </section>

        {/* Categorias */}
        <section className="py-24 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold text-white mb-4">Explore por Categoria</h2>
              <p className="text-xl text-gray-300">Encontre o tênis perfeito para cada momento</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {categories.map((category, index) => (
                <motion.div 
                  key={category.name} 
                  initial={{ opacity: 0, y: 50 }} 
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Link href={category.link} className="group block">
                    <Card className="overflow-hidden bg-white/5 backdrop-blur-md border-white/10 hover:border-white/30 transition-all duration-500 shadow-2xl hover:shadow-yellow-400/20">
                      <div className="relative h-96 overflow-hidden">
                        <Image 
                          src={category.image} 
                          alt={category.name} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-60 mix-blend-multiply`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        
                        <div className="absolute inset-0 flex items-end p-8">
                          <div className="w-full">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`p-3 rounded-full bg-gradient-to-br ${category.gradient} shadow-lg`}>
                                <category.icon className="w-7 h-7 text-white" />
                              </div>
                              <h3 className="text-3xl font-bold text-white">{category.name}</h3>
                            </div>
                            <p className="text-gray-200 text-lg mb-4">{category.subtitle}</p>
                            <div className="flex items-center text-white gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <span className="font-semibold">Explorar</span>
                              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Produtos em Destaque - AGORA COM NIKE 90, VANS SK8 e STAN SMITH */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-100 rounded-full blur-3xl opacity-30"></div>
          
          <div className="container mx-auto px-4 relative">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-5 h-5 text-yellow-600" />
                <span className="text-yellow-600 font-semibold">Seleção Especial</span>
              </div>
              <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Produtos em Destaque
              </h2>
              <p className="text-xl text-gray-600">Selecionados especialmente para você</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  whileHover={{ y: -10 }}
                >
                  <Link href={product.link}>
                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 group border-2 border-transparent hover:border-yellow-400/30">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                          <Image 
                            src={product.image} 
                            alt={product.name} 
                            width={400} 
                            height={400} 
                            className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-700" 
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold px-3 py-1 text-sm shadow-lg">
                              {product.badge}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-6 bg-gradient-to-b from-white to-gray-50">
                          <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-600 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <p className="text-3xl text-yellow-600 font-bold">
                              R$ {product.price.toFixed(2).replace(".", ",")}
                            </p>
                            <Button size="sm" variant="ghost" className="group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                              <ArrowRight className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link href="/loja">
                <Button size="lg" variant="outline" className="border-2 border-gray-900 hover:bg-gray-900 hover:text-white font-semibold">
                  Ver Todos os Produtos
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Mais Vendidos */}
        <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-3 bg-yellow-400/20 backdrop-blur-sm border border-yellow-400/30 rounded-full px-6 py-3 mb-6">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
                <span className="text-yellow-400 font-bold text-lg">Ranking de Vendas</span>
              </div>
              <h2 className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                🔥 Mais Vendidos
              </h2>
              <p className="text-xl text-gray-300">Os favoritos dos nossos clientes</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              {bestsellerProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  whileHover={{ y: -15, scale: 1.02 }}
                  className="relative"
                >
                  {/* Badge de Ranking */}
                  <motion.div 
                    className="absolute -top-6 -right-6 z-20"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                  >
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl shadow-2xl ${
                      product.rank === 1 
                        ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-black" 
                        : product.rank === 2 
                        ? "bg-gradient-to-br from-gray-300 to-gray-500 text-black"
                        : "bg-gradient-to-br from-amber-600 to-amber-800 text-white"
                    }`}>
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold">#</span>
                        <span className="text-3xl leading-none">{product.rank}</span>
                      </div>
                    </div>
                  </motion.div>

                  <Link href={product.link}>
                    <Card className={`overflow-hidden transition-all duration-500 group border-4 ${
                      product.rank === 1 
                        ? "border-yellow-400 shadow-2xl shadow-yellow-400/50" 
                        : "border-white/10 hover:border-yellow-400/50 shadow-xl"
                    } bg-white/5 backdrop-blur-md`}>
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                          <Image 
                            src={product.image} 
                            alt={product.name} 
                            width={400} 
                            height={400} 
                            className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-700" 
                          />
                          {product.rank === 1 && (
                            <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/30 to-transparent pointer-events-none"></div>
                          )}
                          
                          {/* Info de Vendas */}
                          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2">
                            <div className="flex items-center gap-2 text-white">
                              <Award className="w-4 h-4 text-yellow-400" />
                              <span className="font-bold text-sm">{product.sales} vendas</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-6 bg-gradient-to-b from-gray-800 to-gray-900">
                          {/* Rating */}
                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-600"
                                }`}
                              />
                            ))}
                            <span className="text-sm text-gray-300 ml-2">({product.rating})</span>
                          </div>

                          <h3 className="text-xl font-bold mb-3 text-white group-hover:text-yellow-400 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-3xl text-yellow-400 font-bold">
                              R$ {product.price.toFixed(2).replace(".", ",")}
                            </p>
                            <Button 
                              size="sm" 
                              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold group-hover:scale-110 transition-transform"
                            >
                              Comprar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-16"
            >
              <Link href="/loja">
                <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-bold text-lg h-14 px-10 shadow-2xl hover:shadow-yellow-400/50 transition-all hover:scale-105">
                  Ver Catálogo Completo
                  <ShoppingBag className="ml-3 w-6 h-6" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}