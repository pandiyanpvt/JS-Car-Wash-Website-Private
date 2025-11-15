import { Box } from '@mui/material'
import { HeroSection } from '../../components/website'
import { AboutPage } from '../about'

interface HomePageProps {
  dealerSidebarOpen: boolean
  setDealerSidebarOpen: (open: boolean) => void
}

function HomePage({ dealerSidebarOpen, setDealerSidebarOpen }: HomePageProps) {
  return (
    <Box>
      <HeroSection 
        dealerSidebarOpen={dealerSidebarOpen}
        setDealerSidebarOpen={setDealerSidebarOpen}
      />
      <AboutPage />
    </Box>
  )
}

export default HomePage

