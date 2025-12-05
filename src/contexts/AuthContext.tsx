import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

export interface User {
  id: string
  firstName: string
  lastName: string
  userName: string
  email: string
  phone: string
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
  login: (email: string, password: string) => Promise<boolean>
  signup: (userData: {
    firstName: string
    lastName: string
    userName: string
    email: string
    phone: string
    password: string
  }) => Promise<boolean>
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
    const savedOrders = localStorage.getItem('orders')
    const savedReviews = localStorage.getItem('reviews')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
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
      setReviews(JSON.parse(savedReviews))
    }
  }, [])

  const login = async (_email: string, _password: string): Promise<boolean> => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setUser(user)
      return true
    }
    
    const demoUser: User = {
      id: '1',
      firstName: 'Demo',
      lastName: 'User',
      userName: 'demouser',
      email: 'demo@example.com',
      phone: '+1234567890'
    }
    setUser(demoUser)
    localStorage.setItem('user', JSON.stringify(demoUser))
    return true
  }

  const signup = async (userData: {
    firstName: string
    lastName: string
    userName: string
    email: string
    phone: string
    password: string
  }): Promise<boolean> => {
    const savedUsers = localStorage.getItem('users') || '[]'
    const users = JSON.parse(savedUsers)
    
    const userExists = users.some((u: User & { password: string }) => 
      u.email === userData.email || u.userName === userData.userName
    )
    
    if (userExists) {
      return false
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData
    }
    
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem('user', JSON.stringify(userWithoutPassword))
    
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
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

