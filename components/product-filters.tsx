"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface FilterState {
  brands: string[]
  types: string[]
  colors: string[]
  sizes: string[]
  priceRange: [number, number]
}

interface ProductFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const brands = ["Nike", "Adidas", "Converse", "Vans", "Puma", "New Balance", "Asics"]
  const types = ["Corrida", "Casual", "Basquete", "Skate", "Treino", "Caminhada"]
  const colors = ["Branco", "Preto", "Azul", "Vermelho", "Verde", "Cinza", "Rosa"]
  const sizes = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked ? [...filters.brands, brand] : filters.brands.filter((b) => b !== brand)
    onFiltersChange({ ...filters, brands: newBrands })
  }

  const handleTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked ? [...filters.types, type] : filters.types.filter((t) => t !== type)
    onFiltersChange({ ...filters, types: newTypes })
  }

  const handleColorChange = (color: string, checked: boolean) => {
    const newColors = checked ? [...filters.colors, color] : filters.colors.filter((c) => c !== color)
    onFiltersChange({ ...filters, colors: newColors })
  }

  const handleSizeChange = (size: string, checked: boolean) => {
    const newSizes = checked ? [...filters.sizes, size] : filters.sizes.filter((s) => s !== size)
    onFiltersChange({ ...filters, sizes: newSizes })
  }

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({ ...filters, priceRange: [value[0], value[1]] })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      brands: [],
      types: [],
      colors: [],
      sizes: [],
      priceRange: [0, 2000],
    })
  }

  const activeFiltersCount = filters.brands.length + filters.types.length + filters.colors.length + filters.sizes.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filtros</h3>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Limpar ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.brands.map((brand) => (
            <Badge key={brand} variant="secondary" className="gap-1">
              {brand}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleBrandChange(brand, false)} />
            </Badge>
          ))}
          {filters.types.map((type) => (
            <Badge key={type} variant="secondary" className="gap-1">
              {type}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleTypeChange(type, false)} />
            </Badge>
          ))}
          {filters.colors.map((color) => (
            <Badge key={color} variant="secondary" className="gap-1">
              {color}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleColorChange(color, false)} />
            </Badge>
          ))}
          {filters.sizes.map((size) => (
            <Badge key={size} variant="secondary" className="gap-1">
              Tam. {size}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleSizeChange(size, false)} />
            </Badge>
          ))}
        </div>
      )}

      {/* Brand Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Marca</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brands.includes(brand)}
                onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
              />
              <label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                {brand}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Type Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tipo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {types.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={filters.types.includes(type)}
                onCheckedChange={(checked) => handleTypeChange(type, checked as boolean)}
              />
              <label htmlFor={`type-${type}`} className="text-sm cursor-pointer">
                {type}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Preço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={filters.priceRange}
            onValueChange={handlePriceChange}
            max={2000}
            min={0}
            step={50}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>R$ {filters.priceRange[0]}</span>
            <span>R$ {filters.priceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Color Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Cor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {colors.map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color}`}
                checked={filters.colors.includes(color)}
                onCheckedChange={(checked) => handleColorChange(color, checked as boolean)}
              />
              <label htmlFor={`color-${color}`} className="text-sm cursor-pointer">
                {color}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Size Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tamanho</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  id={`size-${size}`}
                  checked={filters.sizes.includes(size)}
                  onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
                />
                <label htmlFor={`size-${size}`} className="text-sm cursor-pointer">
                  {size}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
