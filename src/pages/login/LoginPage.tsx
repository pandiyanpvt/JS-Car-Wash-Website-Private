import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import './LoginPage.css'
import '../products/ProductPage.css'

function LoginPage() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)

  // Navigation items
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

  const handleNavClick = useCallback((href: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
    }
    setMenuOpen(false)
    setMobileServicesOpen(false)
    window.location.href = href
  }, [])

  const getIconSVG = useCallback((iconName: string) => {
    const icons: { [key: string]: string } = {
      menu: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
      close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    }
    return icons[iconName] || ''
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = 'unset'
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

    document.body.style.overflow = 'hidden'

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [menuOpen])

  // Check if coming from /register route and switch to signup tab
  useEffect(() => {
    if (location.state?.fromRegister) {
      setActiveTab('signup')
    }
  }, [location])

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('')
  const [signUpPhone, setSignUpPhone] = useState('')

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign in logic here
    console.log('Sign In:', { email: signInEmail, password: signInPassword })
    // Navigate to home or dashboard after successful login
    // navigate('/')
  }

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign up logic here
    if (signUpPassword !== signUpConfirmPassword) {
      alert('Passwords do not match!')
      return
    }
    console.log('Sign Up:', {
      name: signUpName,
      email: signUpEmail,
      password: signUpPassword,
      phone: signUpPhone
    })
    // Navigate to home or dashboard after successful signup
    // navigate('/')
  }

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle forgot password logic here
    console.log('Forgot Password:', { email: forgotPasswordEmail })
    alert('Password reset link has been sent to your email!')
    setShowForgotPassword(false)
    setForgotPasswordEmail('')
  }

  return (
    <div className="login-page">
      {/* Fixed Hamburger Button */}
      <button
        className="header-hamburger-btn"
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          setMenuOpen(true)
        }}
        onMouseEnter={() => setMenuOpen(true)}
        aria-label="Open menu"
      >
        <svg className="header-menu-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d={getIconSVG('menu')} />
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
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
              onMouseEnter={() => setMenuOpen(true)}
              onMouseLeave={() => setMenuOpen(false)}
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
                        onMouseEnter={() => setMobileServicesOpen(true)}
                        onMouseLeave={() => setMobileServicesOpen(false)}
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="login-page-container">
        {/* Left Welcome Panel */}
        <div className="login-welcome-panel">
          <div className="login-welcome-content">
            <div className="login-logo-container">
              <img
                src="/JS Car Wash Images/cropped-fghfthgf.png"
                alt="JS Car Wash Logo"
                className="login-logo-img"
              />
            </div>
            <h2 className="login-welcome-subtitle">Nice to see you again</h2>
            <h1 className="login-welcome-title">
              WELCOME BACK
              <span className="login-welcome-underline"></span>
            </h1>
            <p className="login-welcome-text">
              Experience premium car wash and detailing services. Book your appointment today and keep your vehicle looking its best.
            </p>
          </div>
          <div className="login-welcome-background">
            <div className="login-bg-grid"></div>
            <div className="login-bg-waves"></div>
            <div className="login-bg-dots"></div>
            <div className="login-bg-circles"></div>
          </div>
        </div>

        {/* Right Login Form Panel */}
        <div className="login-form-panel">
          <div className="login-container">
            <div className="login-content">
          {/* Tabs - Hide when forgot password is shown */}
          {!showForgotPassword && (
            <div className="login-tabs">
              <button
                className={`login-tab ${activeTab === 'signin' ? 'active' : ''}`}
                onClick={() => setActiveTab('signin')}
              >
                Sign In
              </button>
              <button
                className={`login-tab ${activeTab === 'signup' ? 'active' : ''}`}
                onClick={() => setActiveTab('signup')}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Tab Content */}
          <div className="login-tab-content">
            <AnimatePresence mode="wait">
              {/* Forgot Password Form */}
              {showForgotPassword && (
                <motion.div
                  key="forgotpassword"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="login-form-container"
                >
                  <h2 className="login-form-title">Forgot Password</h2>
                  <p className="login-form-subtitle">Enter your email address and we'll send you a link to reset your password</p>
                  
                  <form onSubmit={handleForgotPassword} className="login-form">
                    <div className="login-form-group">
                      <label htmlFor="forgot-email">Email Address</label>
                      <input
                        type="email"
                        id="forgot-email"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <button type="submit" className="login-submit-btn">
                      Send Reset Link
                    </button>

                    <button 
                      type="button" 
                      className="login-back-btn"
                      onClick={() => setShowForgotPassword(false)}
                    >
                      Back to Sign In
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Sign In Form */}
              {!showForgotPassword && activeTab === 'signin' && (
                <motion.div
                  key="signin"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="login-form-container"
                >
                  <h2 className="login-form-title">Welcome Back</h2>
                  <p className="login-form-subtitle">Sign in to your account</p>
                  
                  <form onSubmit={handleSignIn} className="login-form">
                    <div className="login-form-group">
                      <label htmlFor="signin-email">Email Address</label>
                      <input
                        type="email"
                        id="signin-email"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div className="login-form-group">
                      <label htmlFor="signin-password">Password</label>
                      <input
                        type="password"
                        id="signin-password"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                      />
                    </div>

                    <div className="login-form-options">
                      <label className="login-checkbox">
                        <input type="checkbox" />
                        <span>Remember me</span>
                      </label>
                      <button 
                        type="button"
                        className="login-forgot-link"
                        onClick={() => setShowForgotPassword(true)}
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <button type="submit" className="login-submit-btn">
                      Sign In
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Sign Up Form */}
              {!showForgotPassword && activeTab === 'signup' && (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="login-form-container"
                >
                  <h2 className="login-form-title">Create Account</h2>
                  <p className="login-form-subtitle">Sign up to get started</p>
                  
                  <form onSubmit={handleSignUp} className="login-form">
                    <div className="login-form-group">
                      <label htmlFor="signup-name">Full Name</label>
                      <input
                        type="text"
                        id="signup-name"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="login-form-group">
                      <label htmlFor="signup-email">Email Address</label>
                      <input
                        type="email"
                        id="signup-email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div className="login-form-group">
                      <label htmlFor="signup-phone">Phone Number</label>
                      <input
                        type="tel"
                        id="signup-phone"
                        value={signUpPhone}
                        onChange={(e) => setSignUpPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>

                    <div className="login-form-group">
                      <label htmlFor="signup-password">Password</label>
                      <input
                        type="password"
                        id="signup-password"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        placeholder="Create a password"
                        required
                      />
                    </div>

                    <div className="login-form-group">
                      <label htmlFor="signup-confirm-password">Confirm Password</label>
                      <input
                        type="password"
                        id="signup-confirm-password"
                        value={signUpConfirmPassword}
                        onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        required
                      />
                    </div>

                    <div className="login-form-options">
                      <label className="login-checkbox">
                        <input type="checkbox" required />
                        <span>I agree to the Terms & Conditions</span>
                      </label>
                    </div>

                    <button type="submit" className="login-submit-btn">
                      Create Account
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

