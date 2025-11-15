import { Box, Container, Typography } from '@mui/material'

function CarDetailing() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Car Detailing Services
        </Typography>
        <Typography variant="body1">
          Premium car detailing services
        </Typography>
      </Box>
    </Container>
  )
}

export default CarDetailing

