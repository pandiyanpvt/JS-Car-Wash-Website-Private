import { HomePage } from './pages/home'
import { GalleryPage } from './pages/gallery'
import { AboutPage } from './pages/about'
import { ServicePage } from './pages/services'
import CarWash from './pages/services/CarWash'
import CarDetailing from './pages/services/CarDetailing'
import { ContactUsPage } from './pages/contact'
import FAQPage from './pages/faq/FAQPage'
import TestimonialsPage from './pages/testimonials/TestimonialsPage'
import { ProductPage } from './pages/products'
import { BookingPage } from './pages/booking'
import { LoginPage } from './pages/login'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/navbar'
import { NavbarProvider, useNavbar } from './contexts/NavbarContext'
import './styles/index.css'

function AppContent() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login' || location.pathname === '/register'
  const isHomePage = location.pathname === '/'
  const { setIsVisible } = useNavbar()

  // Show navbar on all pages except HomePage (HomePage handles its own visibility)
  useEffect(() => {
    if (!isHomePage && !isLoginPage) {
      setIsVisible(true)
    }
  }, [location.pathname, isHomePage, isLoginPage, setIsVisible])

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        width: '100%',
        minHeight: '100vh',
        overflow: 'auto',
      }}
    >
      {!isLoginPage && <Navbar />}
      <Routes>
          <Route
            path="/"
            element={
              <HomePage
              />
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/aboutus" element={<AboutPage />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/carwash" element={<CarWash />} />
          <Route path="/cardetailing" element={<CarDetailing />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/testimonial" element={<TestimonialsPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Navigate to="/login" replace />} />
        </Routes>
      <ScrollToTop />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <NavbarProvider>
        <AppContent />
      </NavbarProvider>
    </BrowserRouter>
  )
}

export default App

