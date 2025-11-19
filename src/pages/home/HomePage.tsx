import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FooterPage } from '../footer'
import Navbar from '../../components/navbar/Navbar'
import './HomePage.css'

interface HomePageProps {}

function HomePage({}: HomePageProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [menuOpen, setMenuOpen] = useState(false)
  const totalPages = 6

  // Services data
  const services = [
    'Hand Polish',
    'Clay Bar',
    'Headlight Restoration',
    'Car Wash',
    'Headlight Polish',
    'Buff Polish',
    'Leather Clean',
    'Carpet Steam Clean',
    'Sticker Removal',
    'Vacuum Process (Pet hair & Sand)',
    'Seats & Mats Steam',
    'Full Duco Hand Wax Polish',
    'Clean and Wipe Door Trims',
    'Clean and Wipe Dashboard and Console',
    'Interior Windows and Mirrors Clean',
    'Wipe Door and Boot Jambs',
    'Vacuum Seats and Boot',
    'Vacuum Interior Floor Mats and Footwells',
    'Bugs & Tar Removal',
    'Mag wheel wash process',
    'Exterior windows and side mirrors clean',
    'High – Pressure – rinse',
    'Exterior Wash with pH neutral shampoo and Tyre Shine'
  ]

  const serviceImageMap: { [key: string]: string } = {
    'Hand Polish': 'Hand Polish.jpg',
    'Clay Bar': 'Clay Bar.jpg',
    'Headlight Restoration': 'Headlight Restoration.jpg',
    'Car Wash': 'Car Wash.png',
    'Headlight Polish': 'Headlight Polish.jpg',
    'Buff Polish': 'Buff Polish.jpg',
    'Leather Clean': 'Leather Clean.png',
    'Carpet Steam Clean': 'Carpet Steam Clean.jpg',
    'Sticker Removal': 'Sticker Removal.jpg',
    'Vacuum Process (Pet hair & Sand)': 'Vacuum Process (Pet hair & Sand).png',
    'Seats & Mats Steam': 'Seats & Mats Steam.jpg',
    'Full Duco Hand Wax Polish': 'Full Duco Hand Wax Polish.jpg',
    'Clean and Wipe Door Trims': 'Clean and Wipe Door Trims.jpg',
    'Clean and Wipe Dashboard and Console': 'Clean and Wipe Dashboard and Console.png',
    'Interior Windows and Mirrors Clean': 'Interior Windows and Mirrors Clean.jpg',
    'Wipe Door and Boot Jambs': 'Wipe Door and Boot Jambs.png',
    'Vacuum Seats and Boot': 'Vacuum Seats and Boot.png',
    'Vacuum Interior Floor Mats and Footwells': 'Vacuum Interior Floor Mats and Footwells.png',
    'Bugs & Tar Removal': 'Bugs & Tar Removal.png',
    'Mag wheel wash process': 'Mag wheel wash process.png',
    'Exterior windows and side mirrors clean': 'Exterior windows and side mirrors clean.jpg',
    'High – Pressure – rinse': 'High – Pressure – rinse.png',
    'Exterior Wash with pH neutral shampoo and Tyre Shine': 'Exterior Wash with pH neutral shampoo.png'
  }

  // Carousel state
  const [scrollPosition, setScrollPosition] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const scrollSpeed = 2 // pixels per frame
  const animationFrameRef = useRef<number | undefined>(undefined)

  // Create duplicated services for seamless loop
  const duplicatedServices = [...services, ...services, ...services]

  useEffect(() => {
    const animate = () => {
      setScrollPosition((prev) => {
        const cardWidth = 280 + 32 // card width + gap
        const totalWidth = services.length * cardWidth
        // Reset position when we've scrolled through one full set
        if (prev >= totalWidth) {
          return 0
        }
        return prev + scrollSpeed
      })
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [services.length, scrollSpeed])

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : totalPages))
  }

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : 1))
  }

  const getIconSVG = (iconName: string) => {
    const icons: { [key: string]: string } = {
      home: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
      info: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
      build: 'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z',
      photo: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',
      contact: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
      menu: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
      close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
      arrowForward: 'M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z',
      arrowBack: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
      play: 'M8 5v14l11-7z',
      keyboardArrowDown: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z'
    }
    return icons[iconName] || icons.home
  }

  return (
    <div className="home-page">
      {/* Merged Header and Main Container */}
      <div className="home-header-container">
        {/* Header with Hamburger and Logo - Split Design */}
        <header className="home-header">
        {/* Left 50% - White Background */}
        <div className="header-left-section">
          <button
            className="header-hamburger-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg className="header-menu-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d={getIconSVG('menu')} />
            </svg>
          </button>
        </div>

        {/* Right 50% - Dark Background with Red Line */}
        <div className="header-right-section">
          <div className="header-red-line"></div>
          <div className="header-brand">
            <button className="header-dealers-btn">
              DEALERS
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Navbar Modal */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="navbar-backdrop"
              onClick={() => setMenuOpen(false)}
            />

            {/* Navbar Container with Animation */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0, x: '-50%', y: 0 }}
              animate={{ scaleX: 1, opacity: 1, x: '-50%', y: 0 }}
              exit={{ scaleX: 0, opacity: 0, x: '-50%', y: 0 }}
              transition={{ 
                duration: 0.4,
                ease: 'easeInOut'
              }}
              style={{
                position: 'fixed',
                left: '50%',
                top: '20px',
                transformOrigin: 'center center',
                zIndex: 1200,
                pointerEvents: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Navbar onNavigate={() => setMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="home-page-container">
        {/* Left Section - White Background (2/3) */}
        <div className="home-left-section">
          {/* Vertical Bar on Left Edge - Dark Panel */}
          <div className="vertical-bar">
            <div className="vertical-bar-content">
              <p className="vertical-bar-text">DISCOVER MODELS</p>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <svg className="icon-keyboard-arrow-down" viewBox="0 0 24 24" fill="currentColor">
                  <path d={getIconSVG('keyboardArrowDown')} />
                </svg>
              </motion.div>
            </div>
          </div>

          {/* Main Content */}
          <div className="home-main-content">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="logo-wrapper">
                <img
                  src="/JS Car Wash Images/cropped-fghfthgf.png"
                  alt="Logo"
                  className="logo-img"
                />
              </div>
            </motion.div>

            {/* JS Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="js-text">JS</h1>
            </motion.div>

            {/* CAR WASH & DETAILING Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h2 className="car-wash-text">CAR WASH & DETAILING</h2>
            </motion.div>

            {/* Car Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="car-image-wrapper"
            >
              <img
                src="/JS Car Wash Images/kindpng_4272437.png"
                alt="Car"
                className="car-image"
              />
            </motion.div>

            {/* BOOK NOW Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button className="book-now-btn">BOOK NOW</button>
            </motion.div>
          </div>
        </div>

        {/* Right Section - Dark Blue Background (1/3) */}
        <div className="home-right-section">
          <div className="right-section-wrapper">
            <div className="right-section-content">
              {/* Red Vertical Line */}
              <div className="red-vertical-line"></div>

              {/* Top Content */}
              <div className="right-top-content">
                  {/* Headline */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="headline-wrapper">
                      <div className="headline-bar"></div>
                      <h3 className="headline-text">SHINEUP YOUR CAR TO NEXT LEVEL</h3>
                    </div>
                  </motion.div>

                  {/* Description Text */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <p className="description-text">
                      JS Car Wash is Australia's premier professional hand wash and detailing provider. 
                      For over 10 years, JS Car Wash has been a family-owned, private company that thrives 
                      in an atmosphere of determination and innovation. We take pride in offering unparalleled service, 
                      ensuring that every customer leaves with that new car feeling. JS Car Wash is dedicated to making 
                      car cleaning an affordable and convenient experience.
                    </p>
                  </motion.div>

                  {/* Video Player */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <div className="video-player">
                      <div className="play-button">
                        <svg className="play-icon" viewBox="0 0 24 24" fill="currentColor">
                          <path d={getIconSVG('play')} />
                        </svg>
                      </div>
                      <p className="watch-video-text">WATCH VIDEO</p>
                    </div>
                  </motion.div>

                  {/* Configure Link */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <div className="configure-link">
                      <span className="configure-text">CONFIGURE YOUR ROLL-ROYCE</span>
                      <svg className="arrow-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d={getIconSVG('arrowForward')} />
                      </svg>
                    </div>
                  </motion.div>
                </div>

                {/* Bottom Pagination - Centered */}
                <div className="pagination">
                  <button className="pagination-btn" onClick={handlePrev}>
                    <svg className="pagination-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d={getIconSVG('arrowBack')} />
                    </svg>
                  </button>
                  <span className="pagination-text">
                    {String(currentPage).padStart(2, '0')}/{String(totalPages).padStart(2, '0')}
                  </span>
                  <button className="pagination-btn" onClick={handleNext}>
                    <svg className="pagination-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d={getIconSVG('arrowForward')} />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section className="home-services-section">
        <div className="home-services-container">
          <div className="home-services-header">
            <div className="home-services-header-left">
              <p className="home-services-subtitle">PROVIDING ALL TYPES OF</p>
              <h2 className="home-services-title">
                Car Wash <span className="home-services-title-red">& Detailing</span> Services
              </h2>
              <div className="home-services-title-underline">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>

          <div className="home-services-cards-wrapper">
            <div 
              className="home-services-cards-carousel"
              ref={carouselRef}
              style={{
                transform: `translateX(-${scrollPosition}px)`
              }}
            >
              {duplicatedServices.map((serviceName, index) => {
                const imageFile = serviceImageMap[serviceName] || `${serviceName.toLowerCase().replace(/\s+/g, '-').replace(/[&()]/g, '').replace(/,/g, '')}.jpg`
                const imagePath = `/JS Car Wash Images/${imageFile}`

                return (
                  <motion.div
                    key={`${serviceName}-${index}`}
                    className="home-service-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * (index % services.length) }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="home-service-card-image">
                      <img src={imagePath} alt={serviceName} />
                    </div>
                    <h3 className="home-service-card-title">{serviceName}</h3>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Banner Section */}
      <section className="home-features-banner">
        <div className="home-features-container">
          <div className="home-feature-item">
            <div className="home-feature-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="home-feature-text">100% Hand Washed</p>
          </div>
          <div className="home-feature-item">
            <div className="home-feature-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="home-feature-text">Quality Guaranteed</p>
          </div>
          <div className="home-feature-item">
            <div className="home-feature-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="home-feature-text">5K+ Cars Cleaned</p>
          </div>
        </div>
      </section>

      {/* Full-Service Detailing Section */}
      <section className="home-detailing-section">
        <div className="home-detailing-container">
          {/* Left Section - Image */}
          <div className="home-detailing-left">
            <div className="home-detailing-image-wrapper">
              <div className="home-detailing-photo">
                <img src="/JS Car Wash Images/5659.png" alt="Car Detailing" />
              </div>
            </div>
          </div>

          {/* Right Section - Text Content */}
          <div className="home-detailing-right">
            <div className="home-detailing-content">
              <div className="home-detailing-icon">
                <img src="/JS Car Wash Images/Icon-title-lager.svg" alt="Icon" />
              </div>
              <div className="home-detailing-dashes">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <h2 className="home-detailing-title">Full-Service Detailing for Cars</h2>
              <p className="home-detailing-text">
                Our car wash facilities feature flat-belt, drive-on conveyors that are gentle on all finishes and safe for exotics, dual tires & lowered vehicles. Our dedicated crew will have your car clean, dry, and shiny depending on your car for full service, or if you prefer to DIY, our free vacuums, compressed air, and towels make it easy to get your vehicle admired by everyone on the road.
              </p>
              <p className="home-detailing-text">
                Need a deeper clean? We also offer JS Mini detailing options at Dubbo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How To Book Online Section */}
      <section className="home-book-online-section">
        <div className="home-book-online-container">
          <div className="home-book-online-header">
            <p className="home-book-online-subtitle">HOW IT WORKS</p>
            <h2 className="home-book-online-title">
              How To Book <span className="home-book-online-title-red">Online</span>
            </h2>
            <div className="home-book-online-dashes">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className="home-book-online-steps">
            <div className="home-book-online-step">
              <div className="home-book-online-step-number">01</div>
              <h3 className="home-book-online-step-title">Choose A Service</h3>
              <p className="home-book-online-step-description">
                Explore our services, from basic washes to full detailing and paint protection.
              </p>
            </div>

            <div className="home-book-online-step">
              <div className="home-book-online-step-number">02</div>
              <h3 className="home-book-online-step-title">Select Date & Time</h3>
              <p className="home-book-online-step-description">
                Open 7 days a week (check location page for actual opening hours)
              </p>
            </div>

            <div className="home-book-online-step">
              <div className="home-book-online-step-number">03</div>
              <h3 className="home-book-online-step-title">Arrive On Time</h3>
              <p className="home-book-online-step-description">
                Our staff will be ready and waiting to make your car look like new again.
              </p>
            </div>
          </div>

          <div className="home-book-online-actions">
            <button className="book-now-btn">BOOK NOW</button>
          </div>
        </div>
      </section>

      <FooterPage />
    </div>
  )
}

export default HomePage
