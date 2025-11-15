import { Box, Container, Typography } from '@mui/material'

function CarWash() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Car Wash Services
        </Typography>
        <Typography variant="body1">
          Professional car wash services
        </Typography>
      </Box>
    </Container>
  )
}

export default CarWash

