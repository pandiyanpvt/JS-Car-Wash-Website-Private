import './FooterPage.css'

function FooterPage() {
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
    'Home',
    'About Us',
    'Our Services',
    'Faq',
    'Gallery',
    'Our Testimonial',
    'Contact Us',
    'Blog'
  ]

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
                  <a href="#" className="footer-link">{link}</a>
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

