const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
}

interface RegisterRequest {
  email_address: string
  phone_number: string
  first_name: string
  last_name: string
  user_name: string
  password: string
  user_role_id: number
}

interface VerifyEmailRequest {
  email_address: string
  otp: string
}

interface LoginRequest {
  identifier: string
  password: string
}

interface LoginResponse {
  token: string
  user: {
    id: number
    email_address: string
    phone_number: string
    first_name: string
    last_name: string
    user_name: string
    is_verified: boolean
    verified_at: string | null
    user_role_id: number
    is_active: boolean
    createdAt: string
    updatedAt: string
    role: {
      id: number
      role_name: string
      is_active: boolean
      createdAt: string
      updatedAt: string
    }
  }
}

interface ForgotPasswordRequest {
  email_address: string
}

interface ResetPasswordRequest {
  email_address: string
  otp: string
  password: string
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('token')
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred')
    }

    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('An unexpected error occurred')
  }
}

export interface Branch {
  id: number
  branch_name: string
  address: string
  phone_number: string
  email_address: string
  is_active: boolean
  createdAt: string
  updatedAt: string
}

interface ContactUsRequest {
  full_name: string
  email_address: string
  subject: string
  message: string
  is_active: boolean
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<ApiResponse<null>> => {
    return apiRequest<null>('/api/users/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  verifyEmail: async (data: VerifyEmailRequest): Promise<ApiResponse<null>> => {
    return apiRequest<null>('/api/users/verify-email', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiRequest<LoginResponse>('/api/users/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse<null>> => {
    return apiRequest<null>('/api/users/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse<null>> => {
    return apiRequest<null>('/api/users/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

export const contactApi = {
  getBranches: async (): Promise<ApiResponse<Branch[]>> => {
    return apiRequest<Branch[]>('/api/branches', {
      method: 'GET',
    })
  },

  submitContact: async (data: ContactUsRequest): Promise<ApiResponse<null>> => {
    return apiRequest<null>('/api/contact-us', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

interface GalleryItem {
  id: number
  img_url: string
  is_active: boolean
  createdAt: string
  updatedAt: string
}

export const galleryApi = {
  getGallery: async (): Promise<ApiResponse<GalleryItem[]>> => {
    return apiRequest<GalleryItem[]>('/api/gallery', {
      method: 'GET',
    })
  },
}

interface ProductCategory {
  id: number
  category: string
  is_active: boolean
  createdAt: string
  updatedAt: string
}

interface Product {
  id: number
  product_name: string
  description: string
  amount: string
  stock: number
  img_url: string
  product_category_id: number
  is_active: boolean
  createdAt: string
  updatedAt: string
  category: ProductCategory
}

export const productCategoryApi = {
  getAll: async (): Promise<ApiResponse<ProductCategory[]>> => {
    return apiRequest<ProductCategory[]>('/api/product-categories', {
      method: 'GET',
    })
  },

  getById: async (id: number): Promise<ApiResponse<ProductCategory>> => {
    return apiRequest<ProductCategory>(`/api/product-categories/${id}`, {
      method: 'GET',
    })
  },
}

export const productApi = {
  getAll: async (): Promise<ApiResponse<Product[]>> => {
    return apiRequest<Product[]>('/api/products', {
      method: 'GET',
    })
  },

  getById: async (id: number): Promise<ApiResponse<Product>> => {
    return apiRequest<Product>(`/api/products/${id}`, {
      method: 'GET',
    })
  },

  search: async (query: string): Promise<ApiResponse<Product[]>> => {
    return apiRequest<Product[]>(`/api/products/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
    })
  },
}

interface CartItem {
  id: number
  user_id: number
  product_id: number
  qty: number
  total_amount: string
  is_active: boolean
  createdAt: string
  updatedAt: string
  user?: {
    id: number
    email_address: string
    phone_number: string
    first_name: string
    last_name: string
    user_name: string
    is_verified: boolean
    verified_at: string | null
    user_role_id: number
    is_active: boolean
    createdAt: string
    updatedAt: string
  }
  product?: {
    id: number
    product_name: string
    description: string
    amount: string
    stock: number
    img_url: string
    product_category_id: number
    is_active: boolean
    createdAt: string
    updatedAt: string
  }
}

interface CartItemRequest {
  user_id: number
  product_id: number
  qty: number
  is_active: boolean
}

interface CartItemUpdate {
  qty: number
  is_active: boolean
}

export const cartApi = {
  add: async (data: CartItemRequest): Promise<ApiResponse<CartItem>> => {
    return apiRequest<CartItem>('/api/cart', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id: number, data: CartItemUpdate): Promise<ApiResponse<CartItem>> => {
    return apiRequest<CartItem>(`/api/cart/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  getByUserId: async (userId: number): Promise<ApiResponse<CartItem[]>> => {
    return apiRequest<CartItem[]>(`/api/cart/user/${userId}`, {
      method: 'GET',
    })
  },

  delete: async (id: number): Promise<ApiResponse<CartItem>> => {
    return apiRequest<CartItem>(`/api/cart/${id}`, {
      method: 'DELETE',
    })
  },
}

interface OrderProduct {
  product_id: number
  quantity: number
}

interface OrderRequest {
  user_id: number
  branch_id: number
  products: OrderProduct[]
}

interface Order {
  id: number
  user_id: number
  branch_id: number
  total_amount: string
  status: string
  createdAt: string
  updatedAt: string
}

interface OrderProductDetail {
  id: number
  order_id: number
  product_id: number
  quantity: number
  amount: string
  is_active: boolean
  createdAt: string
  updatedAt: string
  product?: {
    id: number
    product_name: string
    description: string
    amount: string
    stock: number
    img_url: string
    product_category_id: number
    is_active: boolean
    createdAt: string
    updatedAt: string
  }
}

interface OrderServiceDetail {
  id: number
  order_id: number
  package_id: number
  vehicle_type: string
  vehicle_number: string
  arrival_date: string
  arrival_time: string
  is_active: boolean
  createdAt: string
  updatedAt: string
  package?: {
    id: number
    package_name: string
    total_amount: string
    service_type_id: number
    is_active: boolean
    createdAt: string
    updatedAt: string
  }
}

interface OrderExtraWorkDetail {
  id: number
  order_id: number
  extra_works_id: number
  is_active: boolean
  createdAt: string
  updatedAt: string
  extra_work?: {
    id: number
    name: string
    amount: string
    description: string
    is_active: boolean
    createdAt: string
    updatedAt: string
  }
}

export interface ApiOrder {
  id: number
  user_id: number
  user_full_name: string
  user_email_address: string
  user_phone_number: string
  branch_id: number
  total_amount: string
  status: string
  order_at: string
  is_active: boolean
  createdAt: string
  updatedAt: string
  user?: {
    id: number
    email_address: string
    phone_number: string
    first_name: string
    last_name: string
    user_name: string
    is_verified: boolean
    verified_at: string | null
    user_role_id: number
    is_active: boolean
    createdAt: string
    updatedAt: string
  }
  branch?: Branch
  service_details: OrderServiceDetail[]
  product_details: OrderProductDetail[]
  extra_work_details: OrderExtraWorkDetail[]
}

export const orderApi = {
  create: async (data: OrderRequest): Promise<ApiResponse<Order>> => {
    return apiRequest<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  getByUserId: async (userId: number): Promise<ApiResponse<ApiOrder[]>> => {
    return apiRequest<ApiOrder[]>(`/api/orders/user/${userId}`, {
      method: 'GET',
    })
  },
}

interface ReviewRequest {
  order_id: number
  rating: number
  review: string
  is_show_others: boolean
  is_active: boolean
}

interface ReviewUpdate {
  rating: number
  review: string
  is_show_others: boolean
}

export interface ApiReview {
  id: number
  order_id: number
  rating: number
  review: string
  is_show_others: boolean
  is_active: boolean
  createdAt: string
  updatedAt: string
  order?: {
    id: number
    user_id: number
    user_full_name: string
    user_email_address: string
    user_phone_number: string
    branch_id: number
    total_amount: string
    status: string
    order_at: string
    is_active: boolean
    createdAt: string
    updatedAt: string
  }
}

export const reviewApi = {
  create: async (data: ReviewRequest): Promise<ApiResponse<ApiReview>> => {
    return apiRequest<ApiReview>('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id: number, data: ReviewUpdate): Promise<ApiResponse<ApiReview>> => {
    return apiRequest<ApiReview>(`/api/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  getByUserId: async (userId: number): Promise<ApiResponse<ApiReview[]>> => {
    return apiRequest<ApiReview[]>(`/api/reviews/user/${userId}`, {
      method: 'GET',
    })
  },

  delete: async (id: number): Promise<ApiResponse<ApiReview>> => {
    return apiRequest<ApiReview>(`/api/reviews/${id}`, {
      method: 'DELETE',
    })
  },
}

