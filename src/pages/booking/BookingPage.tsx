import { Box, Container, Typography } from '@mui/material'

function BookingPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Booking / Schedule
        </Typography>
        <Typography variant="body1">
          Book your car wash or detailing service
        </Typography>
      </Box>
    </Container>
  )
}

export default BookingPage

