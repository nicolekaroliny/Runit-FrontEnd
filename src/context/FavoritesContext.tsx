"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Fav = {
  corridaId: string;
  titulo: string;
  data: string;
  local: string;
  distancias: string;
  link?: string;
};

type FavoritesContextType = {
  favorites: Fav[];
  addFavorite: (fav: Fav) => void;
  removeFavorite: (corridaId: string) => void;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Fav[]>([]);

  const addFavorite = (fav: Fav) => {
    setFavorites((prev) => {
      if (!prev.some((f) => f.corridaId === fav.corridaId)) {
        return [...prev, fav];
      }
      return prev;
    });
  };

  const removeFavorite = (corridaId: string) => {
    setFavorites((prev) => prev.filter((f) => f.corridaId !== corridaId));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}