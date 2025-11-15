import { Box, Container, Typography } from '@mui/material'

function Branch2() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Branch 2 - Booking
        </Typography>
        <Typography variant="body1">
          Book services at Branch 2
        </Typography>
      </Box>
    </Container>
  )
}

export default Branch2

