import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import AuthModal from '../auth/AuthModal'
import ProfilePopup from '../profile/ProfilePopup'
import './Navbar.css'

interface NavbarProps {
  onNavigate?: () => void
  className?: string
  hideLogo?: boolean
}

function Navbar({ onNavigate, className = '' }: NavbarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { openCart, getTotalItems } = useCart()
  const { isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [servicesHover, setServicesHover] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin')
  const [profilePopupOpen, setProfilePopupOpen] = useState(false)
  const cartItemCount = getTotalItems()

  const navItems = [
    { label: 'Home', href: '/', route: true },
    { label: 'AboutUs', href: '/aboutus', route: true },
    { label: 'Services', href: '/services', route: true, hasDropdown: true },
    { label: 'Product', href: '/products', route: true },
    { label: 'Gallery', href: '/gallery', route: true },
    { label: 'Contact Us', href: '/contact', route: true },
    { label: 'BOOK NOW', href: '/booking', route: true }
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
    
    // Check if user is trying to access booking page without authentication
    if (href === '/booking' && !isAuthenticated) {
      setAuthModalTab('signin')
      setAuthModalOpen(true)
      return
    }
    
    if (onNavigate) {
      onNavigate()
    }
    navigate(href)
  }

  // Close mobile menu when clicking outside (but not when profile popup is open)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // Don't close if profile popup is open
      if (profilePopupOpen) {
        return
      }
      if (mobileMenuOpen && 
          !target.closest('.modern-navbar') && 
          !target.closest('.mobile-menu-overlay') &&
          !target.closest('.profile-popup') &&
          !target.closest('.profile-popup-backdrop')) {
        setMobileMenuOpen(false)
        setMobileServicesOpen(false)
      }
    }

    if (mobileMenuOpen && !profilePopupOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    } else if (!profilePopupOpen) {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (!profilePopupOpen) {
        document.body.style.overflow = 'unset'
      }
    }
  }, [mobileMenuOpen, profilePopupOpen])

  return (
    <>
      <nav className={`modern-navbar ${className}`}>
        <div className="navbar-wrapper">
          {/* Logo Section */}
          <div className="navbar-logo-section">
            <Link to="/" onClick={(e) => {
              handleClick('/', e)
              if (location.pathname === '/') {
                window.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: 'smooth'
                })
              }
            }}>
              <div className="navbar-logo-icon">
                <img
                  src="/JS Car Wash Images/cropped-fghfthgf.png"
                  alt="JS Car Wash Logo"
                  className="navbar-logo-img"
                />
              </div>
            </Link>
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

          {/* Desktop Cart Icon - Only show when authenticated */}
          {isAuthenticated && (
            <button
              className="navbar-cart-button desktop-cta-button"
              aria-label="Shopping Cart"
              onClick={openCart}
            >
              <i className="fas fa-shopping-cart"></i>
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </button>
          )}

          {/* Desktop Theme Toggle */}
          <button
            className="navbar-theme-toggle desktop-cta-button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <i className="fas fa-moon"></i>
            ) : (
              <i className="fas fa-sun"></i>
            )}
          </button>

          {/* Desktop Profile Icon or Sign In Button */}
          {isAuthenticated ? (
            <button
              className="navbar-profile-button desktop-cta-button"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setProfilePopupOpen(true)
              }}
              aria-label="Profile"
            >
              <i className="fas fa-user-circle"></i>
            </button>
          ) : (
            <button
              className="navbar-cta-button desktop-cta-button"
              onClick={() => {
                setAuthModalTab('signin')
                setAuthModalOpen(true)
              }}
            >
              Sign In
            </button>
          )}

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
                  <Link to="/" onClick={(e) => {
                    handleClick('/', e)
                    if (location.pathname === '/') {
                      window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: 'smooth'
                      })
                    }
                  }}>
                    <img
                      src="/JS Car Wash Images/cropped-fghfthgf.png"
                      alt="JS Car Wash Logo"
                      className="mobile-logo-img"
                    />
                  </Link>
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
                        <div className="mobile-menu-link-wrapper">
                          <Link
                            to={item.href}
                            className={`mobile-menu-link ${servicesActive ? 'mobile-menu-link-active' : ''}`}
                            onClick={(e) => handleClick(item.href, e)}
                          >
                            {item.label}
                          </Link>
                          <button
                            className={`mobile-dropdown-toggle ${mobileServicesOpen ? 'mobile-dropdown-toggle-open' : ''}`}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setMobileServicesOpen(!mobileServicesOpen)
                            }}
                            aria-label="Toggle services submenu"
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

                {/* Mobile Cart Icon - Only show when authenticated */}
                {isAuthenticated && (
                  <button
                    className="mobile-cta-button mobile-cart-button"
                    onClick={(e) => {
                      e.preventDefault()
                      setMobileMenuOpen(false)
                      openCart()
                    }}
                  >
                    <i className="fas fa-shopping-cart"></i> Cart
                    {cartItemCount > 0 && (
                      <span className="mobile-cart-badge">{cartItemCount}</span>
                    )}
                  </button>
                )}

                {/* Mobile Theme Toggle */}
                <button
                  className="mobile-cta-button mobile-theme-toggle"
                  onClick={(e) => {
                    e.preventDefault()
                    toggleTheme()
                  }}
                >
                  {theme === 'light' ? (
                    <>
                      <i className="fas fa-moon"></i> Dark Mode
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sun"></i> Light Mode
                    </>
                  )}
                </button>

                {isAuthenticated ? (
                  <button
                    className="mobile-cta-button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setMobileMenuOpen(false)
                      setProfilePopupOpen(true)
                    }}
                  >
                    <i className="fas fa-user-circle"></i> Profile
                  </button>
                ) : (
                  <button
                    className="mobile-cta-button"
                    onClick={(e) => {
                      e.preventDefault()
                      setMobileMenuOpen(false)
                      setAuthModalTab('signin')
                      setAuthModalOpen(true)
                    }}
                  >
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
      />
      <ProfilePopup
        isOpen={profilePopupOpen}
        onClose={() => {
          setProfilePopupOpen(false)
        }}
      />
    </>
  )
}

export default Navbar
