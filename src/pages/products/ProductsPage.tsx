import { Box, Container, Typography } from '@mui/material'

function ProductsPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Products
        </Typography>
        <Typography variant="body1">
          Browse our car care products
        </Typography>
      </Box>
    </Container>
  )
}

export default ProductsPage

