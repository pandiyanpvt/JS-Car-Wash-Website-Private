import { Link, useNavigate, useLocation } from 'react-router-dom'
import './FooterPage.css'

function FooterPage() {
  const navigate = useNavigate()
  const location = useLocation()
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
    'Vacuum Process (Pet Hair & Sand)',
    'Seats & Mats Steam',
    'Full Duco Hand Wax Polish',
    'Clean And Wipe Door Trims'
  ]

  const usefulLinks = [
    { label: 'Home', href: '/', isRoute: true },
    { label: 'About Us', href: '/about', isRoute: true },
    { label: 'Our Services', href: '/services', isRoute: true },
    { label: 'Faq', href: '#faq', isRoute: false },
    { label: 'Gallery', href: '/gallery', isRoute: true },
    { label: 'Our Testimonial', href: '#testimonial', isRoute: false },
    { label: 'Contact Us', href: '/contact', isRoute: true },
    { label: 'Blog', href: '#blog', isRoute: false }
  ]

  const handleFooterLinkClick = (href: string, isRoute: boolean, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isRoute && href.startsWith('#')) {
      e.preventDefault()
      const elementId = href.substring(1)
      
      // If not on home page, navigate to home first, then scroll
      if (location.pathname !== '/') {
        navigate('/')
        // Wait for navigation and DOM update, then scroll
        const scrollToElement = () => {
          const element = document.getElementById(elementId)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          } else {
            // Retry if element not found yet
            setTimeout(scrollToElement, 50)
          }
        }
        setTimeout(scrollToElement, 200)
      } else {
        // Already on home page, just scroll
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
        <div className="footer-content">
          {/* Our Services Section */}
          <div className="footer-section">
            <h3 className="footer-title">Our Services</h3>
            <ul className="footer-services-list">
              {services.map((service, index) => (
                <li key={index} className="footer-service-item">
                  <span className="footer-service-text">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links Section */}
          <div className="footer-section">
            <h3 className="footer-title">USEFULL LINKS</h3>
            <ul className="footer-links-list">
              {usefulLinks.map((link, index) => (
                <li key={index} className="footer-link-item">
                  {link.isRoute ? (
                    <Link to={link.href} className="footer-link">{link.label}</Link>
                  ) : (
                    <a 
                      href={link.href} 
                      className="footer-link"
                      onClick={(e) => handleFooterLinkClick(link.href, link.isRoute, e)}
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="footer-section">
            <h3 className="footer-title">NEWSLETTER</h3>
            <div className="newsletter-content">
              <p className="newsletter-text">Subscribe to our newsletter for updates and special offers.</p>
              <form className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-button">Subscribe</button>
              </form>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="footer-section">
            <h3 className="footer-title">CALL US ANYTIME</h3>
            <p className="footer-phone">02 5804 5720</p>
            
            <h3 className="footer-title footer-title-margin">VISIT OUR LOCATION</h3>
            <p className="footer-address">
              66-72 Windsor parade, Dubbo, 2830, NSW
            </p>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="footer-copyright">
          <p>©2025, JS CAR WASH, DEV By Pandiyan (PVT) LTD</p>
        </div>
      </div>
    </footer>
  )
}

export default FooterPage

