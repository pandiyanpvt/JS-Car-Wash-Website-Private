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
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import { PromoOffers } from './components/promo'
import './styles/index.css'

function App() {

  return (
    <BrowserRouter>
      <PromoOffers>
      <div
        style={{
          margin: 0,
          padding: 0,
          width: '100%',
          minHeight: '100vh',
          overflow: 'auto',
        }}
      >
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
          <Route path="/checkout" element={<Navigate to="/products" replace />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
        </Routes>
        <ScrollToTop />
      </div>
      </PromoOffers>
    </BrowserRouter>
  )
}

export default App

