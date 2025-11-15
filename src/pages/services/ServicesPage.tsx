import { Box, Container, Typography } from '@mui/material'

function ServicesPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Our Services
        </Typography>
        <Typography variant="body1">
          Explore our car wash and detailing services
        </Typography>
      </Box>
    </Container>
  )
}

export default ServicesPage

