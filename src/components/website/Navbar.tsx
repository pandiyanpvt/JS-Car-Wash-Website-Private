import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material'
import {
  Phone as PhoneIcon,
  Menu as MenuIcon,
} from '@mui/icons-material'
import { useState } from 'react'
import { motion } from 'framer-motion'

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('home')

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'products', label: 'Products' },
    { id: 'booking', label: 'Booking/Schedule' },
    { id: 'offers', label: 'Offers / Promotions' },
    { id: 'gallery', label: 'Gallery / Before & After' },
    { id: 'testimonials', label: 'Testimonials / Reviews' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'terms', label: 'Terms & Conditions / Privacy Policy' },
  ]

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleNavClick = (id: string) => {
    setActiveLink(id)
    setMobileOpen(false)
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', pt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        JS Car Wash & Detailing
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            sx={{
              cursor: 'pointer',
              backgroundColor:
                activeLink === item.id ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
            }}
          >
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: activeLink === item.id ? 'bold' : 'normal',
                color: activeLink === item.id ? '#d32f2f' : 'inherit',
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ position: 'sticky', top: 0, zIndex: 1100 }}>
      {/* Main Navigation Bar */}
      <Box
        sx={{
          backgroundColor: '#000000',
          color: 'white',
          py: 2,
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 3,
            }}
          >
            {/* Logo */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                minWidth: 200,
              }}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    border: '3px solid #c0c0c0',
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 'bold',
                      color: 'white',
                      lineHeight: 1,
                      mb: 0.5,
                    }}
                  >
                    JS
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.6rem',
                      color: 'white',
                      textAlign: 'center',
                      lineHeight: 1,
                    }}
                  >
                    CAR WASH & DETAILING
                  </Typography>
                </Box>
              </motion.div>
            </Box>

            {/* Navigation Links - Desktop */}
            <Box
              sx={{
                flex: 1,
                display: { xs: 'none', lg: 'flex' },
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
                maxWidth: '800px',
              }}
            >
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  sx={{
                    color: 'white',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    fontWeight: activeLink === item.id ? 'bold' : 'normal',
                    borderBottom:
                      activeLink === item.id
                        ? '2px solid #d32f2f'
                        : '2px solid transparent',
                    pb: 0.5,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      borderBottom: '2px solid #d32f2f',
                      color: '#d32f2f',
                    },
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </Box>

            {/* Right: Call to Action & Mobile Menu */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                minWidth: { xs: 'auto', md: 200 },
                justifyContent: 'flex-end',
              }}
            >
              {/* Phone Button & Info */}
              <Box
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <IconButton
                  sx={{
                    backgroundColor: '#d32f2f',
                    color: 'white',
                    width: 48,
                    height: 48,
                    '&:hover': { backgroundColor: '#b71c1c' },
                  }}
                >
                  <PhoneIcon />
                </IconButton>
                <Box>
                  <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                    Need Help
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}
                  >
                    02 5804 5720
                  </Typography>
                </Box>
              </Box>

              {/* Mobile Menu Button */}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  display: { md: 'none' },
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  '&:hover': { backgroundColor: '#b71c1c' },
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            backgroundColor: '#1a1a1a',
            color: 'white',
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  )
}

export default Navbar

