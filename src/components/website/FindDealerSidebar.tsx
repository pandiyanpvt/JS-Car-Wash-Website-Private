import { Box, Typography, Button, IconButton } from '@mui/material'
import { Close as CloseIcon, LocationOn } from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'

interface FindDealerSidebarProps {
  open: boolean
  onClose: () => void
  isDesktop?: boolean
}

function FindDealerSidebar({ open, onClose, isDesktop = false }: FindDealerSidebarProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1200,
            }}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              opacity: { duration: 0.4, ease: 'easeInOut' },
            }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: isDesktop ? '33.333%' : '100%',
              height: '100vh',
              backgroundColor: '#ffffff',
              zIndex: 1300,
              overflowY: 'auto',
              boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100%',
                p: 4,
              }}
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '1.5rem',
                      fontWeight: 400,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: '#000',
                    }}
                  >
                    FIND YOUR DEALER
                  </Typography>
                  <IconButton
                    onClick={onClose}
                    sx={{
                      color: '#000',
                      padding: '8px',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </motion.div>

              {/* Map Placeholder */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '300px',
                    backgroundColor: '#e8e8e8',
                    borderRadius: '8px',
                    mb: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Typography
                    sx={{
                      color: '#999',
                      fontSize: '0.875rem',
                      fontStyle: 'italic',
                      fontFamily: 'sans-serif',
                    }}
                  >
                    Map Placeholder
                  </Typography>
                </Box>
              </motion.div>

              {/* Dealer Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Box sx={{ mb: 4 }}>
                  <Typography
                    sx={{
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      color: '#000',
                      mb: 1,
                      textTransform: 'uppercase',
                      fontFamily: 'sans-serif',
                    }}
                  >
                    ROLLS-ROYCE MOTOR CARS
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 400,
                      color: '#000',
                      mb: 2,
                      textTransform: 'uppercase',
                      fontFamily: 'sans-serif',
                    }}
                  >
                    SERVICE MILANO
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1,
                    }}
                  >
                    <LocationOn
                      sx={{
                        color: '#000',
                        fontSize: '1.25rem',
                        mt: 0.25,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: '0.9375rem',
                        color: '#000',
                        lineHeight: 1.6,
                        fontFamily: 'sans-serif',
                        fontWeight: 400,
                      }}
                    >
                      Via Della Ghisone Europea 1,<br />
                      San Donato-Milanese, 20097
                    </Typography>
                  </Box>
                </Box>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mt: 'auto',
                    pt: 2,
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outlined"
                      fullWidth
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
                        '&:hover': {
                          borderColor: '#000',
                          backgroundColor: '#000',
                          color: '#fff',
                        },
                      }}
                    >
                      GET DIRECTIONS
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outlined"
                      fullWidth
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
                        '&:hover': {
                          borderColor: '#000',
                          backgroundColor: '#000',
                          color: '#fff',
                        },
                      }}
                    >
                      REQUEST CALLBACK
                    </Button>
                  </motion.div>
                </Box>
              </motion.div>
            </Box>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default FindDealerSidebar

