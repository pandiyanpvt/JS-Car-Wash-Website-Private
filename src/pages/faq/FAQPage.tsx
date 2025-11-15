import { Box, Container, Typography } from '@mui/material'

function FAQPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          FAQ
        </Typography>
        <Typography variant="body1">
          Frequently asked questions
        </Typography>
      </Box>
    </Container>
  )
}

export default FAQPage

