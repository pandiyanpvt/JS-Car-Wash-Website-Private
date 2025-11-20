import { HomePage } from './pages/home'
import { GalleryPage } from './pages/gallery'
import { AboutPage } from './pages/about'
import { ServicePage } from './pages/services'
import CarWash from './pages/services/CarWash'
import CarDetailing from './pages/services/CarDetailing'
import { ContactUsPage } from './pages/contact'
import FAQPage from './pages/faq/FAQPage'
import TestimonialsPage from './pages/testimonials/TestimonialsPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/index.css'

function App() {

  return (
    <BrowserRouter>
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
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

