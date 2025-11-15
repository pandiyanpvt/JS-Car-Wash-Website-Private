import { Box, Typography, Container } from '@mui/material'
import Grid from '@mui/material/Grid'
import { motion } from 'framer-motion'
import React from 'react'
import {
  AccessTime,
  Settings,
  CheckCircle,
} from '@mui/icons-material'

function AboutPage() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Hero Section with Red Car */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '50vh', md: '65vh' },
          minHeight: { xs: '400px', md: '550px' },
          overflow: 'hidden',
        }}
      >
        {/* Background Image */}
        <Box
          component="img"
          src="/JS Car Wash Images/Screenshot-2024-11-08-104501.jpg"
          alt="Background"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
            filter: 'blur(2px)',
          }}
        />
        {/* Dark Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 2,
          }}
        />
        {/* Red Car Image - Larger and Closer */}
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: '-12%', md: '-8%' },
            left: '50%',
            transform: 'translateX(-50%)',
            width: { xs: '150%', md: '140%' },
            maxWidth: '2400px',
            height: 'auto',
            zIndex: 3,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <Box
              component="img"
              src="/JS Car Wash Images/car-banner-light.png"
              alt="Red Car"
              sx={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 15px 40px rgba(0, 0, 0, 0.6))',
              }}
            />
          </motion.div>
        </Box>
        {/* Gradient Transition */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '150px',
            background: 'linear-gradient(to bottom, transparent, #ffffff)',
            zIndex: 4,
          }}
        />
      </Box>

      {/* Benefit of Service Section */}
      <Box
        sx={{
          backgroundColor: '#ffffff',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)',
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          {/* Heading Section */}
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Typography
              sx={{
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                fontWeight: 600,
                color: '#d32f2f',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                mb: { xs: 1, md: 1.5 },
                fontFamily: 'sans-serif',
              }}
            >
              JS CAR WASH
            </Typography>
            
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                fontWeight: 700,
                color: '#000',
                lineHeight: 1.2,
                mb: 1.5,
                fontFamily: 'sans-serif',
              }}
            >
              Benefit of{' '}
              <Box
                component="span"
                sx={{
                  color: '#d32f2f',
                }}
              >
                Service
              </Box>
            </Typography>
            
            {/* Two Black Horizontal Lines */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                mt: 1.5,
              }}
            >
              <Box
                sx={{
                  width: '40px',
                  height: '1px',
                  backgroundColor: '#000',
                }}
              />
              <Box
                sx={{
                  width: '40px',
                  height: '1px',
                  backgroundColor: '#000',
                }}
              />
            </Box>
          </Box>

          {/* Split Layout: Image Left, Text Right */}
          <Grid container spacing={4} alignItems="flex-start">
            {/* Left Side - Image */}
            {/* @ts-ignore - MUI v7.3.5 still uses old Grid API, item prop will be removed in future versions */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    width: '100%',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Box
                    component="img"
                    src="/JS Car Wash Images/zas-890x664-1.png"
                    alt="Car Interior Cleaning"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>

            {/* Right Side - Text Content */}
            {/* @ts-ignore - MUI v7.3.5 still uses old Grid API, item prop will be removed in future versions */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '0.9375rem', md: '1rem' },
                    lineHeight: 1.8,
                    color: '#666',
                    mb: { xs: 2, md: 3 },
                    fontFamily: 'sans-serif',
                  }}
                >
                  <strong>JS Car Wash's</strong> dedication to excellence has drawn top talent from across the car wash industry. Our entire senior leadership team brings hands-on experience, having owned and operated car wash sites themselves. They are deeply committed to constantly refining the car wash process to enhance the customer experience.
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    fontWeight: 600,
                    color: '#000',
                    fontStyle: 'italic',
                    lineHeight: 1.6,
                    fontFamily: 'sans-serif',
                  }}
                >
                  A passion for car detailing is at the heart of everything we do
                </Typography>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Banners Section */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          py: { xs: 10, md: 16 },
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          minHeight: { xs: '200px', md: '250px' },
        }}
      >
        {/* Dark Grey Strip (Background) */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '-15%',
            transform: 'translateY(-50%) rotate(-3deg)',
            width: '130%',
            height: '60px',
            backgroundColor: '#2c2c2c',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            overflow: 'hidden',
            zIndex: 1,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 3, md: 4 },
              whiteSpace: 'nowrap',
              animation: 'scroll 30s linear infinite',
              '@keyframes scroll': {
                '0%': { transform: 'translateX(0)' },
                '100%': { transform: 'translateX(-50%)' },
              },
            }}
          >
            {[...Array(3)].map((_, repeat) => (
              <React.Fragment key={repeat}>
                {['CUSTOM VINYL', 'DETAILING', 'INTERIOR', 'INSTALLATION', 'COLOR CORRECTION'].map((service, index) => (
                  <Typography
                    key={`${repeat}-${index}`}
                    sx={{
                      color: '#9e9e9e',
                      fontSize: { xs: '0.75rem', md: '0.875rem' },
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontFamily: 'sans-serif',
                    }}
                  >
                    ✨ {service} ✨
                  </Typography>
                ))}
              </React.Fragment>
            ))}
          </Box>
        </Box>

        {/* Red Strip (Foreground) */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '-10%',
            transform: 'translateY(-50%) rotate(2deg)',
            width: '120%',
            height: '70px',
            backgroundColor: '#d32f2f',
            border: '2px solid #ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            overflow: 'hidden',
            zIndex: 2,
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 3, md: 4 },
              whiteSpace: 'nowrap',
              animation: 'scroll 25s linear infinite',
              '@keyframes scroll': {
                '0%': { transform: 'translateX(0)' },
                '100%': { transform: 'translateX(-50%)' },
              },
            }}
          >
            {[...Array(4)].map((_, repeat) => (
              <React.Fragment key={repeat}>
                {['TYRE SHINE', 'DETAILING', 'INTERIOR', 'BUGS REMOVAL', 'DETAILING', 'INTERIOR', 'CAR WASH'].map((service, index) => (
                  <Typography
                    key={`${repeat}-${index}`}
                    sx={{
                      color: '#ffffff',
                      fontSize: { xs: '0.75rem', md: '0.875rem' },
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px',
                      fontFamily: 'sans-serif',
                    }}
                  >
                    ✨ {service} ✨
                  </Typography>
                ))}
              </React.Fragment>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Benefits Section with Car Image */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left Column - Two Feature Blocks */}
          {/* @ts-ignore - MUI v7.3.5 still uses old Grid API, item prop will be removed in future versions */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 4, md: 5 } }}>
              {/* Professional Team */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                  <Box
                    sx={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: '#d32f2f',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2.5,
                    }}
                  >
                    <Settings sx={{ color: '#ffffff', fontSize: '2rem' }} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 1.5,
                      color: '#000',
                      fontSize: { xs: '1.125rem', md: '1.25rem' },
                      fontFamily: 'sans-serif',
                      textAlign: 'left',
                    }}
                  >
                    Professional Team
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: '0.875rem', md: '0.9375rem' },
                      color: '#000',
                      lineHeight: 1.7,
                      fontFamily: 'sans-serif',
                      textAlign: 'left',
                    }}
                  >
                    Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches.
                  </Typography>
                </Box>
              </motion.div>

              {/* Delivery on Time */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                  <Box
                    sx={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: '#d32f2f',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2.5,
                    }}
                  >
                    <AccessTime sx={{ color: '#ffffff', fontSize: '2rem' }} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 1.5,
                      color: '#000',
                      fontSize: { xs: '1.125rem', md: '1.25rem' },
                      fontFamily: 'sans-serif',
                      textAlign: 'left',
                    }}
                  >
                    Delivery on Time
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: '0.875rem', md: '0.9375rem' },
                      color: '#000',
                      lineHeight: 1.7,
                      fontFamily: 'sans-serif',
                      textAlign: 'left',
                    }}
                  >
                    Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches.
                  </Typography>
                </Box>
              </motion.div>
            </Box>
          </Grid>

          {/* Middle Column - Car Wireframe Image */}
          {/* @ts-ignore - MUI v7.3.5 still uses old Grid API, item prop will be removed in future versions */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  py: { xs: 4, md: 6 },
                }}
              >
                <Box
                  component="img"
                  src="/JS Car Wash Images/gtr-1.png"
                  alt="Car Wireframe"
                  sx={{
                    width: '100%',
                    maxWidth: { xs: '300px', md: '400px' },
                    height: 'auto',
                    objectFit: 'contain',
                    filter: 'opacity(0.9)',
                  }}
                />
              </Box>
            </motion.div>
          </Grid>

          {/* Right Column - Two Feature Blocks */}
          {/* @ts-ignore - MUI v7.3.5 still uses old Grid API, item prop will be removed in future versions */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 4, md: 5 } }}>
              {/* Quality Products */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                  <Box
                    sx={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: '#d32f2f',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2.5,
                    }}
                  >
                    <Settings sx={{ color: '#ffffff', fontSize: '2rem' }} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 1.5,
                      color: '#000',
                      fontSize: { xs: '1.125rem', md: '1.25rem' },
                      fontFamily: 'sans-serif',
                      textAlign: 'left',
                    }}
                  >
                    Quality Products
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: '0.875rem', md: '0.9375rem' },
                      color: '#000',
                      lineHeight: 1.7,
                      fontFamily: 'sans-serif',
                      textAlign: 'left',
                    }}
                  >
                    Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches.
                  </Typography>
                </Box>
              </motion.div>

              {/* Manufacturing Unit */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                  <Box
                    sx={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: '#d32f2f',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2.5,
                    }}
                  >
                    <CheckCircle sx={{ color: '#ffffff', fontSize: '2rem' }} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 1.5,
                      color: '#000',
                      fontSize: { xs: '1.125rem', md: '1.25rem' },
                      fontFamily: 'sans-serif',
                      textAlign: 'left',
                    }}
                  >
                    Manufacturing Unit
        </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: '0.875rem', md: '0.9375rem' },
                      color: '#000',
                      lineHeight: 1.7,
                      fontFamily: 'sans-serif',
                      textAlign: 'left',
                    }}
                  >
                    Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches.
        </Typography>
      </Box>
              </motion.div>
            </Box>
          </Grid>
        </Grid>
    </Container>
    </Box>
  )
}

export default AboutPage
