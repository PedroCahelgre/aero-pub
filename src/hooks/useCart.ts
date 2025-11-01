'use client'

import { useState, useEffect, useCallback } from 'react'
import { Product } from '@/types'

// Extende o tipo Product para incluir a quantidade e as notas do item no carrinho
export interface CartItem extends Product {
  quantity: number
  notes: string
}

/**
 * Hook para gerir o estado do carrinho de compras.
 *
 * Utiliza o localStorage para persistir o carrinho entre as sessões.
 * O estado é inicializado de forma preguiçosa a partir do localStorage para evitar
 * problemas de hidratação e garantir que o estado está sincronizado desde o início.
 */
export function useCart() {
  // Inicialização preguiçosa do estado a partir do localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Acesso ao localStorage apenas no lado do cliente
    if (typeof window === 'undefined') {
      return []
    }
    try {
      const savedCart = window.localStorage.getItem('aeropizza_cart')
      return savedCart ? JSON.parse(savedCart) : []
    } catch (error) {
      console.error('❌ Erro ao carregar o carrinho do localStorage:', error)
      return []
    }
  })

  // Efeito para persistir o estado do carrinho no localStorage sempre que ele muda
  useEffect(() => {
    try {
      // Se o carrinho estiver vazio, remove o item do localStorage
      if (cart.length === 0) {
        window.localStorage.removeItem('aeropizza_cart')
      } else {
        window.localStorage.setItem('aeropizza_cart', JSON.stringify(cart))
      }
    } catch (error) {
      console.error('❌ Erro ao salvar o carrinho no localStorage:', error)
    }
  }, [cart])

  // Adiciona um produto ao carrinho ou incrementa a sua quantidade se já existir
  const addToCart = useCallback((product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        // Se o item já existe, aumenta a quantidade
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // Adiciona um novo item ao carrinho
        return [...prevCart, { ...product, quantity: 1, notes: '' }]
      }
    })
  }, [])

  // Atualiza a quantidade de um item específico no carrinho
  const updateQuantity = useCallback((productId: string, change: number) => {
    setCart(prevCart =>
      prevCart
        .map(item => {
          if (item.id === productId) {
            const newQuantity = item.quantity + change
            // Se a nova quantidade for positiva, atualiza; caso contrário, prepara para remover
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
          }
          return item
        })
        // Filtra os itens nulos (aqueles cuja quantidade chegou a zero)
        .filter((item): item is CartItem => item !== null)
    )
  }, [])

  // Atualiza as notas de um item específico no carrinho
  const updateNotes = useCallback((productId: string, notes: string) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, notes } : item
      )
    )
  }, [])

  // Remove um item do carrinho
  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }, [])

  // Limpa todos os itens do carrinho
  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  // Calcula o preço total, incluindo a taxa de entrega se aplicável
  const getTotalPrice = useCallback(
    (deliveryType: 'DELIVERY' | 'PICKUP' = 'DELIVERY') => {
      const subtotal = cart.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      )
      const deliveryFee = deliveryType === 'DELIVERY' ? 8.00 : 0
      return subtotal + deliveryFee
    },
    [cart]
  )

  // Calcula o número total de itens no carrinho
  const getCartCount = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }, [cart])

  return {
    cart,
    addToCart,
    updateQuantity,
    updateNotes,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getCartCount,
  }
}