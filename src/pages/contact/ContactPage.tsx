import { Box, Container, Typography } from '@mui/material'

function ContactPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1">
          Get in touch with us
        </Typography>
      </Box>
    </Container>
  )
}

export default ContactPage

