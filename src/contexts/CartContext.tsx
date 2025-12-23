import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { cartApi } from '../services/api'
import { useAuth } from './AuthContext'

export interface CartItem {
  id: number
  cartItemId?: number
  name: string
  price: number
  image: string
  quantity: number
  category?: string
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => Promise<void>
  removeFromCart: (id: number) => Promise<void>
  updateQuantity: (id: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getTotalPrice: () => number
  getTotalItems: () => number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchCartItems = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setCartItems([])
      return
    }

    try {
      setLoading(true)
      const response = await cartApi.getByUserId(user.id)
      if (response.success && response.data) {
        const mappedItems: CartItem[] = response.data
          .filter(item => item.is_active && item.product)
          .map(item => ({
            id: item.product_id,
            cartItemId: item.id,
            name: item.product!.product_name,
            price: parseFloat(item.product!.amount),
            image: item.product!.img_url,
            quantity: item.qty,
            category: undefined
          }))
        setCartItems(mappedItems)
      }
    } catch (error) {
      console.error('Failed to fetch cart items:', error)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    fetchCartItems()
  }, [fetchCartItems])

  const addToCart = async (item: CartItem) => {
    if (!isAuthenticated || !user) {
      return
    }

    const existingItem = cartItems.find(cartItem => cartItem.id === item.id)

    try {
      if (existingItem && existingItem.cartItemId) {
        const newQuantity = existingItem.quantity + 1
        const response = await cartApi.update(existingItem.cartItemId, {
          qty: newQuantity,
          is_active: true
        })
        if (response.success) {
          setCartItems(prevItems =>
            prevItems.map(cartItem =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: newQuantity }
                : cartItem
            )
          )
          setIsCartOpen(true)
        } else {
          throw new Error('Failed to update cart item')
        }
      } else {
        const response = await cartApi.add({
          user_id: user.id,
          product_id: item.id,
          qty: 1,
          is_active: true
        })
        if (response.success && response.data) {
          const newItem: CartItem = {
            id: response.data.product_id,
            cartItemId: response.data.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: response.data.qty,
            category: item.category
          }
          setCartItems(prevItems => [...prevItems, newItem])
          setIsCartOpen(true)
        } else {
          throw new Error('Failed to add item to cart')
        }
      }
    } catch (error) {
      console.error('Failed to add item to cart:', error)
      await fetchCartItems()
    }
  }

  const removeFromCart = async (id: number) => {
    const item = cartItems.find(cartItem => cartItem.id === id)
    if (!item || !item.cartItemId) {
      setCartItems(prevItems => prevItems.filter(item => item.id !== id))
      return
    }

    try {
      await cartApi.delete(item.cartItemId)
      setCartItems(prevItems => prevItems.filter(item => item.id !== id))
    } catch (error) {
      console.error('Failed to remove item from cart:', error)
    }
  }

  const updateQuantity = async (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    const item = cartItems.find(cartItem => cartItem.id === id)
    if (!item || !item.cartItemId) {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      )
      return
    }

    try {
      const response = await cartApi.update(item.cartItemId, {
        qty: quantity,
        is_active: true
      })
      if (response.success) {
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        )
      }
    } catch (error) {
      console.error('Failed to update cart item quantity:', error)
    }
  }

  const clearCart = async () => {
    if (!isAuthenticated || !user) {
      setCartItems([])
      return
    }

    try {
      await Promise.all(
        cartItems
          .filter(item => item.cartItemId)
          .map(item => cartApi.delete(item.cartItemId!))
      )
      setCartItems([])
    } catch (error) {
      console.error('Failed to clear cart from API:', error)
      setCartItems([])
    }
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const openCart = () => {
    setIsCartOpen(true)
  }

  const closeCart = () => {
    setIsCartOpen(false)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        isCartOpen,
        openCart,
        closeCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}




