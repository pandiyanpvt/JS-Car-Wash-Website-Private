import { HomePage } from './pages/home'
import { GalleryPage } from './pages/gallery'
import { AboutPage } from './pages/about'
import { ServicePage } from './pages/services'
import { ContactUsPage } from './pages/contact'
import { Box } from '@mui/material'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <BrowserRouter>
      <Box
        sx={{
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
          <Route path="/services" element={<ServicePage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
      </Box>
    </BrowserRouter>
  )
}

export default App

