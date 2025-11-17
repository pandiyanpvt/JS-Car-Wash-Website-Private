import { HomePage } from './pages/home'
import { GalleryPage } from './pages/gallery'
import { Box } from '@mui/material'
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  const [dealerSidebarOpen, setDealerSidebarOpen] = useState(false)

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
                dealerSidebarOpen={dealerSidebarOpen}
                setDealerSidebarOpen={setDealerSidebarOpen}
              />
            }
          />
          <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
      </Box>
    </BrowserRouter>
  )
}

export default App

