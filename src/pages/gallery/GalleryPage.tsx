import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FooterPage } from '../footer'
import Navbar from '../../components/navbar/Navbar'
import { galleryApi } from '../../services/api'
import SEO from '../../components/SEO'
import './GalleryPage.css'

interface GalleryImage {
  id: number
  src: string
  alt: string
}

function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await galleryApi.getGallery()
        if (response.success && response.data) {
          const activeImages = response.data
            .filter(item => item.is_active)
            .map(item => ({
              id: item.id,
              src: item.img_url,
              alt: `Gallery Image ${item.id}`
            }))
          setGalleryImages(activeImages)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load gallery images'
        setError(errorMessage)
        console.error('Error fetching gallery:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [])

  const getCurrentImageIndex = () => {
    if (!selectedImage) return -1
    return galleryImages.findIndex(img => img.id === selectedImage.id)
  }

  const handlePrevious = () => {
    const currentIndex = getCurrentImageIndex()
    if (currentIndex > 0) {
      setSelectedImage(galleryImages[currentIndex - 1])
    } else {
      setSelectedImage(galleryImages[galleryImages.length - 1])
    }
  }

  const handleNext = () => {
    const currentIndex = getCurrentImageIndex()
    if (currentIndex < galleryImages.length - 1) {
      setSelectedImage(galleryImages[currentIndex + 1])
    } else {
      setSelectedImage(galleryImages[0])
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return

      if (e.key === 'Escape') {
        setSelectedImage(null)
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id)
        if (currentIndex > 0) {
          setSelectedImage(galleryImages[currentIndex - 1])
        } else {
          setSelectedImage(galleryImages[galleryImages.length - 1])
        }
      } else if (e.key === 'ArrowRight') {
        const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id)
        if (currentIndex < galleryImages.length - 1) {
          setSelectedImage(galleryImages[currentIndex + 1])
        } else {
          setSelectedImage(galleryImages[0])
        }
      }
    }

    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [selectedImage, galleryImages])

  return (
    <div className="gallery-page">
      <SEO
        title="Photo Gallery | JS Car Wash Results"
        description="Browse through our gallery of professional car wash and detailing results. See the premium finish we provide to every vehicle."
        canonical="https://www.jscarwash.com/gallery"
      />
      <Navbar className="fixed-navbar" hideLogo={true} />
      {/* Page Heading Section */}
      <section className="page-heading-section">
        <div className="page-heading-overlay"></div>
        <div className="page-heading-content">
          <h1 className="page-heading-title">Gallery</h1>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="gallery-section">
        <div className="gallery-container-full">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '1.125rem', color: '#666' }}>Loading gallery...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '1.125rem', color: '#dc3545' }}>{error}</p>
            </div>
          ) : galleryImages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '1.125rem', color: '#666' }}>No gallery images available.</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  className="gallery-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="gallery-card-image-wrapper">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="gallery-card-image"
                      loading="lazy"
                    />
                    <div className="gallery-card-overlay">
                      <div className="gallery-card-content">
                        <h3 className="gallery-card-title">{image.alt}</h3>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="gallery-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="gallery-lightbox-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="gallery-lightbox-close"
                onClick={() => setSelectedImage(null)}
                aria-label="Close lightbox"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                className="gallery-lightbox-prev"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrevious()
                }}
                aria-label="Previous image"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                className="gallery-lightbox-next"
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                aria-label="Next image"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="gallery-lightbox-image"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <FooterPage />
    </div>
  )
}

export default GalleryPage
