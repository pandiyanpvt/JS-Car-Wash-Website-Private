import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useNavbar } from '../../contexts/NavbarContext'
import './Navbar.css'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const location = useLocation()
  const menuRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const { isVisible } = useNavbar()

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
    setIsServicesOpen(false)
  }, [location.pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleServices = () => {
    setIsServicesOpen(!isServicesOpen)
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const isServicesActive = () => {
    return location.pathname === '/services' || 
           location.pathname === '/carwash' || 
           location.pathname === '/cardetailing'
  }

  // Don't render navbar if not visible
  if (!isVisible) {
    return null
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Desktop Navigation */}
        <div className="navbar-menu desktop-menu">
          <Link 
            to="/" 
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          
          <Link 
            to="/aboutus" 
            className={`navbar-link ${isActive('/aboutus') ? 'active' : ''}`}
          >
            AboutUs
          </Link>

          {/* Services Dropdown */}
          <div 
            className={`navbar-dropdown ${isServicesActive() ? 'active' : ''}`}
            ref={servicesRef}
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
          >
            <Link 
              to="/services"
              className={`navbar-link dropdown-toggle ${isServicesActive() ? 'active' : ''}`}
            >
              Services
              <span className="dropdown-arrow">▼</span>
            </Link>
            {isServicesOpen && (
              <div className="dropdown-menu">
                <Link 
                  to="/services" 
                  className={`dropdown-item ${location.pathname === '/services' ? 'active' : ''}`}
                >
                  All Services
                </Link>
                <Link 
                  to="/carwash" 
                  className={`dropdown-item ${location.pathname === '/carwash' ? 'active' : ''}`}
                >
                  Car Wash
                </Link>
                <Link 
                  to="/cardetailing" 
                  className={`dropdown-item ${location.pathname === '/cardetailing' ? 'active' : ''}`}
                >
                  Car Detailing
                </Link>
              </div>
            )}
          </div>

          <Link 
            to="/products" 
            className={`navbar-link ${isActive('/products') ? 'active' : ''}`}
          >
            Product
          </Link>

          <Link 
            to="/gallery" 
            className={`navbar-link ${isActive('/gallery') ? 'active' : ''}`}
          >
            Gallery
          </Link>

          <Link 
            to="/contact" 
            className={`navbar-link ${isActive('/contact') ? 'active' : ''}`}
          >
            Contact Us
          </Link>

          <Link 
            to="/booking" 
            className={`navbar-link navbar-cta ${isActive('/booking') ? 'active' : ''}`}
          >
            Book Now
          </Link>

          <Link 
            to="/login" 
            className={`navbar-link navbar-account ${isActive('/login') ? 'active' : ''}`}
          >
            Create An Account
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <Link 
          to="/" 
          className={`mobile-link ${isActive('/') ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        >
          Home
        </Link>
        
        <Link 
          to="/aboutus" 
          className={`mobile-link ${isActive('/aboutus') ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        >
          AboutUs
        </Link>

        {/* Mobile Services Dropdown */}
        <div className="mobile-dropdown">
          <button 
            className={`mobile-link mobile-dropdown-toggle ${isServicesActive() ? 'active' : ''}`}
            onClick={toggleServices}
          >
            Services
            <span className={`mobile-dropdown-arrow ${isServicesOpen ? 'open' : ''}`}>▼</span>
          </button>
          <div className={`mobile-dropdown-menu ${isServicesOpen ? 'open' : ''}`}>
            <Link 
              to="/carwash" 
              className={`mobile-dropdown-item ${location.pathname === '/carwash' ? 'active' : ''}`}
              onClick={() => {
                setIsMenuOpen(false)
                setIsServicesOpen(false)
              }}
            >
              Car Wash
            </Link>
            <Link 
              to="/cardetailing" 
              className={`mobile-dropdown-item ${location.pathname === '/cardetailing' ? 'active' : ''}`}
              onClick={() => {
                setIsMenuOpen(false)
                setIsServicesOpen(false)
              }}
            >
              Car Detailing
            </Link>
          </div>
        </div>

        <Link 
          to="/products" 
          className={`mobile-link ${isActive('/products') ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        >
          Product
        </Link>

        <Link 
          to="/gallery" 
          className={`mobile-link ${isActive('/gallery') ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        >
          Gallery
        </Link>

        <Link 
          to="/contact" 
          className={`mobile-link ${isActive('/contact') ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        >
          Contact Us
        </Link>

        <Link 
          to="/booking" 
          className={`mobile-link mobile-cta ${isActive('/booking') ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        >
          Book Now
        </Link>

        <Link 
          to="/login" 
          className={`mobile-link mobile-account ${isActive('/login') ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        >
          Create An Account
        </Link>
      </div>
    </nav>
  )
}

export default Navbar

