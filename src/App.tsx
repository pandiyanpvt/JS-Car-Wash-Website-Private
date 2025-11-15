import { Navbar } from './components/website'
import { Box } from '@mui/material'

function App() {
  return (
    <Box>
      <Navbar />
      <Box sx={{ minHeight: '100vh', pt: 2 }}>
        {/* Main content will go here */}
      </Box>
    </Box>
  )
}

export default App

