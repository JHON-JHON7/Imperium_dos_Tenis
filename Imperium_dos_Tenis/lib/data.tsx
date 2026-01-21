// src/lib/data.ts

export interface Product {
  id: number
  name: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  images: string[]
  rating: number
  reviewCount: number
  isNew: boolean
  discount?: number
  colors: string[]
  sizes: string[]
  type: string
  description: string
  features: string[]
  specifications: { label: string; value: string }[]
}

export const products: Product[] = [
  {
    id: 1,
    name: "Air Max Revolution Pro",
    brand: "Nike",
    price: 899.9,
    originalPrice: 1199.9,
    image: "/nike-air-max-sneakers-white-and-blue-premium.jpg",
    images: [
      "/nike-air-max-sneakers-white-and-blue-premium.jpg",
      "/nike-air-max-sneakers-white-and-blue-premium.jpg",
      "/nike-air-max-sneakers-white-and-blue-premium.jpg",
      "/nike-air-max-sneakers-white-and-blue-premium.jpg",
    ],
    rating: 4.8,
    reviewCount: 124,
    isNew: true,
    discount: 25,
    colors: ["Branco/Azul", "Preto/Vermelho"],
    sizes: ["38", "39", "40", "41", "42"],
    type: "Esportivo",
    description:
      "O Air Max Revolution Pro combina tecnologia de amortecimento avançada com design moderno. Perfeito para corridas e uso casual.",
    features: [
      "Tecnologia Air Max para amortecimento superior",
      "Cabedal em mesh respirável",
      "Solado de borracha antiderrapante",
      "Palmilha removível e anatômica",
      "Design moderno e versátil",
    ],
    specifications: [
      { label: "Material", value: "Mesh e Sintético" },
      { label: "Solado", value: "Borracha" },
      { label: "Peso", value: "280g (por pé)" },
      { label: "Origem", value: "Importado" },
    ],
  },
  {
    id: 2,
    name: "Ultraboost 22 Performance",
    brand: "Adidas",
    price: 749.9,
    image: "/adidas-ultraboost-running-shoes-black-premium.jpg",
    images: [
      "/adidas-ultraboost-running-shoes-black-premium.jpg",
      "/adidas-ultraboost-running-shoes-black-premium.jpg",
      "/adidas-ultraboost-running-shoes-black-premium.jpg",
    ],
    rating: 4.6,
    reviewCount: 89,
    isNew: false,
    colors: ["Preto", "Cinza"],
    sizes: ["39", "40", "41", "42", "43"],
    type: "Esportivo",
    description:
      "O Ultraboost 22 redefine o conforto em corrida. Com tecnologia Boost incomparável, oferece retorno de energia a cada passada.",
    features: [
      "Tecnologia Boost para retorno de energia",
      "Cabedal Primeknit adaptável",
      "Solado Continental™ para aderência",
      "Suporte Torsion System",
    ],
    specifications: [
      { label: "Material", value: "Primeknit" },
      { label: "Solado", value: "Continental™ Rubber" },
      { label: "Peso", value: "310g (por pé)" },
      { label: "Origem", value: "Importado" },
    ],
  },
]

export const mockReviews = [
  {
    id: 1,
    name: "João Silva",
    rating: 5,
    date: "15/03/2024",
    comment: "Excelente produto! Muito confortável e bonito. Recomendo!",
  },
  {
    id: 2,
    name: "Maria Santos",
    rating: 4,
    date: "10/03/2024",
    comment: "Ótima qualidade, chegou rápido. O único ponto é que achei um pouco justo no tamanho.",
  },
  {
    id: 3,
    name: "Pedro Costa",
    rating: 5,
    date: "05/03/2024",
    comment: "Perfeito para corrida! Já é o terceiro par que compro desta marca.",
  },
]