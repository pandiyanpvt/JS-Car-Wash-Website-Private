import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { authApi } from '../services/api'

export interface User {
  id: number
  firstName: string
  lastName: string
  userName: string
  email: string
  phone: string
  isVerified: boolean
  verifiedAt: string | null
  userRoleId: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  role?: {
    id: number
    roleName: string
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
}

export interface Order {
  id: string
  date: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  status: 'pending' | 'completed' | 'cancelled'
}

export interface Review {
  id: string
  orderId: string
  orderDate: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  rating: number
  comment: string
  date: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (userData: {
    firstName: string
    lastName: string
    userName: string
    email: string
    phone: string
    password: string
  }) => Promise<{ success: boolean; error?: string }>
  verifyEmail: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  resetPassword: (email: string, otp: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  orders: Order[]
  addOrder: (order: Order) => void
  reviews: Review[]
  addReview: (review: Review) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    const savedOrders = localStorage.getItem('orders')
    const savedReviews = localStorage.getItem('reviews')
    
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders))
      } catch (error) {
        console.error('Error parsing saved orders:', error)
      }
    } else {
      const dummyOrders: Order[] = [
        {
          id: 'ORD-' + Date.now().toString().slice(-8),
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            { name: 'Premium Car Wash Package', quantity: 1, price: 49.99 },
            { name: 'Wax Protection', quantity: 1, price: 15.00 },
            { name: 'Interior Vacuum', quantity: 1, price: 10.00 }
          ],
          total: 74.99,
          status: 'completed'
        },
        {
          id: 'ORD-' + (Date.now() - 1000).toString().slice(-8),
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            { name: 'Full Car Detailing Package', quantity: 1, price: 149.99 },
            { name: 'Engine Bay Cleaning', quantity: 1, price: 25.00 },
            { name: 'Tire Shine', quantity: 1, price: 12.00 },
            { name: 'Air Freshener', quantity: 2, price: 5.00 }
          ],
          total: 196.99,
          status: 'pending'
        }
      ]
      setOrders(dummyOrders)
      localStorage.setItem('orders', JSON.stringify(dummyOrders))
    }
    
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews))
      } catch (error) {
        console.error('Error parsing saved reviews:', error)
      }
    }
  }, [])

  const login = async (identifier: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.login({ identifier, password })
      
      if (response.success && response.data) {
        const { token, user: apiUser } = response.data
        
        const user: User = {
          id: apiUser.id,
          firstName: apiUser.first_name,
          lastName: apiUser.last_name,
          userName: apiUser.user_name,
          email: apiUser.email_address,
          phone: apiUser.phone_number,
          isVerified: apiUser.is_verified,
          verifiedAt: apiUser.verified_at,
          userRoleId: apiUser.user_role_id,
          isActive: apiUser.is_active,
          createdAt: apiUser.createdAt,
          updatedAt: apiUser.updatedAt,
          role: apiUser.role ? {
            id: apiUser.role.id,
            roleName: apiUser.role.role_name,
            isActive: apiUser.role.is_active,
            createdAt: apiUser.role.createdAt,
            updatedAt: apiUser.role.updatedAt
          } : undefined
        }
        
        setUser(user)
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        return { success: true }
      }
      
      return { success: false, error: response.message || 'Login failed' }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during login'
      return { success: false, error: errorMessage }
    }
  }

  const signup = async (userData: {
    firstName: string
    lastName: string
    userName: string
    email: string
    phone: string
    password: string
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.register({
        email_address: userData.email,
        phone_number: userData.phone,
        first_name: userData.firstName,
        last_name: userData.lastName,
        user_name: userData.userName,
        password: userData.password,
        user_role_id: 3
      })
      
      if (response.success) {
        return { success: true }
      }
      
      return { success: false, error: response.message || 'Registration failed' }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration'
      return { success: false, error: errorMessage }
    }
  }

  const verifyEmail = async (email: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.verifyEmail({
        email_address: email,
        otp
      })
      
      if (response.success) {
        return { success: true }
      }
      
      return { success: false, error: response.message || 'Email verification failed' }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during email verification'
      return { success: false, error: errorMessage }
    }
  }

  const forgotPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.forgotPassword({
        email_address: email
      })
      
      if (response.success) {
        return { success: true }
      }
      
      return { success: false, error: response.message || 'Failed to send reset password email' }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      return { success: false, error: errorMessage }
    }
  }

  const resetPassword = async (email: string, otp: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.resetPassword({
        email_address: email,
        otp,
        password
      })
      
      if (response.success) {
        return { success: true }
      }
      
      return { success: false, error: response.message || 'Password reset failed' }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during password reset'
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const addOrder = (order: Order) => {
    const updatedOrders = [order, ...orders]
    setOrders(updatedOrders)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
  }

  const addReview = (review: Review) => {
    const updatedReviews = [review, ...reviews]
    setReviews(updatedReviews)
    localStorage.setItem('reviews', JSON.stringify(updatedReviews))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        verifyEmail,
        forgotPassword,
        resetPassword,
        logout,
        orders,
        addOrder,
        reviews,
        addReview
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

