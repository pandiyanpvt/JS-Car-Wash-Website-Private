import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import './ProductPage.css'

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  image: string
  rating?: number
}

function ProductPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const location = useLocation()

  // Sample products data
  const products: Product[] = useMemo(() => [
    {
      id: 1,
      name: 'Premium Car Wax',
      description: 'High-quality car wax for long-lasting shine and protection',
      price: 134.12,
      stock: 25,
      image: '/JS Car Wash Images/Hand Polish.jpg',
      rating: 5.0
    },
    {
      id: 2,
      name: 'Interior Cleaner',
      description: 'Professional interior cleaner for all car surfaces',
      price: 89.99,
      stock: 18,
      image: '/JS Car Wash Images/Leather Clean.png',
      rating: 5.0
    },
    {
      id: 3,
      name: 'Tire Shine Spray',
      description: 'Premium tire shine for a glossy, black finish',
      price: 45.50,
      stock: 32,
      image: '/JS Car Wash Images/Tyre Shine.png',
      rating: 5.0
    },
    {
      id: 4,
      name: 'Headlight Restorer',
      description: 'Restore cloudy headlights to crystal clear',
      price: 67.99,
      stock: 15,
      image: '/JS Car Wash Images/Headlight Restoration.jpg',
      rating: 5.0
    },
    {
      id: 5,
      name: 'Clay Bar Kit',
      description: 'Complete clay bar kit for paint decontamination',
      price: 125.00,
      stock: 20,
      image: '/JS Car Wash Images/Clay Bar.jpg',
      rating: 5.0
    },
    {
      id: 6,
      name: 'Buff Polish Compound',
      description: 'Professional buff polish for removing scratches',
      price: 98.75,
      stock: 22,
      image: '/JS Car Wash Images/Buff Polish.jpg',
      rating: 5.0
    },
    {
      id: 7,
      name: 'Carpet Steam Cleaner',
      description: 'Deep cleaning solution for car carpets and mats',
      price: 76.50,
      stock: 28,
      image: '/JS Car Wash Images/Carpet Steam Clean.jpg',
      rating: 5.0
    },
    {
      id: 8,
      name: 'Sticker Remover',
      description: 'Safe adhesive remover for stickers and decals',
      price: 34.99,
      stock: 40,
      image: '/JS Car Wash Images/Sticker Removal.jpg',
      rating: 5.0
    },
    {
      id: 9,
      name: 'Full Duco Wax',
      description: 'Premium hand wax polish for complete car protection',
      price: 149.99,
      stock: 12,
      image: '/JS Car Wash Images/Full Duco Hand Wax Polish.jpg',
      rating: 5.0
    },
    {
      id: 10,
      name: 'Bugs & Tar Remover',
      description: 'Effective cleaner for removing bugs and tar',
      price: 55.25,
      stock: 30,
      image: '/JS Car Wash Images/Bugs & Tar Removal.png',
      rating: 5.0
    }
  ], [])

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

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    })
  }, [products, searchQuery])

  const handleAddToCart = useCallback((product: Product) => {
    // Add to cart logic here
    console.log('Added to cart:', product)
    // You can implement cart state management here
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

  return (
    <div className="product-page">
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

      {/* Top Navigation Bar */}
      <div className="product-page-header">
        <div className="product-header-content">
          {/* Search Bar */}
          <div className="product-search-container">
            <input
              type="text"
              className="product-search-input"
              placeholder="Search your product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="product-search-icon-btn" aria-label="Search">
              <i className="fas fa-search"></i>
            </button>
          </div>

          {/* Right Side Icons */}
          <div className="product-header-icons">
            {/* Shopping Cart */}
            <button className="product-header-icon-btn" aria-label="Shopping Cart">
              <i className="fas fa-shopping-cart"></i>
            </button>

            {/* Notification Bell */}
            <button className="product-header-icon-btn notification-btn" aria-label="Notifications">
              <i className="fas fa-bell"></i>
              <span className="notification-badge">3</span>
            </button>

            {/* User Profile with Dropdown */}
            <div className="product-user-profile">
              <button className="product-header-icon-btn user-profile-btn" aria-label="User Profile">
                <div className="user-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <i className="fas fa-angle-down"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="product-page-content">
        <div className="product-page-container">
          {/* Products Grid - 5 cards per row */}
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                {/* Product Image */}
                <div className="product-card-image-wrapper">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-card-image"
                    loading="lazy"
                  />
                </div>

                {/* Product Info */}
                <div className="product-card-content">
                  <h3 className="product-card-name">{product.name}</h3>
                  <p className="product-card-description">{product.description}</p>
                  
                  <div className="product-card-details">
                    <div className="product-stock">
                      <span className="product-stock-label">Available Stock:</span>
                      <span className="product-stock-value">{product.stock}</span>
                    </div>
                    <div className="product-price">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    className="product-add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="product-empty-state">
              <p>No products found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductPage

