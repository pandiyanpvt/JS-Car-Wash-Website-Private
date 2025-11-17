import { Box } from '@mui/material'
import { HeroSection } from '../../components/website'
import { AboutPage } from '../about'
import { ServicePage } from '../services'
import { ContactUsPage } from '../contact'
import { FooterPage } from '../footer'

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
      <ServicePage />
      <ContactUsPage />
      <FooterPage />
    </Box>
  )
}

export default HomePage

