"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, ShoppingCart, Star, Truck, Shield, ArrowLeft, Check, Share2 } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useFavorites } from "@/lib/favorites-context"
import Link from "next/link"


const products = [
  {
    id: 1,
    name: "Tênis Nike Air Max 90",
    brand: "Nike",
    price:  569.99, 
    originalPrice: 899.99,
    image: "/90-1P.avif",
    rating: 4.8,
    reviewCount: 124,
    isNew: true,
    discount: 25,
    colors: ["Preto", "Branco"],
    sizes: ["38", "39", "40", "41", "42"],
    type: "Esportivo",
    description: "Originalmente desenvolvida para corrida de desempenho, a unidade Max Air no calcanhar acrescenta amortecimento inacreditável.",
    features: ["Amortecimento Air Max visível", "Cabedal em mesh respirável", "Solado de borracha durável", "Design aerodinâmico"],
    specifications: [
        { label: "Material", value: "Mesh e Sintético" },
        { label: "Indicado para", value: "Dia a dia / Caminhada" },
        { label: "Peso", value: "300g (varia com o tamanho)" },
        { label: "Garantia", value: "Contra defeito de fabricação" }
    ],
    // Múltiplas imagens
    images: ["/90-1P.avif", "/90-2P.avif", "/90-3P.avif"]
  },
  {
    id: 2,
    name: "SK8-HI ",
    brand: "Vans",
    price: 399.99,
    image: "/SK8-1B.webp",
    rating: 4.6,
    reviewCount: 89,
    isNew: false,
    colors: ["Branco",],
    sizes: ["39", "40", "41", "42", "43"],
    type: "Casual",
    description: "O cano mais alto foi inovador na época, pois oferecia suporte adicional e proteção para o tornozelo dos skatistas contra impactos e arranhões, um problema comum com tênis de cano baixo",
    features: ["Tecnologia Boost de retorno de energia", "Cabedal Primeknit adaptável", "Solado Continental™", "Suporte Torsion System"],
    specifications: [
        { label: "Material", value: "Primeknit" },
        { label: "Indicado para", value: "Casual" },
        { label: "Peso", value: "333g" },
        { label: "Drop", value: "10mm" }
    ],
    images: ["/SK8-1B.webp", "/SK8-2B.webp", "/SK8-3B.webp"]
  },
  {
    id: 3,
    name: "Tênis Asics Court FF 3 Novak",
    brand: "Asics",
    price: 1199.99,
    originalPrice: 1499.99,
    image: "/CF-1B.webp",
    rating: 4.9,
    reviewCount: 45,
    isNew: true,
    discount: 20,
    colors: ["Branco", "Azul"],
    sizes: ["39", "40", "41", "42", "43", "44"],
    type: "Esportivo",
    description: "Desenvolvido em colaboração com Novak Djokovic, o Court FF™ 3 oferece flexibilidade e estabilidade superiores para manter o foco e a energia durante as partidas mais intensas.",
    features: ["Tecnologia FLYTEFOAM™", "Tecnologia GEL™ no antepé", "Design MONO-SOCK™", "Solado AHARPLUS™"],
    specifications: [
        { label: "Material", value: "Sintético e Mesh" },
        { label: "Indicado para", value: "Ténis / Quadra Rápida" },
        { label: "Peso", value: "410g" },
        { label: "Garantia", value: "Contra defeito de fabricação" }
    ],
    images: ["/CF-1B.webp", "/CF-2B.webp", "/CF-3B.webp"]
  },
  {
    id: 4,
    name: "Tênis Vans Ultrarange EXO",
    brand: "Vans",
    price: 649.99,
    originalPrice: 799.99,
    image: "/UEF-IC.webp",
    rating: 4.7,
    reviewCount: 210,
    isNew: false,
    discount: 18,
    colors: ["Cinza", "Branco"],
    sizes: ["37", "38", "39", "40", "41", "42"],
    type: "Híbrido",
    description: "O Ultrarange EXO foi desenhado para quem não para. Com uma entressola co-moldada UltraCush®, detalhes RapidWeld atualizados e uma sola de borracha leve e cortada, oferece conforto e aderência em qualquer terreno.",
    features: ["Suporte EXO Skeleton", "Entressola UltraCush® Lite", "Respiração otimizada", "Sola tratorada invertida"],
    specifications: [
        { label: "Material", value: "Tecido Mesh e Sintético" },
        { label: "Indicado para", value: "Dia a dia / Aventura" },
        { label: "Peso", value: "270g" },
        { label: "Tecnologia", value: "UltraCush" }
    ],
    images: ["/UEF-IC.webp", "/UEF-2C.webp", "/UEF-3C.webp"]
  },
  {
    id: 5,
    name: "Tênis Nike Air Max Excee",
    brand: "Nike",
    price: 549.99,
    originalPrice: 749.99,
    image: "/AME-1V.avif",
    rating: 4.5,
    reviewCount: 156,
    isNew: false,
    discount: 26,
    colors: ["Branco", "Verde", "Preto"],
    sizes: ["38", "39", "40", "41", "42", "43"],
    type: "Casual Esportivo",
    description: "Inspirado no Nike Air Max 90, o Excee celebra um clássico com um visual repaginado. Linhas alongadas e proporções distorcidas na parte superior trazem o ícone dos anos 90 para um espaço novo e moderno.",
    features: ["Unidade Air visível", "Sola de espuma com borracha", "Visual retrô modernizado", "Conforto leve"],
    specifications: [
        { label: "Material", value: "Couro, Mesh e Sintético" },
        { label: "Indicado para", value: "Casual / Streetwear" },
        { label: "Peso", value: "320g" },
        { label: "Amortecimento", value: "Nike Air" }
    ],
    images: ["/AME-1V.avif", "/AME-2V.avif", "/AME-3V.avif"]
  }
  // Adicione mais produtos mockados.
]

// Mock de reviews para preencher a aba
const mockReviews = [
    { id: 1, name: "Ricardo Silva", rating: 5, date: "12/10/2023", comment: "Tênis incrível, muito confortável!" },
    { id: 2, name: "Ana Costa", rating: 4, date: "05/11/2023", comment: "Lindo design e entrega rápida, mas a forma é um pouco justa, recomendo um número maior." }
]

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()

  // Pega o ID da URL
  const productId = params?.id ? Number(params.id) : null
  
  // Busca o produto ou usa o primeiro como fallback para não quebrar a tela se o ID não existir no mock
  const product = products.find((p) => p.id === productId) || products[0]

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState(mockReviews)
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" })
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0])
      setSelectedSize(product.sizes[2] || product.sizes[0] || "")
    }
  }, [product])

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice ?? undefined,
      image: product.image,
      color: selectedColor,
      size: selectedSize,
    })
  }

  const handleToggleFavorite = () => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice ?? undefined,
        image: product.image,
      })
    }
  }

  const handleAddReview = () => {
    if (newReview.name.trim() && newReview.comment.trim()) {
      const review = {
        id: reviews.length + 1,
        name: newReview.name,
        rating: newReview.rating,
        date: new Date().toLocaleDateString('pt-BR'),
        comment: newReview.comment
      }
      setReviews([review, ...reviews])
      setNewReview({ name: "", rating: 5, comment: "" })
      setShowReviewForm(false)
    }
  }

  // Produtos relacionados (filtra pelo mesmo tipo e exclui o atual)
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.type === product.type)
    .slice(0, 4)

  // Garante array de imagens
  const productImages = product.images && product.images.length > 0 ? product.images : [product.image, product.image, product.image]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb Estilizado */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-yellow-500 transition-colors">
            Início
          </Link>
          <span>/</span>
          <Link href="/loja" className="hover:text-yellow-500 transition-colors">
            Loja
          </Link>
          <span>/</span>
          <span className="text-yellow-500 font-medium truncate">{product.name}</span>
        </div>

        {/* Botão Voltar */}
        <Button variant="ghost" className="mb-6 pl-0 hover:pl-2 hover:bg-transparent hover:text-yellow-500 text-white transition-all" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        {/* Seção Principal do Produto */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          
          {/* --- COLUNA DA ESQUERDA: IMAGENS --- */}
          <div className="space-y-4">
            {/* Imagem Principal */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-yellow-600/20 shadow-2xl shadow-black/50 group">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500"
              />
              {/* Badges */}
              {product.discount && (
                <Badge className="absolute top-4 left-4 bg-red-600 text-white text-lg px-3 py-1 border-0 shadow-lg shadow-red-600/20">
                  -{product.discount}%
                </Badge>
              )}
              {product.isNew && (
                <Badge className="absolute top-4 right-4 bg-yellow-500 text-black font-bold text-lg px-3 py-1 border-0 shadow-lg shadow-yellow-500/20">
                  Novo
                </Badge>
              )}
            </div>

            {/* Miniaturas (Thumbnails) */}
            <div className="grid grid-cols-4 gap-3">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all bg-white/5 ${
                    selectedImage === index
                      ? "border-yellow-500 ring-2 ring-yellow-500/20 scale-95"
                      : "border-transparent hover:border-yellow-500/50"
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} vista ${index + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* --- COLUNA DA DIREITA: INFORMAÇÕES --- */}
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-start">
                  <Badge variant="outline" className="mb-3 text-yellow-500 border-yellow-500/50 uppercase tracking-wider">{product.brand}</Badge>
                  <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                      <Share2 className="w-5 h-5" />
                  </button>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white tracking-tight">{product.name}</h1>

              {/* Avaliação */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) ? "fill-yellow-500 text-yellow-500" : "text-gray-700"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-yellow-500">{product.rating}</span>
                <span className="text-sm text-gray-400">({reviews.length} avaliações)</span>
              </div>
              
               {/* Preço */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-5xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through decoration-red-500/50">
                    R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                  </span>
                )}
              </div>
            </div>

            {/* Descrição Curta */}
            <p className="text-gray-300 leading-relaxed text-lg border-l-2 border-yellow-600/50 pl-4">
              {product.description}
            </p>

            {/* Painel de Seleção */}
            <div className="space-y-6 p-6 bg-white/5 rounded-2xl border border-yellow-600/20 backdrop-blur-sm shadow-xl">
              
              {/* Seletor de Cor */}
              <div>
                <label className="text-sm font-medium mb-3 block text-gray-300">
                  Cor: <span className="text-yellow-500 font-bold">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all font-medium text-sm ${
                        selectedColor === color
                          ? "border-yellow-500 bg-yellow-500 text-black font-bold shadow-lg shadow-yellow-500/20"
                          : "border-gray-700 bg-transparent text-gray-300 hover:border-yellow-500/50 hover:text-white"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seletor de Tamanho */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-gray-300">Tamanho</label>
                  <button className="text-xs text-yellow-500 hover:text-yellow-400 hover:underline flex items-center gap-1">
                    Guia de medidas
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-12 rounded-lg border-2 transition-all font-medium flex items-center justify-center ${
                        selectedSize === size
                          ? "border-yellow-500 bg-yellow-500 text-black font-bold shadow-lg shadow-yellow-500/20"
                          : "border-gray-700 bg-transparent text-gray-300 hover:border-yellow-500/50 hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ações (Quantidade e Botões) */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                {/* Contador */}
                <div className="flex items-center border border-gray-700 rounded-lg bg-black/20 w-fit">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-12 w-12 rounded-none hover:bg-white/10 text-white hover:text-yellow-500"
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="text-lg font-medium w-12 text-center text-white">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-12 w-12 rounded-none hover:bg-white/10 text-white hover:text-yellow-500"
                  >
                    +
                  </Button>
                </div>

                {/* Botão Comprar */}
                <Button 
                    size="lg" 
                    className="flex-1 h-12 text-base bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold shadow-lg shadow-yellow-500/30 border-0 transition-all hover:scale-105" 
                    onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Comprar Agora
                </Button>
                
                {/* Botão Favoritar */}
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-12 p-0 shrink-0 border-gray-700 bg-transparent hover:bg-white/10 hover:border-yellow-500"
                  onClick={handleToggleFavorite}
                >
                  <Heart
                    className={`h-6 w-6 transition-colors ${isMounted && isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-white"}`}
                  />
                </Button>
              </div>
            </div>

            {/* Benefícios (Frete/Garantia) */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-yellow-600/10">
                <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-sm text-white">Frete Grátis</p>
                  <p className="text-xs text-gray-400">Para todo Brasil</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-yellow-600/10">
                <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-sm text-white">Garantia Original</p>
                  <p className="text-xs text-gray-400">Autenticidade garantida</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Abas de Informação (Tabs) */}
        <Tabs defaultValue="description" className="mb-16 w-full">
          <TabsList className="w-full justify-start border-b border-gray-800 rounded-none h-auto p-0 bg-transparent gap-6">
            {["description", "specifications", "reviews"].map((tab) => (
                <TabsTrigger 
                key={tab}
                value={tab} 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-yellow-500 data-[state=active]:text-yellow-500 text-gray-400 data-[state=active]:bg-transparent pb-3 px-1 font-semibold capitalize text-lg"
                >
                {tab === 'description' ? 'Descrição' : tab === 'specifications' ? 'Especificações' : `Avaliações (${reviews.length})`}
                </TabsTrigger>
            ))}
          </TabsList>

          {/* Conteúdo: Descrição */}
          <TabsContent value="description" className="mt-8 animate-in fade-in-50">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                 <h3 className="text-2xl font-bold text-white">Detalhes do Produto</h3>
                 <p className="text-gray-300 leading-relaxed">{product.description}</p>
              </div>
              <div className="bg-white/5 border border-yellow-600/10 p-6 rounded-xl h-fit">
                <h3 className="text-lg font-bold text-yellow-500 mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5" /> Destaques
                </h3>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-gray-300">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* Conteúdo: Especificações */}
          <TabsContent value="specifications" className="mt-8 animate-in fade-in-50">
            <div className="border border-gray-800 rounded-xl overflow-hidden">
                {product.specifications.map((spec, index) => (
                <div key={index} className="grid grid-cols-3 p-4 hover:bg-white/5 transition-colors border-b border-gray-800 last:border-0">
                    <span className="font-bold text-sm text-gray-300">{spec.label}</span>
                    <span className="col-span-2 text-sm text-gray-400">{spec.value}</span>
                </div>
                ))}
            </div>
          </TabsContent>

          {/* Conteúdo: Avaliações */}
          <TabsContent value="reviews" className="mt-8 animate-in fade-in-50">
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-4">
                 <div className="bg-white/5 border border-yellow-600/10 p-6 rounded-xl text-center">
                       <div className="text-6xl font-bold text-yellow-500 mb-2">{product.rating}</div>
                       <div className="flex justify-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-yellow-500 text-yellow-500" : "text-gray-600"}`} />
                          ))}
                       </div>
                       <p className="text-gray-400 font-medium">{reviews.length} avaliações verificadas</p>
                 </div>

                 {/* Botão para adicionar avaliação */}
                 {!showReviewForm && (
                   <Button 
                     onClick={() => setShowReviewForm(true)}
                     className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold"
                   >
                     Escrever Avaliação
                   </Button>
                 )}
              </div>

              <div className="lg:col-span-8 space-y-6">
                {/* Formulário de nova avaliação */}
                {showReviewForm && (
                  <div className="bg-white/5 border border-yellow-600/20 p-6 rounded-xl space-y-4">
                    <h3 className="text-xl font-bold text-white mb-4">Sua Avaliação</h3>
                    
                    {/* Nome */}
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Nome</label>
                      <input
                        type="text"
                        value={newReview.name}
                        onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                        placeholder="Digite seu nome"
                        className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-yellow-500 focus:outline-none"
                      />
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Avaliação</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setNewReview({...newReview, rating})}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`h-8 w-8 ${rating <= newReview.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-600"}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comentário */}
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Comentário</label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                        placeholder="Compartilhe sua experiência com este produto..."
                        rows={4}
                        className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-yellow-500 focus:outline-none resize-none"
                      />
                    </div>

                    {/* Botões */}
                    <div className="flex gap-3">
                      <Button
                        onClick={handleAddReview}
                        className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold"
                      >
                        Publicar Avaliação
                      </Button>
                      <Button
                        onClick={() => setShowReviewForm(false)}
                        variant="outline"
                        className="border-gray-700 text-white hover:bg-white/10"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Lista de avaliações */}
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-800 pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold">
                            {review.name.charAt(0).toUpperCase()}
                         </div>
                         <div>
                            <p className="font-semibold text-white text-sm">{review.name}</p>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-700"}`} />
                              ))}
                            </div>
                         </div>
                      </div>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-3 pl-14">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Produtos Relacionados - Agora em Dark Mode */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-white">Você Também Pode Gostar</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link href={`/produto/${relatedProduct.id}`} key={relatedProduct.id} className="group">
                  <div className="h-full overflow-hidden rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-yellow-500/50 transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden bg-white/5">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-yellow-500 mb-1 uppercase tracking-wide">{relatedProduct.brand}</p>
                      <h3 className="font-medium text-sm text-white line-clamp-2 mb-2 group-hover:text-yellow-500 transition-colors">{relatedProduct.name}</h3>
                      <p className="font-bold text-lg text-white">
                        R$ {relatedProduct.price.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}