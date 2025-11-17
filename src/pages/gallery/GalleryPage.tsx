import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FooterPage } from '../footer'
import './GalleryPage.css'

// Gallery page component with navbar, gallery cards, and footer

interface GalleryImage {
  id: number
  src: string
  alt: string
  title?: string
}

function GalleryPage() {
  const menuItems = [
    { label: 'Home', href: '/', isRoute: true },
    { label: 'About Us', href: '#about', isRoute: false },
    { label: 'Services', href: '#services', isRoute: false },
    { label: 'Gallery', href: '/gallery', isRoute: true },
    { label: 'Contact Us', href: '#contact', isRoute: false }
  ]

  const galleryImages: GalleryImage[] = [
    { id: 1, src: '/JS Car Wash Images/02-min.jpg', alt: 'Car Wash Service 1' },
    { id: 2, src: '/JS Car Wash Images/03-min.jpg', alt: 'Car Wash Service 2' },
    { id: 3, src: '/JS Car Wash Images/04-min.jpg', alt: 'Car Wash Service 3' },
    { id: 4, src: '/JS Car Wash Images/05-min.jpg', alt: 'Car Wash Service 4' },
    { id: 5, src: '/JS Car Wash Images/06-min.jpg', alt: 'Car Wash Service 5' },
    { id: 6, src: '/JS Car Wash Images/07-min.jpg', alt: 'Car Wash Service 6' },
    { id: 7, src: '/JS Car Wash Images/08-min.jpg', alt: 'Car Wash Service 7' },
    { id: 8, src: '/JS Car Wash Images/10-min.jpg', alt: 'Car Wash Service 8' },
    { id: 9, src: '/JS Car Wash Images/11-min.jpg', alt: 'Car Wash Service 9' },
    { id: 10, src: '/JS Car Wash Images/12-min.jpg', alt: 'Car Wash Service 10' },
    { id: 11, src: '/JS Car Wash Images/13-min.jpg', alt: 'Car Wash Service 11' },
    { id: 12, src: '/JS Car Wash Images/14-min.jpg', alt: 'Car Wash Service 12' },
    { id: 13, src: '/JS Car Wash Images/15-min.jpg', alt: 'Car Wash Service 13' },
    { id: 14, src: '/JS Car Wash Images/16-min.jpg', alt: 'Car Wash Service 14' },
    { id: 15, src: '/JS Car Wash Images/17-min.jpg', alt: 'Car Wash Service 15' },
    { id: 16, src: '/JS Car Wash Images/18-min.jpg', alt: 'Car Wash Service 16' },
    { id: 17, src: '/JS Car Wash Images/19-890x664-1.jpg', alt: 'Car Wash Service 17' },
    { id: 18, src: '/JS Car Wash Images/20-890x664-1.jpg', alt: 'Car Wash Service 18' },
    { id: 19, src: '/JS Car Wash Images/21-890x664-1.jpg', alt: 'Car Wash Service 19' },
    { id: 20, src: '/JS Car Wash Images/23-890x664-1.jpg', alt: 'Car Wash Service 20' },
    { id: 21, src: '/JS Car Wash Images/24-890x664-1.jpg', alt: 'Car Wash Service 21' },
    { id: 22, src: '/JS Car Wash Images/25-890x664-1.jpg', alt: 'Car Wash Service 22' },
    { id: 23, src: '/JS Car Wash Images/corvette-v100-1024x545-1.jpg', alt: 'Car Detailing' },
    { id: 24, src: '/JS Car Wash Images/services2-890x664-1.jpg', alt: 'Car Services' }
  ]

  return (
    <div className="gallery-page">
      {/* Navbar */}
      <nav className="gallery-navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <Link to="/">
              <img src="/JS Car Wash Images/cropped-fghfthgf.png" alt="JS Car Wash Logo" className="logo-img" />
            </Link>
          </div>
          
          <ul className="navbar-menu">
            {menuItems.map((item, index) => (
              <li key={index} className="navbar-menu-item">
                {item.isRoute ? (
                  <Link to={item.href} className="navbar-link">
                    {item.label}
                  </Link>
                ) : (
                  <a href={item.href} className="navbar-link">
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Gallery Header */}
      <section className="gallery-header">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="gallery-header-content"
          >
            <p className="gallery-subtitle">JS CAR WASH</p>
            <h1 className="gallery-title">
              Our <span className="gallery-title-accent">Gallery</span>
            </h1>
            <div className="gallery-lines">
              <div className="gallery-line gallery-line-red"></div>
              <div className="gallery-line gallery-line-red"></div>
              <div className="gallery-line gallery-line-red"></div>
            </div>
            <p className="gallery-description">
              Explore our collection of before & after photos showcasing our professional car wash and detailing services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="gallery-section">
        <div className="container">
          <div className="gallery-grid">
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                className="gallery-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
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

      {/* Footer */}
      <FooterPage />
    </div>
  )
}

export default GalleryPage
