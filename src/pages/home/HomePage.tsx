import { Box, Container, Typography } from '@mui/material'

function HomePage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Home Page
        </Typography>
        <Typography variant="body1">
          Welcome to JS Car Wash & Detailing
        </Typography>
      </Box>
    </Container>
  )
}

export default HomePage

