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

interface Branch {
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

