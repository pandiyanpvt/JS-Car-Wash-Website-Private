import { Box, Container, Typography } from '@mui/material'

function Branch1() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Branch 1 - Booking
        </Typography>
        <Typography variant="body1">
          Book services at Branch 1
        </Typography>
      </Box>
    </Container>
  )
}

export default Branch1

