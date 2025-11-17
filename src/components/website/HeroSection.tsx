import { Box, Typography, Button, IconButton, useMediaQuery, useTheme, Drawer, List, ListItem, ListItemText } from '@mui/material'
import { PlayArrow, ArrowForward, ArrowBack, KeyboardArrowDown, Menu, Close, Home, Info, Build, PhotoLibrary, ContactMail } from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import FindDealerSidebar from './FindDealerSidebar'

interface HeroSectionProps {
  dealerSidebarOpen: boolean
  setDealerSidebarOpen: (open: boolean) => void
}

function HeroSection({ dealerSidebarOpen, setDealerSidebarOpen }: HeroSectionProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [menuOpen, setMenuOpen] = useState(false)
  const totalPages = 6
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  const menuItems = [
    { label: 'Home', href: '#home', icon: Home },
    { label: 'About Us', href: '#about', icon: Info },
    { label: 'Services', href: '#services', icon: Build },
    { label: 'Gallery', href: '#gallery', icon: PhotoLibrary },
    { label: 'Contact Us', href: '#contact', icon: ContactMail }
  ]

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : totalPages))
  }

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : 1))
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        height: '100vh',
        overflow: 'hidden',
        width: '100%',
        maxHeight: '100vh',
        position: 'relative',
      }}
    >
      {/* Hamburger Menu Button */}
      <IconButton
        onClick={() => setMenuOpen(true)}
        sx={{
          position: 'absolute',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
          zIndex: 1000,
          color: '#000',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
          },
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Menu sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' } }} />
      </IconButton>

      {/* Navigation Drawer */}
      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        PaperProps={{
          className: 'dark-scrollbar',
          sx: {
            width: { xs: '320px', sm: '380px', md: '420px' },
            background: 'linear-gradient(180deg, #0f1419 0%, #1a1f2e 100%)',
            color: '#ffffff',
            boxShadow: '4px 0 24px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
          },
        }}
      >
        {/* Header with Logo and Close */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: { xs: 3, md: 4 },
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'linear-gradient(135deg, rgba(211, 47, 47, 0.1) 0%, transparent 100%)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                '& img': {
                  maxHeight: { xs: '35px', md: '40px' },
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                },
              }}
            >
              <img
                src="/JS Car Wash Images/cropped-fghfthgf.png"
                alt="Logo"
              />
            </Box>
            <Typography
              sx={{
                fontSize: { xs: '1.125rem', md: '1.25rem' },
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Navigation
            </Typography>
          </Box>
          <IconButton
            onClick={() => setMenuOpen(false)}
            sx={{
              color: '#ffffff',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(211, 47, 47, 0.2)',
                borderColor: '#d32f2f',
                transform: 'rotate(90deg)',
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>

        {/* Navigation List */}
        <List sx={{ pt: { xs: 2, md: 3 }, px: { xs: 1, md: 2 }, flex: 1, overflow: 'auto' }}>
          {menuItems.map((item, index) => {
            const IconComponent = item.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ListItem
                  component="a"
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  sx={{
                    py: { xs: 2, md: 2.5 },
                    px: { xs: 2.5, md: 3 },
                    mb: 1,
                    cursor: 'pointer',
                    borderRadius: '12px',
                    border: '1px solid transparent',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '4px',
                      background: 'linear-gradient(180deg, #d32f2f 0%, #ff6b6b 100%)',
                      transform: 'scaleY(0)',
                      transformOrigin: 'bottom',
                      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(211, 47, 47, 0.15)',
                      borderColor: 'rgba(211, 47, 47, 0.3)',
                      transform: 'translateX(8px)',
                      '&::before': {
                        transform: 'scaleY(1)',
                      },
                      '& .menu-icon': {
                        backgroundColor: 'rgba(211, 47, 47, 0.2)',
                        borderColor: '#d32f2f',
                        transform: 'scale(1.1)',
                        '& .MuiSvgIcon-root': {
                          color: '#d32f2f',
                          transform: 'scale(1.2)',
                        },
                      },
                      '& .MuiListItemText-primary': {
                        color: '#ffffff',
                        transform: 'translateX(4px)',
                      },
                      '& .menu-arrow': {
                        color: '#d32f2f',
                        transform: 'translateX(4px)',
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      width: '100%',
                    }}
                  >
                    <Box
                      className="menu-icon"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: { xs: '40px', md: '44px' },
                        height: { xs: '40px', md: '44px' },
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      <IconComponent
                        sx={{
                          fontSize: { xs: '1.25rem', md: '1.375rem' },
                          color: 'rgba(255, 255, 255, 0.7)',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      />
                    </Box>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: { xs: '0.9375rem', md: '1rem' },
                        fontWeight: 500,
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                      }}
                      sx={{
                        '& .MuiListItemText-primary': {
                          color: 'rgba(255, 255, 255, 0.8)',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        },
                      }}
                    />
                    <ArrowForward
                      className="menu-arrow"
                      sx={{
                        fontSize: { xs: '1rem', md: '1.125rem' },
                        color: 'rgba(255, 255, 255, 0.4)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        ml: 'auto',
                      }}
                    />
                  </Box>
                </ListItem>
              </motion.div>
            )
          })}
        </List>

        {/* Footer Section */}
        <Box
          sx={{
            mt: 'auto',
            p: { xs: 3, md: 4 },
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'linear-gradient(135deg, rgba(211, 47, 47, 0.05) 0%, transparent 100%)',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.5)',
              textAlign: 'center',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            JS Car Wash & Detailing
          </Typography>
        </Box>
      </Drawer>

      {/* Left Section - White Background (2/3) */}
      <Box
        sx={{
          width: { xs: '100%', md: '66.666%' },
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
          height: '100%',
        }}
      >
        {/* Vertical Bar on Left Edge - Dark Panel */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: { xs: '50px', md: '80px' },
            height: { xs: '200px', md: '250px' },
            backgroundColor: '#0f1419',
            backgroundImage: 'linear-gradient(180deg, rgba(15, 20, 25, 1) 0%, rgba(10, 15, 20, 1) 100%)',
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <Typography
              sx={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                color: '#ffffff',
                fontSize: '0.8125rem',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                fontWeight: 300,
                fontFamily: 'sans-serif',
                transform: 'rotate(180deg)',
              }}
            >
              DISCOVER MODELS
            </Typography>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <KeyboardArrowDown 
                sx={{ 
                  color: '#ffffff', 
                  fontSize: '1.25rem',
                }} 
              />
            </motion.div>
          </Box>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pl: { xs: 2, sm: 3, md: '60px' },
            pr: { xs: 2, sm: 3, md: 4 },
            py: { xs: 1.5, sm: 2, md: 4 },
            position: 'relative',
            overflow: 'hidden',
            height: '100%',
            width: '100%',
            minHeight: 0,
            maxHeight: '100vh',
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: { xs: 1, sm: 1.5, md: 2 },
                width: '100%',
                maxWidth: '100%',
                '& img': {
                  maxWidth: '100%',
                  maxHeight: { xs: '60px', sm: '80px', md: '120px' },
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                },
              }}
            >
              <img
                src="/JS Car Wash Images/cropped-fghfthgf.png"
                alt="Logo"
              />
            </Box>
          </motion.div>

          {/* BLACK BADGE Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.75rem', md: '3rem', lg: '4rem' },
                fontWeight: 200,
                letterSpacing: { xs: '2px', sm: '3px', md: '5px', lg: '6px' },
                textTransform: 'uppercase',
                color: '#000',
                mb: { xs: 0.25, md: 0.5 },
                textAlign: 'center',
                lineHeight: 1.1,
                px: { xs: 1, sm: 2 },
              }}
            >
              JS
            </Typography>
          </motion.div>

          {/* WRAITH Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Typography
              sx={{
                fontSize: { xs: '0.875rem', sm: '1.125rem', md: '1.75rem', lg: '2.25rem' },
                fontWeight: 200,
                letterSpacing: { xs: '4px', sm: '5px', md: '8px', lg: '10px' },
                textTransform: 'uppercase',
                color: '#000',
                mb: { xs: 1, sm: 1.5, md: 2 },
                textAlign: 'center',
                px: { xs: 1, sm: 2 },
              }}
            >
              CAR WASH & DETAILING
            </Typography>
          </motion.div>

          {/* Car Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{ width: '100%' }}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: { xs: '100%', sm: '90%', md: '1100px' },
                height: { xs: '150px', sm: '220px', md: '400px', lg: '550px' },
                maxHeight: { xs: '30vh', sm: '35vh', md: '50vh', lg: '60vh' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                mb: { xs: 1, sm: 1.5, md: 2 },
                mx: 'auto',
              }}
            >
              <img
                src="/JS Car Wash Images/kindpng_4272437.png"
                alt="Car"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
          </motion.div>

          {/* BOOK NOW Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              variant="outlined"
              sx={{
                borderColor: '#000',
                color: '#000',
                borderWidth: '1px',
                borderRadius: '50px',
                px: { xs: 1.5, sm: 2, md: 3 },
                py: { xs: 0.5, sm: 0.75, md: 1 },
                textTransform: 'uppercase',
                letterSpacing: { xs: '2px', sm: '2.5px', md: '3px' },
                fontSize: { xs: '0.625rem', sm: '0.6875rem', md: '0.8125rem' },
                fontWeight: 300,
                backgroundColor: '#ffffff',
                minWidth: { xs: '130px', sm: '150px', md: '200px' },
                '&:hover': {
                  borderColor: '#000',
                  backgroundColor: '#000',
                  color: '#fff',
                },
              }}
            >
              BOOK NOW
            </Button>
          </motion.div>
        </Box>
      </Box>

      {/* Right Section - Dark Blue Background (1/3) */}
      <AnimatePresence>
        {(!dealerSidebarOpen || !isDesktop) && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{
              opacity: dealerSidebarOpen && isDesktop ? 0 : 1,
            }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.4, ease: 'easeInOut' },
            }}
            style={{
              width: isDesktop ? '33.333%' : '100%',
              overflow: 'hidden',
              height: '100%',
              flexShrink: 0,
              marginLeft: 'auto',
            }}
          >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            backgroundColor: '#0f1419',
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(26, 35, 50, 0.5) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(20, 30, 45, 0.5) 0%, transparent 50%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            px: { xs: 3, md: 4 },
            py: { xs: 4, md: 6 },
            position: 'relative',
            flexShrink: 0,
          }}
        >
        {/* Red Vertical Line */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '3px',
            backgroundColor: '#d32f2f',
          }}
        />

        {/* DEALERS Button - Top Right */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 16, md: 20 },
            right: { xs: 16, md: 20 },
            zIndex: 20,
          }}
        >
          <Typography
            onClick={() => setDealerSidebarOpen(true)}
            sx={{
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: 400,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            DEALERS
          </Typography>
        </Box>

         {/* Top Content */}
         <Box 
           sx={{ 
             pl: 3, 
             pt: { xs: 1.5, md: 2 },
             flex: 1,
             display: 'flex',
             flexDirection: 'column',
             justifyContent: 'center',
             overflow: 'auto',
             maxHeight: 'calc(100% - 80px)',
           }}
         >
           {/* Headline */}
           <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8 }}
           >
             <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: { xs: 1.5, md: 2 } }}>
               <Box
                 sx={{
                   width: '3px',
                   height: '40px',
                   backgroundColor: '#d32f2f',
                   mr: 2,
                   mt: 0.5,
                 }}
               />
               <Typography
                 sx={{
                   fontSize: { xs: '1.25rem', md: '1.75rem' },
                   fontWeight: 200,
                   letterSpacing: { xs: '1px', md: '2px' },
                   textTransform: 'uppercase',
                   color: '#ffffff',
                   lineHeight: 1.3,
                 }}
               >
                 SHINEUP YOUR CAR TO NEXT LEVEL
               </Typography>
             </Box>
           </motion.div>

          {/* Description Text */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              sx={{
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                fontWeight: 300,
                color: '#ffffff',
                lineHeight: 1.6,
                mb: { xs: 1.5, md: 2 },
                opacity: 0.95,
              }}
            >
              JS Car Wash is Australia’s premier professional hand wash and detailing provider. 
              For over 10 years, JS Car Wash has been a family-owned, private company that thrives 
              in an atmosphere of determination and innovation. We take pride in offering unparalleled service, 
              ensuring that every customer leaves with that new car feeling. JS Car Wash is dedicated to making 
              car cleaning an affordable and convenient experience.
            </Typography>
          </motion.div>

          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Box
              sx={{
                width: '100%',
                aspectRatio: '16/9',
                backgroundColor: '#0a0a0a',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                cursor: 'pointer',
                mb: { xs: 1.5, md: 2 },
                overflow: 'hidden',
                '&:hover': {
                  '& .play-button': {
                    transform: 'scale(1.1)',
                  },
                },
              }}
            >
              {/* Play Button */}
              <Box
                className="play-button"
                sx={{
                  width: { xs: '50px', md: '60px' },
                  height: { xs: '50px', md: '60px' },
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                  transition: 'transform 0.3s ease',
                }}
              >
                <PlayArrow sx={{ color: '#000', fontSize: { xs: '1.75rem', md: '2rem' }, ml: 0.5 }} />
              </Box>
              <Typography
                sx={{
                  position: 'absolute',
                  bottom: { xs: 12, md: 16 },
                  left: { xs: 16, md: 16 },
                  color: '#ffffff',
                  fontSize: { xs: '0.6875rem', md: '0.75rem' },
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                WATCH VIDEO
              </Typography>
            </Box>
          </motion.div>

          {/* Configure Link */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                '&:hover': {
                  '& .arrow-icon': {
                    transform: 'translateX(4px)',
                  },
                },
              }}
            >
              <Typography
                sx={{
                  color: '#ffffff',
                  fontSize: { xs: '0.75rem', md: '0.8125rem' },
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  fontWeight: 300,
                }}
              >
                CONFIGURE YOUR ROLL-ROYCE
              </Typography>
              <ArrowForward
                className="arrow-icon"
                sx={{
                  color: '#ffffff',
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  transition: 'transform 0.3s ease',
                }}
              />
            </Box>
          </motion.div>
        </Box>

        {/* Bottom Pagination - Centered */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            py: { xs: 1, md: 1.5 },
            flexShrink: 0,
          }}
        >
          <IconButton
            onClick={handlePrev}
            sx={{
              color: '#ffffff',
              padding: '8px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <ArrowBack sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }} />
          </IconButton>
          <Typography
            sx={{
              color: '#ffffff',
              fontSize: { xs: '0.75rem', md: '0.875rem' },
              letterSpacing: '1px',
              fontWeight: 300,
              minWidth: '50px',
              textAlign: 'center',
            }}
          >
            {String(currentPage).padStart(2, '0')}/{String(totalPages).padStart(2, '0')}
          </Typography>
          <IconButton
            onClick={handleNext}
            sx={{
              color: '#ffffff',
              padding: '8px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <ArrowForward sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }} />
          </IconButton>
        </Box>
        </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Find Dealer Sidebar */}
      <FindDealerSidebar
        open={dealerSidebarOpen}
        onClose={() => setDealerSidebarOpen(false)}
        isDesktop={isDesktop}
      />
      </Box>
  )
}

export default HeroSection

