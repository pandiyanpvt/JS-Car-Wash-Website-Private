import { Box, Container, Typography } from '@mui/material'

function BookCarWash() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Book Car Wash
        </Typography>
        <Typography variant="body1">
          Schedule your car wash service
        </Typography>
      </Box>
    </Container>
  )
}

export default BookCarWash

