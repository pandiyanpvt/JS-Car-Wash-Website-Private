import { Box, Container, Typography } from '@mui/material'

function BookCarDetailing() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Book Car Detailing
        </Typography>
        <Typography variant="body1">
          Schedule your car detailing service
        </Typography>
      </Box>
    </Container>
  )
}

export default BookCarDetailing

