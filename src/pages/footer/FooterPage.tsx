import { useLocation } from 'react-router-dom'
import './FooterPage.css'

function FooterPage() {
  const location = useLocation()

  const handleFooterLinkClick = (href: string, isRoute: boolean, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isRoute) {
      e.preventDefault()
      window.location.href = href
    } else if (href.startsWith('#')) {
      e.preventDefault()
      const elementId = href.substring(1)
      
      if (location.pathname !== '/') {
        window.location.href = '/'
        const scrollToElement = () => {
          const element = document.getElementById(elementId)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          } else {
            setTimeout(scrollToElement, 50)
          }
        }
        setTimeout(scrollToElement, 200)
      } else {
        const element = document.getElementById(elementId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }
  }

  return (
    <footer className="footer-page">
      <div className="footer-container">
        {/* Top Section with Gradient Line */}
        <div className="footer-top-line"></div>
        
        <div className="footer-content">
          {/* Left Section - Company Info */}
          <div className="footer-left-section">
            <div className="footer-logo-wrapper">
              <div className="footer-logo">
                <img 
                  src="/JS Car Wash Images/cropped-fghfthgf.png" 
                  alt="JS Car Wash Logo" 
                  className="footer-logo-img"
                />
                <div className="footer-logo-text-wrapper">
                  <span className="footer-logo-text">JS</span>
                  <span className="footer-logo-subtext">CAR WASH</span>
                </div>
              </div>
            </div>
            <p className="footer-description">
              JS Car Wash empowers customers to transform their vehicles into pristine condition - making car care easier, more accessible, and more effective.
            </p>
            <div className="footer-social">
              <a href="#" className="social-icon" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="social-icon" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="social-icon" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="social-icon" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="footer-nav-columns">
            <div className="footer-nav-column">
              <h3 className="footer-nav-title">Quick Links</h3>
              <ul className="footer-nav-list">
                <li><a href="/products" onClick={(e) => handleFooterLinkClick('/products', true, e)}>Products</a></li>
                <li><a href="/services" onClick={(e) => handleFooterLinkClick('/services', true, e)}>Services</a></li>
                <li><a href="/booking" onClick={(e) => handleFooterLinkClick('/booking', true, e)}>Booking</a></li>
                <li><a href="/gallery" onClick={(e) => handleFooterLinkClick('/gallery', true, e)}>Gallery</a></li>
              </ul>
            </div>

            <div className="footer-nav-column">
              <h3 className="footer-nav-title">Support</h3>
              <ul className="footer-nav-list">
                <li><a href="/faq" onClick={(e) => handleFooterLinkClick('/faq', true, e)}>FAQ</a></li>
                <li><a href="/testimonial" onClick={(e) => handleFooterLinkClick('/testimonial', true, e)}>Testimonials</a></li>
                <li><a href="/aboutus" onClick={(e) => handleFooterLinkClick('/aboutus', true, e)}>About Us</a></li>
                <li><a href="/contact" onClick={(e) => handleFooterLinkClick('/contact', true, e)}>Contact</a></li>
              </ul>
            </div>

            <div className="footer-nav-column">
              <h3 className="footer-nav-title">Contact Info</h3>
              <ul className="footer-nav-list">
                <li className="footer-contact-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <span>02 5804 5720</span>
                </li>
                <li className="footer-contact-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <span>info@jscarwash.com.au</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copyright-text">
              © 2025 JS CAR WASH. All rights reserved.
            </p>
            <p className="footer-dev-text">
              Developed by <span>Pandiyan (PVT) LTD</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterPage
