import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FooterPage } from '../footer'
import { useNavbar } from '../../contexts/NavbarContext'
import './HomePage.css'

interface HomePageProps {}

function HomePage({}: HomePageProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [modelsShow, setModelsShow] = useState(false)
  const [dealersShow, setDealersShow] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [faqClickedIndex, setFaqClickedIndex] = useState<number | null>(null)
  const [showNavbar, setShowNavbar] = useState(false)
  const headerContainerRef = useRef<HTMLDivElement>(null)
  const pageContainerRef = useRef<HTMLDivElement>(null)
  const [containerPosition, setContainerPosition] = useState({ top: 0, left: 0, width: 0, height: 0 })
  const totalPages = 6
  const navigate = useNavigate()
  const { setIsVisible } = useNavbar()

  // Branches data - memoized
  const branches = useMemo(() => [
    {
      name: 'JS CAR WASH',
      subtitle: 'SERVICE DUBBO',
      address: '66-72 Windsor parade, Dubbo, 2830, NSW',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d431895.0726953198!2d148.631!3d-32.253232!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b0f734ad0c1d615%3A0xe2dddee3b54e4e93!2sJS%20Car%20Wash%20and%20Detailing!5e0!3m2!1sen!2sus!4v1763647268513!5m2!1sen!2sus'
    },
    {
      name: 'JS CAR WASH',
      subtitle: 'SERVICE DUBBO',
      address: '66-72 Windsor parade, Dubbo, 2830, NSW',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d431895.0726953198!2d148.631!3d-32.253232!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b0f734ad0c1d615%3A0xe2dddee3b54e4e93!2sJS%20Car%20Wash%20and%20Detailing!5e0!3m2!1sen!2sus!4v1763647268513!5m2!1sen!2sus'
    }
  ], [])


  // Hide navbar initially on HomePage
  useEffect(() => {
    setIsVisible(false)
    
    return () => {
      // Reset navbar visibility when leaving homepage
      setIsVisible(true)
    }
  }, [setIsVisible])

  // Show/hide navbar on scroll - hide until scrolling past entire home-page-container
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const headerHeight = headerContainerRef.current?.offsetHeight || 0
      const pageContainer = pageContainerRef.current
      
      // Show navbar when scrolled past the header section (for local header navbar)
      if (scrollY > headerHeight * 0.5) {
        setShowNavbar(true)
      } else {
        setShowNavbar(false)
      }

      // Control global navbar visibility - only show after scrolling past entire home-page-container
      if (pageContainer) {
        const containerTop = pageContainer.offsetTop
        const containerHeight = pageContainer.offsetHeight
        const containerBottom = containerTop + containerHeight
        
        // Show navbar when user has scrolled past the entire home-page-container
        if (scrollY >= containerBottom) {
          setIsVisible(true)
        } else {
          setIsVisible(false)
        }
      }
    }

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      handleScroll()
    }, 100)

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [setIsVisible])

  // Services data - memoized
  const services = useMemo(() => [
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
  ], [])

  const serviceImageMap: { [key: string]: string } = useMemo(() => ({
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
  }), [])

  // Carousel state - use ref to avoid state updates
  const scrollPositionRef = useRef(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const scrollSpeed = 2 // pixels per frame
  const animationFrameRef = useRef<number | undefined>(undefined)
  const lastUpdateTimeRef = useRef(0)
  const throttleDelay = 16 // ~60fps

  // Create duplicated services for seamless loop - memoized
  const duplicatedServices = useMemo(() => [...services, ...services, ...services], [services])

  // Optimized carousel animation using direct DOM manipulation instead of state updates
  useEffect(() => {
    const cardWidth = 280 + 32 // card width + gap
    const totalWidth = services.length * cardWidth

    const animate = (currentTime: number) => {
      // Throttle updates to ~60fps
      if (currentTime - lastUpdateTimeRef.current >= throttleDelay) {
        scrollPositionRef.current += scrollSpeed
        
        // Reset position when we've scrolled through one full set
        if (scrollPositionRef.current >= totalWidth) {
          scrollPositionRef.current = 0
        }

        // Direct DOM manipulation for better performance
        if (carouselRef.current) {
          carouselRef.current.style.transform = `translateX(-${scrollPositionRef.current}px)`
        }
        
        lastUpdateTimeRef.current = currentTime
      }
      
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [services.length, scrollSpeed])


  // Update container position for modelshow - with throttling
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let rafId: number | null = null

    const updatePosition = () => {
      if (pageContainerRef.current) {
        const rect = pageContainerRef.current.getBoundingClientRect()
        setContainerPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height
        })
      }
    }

    // Throttled update function
    const throttledUpdate = () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      rafId = requestAnimationFrame(() => {
        updatePosition()
        rafId = null
      })
    }

    // Debounced resize handler
    const debouncedResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(updatePosition, 150)
    }

    updatePosition()
    window.addEventListener('resize', debouncedResize, { passive: true })
    window.addEventListener('scroll', throttledUpdate, { passive: true })

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      window.removeEventListener('resize', debouncedResize)
      window.removeEventListener('scroll', throttledUpdate)
    }
  }, [modelsShow])

  const handleDiscoverModels = () => {
    if (headerContainerRef.current) {
      const rect = headerContainerRef.current.getBoundingClientRect()
      // Check if container is fully visible in viewport
      const isVisible = rect.top >= 0 && rect.top < window.innerHeight && rect.bottom <= window.innerHeight
      
      if (!isVisible) {
        // Scroll to the header container quickly
        headerContainerRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        })
        
        // Reduced wait time for faster response
        setTimeout(() => {
          setModelsShow(true)
        }, 300) // Faster response time
      } else {
        // Already visible, show overlay immediately
        setModelsShow(true)
      }
    } else {
      // Fallback if ref is not available
      setModelsShow(true)
    }
  }

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : totalPages))
  }

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : 1))
  }

  const getIconSVG = useCallback((iconName: string) => {
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
  }, [])


  return (
    <div className="home-page">
      {/* Main Container */}
      <motion.div 
        ref={(el) => {
          headerContainerRef.current = el
          pageContainerRef.current = el
        }}
        className={`home-page-container ${dealersShow ? 'dealers-open' : ''}`}
        style={{
          opacity: modelsShow ? 0 : 1,
          pointerEvents: modelsShow ? 'none' : 'auto'
        }}
      >
        {/* Header with Navbar - Full Width */}
        <div className="home-page-header">
          <div className={`header-navbar-wrapper ${showNavbar ? 'navbar-visible' : 'navbar-hidden'}`}>
          </div>
          
          {/* Split Design - Left and Right Sections */}
          <div className="header-split-sections">
            {/* Left 50% - White Background */}
            <div className="header-left-section">
            </div>

            {/* Right 50% - Dark Background with Red Line */}
            <div className="header-right-section">
              <div className="header-red-line"></div>
              <div className="header-brand">
                <button 
                  className="header-dealers-btn"
                  onClick={() => setDealersShow(true)}
                >
                  BRANCHES
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="home-page-content-wrapper">
          {/* Left Section - White Background (2/3) */}
          <div className="home-left-section">
          {/* Vertical Bar on Left Edge - Dark Panel */}
          <motion.div 
            className="vertical-bar"
            animate={{ 
              x: modelsShow ? '-100%' : 0 
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <div className="vertical-bar-content" onClick={handleDiscoverModels} style={{ cursor: 'pointer' }}>
              <div className="vertical-bar-text-wrapper">
                <p className="vertical-bar-text">DISCOVER MODELS</p>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="vertical-bar-arrow-wrapper"
                >
                  <span className="icon-chevron">{'>'}</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

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
                loading="lazy"
              />
            </motion.div>

            {/* BOOK NOW Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button className="book-now-btn" onClick={() => navigate('/booking')}>BOOK NOW</button>
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
                      in an atmosphere of determination and innovation.
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
                      <span className="configure-text">CONFIGURE YOUR SEDAN</span>
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
      </motion.div>

      {/* Models Show Overlay */}
      <AnimatePresence>
        {modelsShow && (
          <motion.div
            className="modelshow"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: `${containerPosition.top}px`,
              left: `${containerPosition.left}px`,
              width: `${containerPosition.width}px`,
              height: `${containerPosition.height}px`,
              zIndex: 1300,
              backgroundColor: '#ffffff',
              overflowY: 'auto',
              overflowX: 'hidden'
            }}
          >
            {/* Header with Title and Close Button */}
            <div className="modelshow-header">
              {/* Navigation Row */}
              <div className="modelshow-nav-row">
                <h1 className="modelshow-title">CHOOSE YOUR MODEL</h1>
                <button
                  className="modelshow-close-btn"
                  onClick={() => {
                    setIsClosing(true)
                    // Wait for cards to animate out, then close overlay
                    setTimeout(() => {
                      setModelsShow(false)
                      setIsClosing(false)
                    }, 600)
                  }}
                  aria-label="Close models"
                >
                  <svg className="modelshow-close-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d={getIconSVG('close')} />
                  </svg>
                </button>
              </div>
            </div>

            {/* Models Grid */}
            <div className="modelshow-content">
              <div className="modelshow-grid">
                {[
                  { name: 'SEDAN', slogan: 'Classic elegance meets modern comfort.', image: '/JS Car Wash Images/Sedan.png' },
                  { name: 'X-LARGE', slogan: 'Spacious luxury for the whole family.', image: '/JS Car Wash Images/X-Large.png' },
                  { name: 'SUV', slogan: 'Adventure ready, comfort guaranteed.', image: '/JS Car Wash Images/Suv.png' },
                  { name: 'HATCHBACK', slogan: 'Compact style, maximum efficiency.', image: '/JS Car Wash Images/Hatchback.png' },
                  { name: 'WAGON', slogan: 'Versatile space, refined design.', image: '/JS Car Wash Images/Wagon.png' },
                  { name: 'SPORT', slogan: 'Performance meets precision engineering.', image: '/JS Car Wash Images/Sports.png' }
                ].map((model, index) => (
                  <motion.div
                    key={index}
                    className="modelshow-model-card"
                    initial={{ opacity: 0 }}
                    animate={isClosing ? { opacity: 0 } : { opacity: 1 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: isClosing ? (5 - index) * 0.1 : index * 0.15
                    }}
                  >
                    <motion.div 
                      className="modelshow-model-image"
                      initial={{ opacity: 0, x: '100vw' }}
                      animate={isClosing ? { opacity: 0, x: '-100%' } : { opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.8, 
                        delay: isClosing ? (5 - index) * 0.1 : index * 0.15,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                    >
                      <img src={model.image} alt={model.name} loading="lazy" />
                    </motion.div>
                    <h3 className="modelshow-model-name">{model.name}</h3>
                    <p className="modelshow-model-slogan">{model.slogan}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dealers Show Overlay */}
      <AnimatePresence>
        {dealersShow && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="dealersshow-backdrop"
              onClick={() => setDealersShow(false)}
              style={{
                zIndex: 1299
              }}
            />
            {/* Dealers Panel */}
            <motion.div
              className="dealersshow"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Title */}
              <div className="dealersshow-header">
                <div className="dealersshow-nav-row">
                  <h1 className="dealersshow-title">FIND YOUR BRANCH</h1>
                  <button
                    className="dealersshow-close-btn"
                    onClick={() => setDealersShow(false)}
                    aria-label="Close dealers"
                  >
                    <svg className="dealersshow-close-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

            {/* Dealers Content */}
            <div className="dealersshow-content">
              {branches.map((branch, index) => (
                <div key={index} className="dealersshow-branch-item">
                  {/* Branch Title */}
                  <h3 className="dealersshow-branch-title">BRANCH {index + 1}</h3>

                  {/* Map */}
                  <div className="dealersshow-map">
                    <iframe
                      src={branch.mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="dealersshow-map-iframe"
                      title={`${branch.name} - ${branch.subtitle}`}
                    ></iframe>
                  </div>

                  {/* Action Buttons */}
                  <div className="dealersshow-actions">
                    <button className="dealersshow-action-btn primary">GET DIRECTIONS</button>
                    <button className="dealersshow-action-btn secondary">REQUEST CALLBACK</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>

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
            >
              {duplicatedServices.map((serviceName, index) => {
                const imageFile = serviceImageMap[serviceName] || `${serviceName.toLowerCase().replace(/\s+/g, '-').replace(/[&()]/g, '').replace(/,/g, '')}.jpg`
                const imagePath = `/JS Car Wash Images/${imageFile}`

                return (
                  <div
                    key={`${serviceName}-${index}`}
                    className="home-service-card"
                  >
                    <div className="home-service-card-image">
                      <img src={imagePath} alt={serviceName} loading="lazy" />
                    </div>
                    <h3 className="home-service-card-title">{serviceName}</h3>
                  </div>
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
              <i className="fas fa-hand-sparkles"></i>
            </div>
            <p className="home-feature-text">100% Hand Washed</p>
          </div>
          <div className="home-feature-item">
            <div className="home-feature-icon">
              <i className="fas fa-award"></i>
            </div>
            <p className="home-feature-text">Quality Guaranteed</p>
          </div>
          <div className="home-feature-item">
            <div className="home-feature-icon">
              <i className="fas fa-car"></i>
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
                <img src="/JS Car Wash Images/5659.png" alt="Car Detailing" loading="lazy" />
              </div>
            </div>
          </div>

          {/* Right Section - Text Content */}
          <div className="home-detailing-right">
            <div className="home-detailing-content">
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
            <div className="home-book-online-step-card">
              <div className="home-book-online-step-number">01</div>
              <h3 className="home-book-online-step-title">Choose Branch & Service</h3>
              <p className="home-book-online-step-description">
                Select your preferred branch location and the service you need.
              </p>
            </div>

            <div className="home-book-online-step-card">
              <div className="home-book-online-step-number">02</div>
              <h3 className="home-book-online-step-title">Choose Model & Fill Details</h3>
              <p className="home-book-online-step-description">
                Enter your vehicle model and provide all necessary details for booking.
              </p>
            </div>

            <div className="home-book-online-step-card">
              <div className="home-book-online-step-number">03</div>
              <h3 className="home-book-online-step-title">Select Package & Extras</h3>
              <p className="home-book-online-step-description">
                Choose your preferred package and add any additional extras you need.
              </p>
            </div>

            <div className="home-book-online-step-card">
              <div className="home-book-online-step-number">04</div>
              <h3 className="home-book-online-step-title">Confirmation</h3>
              <p className="home-book-online-step-description">
                Review your booking details and confirm your appointment.
              </p>
            </div>
          </div>

          <div className="home-book-online-actions">
            <button className="book-now-btn" onClick={() => navigate('/booking')}>BOOK NOW</button>
          </div>
        </div>
      </section>

      {/* Great Packages For Car Washing Section */}
      <section className="home-packages-section">
        <div className="home-packages-container">
          <div className="home-packages-header">
            <p className="home-packages-subtitle">PROVIDING ALL TYPES OF</p>
            <h2 className="home-packages-title">
              Great Packages <span className="home-packages-title-red">For Car Washing</span>
            </h2>
            <div className="home-packages-title-underline">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className="home-packages-grid">
            {/* JS Polish Card */}
            <div className="home-package-card">
              <div className="home-package-header">
                <div className="home-package-price">$149 <span className="home-package-price-suffix">/ start from</span></div>
                <h3 className="home-package-name">JS Polish</h3>
              </div>
              <button className="home-package-book-btn" onClick={() => navigate('/booking')}>Book Now</button>
              <div className="home-package-features">
                <h4 className="home-package-features-title">Package includes</h4>
                <ul className="home-package-features-list">
                  <li className="home-package-feature-item">
                    <i className="fas fa-check-circle home-package-check-icon"></i>
                    <span>High - Pressure - rinse</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-check-circle home-package-check-icon"></i>
                    <span>Exterior Wash with pH neutral shampoo</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-check-circle home-package-check-icon"></i>
                    <span>Apply tyer shine</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-check-circle home-package-check-icon"></i>
                    <span>Exterior windows and side mirrors clean</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-check-circle home-package-check-icon"></i>
                    <span>Mag wheel wash process</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-check-circle home-package-check-icon"></i>
                    <span>Vacuum interior floor mats and footwells</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-check-circle home-package-check-icon"></i>
                    <span>Vacuum seats and boot</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-check-circle home-package-check-icon"></i>
                    <span>Wipe door and boot jambs</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-check-circle home-package-check-icon"></i>
                    <span>Interior windows and mirrors clean</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-check-circle home-package-check-icon"></i>
                    <span>Clean and wipe dashboard and console</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-check-circle home-package-check-icon"></i>
                    <span>Clean and wipe door trims</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-check-circle home-package-check-icon"></i>
                    <span>Full duco hand wax polish</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* JS Platinum Card */}
            <div className="home-package-card">
              <div className="home-package-header">
                <div className="home-package-price">$69 <span className="home-package-price-suffix">/ start from</span></div>
                <h3 className="home-package-name">JS Platinum</h3>
              </div>
              <button className="home-package-book-btn" onClick={() => navigate('/booking')}>Book Now</button>
              <div className="home-package-features">
                <h4 className="home-package-features-title">Package includes</h4>
                <ul className="home-package-features-list">
                  <li className="home-package-feature-item">
                    <i className="fas fa-check-circle home-package-check-icon"></i>
                    <span>High - Pressure - rinse</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-check-circle home-package-check-icon"></i>
                    <span>Exterior Wash with pH neutral shampoo</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-check-circle home-package-check-icon"></i>
                    <span>Apply tyer shine</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-check-circle home-package-check-icon"></i>
                    <span>Exterior windows and side mirrors clean</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-check-circle home-package-check-icon"></i>
                    <span>Mag wheel wash process</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-check-circle home-package-check-icon"></i>
                    <span>Vacuum interior floor mats and footwells</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-check-circle home-package-check-icon"></i>
                    <span>Vacuum seats and boot</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-check-circle home-package-check-icon"></i>
                    <span>Wipe door and boot jambs</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-check-circle home-package-check-icon"></i>
                    <span>Interior windows and mirrors clean</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-check-circle home-package-check-icon"></i>
                    <span>Clean and wipe dashboard and console</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-check-circle home-package-check-icon"></i>
                    <span>Clean and wipe door trims</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-times-circle home-package-x-icon"></i>
                    <span>Full duco hand wax polish</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* JS Express Card */}
            <div className="home-package-card">
              <div className="home-package-header">
                <div className="home-package-price">$39 <span className="home-package-price-suffix">/ start from</span></div>
                <h3 className="home-package-name">JS Express</h3>
              </div>
              <button className="home-package-book-btn" onClick={() => navigate('/booking')}>Book Now</button>
              <div className="home-package-features">
                <h4 className="home-package-features-title">Package includes</h4>
                <ul className="home-package-features-list">
                  <li className="home-package-feature-item">
                    <i className="fas fa-check-circle home-package-check-icon"></i>
                    <span>High - Pressure - rinse</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-check-circle home-package-check-icon"></i>
                    <span>Exterior Wash with pH neutral shampoo</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-check-circle home-package-check-icon"></i>
                    <span>Apply tyer shine</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-check-circle home-package-check-icon"></i>
                    <span>Exterior windows and side mirrors clean</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-times-circle home-package-x-icon"></i>
                    <span>Mag wheel wash process</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-times-circle home-package-x-icon"></i>
                    <span>Vacuum interior floor mats and footwells</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-times-circle home-package-x-icon"></i>
                    <span>Vacuum seats and boot</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-times-circle home-package-x-icon"></i>
                    <span>Wipe door and boot jambs</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-times-circle home-package-x-icon"></i>
                    <span>Interior windows and mirrors clean</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-times-circle home-package-x-icon"></i>
                    <span>Clean and wipe dashboard and console</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-times-circle home-package-x-icon"></i>
                    <span>Clean and wipe door trims</span>
                  </li>
                  <li className="home-package-feature-item">
                    <i className="fas fa-times-circle home-package-x-icon"></i>
                    <span>Full duco hand wax polish</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="home-faq-section">
        <div className="home-faq-container">
          <div className="home-faq-header">
            <p className="home-faq-subtitle">JS CAR WASH</p>
            <h2 className="home-faq-title">
              Answers To Our Most Common Queries
            </h2>
            <div className="home-faq-lines">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className="home-faq-list">
            {[
              {
                question: 'How should I prepare my car to ensure the best possible wash outcome?',
                answer: 'We advise removing as much "clutter" as possible from the boot, seats, side pockets & console area, and any valuables. Any rubbish left on the floor of the vehicle will be disposed of. Please take some time when you drop your car off to indicate any damaged areas of the vehicle and any areas you wish to pay particular attention to ensure you are satisfied.'
              },
              {
                question: 'What should I do if I\'m not satisfied with the service I received?',
                answer: 'Please ensure you check your car before you leave. If any area of the vehicle has been missed, please highlight this to the onsite manager and it will be rectified on the spot. Alternatively, please contact our Customer Service team on 02 5804 5720 or info@jscarwash.com.au',
                hasHighlight: true
              },
              {
                question: 'Why have I been asked to pay more because my car is dirty?',
                answer: 'Hand Car Washing is a labour-based process which relies on time & labour to clean the cars. Pricing is therefore based on these components to clean a car. Cars with excessive soilage (whether interior or exterior) require additional time to clean and as such may be subject to a soilage surcharge. The onsite manager should always discuss and agree any additional charges before the wash commences, as such it is your decision whether to accept the surcharge and for the wash to proceed.'
              },
              {
                question: 'Why does it cost more to wash larger vehicles?',
                answer: 'JS Car Wash is a labour-based business, as such pricing is dependent on the time it takes to clean vehicles. Larger vehicles take longer to clean which is why the cost is high.'
              },
              {
                question: 'What is considered an X-Large vehicle?',
                answer: 'Examples of X-Large vehicles include (but are not limited to): Hyundai Palisade, Toyota Land Cruiser, Mitsubishi Pajero, KIA Sorento, BMW X7, Mercedes Van, Mercedes GLS, Land Rover Discovery, Mazda CX-9, Skoda Kodiaq, Volvo XC90, Ford Raptor, RAM 1500, GMC Yukon etc.'
              },
              {
                question: 'How do I contact you?',
                answer: 'You can find the contact details for each of our sites on their location page on our website. If you do not have a successful resolution, contact our Customer Service team through either:',
                hasBulletPoints: true,
                bulletPoints: [
                  { label: 'Phone', value: '02 5804 5720' },
                  { label: 'Email', value: 'info@jscarwash.com.au' }
                ]
              },
              {
                question: 'How long will it take?',
                answer: 'An Express wash usually takes 25 – 45 minutes. A js Car wash usually takes 45 – 60 minutes. A Platinum wash usually takes around 60 – 90 minutes. JS Polish usually takes 75 – 110 minutes. However, these times will vary depending on your vehicle\'s specific requirements.'
              },
              {
                question: 'Can I cancel my booking?',
                answer: 'Yes, you can cancel your booking. However, it is recommended to do so within a reasonable time frame to avoid any cancellation fees.'
              },
              {
                question: 'When is the latest time I can bring my car in?',
                answer: 'We recommend bringing your car in no later than half an hour before closing time.'
              },
              {
                question: 'How often should I get my car washed?',
                answer: 'We recommend every two to three weeks if you drive regularly. However, how often you need your car washed will depend on many factors such as how often you drive, where you drive, and where you park.'
              },
              {
                question: 'Can you provide an invoice?',
                answer: 'We\'ll send you an email with your receipt after we\'ve processed your payment. We\'ll also email you after you\'ve made a booking to double-check you\'re being billed for the correct service.'
              },
              {
                question: 'What is the difference between a wax and polish?',
                answer: 'Car waxing and polishing serve distinct purposes in car care. Polishing is a process that uses abrasive compounds to remove imperfections like swirl marks and scratches, restoring the paint\'s clarity and smoothness. Waxing involves applying a protective layer over the paint to shield it from environmental elements and add a glossy shine. While polishing corrects imperfections, waxing primarily protects and enhances the paint\'s appearance. These two processes are often combined, with polishing preceding waxing in a typical car care routine to achieve corrective and protective benefits.'
              },
              {
                question: 'Why choose JS Car Wash over traditional automated car washes?',
                answer: 'We distinguish ourselves with our professional hand washing techniques, attention to detail and personalised care, ensuring your vehicle receives the best treatment possible. Automated car washes are unable to clean the entire vehicle and their brushes increase the risk of scratching paintwork.'
              }
            ].map((item, index) => {
              const isOpen = faqClickedIndex === index

              return (
                <motion.div
                  key={index}
                  className={`home-faq-item ${isOpen ? 'home-faq-item-open' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
                >
                  <div 
                    className="home-faq-question" 
                    onClick={() => {
                      if (faqClickedIndex === index) {
                        setFaqClickedIndex(null)
                      } else {
                        setFaqClickedIndex(index)
                      }
                    }}
                  >
                    <span className="home-faq-icon">{isOpen ? '−' : '+'}</span>
                    <span className="home-faq-question-text">{item.question}</span>
                  </div>
                  <AnimatePresence mode="wait">
                    {isOpen && (
                      <motion.div
                        className="home-faq-answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                      >
                        <p>
                          {item.hasHighlight ? (
                            <>
                              {item.answer.split(/(02 5804 5720|info@jscarwash\.com\.au)/).map((part, idx) => 
                                part === '02 5804 5720' || part === 'info@jscarwash.com.au' ? (
                                  <span key={idx} className="home-faq-highlight">{part}</span>
                                ) : (
                                  <span key={idx}>{part}</span>
                                )
                              )}
                            </>
                          ) : item.hasBulletPoints ? (
                            <>
                              {item.answer}
                              <ul className="home-faq-bullet-list">
                                {item.bulletPoints?.map((point, idx) => (
                                  <li key={idx}>
                                    <span className="home-faq-bullet-label">{point.label}</span>
                                    {' – '}
                                    <span className="home-faq-highlight">{point.value}</span>
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            item.answer
                          )}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <FooterPage />
    </div>
  )
}

export default HomePage
