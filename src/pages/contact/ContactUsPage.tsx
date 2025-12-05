import { useState } from 'react'
import { FooterPage } from '../footer'
import PageHeading from '../../components/PageHeading'
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
      <PageHeading title="Contact Us" />
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

        {/* Map Section */}
        <div className="map-section">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d431895.0726953198!2d148.631!3d-32.253232!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b0f734ad0c1d615%3A0xe2dddee3b54e4e93!2sJS%20Car%20Wash%20and%20Detailing!5e0!3m2!1sen!2sus!4v1763360957951!5m2!1sen!2sus"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="contact-map"
            title="JS Car Wash Location"
          ></iframe>
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

