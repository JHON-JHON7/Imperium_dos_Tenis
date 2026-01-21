"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"

interface CartItem {
  id: number
  name: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  color: string
  size: string
  quantity: number  
}

interface CartState {
  items: CartItem[]
  coupon: string | null
  discount: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "APPLY_COUPON"; payload: { code: string; discount: number } }
  | { type: "REMOVE_COUPON" }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  applyCoupon: (code: string) => boolean
  removeCoupon: () => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
} | null>(null)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.color === action.payload.color &&
          item.size === action.payload.size,
      )

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === existingItem.id &&
            item.color === existingItem.color &&
            item.size === existingItem.size
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        }
      }

      return {
        ...state,
        items: [...state.items, action.payload],
      }
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: Math.max(0, action.payload.quantity) }
              : item,
          )
          .filter((item) => item.quantity > 0),
      }

    case "APPLY_COUPON":
      return {
        ...state,
        coupon: action.payload.code,
        discount: action.payload.discount,
      }

    case "REMOVE_COUPON":
      return {
        ...state,
        coupon: null,
        discount: 0,
      }

    case "CLEAR_CART":
      return {
        items: [],
        coupon: null,
        discount: 0,
      }

    case "LOAD_CART":
      return action.payload

    default:
      return state
  }
}

const initialState: CartState = {
  items: [],
  coupon: null,
  discount: 0,
}

const CART_STORAGE_KEY = "imperium-cart"

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Carregar do localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: parsedCart })
        console.log("Carrinho carregado:", parsedCart)
      }
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error)
    }
  }, [])

  // Salvar no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state))
      console.log("Carrinho salvo:", state)
    } catch (error) {
      console.error("Erro ao salvar carrinho:", error)
    }
  }, [state])

  // Adicionar ao carrinho (sempre quantity 1)
  const addToCart = (item: Omit<CartItem, "quantity">) => {
    dispatch({
      type: "ADD_ITEM",
      payload: { ...item, quantity: 1 },
    })
  }

  const removeFromCart = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const applyCoupon = (code: string): boolean => {
    const validCoupons: Record<string, number> = {
      DESCONTO10: 10,
      PRIMEIRACOMPRA: 15,
      FRETEGRATIS: 5,
      BLACKFRIDAY: 25,
    }

    if (validCoupons[code.toUpperCase()]) {
      dispatch({
        type: "APPLY_COUPON",
        payload: { code: code.toUpperCase(), discount: validCoupons[code.toUpperCase()] },
      })
      return true
    }

    return false
  }

  const removeCoupon = () => {
    dispatch({ type: "REMOVE_COUPON" })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const getCartTotal = () => {
    const subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
    const discountAmount = (subtotal * state.discount) / 100
    return subtotal - discountAmount
  }

  const getCartCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addToCart,
        removeFromCart,
        updateQuantity,
        applyCoupon,
        removeCoupon,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
