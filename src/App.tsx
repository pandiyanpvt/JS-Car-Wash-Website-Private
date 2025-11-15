import { HomePage } from './pages/home'
import { Box } from '@mui/material'
import { useState } from 'react'

function App() {
  const [dealerSidebarOpen, setDealerSidebarOpen] = useState(false)

  return (
    <Box
      sx={{
        margin: 0,
        padding: 0,
        width: '100%',
        minHeight: '100vh',
        overflow: 'auto',
      }}
    >
      <HomePage 
        dealerSidebarOpen={dealerSidebarOpen}
        setDealerSidebarOpen={setDealerSidebarOpen}
      />
    </Box>
  )
}

export default App

