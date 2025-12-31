import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FooterPage } from '../footer'
import Navbar from '../../components/navbar/Navbar'
import AuthModal from '../../components/auth/AuthModal'
import { useAuth } from '../../contexts/AuthContext'
import { contactApi } from '../../services/api'
import './HomePage.css'

interface HomePageProps {}

interface Branch {
  id: number
  name: string
  subtitle: string
  address: string
  mapUrl?: string
}

function HomePage({}: HomePageProps) {
  const { isAuthenticated } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [modelsShow, setModelsShow] = useState(false)
  const [dealersShow, setDealersShow] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [faqClickedIndex, setFaqClickedIndex] = useState<number | null>(null)
  const [showNavbar, setShowNavbar] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin')
  const [selectedModel, setSelectedModel] = useState<string | null>(() => {
    // Load selected model from localStorage on mount
    try {
      const stored = localStorage.getItem('selectedCarModel')
      return stored ? stored : 'SUV'
    } catch {
      return 'SUV'
    }
  })
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(() => {
    // Load selected branch from localStorage on mount
    try {
      const stored = localStorage.getItem('selectedBranch')
      if (stored) {
        const branch = JSON.parse(stored)
        return { 
          id: branch.id ?? 0,
          name: branch.name || branch.subtitle || '',
          subtitle: branch.subtitle || branch.name || '',
          address: branch.address || '',
          mapUrl: branch.mapUrl
        }
      }
    } catch (error) {
      console.error('Failed to load selected branch from localStorage:', error)
    }
    return null
  })
  const [showVideo, setShowVideo] = useState(false)
  const headerContainerRef = useRef<HTMLDivElement>(null)
  const pageContainerRef = useRef<HTMLDivElement>(null)
  const [containerPosition, setContainerPosition] = useState({ top: 0, left: 0, width: 0, height: 0 })
  const location = useLocation()
  const navigate = useNavigate()
  const [branches, setBranches] = useState<Branch[]>([])

  // Car models array for pagination
  const carModels = useMemo(() => [
    'SEDAN',
    'X-LARGE',
    'SUV',
    'HATCHBACK',
    'WAGON',
    'SPORT'
  ], [])

  // Load branches from backend
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await contactApi.getBranches()
        if (response.success && response.data) {
          const activeBranches = response.data
            .filter((branch: any) => branch.is_active)
            .map((branch: any) => ({
              id: branch.id,
              name: branch.branch_name,
              subtitle: branch.branch_name,
              address: branch.address,
              mapUrl: branch.map_url || branch.mapUrl
            }))
          setBranches(activeBranches)
        }
      } catch (error) {
        console.error('Error fetching branches:', error)
      }
    }
    fetchBranches()
  }, [])

  // Combined map URL showing both branches with markers
  const combinedMapUrl = useMemo(() => {
    if (!branches.length) return ''
    const addresses = branches
      .map(branch => encodeURIComponent(branch.address))
      .join('|')
    return `https://www.google.com/maps?q=${addresses}&hl=en&z=8&output=embed`
  }, [branches])

  const navItems = useMemo(() => [
    { label: 'Home', href: '/', route: true },
    { label: 'AboutUs', href: '/aboutus', route: true },
    { label: 'Services', href: '/services', route: true, hasDropdown: true },
    { label: 'Product', href: '/products', route: true },
    { label: 'Gallery', href: '/gallery', route: true },
    { label: 'Contact Us', href: '/contact', route: true },
    { label: 'BOOK NOW', href: '/booking', route: true }
  ], [])

  const servicesSubItems = useMemo(() => [
    { label: 'Car Wash', href: '/carwash', route: true },
    { label: 'Car Detailing', href: '/cardetailing', route: true }
  ], [])

  const isActive = useCallback((href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname === href
  }, [location.pathname])

  const isServicesActive = useCallback(() => {
    return location.pathname === '/services' || 
           location.pathname === '/carwash' || 
           location.pathname === '/cardetailing'
  }, [location.pathname])

  const isDropdownItemActive = useCallback((href: string) => {
    return location.pathname === href
  }, [location.pathname])

  // Model to head image mapping
  const modelHeadImageMap: { [key: string]: string } = useMemo(() => ({
    'SEDAN': '/header/Sedan_Front_compresed-removebg-preview.png',
    'X-LARGE': '/header/X-Large-removebg-preview.png',
    'SUV': '/header/SUV-removebg-preview.png',
    'HATCHBACK': '/header/Hatchback-removebg-preview.png',
    'WAGON': '/header/wagon-removebg-preview.png',
    'SPORT': '/header/Sport_Front_compresed-removebg-preview.png'
  }), [])

  // Model to video mapping - using local MP4 files
  const modelVideoMap: { [key: string]: { url: string; title: string; coverImage: string; isLocal: boolean } } = useMemo(() => ({
    'SEDAN': { 
      url: '/header/Sedan.mp4', 
      title: 'Sedan Car Wash Video',
      coverImage: '/JS Car Wash Images/Sedan.png',
      isLocal: true
    },
    'X-LARGE': { 
      url: '/header/X-Large.mp4', 
      title: 'X-Large Car Wash Video',
      coverImage: '/JS Car Wash Images/X-Large.png',
      isLocal: true
    },
    'SUV': { 
      url: '/header/SUV.mp4', 
      title: 'SUV Car Wash Video',
      coverImage: '/JS Car Wash Images/Suv.png',
      isLocal: true
    },
    'HATCHBACK': { 
      url: '/header/Hatchback.mp4', 
      title: 'Hatchback Car Wash Video',
      coverImage: '/JS Car Wash Images/Hatchback.png',
      isLocal: true
    },
    'WAGON': { 
      url: '/header/wagon.mp4', 
      title: 'Wagon Car Wash Video',
      coverImage: '/JS Car Wash Images/Wagon.png',
      isLocal: true
    },
    'SPORT': { 
      url: '/header/sports.mp4', 
      title: 'Sport Car Wash Video',
      coverImage: '/JS Car Wash Images/Sports.png',
      isLocal: true
    }
  }), [])

  // Model-specific text content
  const modelTextMap: { [key: string]: { headline: string; description: string } } = useMemo(() => ({
    'SEDAN': {
      headline: 'PREMIUM SEDAN CAR WASH & DETAILING',
      description: 'Experience our professional hand wash and detailing service for your Sedan. Our expert team uses premium products and techniques to restore your vehicle\'s shine and protect its finish. Perfect for daily drivers and luxury sedans alike.'
    },
    'X-LARGE': {
      headline: 'X-LARGE VEHICLE EXPERT CARE',
      description: 'Specialized care for X-Large vehicles including SUVs, vans, and large trucks. Our spacious facilities and professional equipment ensure thorough cleaning and detailing of every surface, inside and out. Trusted by families and commercial fleets.'
    },
    'SUV': {
      headline: 'SUV DEEP CLEAN & PROTECTION',
      description: 'Comprehensive wash and detailing service designed for SUVs. From rugged off-road vehicles to luxury SUVs, we provide meticulous attention to detail. Protect your investment with our premium waxing and interior detailing services.'
    },
    'HATCHBACK': {
      headline: 'COMPACT CAR PERFECTION',
      description: 'Expert care for your Hatchback with our precision cleaning techniques. We understand the unique needs of compact vehicles and provide thorough exterior wash and interior detailing. Keep your hatchback looking brand new.'
    },
    'WAGON': {
      headline: 'FAMILY WAGON COMPLETE CARE',
      description: 'Complete wash and detailing service for your family wagon. Our team ensures every corner is spotless, from the spacious interior to the exterior finish. Safe, family-friendly products for your peace of mind.'
    },
    'SPORT': {
      headline: 'SHINE UP YOUR CAR TO NEXT LEVEL',
      description: 'JS Car Wash is Australia\'s premier professional hand wash and detailing provider. For over 10 years, JS Car Wash has been a family-owned, private company that thrives in an atmosphere of determination and innovation.'
    }
  }), [])

  // Get text content based on selected model
  const textContent = useMemo(() => {
    if (selectedModel && modelTextMap[selectedModel]) {
      return modelTextMap[selectedModel]
    }
    // Default to SUV
    return modelTextMap['SUV']
  }, [selectedModel, modelTextMap])

  // Get video source based on selected model
  const videoData = useMemo(() => {
    if (selectedModel && modelVideoMap[selectedModel]) {
      return modelVideoMap[selectedModel]
    }
    // Default to SUV
    return modelVideoMap['SUV']
  }, [selectedModel, modelVideoMap])

  // Get car image source based on selected model
  const carImageSrc = useMemo(() => {
    if (selectedModel && modelHeadImageMap[selectedModel]) {
      return modelHeadImageMap[selectedModel]
    }
    // Default to SUV
    return modelHeadImageMap['SUV']
  }, [selectedModel, modelHeadImageMap])

  const handleNavClick = useCallback((href: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
    }
    setMenuOpen(false)
    setMobileServicesOpen(false)
    navigate(href)
  }, [navigate])

  // Handle branch selection with authentication check
  const handleBranchSelection = useCallback((branch: Branch) => {
    if (!isAuthenticated) {
      // User not authenticated, show sign-in popup
      setDealersShow(false)
      setAuthModalTab('signin')
      setAuthModalOpen(true)
      return
    }
    
    // User is authenticated, allow branch selection
    setSelectedBranch(branch)
    try {
      localStorage.setItem('selectedBranch', JSON.stringify(branch))
    } catch (error) {
      console.error('Failed to save selected branch to localStorage:', error)
    }
    setDealersShow(false)
  }, [isAuthenticated])

  // Ensure default model (SUV) is set on first visit
  useEffect(() => {
    if (!selectedModel) {
      setSelectedModel('SUV')
      try {
        localStorage.setItem('selectedCarModel', 'SUV')
      } catch (error) {
        console.error('Failed to save default model to localStorage:', error)
      }
    }
  }, [selectedModel])

  // Lock body scroll when any popup is open (sign-in, discover model, dealers, video, sidebar, profile popup)
  useEffect(() => {
    // Check if profile popup is open by looking for it in the DOM
    const checkProfilePopup = () => {
      return !!document.querySelector('.profile-popup')
    }
    
    const hasOpenPopup = menuOpen || dealersShow || modelsShow || authModalOpen || showVideo || checkProfilePopup()
    if (hasOpenPopup) {
      // Lock scroll on body
      const originalOverflow = document.body.style.overflow
      const originalPosition = document.body.style.position
      const scrollY = window.scrollY
      
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      
      return () => {
        document.body.style.overflow = originalOverflow
        document.body.style.position = originalPosition
        document.body.style.top = ''
        document.body.style.width = ''
        window.scrollTo(0, scrollY)
      }
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
    }
  }, [menuOpen, dealersShow, modelsShow, authModalOpen, showVideo])

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!menuOpen) {
      return
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // Don't close if clicking on hamburger button or menu overlay
      if (target.closest('.header-hamburger-btn') || target.closest('.mobile-menu-overlay')) {
        return
      }
      setMenuOpen(false)
      setMobileServicesOpen(false)
    }

    // Use a small delay to prevent immediate closure when opening
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  // Show/hide navbar on scroll (but not when popups are open)
  useEffect(() => {
    const handleScroll = () => {
      // Don't handle scroll if any popup is open (check if body is locked)
      const bodyStyle = window.getComputedStyle(document.body)
      const isBodyLocked = bodyStyle.position === 'fixed' || bodyStyle.overflow === 'hidden'
      
      // Also check if profile popup is open
      const profilePopupExists = document.querySelector('.profile-popup')
      
      if (isBodyLocked || profilePopupExists) {
        return // Don't change navbar visibility when popups are open
      }
      
      const scrollY = window.scrollY
      const headerHeight = headerContainerRef.current?.offsetHeight || 0
      
      // Show navbar when scrolled past the header section
      if (scrollY > headerHeight * 0.5) {
        setShowNavbar(true)
      } else {
        setShowNavbar(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

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
  const scrollSpeed = 1 // pixels per frame
  const animationFrameRef = useRef<number | undefined>(undefined)
  const lastUpdateTimeRef = useRef(0)
  const throttleDelay = 16 // ~60fps

  // Create duplicated services for seamless loop - memoized
  const duplicatedServices = useMemo(() => [...services, ...services, ...services], [services])

  // Optimized carousel animation using direct DOM manipulation instead of state updates
  useEffect(() => {
    const cardWidth = 350 + 32 // card width + gap
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

  // Save selected model to localStorage whenever it changes
  useEffect(() => {
    if (selectedModel) {
      try {
        localStorage.setItem('selectedCarModel', selectedModel)
      } catch (error) {
        console.error('Failed to save selected model to localStorage:', error)
      }
    }
    // Close video when model changes
    setShowVideo(false)
  }, [selectedModel])

  // Handle full-screen video modal
  useEffect(() => {
    if (showVideo) {
      // Prevent body scroll when video is open
      document.body.style.overflow = 'hidden'
      
      // Handle ESC key to close video
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setShowVideo(false)
        }
      }
      
      window.addEventListener('keydown', handleEscape)
      
      return () => {
        document.body.style.overflow = 'unset'
        window.removeEventListener('keydown', handleEscape)
      }
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [showVideo])

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
        }, 150) // Faster response time
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
    const currentIndex = selectedModel ? carModels.indexOf(selectedModel) : -1
    if (currentIndex === -1) {
      // If no model selected, start with last model
      setSelectedModel(carModels[carModels.length - 1])
    } else if (currentIndex === 0) {
      // If first model, go to last
      setSelectedModel(carModels[carModels.length - 1])
    } else {
      // Go to previous model
      setSelectedModel(carModels[currentIndex - 1])
    }
    // Save to localStorage
    try {
      const newModel = currentIndex === -1 
        ? carModels[carModels.length - 1]
        : currentIndex === 0 
        ? carModels[carModels.length - 1]
        : carModels[currentIndex - 1]
      localStorage.setItem('selectedCarModel', newModel)
    } catch (error) {
      console.error('Failed to save selected model to localStorage:', error)
    }
  }

  const handleNext = () => {
    const currentIndex = selectedModel ? carModels.indexOf(selectedModel) : -1
    if (currentIndex === -1) {
      // If no model selected, start with first model
      setSelectedModel(carModels[0])
    } else if (currentIndex === carModels.length - 1) {
      // If last model, go to first
      setSelectedModel(carModels[0])
    } else {
      // Go to next model
      setSelectedModel(carModels[currentIndex + 1])
    }
    // Save to localStorage
    try {
      const newModel = currentIndex === -1 
        ? carModels[0]
        : currentIndex === carModels.length - 1 
        ? carModels[0]
        : carModels[currentIndex + 1]
      localStorage.setItem('selectedCarModel', newModel)
    } catch (error) {
      console.error('Failed to save selected model to localStorage:', error)
    }
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
      {/* Mobile Menu Overlay - HomePage Navigation */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => {
                setMenuOpen(false)
                setMobileServicesOpen(false)
              }}
            />
            <motion.div
              className="mobile-menu-overlay"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="mobile-menu-header">
                <div className="mobile-menu-logo">
                  <img
                    src="/JS Car Wash Images/cropped-fghfthgf.png"
                    alt="JS Car Wash Logo"
                    className="mobile-logo-img"
                  />
                </div>
                <button
                  className="mobile-menu-close"
                  onClick={() => {
                    setMenuOpen(false)
                    setMobileServicesOpen(false)
                  }}
                  aria-label="Close menu"
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <div className="mobile-menu-content">
                {navItems.map((item, index) => {
                  const active = isActive(item.href)
                  if (item.hasDropdown) {
                    const servicesActive = isServicesActive()
                    return (
                      <div 
                        key={index} 
                        className="mobile-menu-item"
                      >
                        <div className="mobile-menu-link-with-dropdown">
                          <Link
                            to={item.href}
                            className={`mobile-menu-link ${servicesActive ? 'mobile-menu-link-active' : ''}`}
                            onClick={(e) => handleNavClick(item.href, e)}
                          >
                            {item.label}
                          </Link>
                          <button
                            className="mobile-dropdown-toggle"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setMobileServicesOpen(!mobileServicesOpen)
                            }}
                            aria-label="Toggle services menu"
                          >
                            <svg
                              className={`mobile-dropdown-arrow ${mobileServicesOpen ? 'mobile-dropdown-arrow-open' : ''}`}
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                        {mobileServicesOpen && (
                          <div className="mobile-submenu">
                            {servicesSubItems.map((subItem, subIndex) => {
                              const dropdownActive = isDropdownItemActive(subItem.href)
                              return (
                                <Link
                                  key={subIndex}
                                  to={subItem.href}
                                  className={`mobile-submenu-item ${dropdownActive ? 'mobile-submenu-item-active' : ''}`}
                                  onClick={(e) => handleNavClick(subItem.href, e)}
                                >
                                  {subItem.label}
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  }
                  return (
                    <Link
                      key={index}
                      to={item.href}
                      className={`mobile-menu-link ${active ? 'mobile-menu-link-active' : ''}`}
                      onClick={(e) => handleNavClick(item.href, e)}
                    >
                      {item.label}
                    </Link>
                  )
                })}

                <button
                  className="mobile-cta-button"
                  onClick={(e) => {
                    e.preventDefault()
                    setMenuOpen(false)
                    setAuthModalTab('signup')
                    setAuthModalOpen(true)
                  }}
                >
                  Create an Account
                </button>
                <button
                  className="mobile-cta-button"
                  onClick={(e) => {
                    e.preventDefault()
                    setMenuOpen(false)
                    setAuthModalTab('signin')
                    setAuthModalOpen(true)
                  }}
                >
                  Sign In
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
        {/* Header with Navbar - Full Width - Desktop Only */}
        <div className={`header-navbar-wrapper ${showNavbar ? 'navbar-visible' : 'navbar-hidden'} ${showVideo ? 'animate__animated animate__backOutLeft' : ''}`}>
          <Navbar hideLogo={true} />
        </div>
        {/* Hamburger Menu Button - Mobile: Opens Sidebar, Desktop: Shows Navbar */}
        <button
          className={`header-hamburger-btn ${showNavbar ? 'hamburger-hidden' : ''} ${showVideo ? 'animate__animated animate__backOutRight' : ''}`}
          onClick={() => {
            // Check if desktop (width > 959px) or mobile
            const isDesktop = window.innerWidth > 959
            if (isDesktop) {
              // On desktop: toggle navbar
              setShowNavbar(!showNavbar)
            } else {
              // On mobile: toggle sidebar
              setMenuOpen(!menuOpen)
            }
          }}
          aria-label="Toggle menu"
        >
          <svg className="hamburger-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {(menuOpen || showNavbar) ? (
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            )}
          </svg>
        </button>

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
              transition={{ duration: 0.8, delay: 0.2 }}
              className="home-main-logo"
            >
              <img
                src="/JS Car Wash Images/cropped-fghfthgf.png"
                alt="JS Car Wash Logo"
                className="home-main-logo-img"
              />
              <h1 className="home-main-js-text">JS</h1>
              <h2 className="home-main-car-wash-text">CAR WASH & DETAILING</h2>
            </motion.div>

            {/* Car Image */}
            <motion.div
              key={selectedModel || 'default'}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="home-main-car-image-wrapper"
            >
              <img
                src={carImageSrc}
                alt="Car"
                className="home-main-car-image"
                loading="lazy"
              />
            </motion.div>

            {/* BOOK NOW Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button className="book-now-btn" onClick={() => {
                if (!isAuthenticated) {
                  setAuthModalTab('signin')
                  setAuthModalOpen(true)
                } else {
                  navigate('/booking')
                }
              }}>BOOK NOW</button>
            </motion.div>
          </div>
        </div>

        {/* Right Section - Dark Blue Background (1/3) */}
        <div className="home-right-section">
          <div className="right-section-wrapper">
            <div className="right-section-content">
              <button 
                className="header-dealers-btn right-section-dealers-btn"
                onClick={() => setDealersShow(true)}
              >
                DEALERS
              </button>
              {/* Top Content */}
              <div className="right-top-content">
                  {/* Headline */}
                  <motion.div
                    key={`headline-${selectedModel || 'default'}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="headline-wrapper">
                      <div className="headline-bar"></div>
                      <h3 className="headline-text">
                        {textContent.headline}
                      </h3>
                    </div>
                  </motion.div>

                  {/* Description Text */}
                  <motion.div
                    key={`desc-${selectedModel || 'default'}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <p className="description-text" key={`desc-text-${selectedModel || 'default'}`}>
                      {textContent.description}
                    </p>
                  </motion.div>

                  {/* Video Player */}
                  <motion.div
                    key={selectedModel || 'default-video'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <div 
                      className="video-player"
                      onClick={() => setShowVideo(true)}
                    >
                      {videoData.isLocal ? (
                        <video
                          className="video-inline"
                          src={videoData.url}
                          title={videoData.title}
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      ) : (
                        <div
                          className="video-inline-fallback"
                          style={{
                            backgroundImage: `url(${videoData.coverImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                          }}
                        />
                      )}
                      <div className="video-overlay"></div>
                      <div className="play-button">
                        <svg className="play-icon" viewBox="0 0 24 24" fill="currentColor">
                          <path d={getIconSVG('play')} />
                        </svg>
                      </div>
                      <p className="watch-video-text">WATCH VIDEO</p>
                    </div>
                  </motion.div>

                  {/* Branch Selection - Show "Select your branch" if not signed in, or branch name if signed in */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="selected-branch-wrapper"
                    onClick={() => setDealersShow(true)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="selected-branch-content">
                      <svg className="selected-branch-location-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                      </svg>
                      <p className="selected-branch-text">
                        {isAuthenticated && selectedBranch 
                          ? (selectedBranch.subtitle || selectedBranch.name)
                          : 'Select your branch'
                        }
                      </p>
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
                    {String((selectedModel ? carModels.indexOf(selectedModel) : 0) + 1).padStart(2, '0')}/{String(carModels.length).padStart(2, '0')}
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
            className={`modelshow animate__animated ${isClosing ? 'animate__fadeOutDownBig' : 'animate__fadeInUpBig'}`}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: `${containerPosition.top}px`,
              left: `${containerPosition.left}px`,
              width: `${containerPosition.width}px`,
              height: `${containerPosition.height}px`,
              zIndex: 1300,
              backgroundColor: '#ffffff',
              overflowY: 'hidden',
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
                    }, 300)
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
                      delay: 0
                    }}
                    onClick={() => {
                      setSelectedModel(model.name)
                      // Save selected model to localStorage
                      try {
                        localStorage.setItem('selectedCarModel', model.name)
                      } catch (error) {
                        console.error('Failed to save selected model to localStorage:', error)
                      }
                      setModelsShow(false)
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <motion.div 
                      className="modelshow-model-image"
                      initial={{ opacity: 0, x: '100vw' }}
                      animate={isClosing ? { opacity: 0, x: '-100%' } : { opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.8, 
                        delay: 0,
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

      {/* Full Screen Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <>
            <motion.div
              className="video-fullscreen-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowVideo(false)}
            />
            <motion.div
              className={`video-fullscreen-container animate__animated animate__backInRight`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              <button
                className="video-fullscreen-close-btn"
                onClick={() => setShowVideo(false)}
                aria-label="Close video"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className="video-fullscreen-wrapper">
                {videoData.isLocal ? (
                  <video
                    src={videoData.url}
                    title={videoData.title}
                    className="video-fullscreen-video"
                    controls
                    autoPlay
                    loop
                    playsInline
                  />
                ) : (
                  <iframe
                    src={videoData.url}
                    title={videoData.title}
                    className="video-fullscreen-iframe"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
            </motion.div>
          </>
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
                  <h1 className="dealersshow-title">Our branchers</h1>
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
              {/* Single Map showing both branches with markers */}
              <div className="dealersshow-map">
                <iframe
                  src={combinedMapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="dealersshow-map-iframe"
                  title="JS Car Wash - All Branches"
                ></iframe>
                {/* Custom JS Car Wash Logo Markers */}
                {branches.map((branch, index) => (
                  <div
                    key={index}
                    className={`dealersshow-map-marker ${index === 0 ? 'marker-dubbo' : 'marker-sydney'}`}
                    onClick={() => handleBranchSelection(branch)}
                  >
                    <img
                      src="/JS Car Wash Images/cropped-fghfthgf.png"
                      alt={`JS Car Wash ${branch.subtitle}`}
                      className="dealersshow-marker-logo"
                    />
                    <div className="dealersshow-marker-pulse"></div>
                  </div>
                ))}
              </div>

              {/* Branch Selection Buttons */}
              <div className="dealersshow-branch-buttons">
                {branches.map((branch, index) => (
                  <button
                    key={index}
                    className={`dealersshow-branch-name-btn ${selectedBranch?.subtitle === branch.subtitle ? 'selected' : ''}`}
                    onClick={() => handleBranchSelection(branch)}
                  >
                    {branch.subtitle}
                  </button>
                ))}
              </div>
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

      {/* Sign In Popup Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
      />
    </div>
  )
}

export default HomePage
