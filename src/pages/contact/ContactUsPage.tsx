import { useState } from 'react'
import { FooterPage } from '../footer'
import Navbar from '../../components/navbar/Navbar'
import './ContactUsPage.css'

function ContactUsPage() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
  }

  return (
    <div className="contact-page" id="contact">
      <Navbar className="fixed-navbar" hideLogo={true} />
      {/* Page Heading Section */}
      <section className="page-heading-section">
        <div className="page-heading-overlay"></div>
        <div className="page-heading-content">
          <h1 className="page-heading-title">Contact Us</h1>
        </div>
      </section>
      <div className="container">
        {/* Contact Info Section */}
        <div className="contact-info-section">
          <div className="contact-info-grid">
            {/* Call Us Anytime */}
            <div className="contact-info-card">
              <div className="contact-icon">
                <i className="fas fa-phone"></i>
              </div>
              <div className="contact-info-content">
                <h3 className="contact-info-title">Call Us Anytime</h3>
                <p className="contact-info-value">
                  <a href="tel:0258045720" className="contact-link">02 5804 5720</a>
                </p>
              </div>
            </div>

            {/* Send Us Mail */}
            <div className="contact-info-card">
              <div className="contact-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="contact-info-content">
                <h3 className="contact-info-title">SEND US MAIL</h3>
                <p className="contact-info-value">
                  <a href="mailto:info@jscarwash.com.au" className="contact-link">info@jscarwash.com.au</a>
                </p>
              </div>
            </div>

            {/* Visit Us */}
            <div className="contact-info-card">
              <div className="contact-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="contact-info-content">
                <h3 className="contact-info-title">VISIT US</h3>
                <p className="contact-info-value">
                  66-72 Windsor parade, Dubbo, 2830, NSW
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Branches Section */}
        <div className="branches-section">
          <div className="branches-header">
            <h2 className="branches-title">Our Branches</h2>
            <p className="branches-subtitle">Visit us at any of our locations</p>
          </div>

          <div className="branches-grid">
            {/* Branch 1 - Dubbo */}
            <div className="branch-card">
              <div className="branch-header">
                <h3 className="branch-name">JS Car Wash and Detailing</h3>
                <p className="branch-subtitle">Dubbo</p>
              </div>
              <div className="branch-info">
                <div className="branch-address">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>66-72 Windsor parade, Dubbo, 2830, NSW</span>
                </div>
                <div className="branch-actions">
                  <a
                    href="https://maps.app.goo.gl/o8hPg2ap39zBX77H7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="branch-directions-btn"
                  >
                    <i className="fas fa-directions"></i>
                    Get Directions
                  </a>
                </div>
              </div>
              <div className="branch-map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3374.180424993968!2d148.6284251755715!3d-32.253227437203996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b0f734ad0c1d615%3A0xe2dddee3b54e4e93!2sJS%20Car%20Wash%20and%20Detailing!5e0!3m2!1sen!2slk!4v1764846725165!5m2!1sen!2slk"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="branch-map-iframe"
                  title="JS Car Wash and Detailing - Dubbo"
                ></iframe>
              </div>
            </div>

            {/* Branch 2 - Toongabbie */}
            <div className="branch-card">
              <div className="branch-header">
                <h3 className="branch-name">JS Car wash and Premium Detailing</h3>
                <p className="branch-subtitle">Toongabbie</p>
              </div>
              <div className="branch-info">
                <div className="branch-address">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>Portico Plaza Shop Ground Floor Parking, 17-19 Aurelia Street, Portico Plaza Shopping Centre, Car park entrance Cornelia RD, Junia Ave, Toongabbie NSW 2146, Australia</span>
                </div>
                <div className="branch-actions">
                  <a
                    href="https://maps.app.goo.gl/PgpM3vrZHKQ1rK8B8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="branch-directions-btn"
                  >
                    <i className="fas fa-directions"></i>
                    Get Directions
                  </a>
                </div>
              </div>
              <div className="branch-map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3315.965734607781!2d150.94737837564423!3d-33.78738301484629!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b129950237d3ef5%3A0x14338f06235cd8bf!2sJS%20Car%20wash%20and%20Premium%20Detailing!5e0!3m2!1sen!2slk!4v1764846756939!5m2!1sen!2slk"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="branch-map-iframe"
                  title="JS Car wash and Premium Detailing"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="contact-form-section">
          <div className="contact-form-header">
            <h2 className="contact-form-title">SEND US MAIL</h2>
            <h3 className="contact-form-subtitle">FEEL FREE TO ASK US ANYTHING</h3>
            <p className="contact-form-description">
              For any feedback related to your wash experience please click on 'Recent Wash Experience' above. Alternatively, if you wish to contact us directly, please use any of the channels below. Thank you.
            </p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullname" className="form-label">Fullname</label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject" className="form-label">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">Text</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-textarea"
                rows={6}
                required
              ></textarea>
            </div>

            <button type="submit" className="form-submit-button">
              Send Message
            </button>
          </form>
        </div>
      </div>
      <FooterPage />
    </div>
  )
}

export default ContactUsPage

