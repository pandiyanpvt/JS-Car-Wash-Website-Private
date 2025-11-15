import { Box, Container, Typography } from '@mui/material'

function TermsPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Terms & Conditions / Privacy Policy
        </Typography>
        <Typography variant="body1">
          Read our terms and conditions and privacy policy
        </Typography>
      </Box>
    </Container>
  )
}

export default TermsPage

