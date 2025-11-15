import { Box, Container, Typography } from '@mui/material'

function TestimonialsPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Testimonials / Reviews
        </Typography>
        <Typography variant="body1">
          Read what our customers say about us
        </Typography>
      </Box>
    </Container>
  )
}

export default TestimonialsPage

