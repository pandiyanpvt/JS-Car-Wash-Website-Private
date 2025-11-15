import { Box, Container, Typography } from '@mui/material'

function OffersPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Offers / Promotions
        </Typography>
        <Typography variant="body1">
          Check out our current offers and promotions
        </Typography>
      </Box>
    </Container>
  )
}

export default OffersPage

