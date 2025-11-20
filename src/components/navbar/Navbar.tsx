import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './Navbar.css'

interface NavbarProps {
  onNavigate?: () => void
  className?: string
}

function Navbar({ onNavigate, className = '' }: NavbarProps) {
  const location = useLocation()
  const [servicesHover, setServicesHover] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)

  const navItems = [
    { label: 'Home', href: '/', route: true },
    { label: 'AboutUs', href: '/aboutus', route: true },
    { label: 'Services', href: '/services', route: true, hasDropdown: true },
    { label: 'Contact Us', href: '/contact', route: true },
    { label: 'BOOK NOW', href: '/login', route: true }
  ]

  const servicesSubItems = [
    { label: 'Car Wash', href: '/carwash', route: true },
    { label: 'Car Detailing', href: '/cardetailing', route: true }
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname === href
  }

  const isServicesActive = () => {
    return location.pathname === '/services' || 
           location.pathname === '/carwash' || 
           location.pathname === '/cardetailing'
  }

  const isDropdownItemActive = (href: string) => {
    return location.pathname === href
  }

  const handleClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    setMobileServicesOpen(false)
    if (onNavigate) {
      onNavigate()
    }
    window.location.href = href
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (mobileMenuOpen && !target.closest('.modern-navbar') && !target.closest('.mobile-menu-overlay')) {
        setMobileMenuOpen(false)
        setMobileServicesOpen(false)
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  return (
    <>
      <nav className={`modern-navbar ${className}`}>
        <div className="navbar-wrapper">
          {/* Logo Section */}
          <div className="navbar-logo-section">
            <div className="navbar-logo-icon">
              <img
                src="/JS Car Wash Images/cropped-fghfthgf.png"
                alt="JS Car Wash Logo"
                className="navbar-logo-img"
              />
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="navbar-links desktop-nav-links">
            {navItems.map((item, index) => {
              const active = isActive(item.href)
              if (item.hasDropdown) {
                const servicesActive = isServicesActive()
                return (
                  <div
                    key={index}
                    className="navbar-dropdown-wrapper"
                    onMouseEnter={() => setServicesHover(true)}
                    onMouseLeave={() => setServicesHover(false)}
                  >
                    <Link
                      to={item.href}
                      className={`navbar-link ${servicesActive ? 'navbar-link-active' : ''}`}
                      onClick={(e) => handleClick(item.href, e)}
                    >
                      {item.label}
                      <svg className="navbar-dropdown-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                    {servicesHover && (
                      <div className="navbar-dropdown-menu">
                        {servicesSubItems.map((subItem, subIndex) => {
                          const dropdownActive = isDropdownItemActive(subItem.href)
                          return (
                            <Link
                              key={subIndex}
                              to={subItem.href}
                              className={`navbar-dropdown-item ${dropdownActive ? 'navbar-dropdown-item-active' : ''}`}
                              onClick={(e) => handleClick(subItem.href, e)}
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
                  className={`navbar-link ${active ? 'navbar-link-active' : ''}`}
                  onClick={(e) => handleClick(item.href, e)}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Desktop Create Account Button */}
          <Link
            to="/register"
            className="navbar-cta-button desktop-cta-button"
            onClick={(e) => {
              e.preventDefault()
              if (onNavigate) {
                onNavigate()
              }
              window.location.href = '/register'
            }}
          >
            Create an Account
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg className="hamburger-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => {
                setMobileMenuOpen(false)
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
                    setMobileMenuOpen(false)
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
                      <div key={index} className="mobile-menu-item">
                        <button
                          className={`mobile-menu-link ${servicesActive ? 'mobile-menu-link-active' : ''}`}
                          onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                        >
                          {item.label}
                          <svg
                            className={`mobile-dropdown-arrow ${mobileServicesOpen ? 'mobile-dropdown-arrow-open' : ''}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        {mobileServicesOpen && (
                          <div className="mobile-submenu">
                            {servicesSubItems.map((subItem, subIndex) => {
                              const dropdownActive = isDropdownItemActive(subItem.href)
                              return (
                                <Link
                                  key={subIndex}
                                  to={subItem.href}
                                  className={`mobile-submenu-item ${dropdownActive ? 'mobile-submenu-item-active' : ''}`}
                                  onClick={(e) => handleClick(subItem.href, e)}
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
                      onClick={(e) => handleClick(item.href, e)}
                    >
                      {item.label}
                    </Link>
                  )
                })}

                <Link
                  to="/register"
                  className="mobile-cta-button"
                  onClick={(e) => {
                    e.preventDefault()
                    setMobileMenuOpen(false)
                    if (onNavigate) {
                      onNavigate()
                    }
                    window.location.href = '/register'
                  }}
                >
                  Create an Account
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
