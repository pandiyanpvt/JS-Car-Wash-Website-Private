import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FooterPage } from '../footer'
import Navbar from '../../components/navbar/Navbar'
import './GalleryPage.css'

// Gallery page component with navbar, gallery cards, and footer

interface GalleryImage {
  id: number
  src: string
  alt: string
  title?: string
}

function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  const galleryImages: GalleryImage[] = [
    { id: 1, src: '/Gallery/01-min.png', alt: 'Car Wash Service 1' },
    { id: 2, src: '/Gallery/02-min.jpg', alt: 'Car Wash Service 2' },
    { id: 3, src: '/Gallery/03-min.jpg', alt: 'Car Wash Service 3' },
    { id: 4, src: '/Gallery/04-min.jpg', alt: 'Car Wash Service 4' },
    { id: 5, src: '/Gallery/05-min.jpg', alt: 'Car Wash Service 5' },
    { id: 6, src: '/Gallery/06-min.jpg', alt: 'Car Wash Service 6' },
    { id: 7, src: '/Gallery/07-min.jpg', alt: 'Car Wash Service 7' },
    { id: 8, src: '/Gallery/08-min.jpg', alt: 'Car Wash Service 8' },
    { id: 9, src: '/Gallery/10-min.jpg', alt: 'Car Wash Service 9' },
    { id: 10, src: '/Gallery/11-min.jpg', alt: 'Car Wash Service 10' },
    { id: 11, src: '/Gallery/12-min.jpg', alt: 'Car Wash Service 11' },
    { id: 12, src: '/Gallery/13-min.jpg', alt: 'Car Wash Service 12' },
    { id: 13, src: '/Gallery/14-min.jpg', alt: 'Car Wash Service 13' },
    { id: 14, src: '/Gallery/15-min.jpg', alt: 'Car Wash Service 14' },
    { id: 15, src: '/Gallery/16-min.jpg', alt: 'Car Wash Service 15' },
    { id: 16, src: '/Gallery/17-min.jpg', alt: 'Car Wash Service 16' },
    { id: 17, src: '/Gallery/18-min.jpg', alt: 'Car Wash Service 17' }
  ]

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
        handlePrevious()
      } else if (e.key === 'ArrowRight') {
        handleNext()
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
  }, [selectedImage])

  return (
    <div className="gallery-page">
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
            onClick={() => setSelectedImage(null)}
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
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="gallery-lightbox-image"
              />
              <div className="gallery-lightbox-title">
                <h3>{selectedImage.alt}</h3>
              </div>
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
