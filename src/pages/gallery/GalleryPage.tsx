import { Box, Container, Typography } from '@mui/material'

function GalleryPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Gallery / Before & After
        </Typography>
        <Typography variant="body1">
          View our work gallery and before & after photos
        </Typography>
      </Box>
    </Container>
  )
}

export default GalleryPage

