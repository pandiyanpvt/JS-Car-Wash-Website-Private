import { Box, Container, Typography } from '@mui/material'

function AboutPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body1">
          Learn more about JS Car Wash & Detailing
        </Typography>
      </Box>
    </Container>
  )
}

export default AboutPage

