"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"

interface FavoriteItem {
  id: number
  name: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  
}

interface FavoritesState {
  items: FavoriteItem[]
}

type FavoritesAction =
  | { type: "ADD_FAVORITE"; payload: FavoriteItem }
  | { type: "REMOVE_FAVORITE"; payload: number }
  | { type: "CLEAR_FAVORITES" }
  | { type: "LOAD_FAVORITES"; payload: FavoritesState }

const FavoritesContext = createContext<{
  state: FavoritesState
  dispatch: React.Dispatch<FavoritesAction>
  addToFavorites: (item: FavoriteItem) => void
  removeFromFavorites: (id: number) => void
  clearFavorites: () => void
  isFavorite: (id: number) => boolean
  getFavoritesCount: () => number
} | null>(null)

const favoritesReducer = (state: FavoritesState, action: FavoritesAction): FavoritesState => {
  switch (action.type) {
    case "ADD_FAVORITE":
      if (state.items.find((item) => item.id === action.payload.id)) {
        return state
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      }

    case "REMOVE_FAVORITE":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }

    case "CLEAR_FAVORITES":
      return {
        items: [],
      }

    case "LOAD_FAVORITES":
      return action.payload

    default:
      return state
  }
}

const initialState: FavoritesState = {
  items: [],
}

const FAVORITES_STORAGE_KEY = "imperium-favorites"

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(favoritesReducer, initialState)

  // ✅ CARREGAR do localStorage
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY)
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites)
        dispatch({ type: "LOAD_FAVORITES", payload: parsedFavorites })
        console.log("✅ Favoritos carregados:", parsedFavorites)
      }
    } catch (error) {
      console.error("❌ Erro ao carregar favoritos:", error)
    }
  }, [])

  // ✅ SALVAR no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(state))
      console.log("💾 Favoritos salvos:", state)
    } catch (error) {
      console.error("❌ Erro ao salvar favoritos:", error)
    }
  }, [state])

  const addToFavorites = (item: FavoriteItem) => {
    dispatch({ type: "ADD_FAVORITE", payload: item })
  }

  const removeFromFavorites = (id: number) => {
    dispatch({ type: "REMOVE_FAVORITE", payload: id })
  }

  const clearFavorites = () => {
    dispatch({ type: "CLEAR_FAVORITES" })
  }

  const isFavorite = (id: number): boolean => {
    return state.items.some((item) => item.id === id)
  }

  const getFavoritesCount = () => {
    return state.items.length
  }

  return (
    <FavoritesContext.Provider
      value={{
        state,
        dispatch,
        addToFavorites,
        removeFromFavorites,
        clearFavorites,
        isFavorite,
        getFavoritesCount,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}