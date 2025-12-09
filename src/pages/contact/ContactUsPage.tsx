import { useState, useEffect } from 'react'
import { FooterPage } from '../footer'
import Navbar from '../../components/navbar/Navbar'
import { useAuth } from '../../contexts/AuthContext'
import { contactApi } from '../../services/api'
import ContactSuccessModal from '../../components/contact/ContactSuccessModal'
import './ContactUsPage.css'

interface Branch {
  id: number
  branch_name: string
  address: string
  phone_number: string
  email_address: string
  is_active: boolean
  createdAt: string
  updatedAt: string
}

function ContactUsPage() {
  const { user } = useAuth()
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    subject: '',
    message: ''
  })

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true)
        const response = await contactApi.getBranches()
        if (response.success && response.data) {
          setBranches(response.data.filter(branch => branch.is_active))
        }
      } catch (error) {
        console.error('Error fetching branches:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBranches()
  }, [])

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullname: `${user.firstName} ${user.lastName}`,
        email: user.email
      }))
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')
    setSubmitSuccess(false)

    try {
      const response = await contactApi.submitContact({
        full_name: formData.fullname,
        email_address: formData.email,
        subject: formData.subject,
        message: formData.message,
        is_active: true
      })

      if (response.success) {
        setSubmitSuccess(true)
        setFormData({
          fullname: user ? `${user.firstName} ${user.lastName}` : '',
          email: user ? user.email : '',
          subject: '',
          message: ''
        })
      } else {
        setSubmitError(response.message || 'Failed to submit contact form')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while submitting the form'
      setSubmitError(errorMessage)
    } finally {
      setSubmitting(false)
    }
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
        {/* Branches Section */}
        <div className="branches-section">
          <div className="branches-header">
            <h2 className="branches-title">Our Branches</h2>
            <p className="branches-subtitle">Visit us at any of our locations</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Loading branches...</p>
            </div>
          ) : (
            <div className="branches-grid">
              {branches.map((branch) => {
                const isDubbo = branch.branch_name.toLowerCase().includes('dubbo')
                const isToongabbie = branch.branch_name.toLowerCase().includes('toongabbie')
                
                let mapUrl = ''
                let directionsUrl = ''
                
                if (isDubbo) {
                  mapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3374.180424993968!2d148.6284251755715!3d-32.253227437203996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b0f734ad0c1d615%3A0xe2dddee3b54e4e93!2sJS%20Car%20Wash%20and%20Detailing!5e0!3m2!1sen!2slk!4v1764846725165!5m2!1sen!2slk'
                  directionsUrl = 'https://maps.app.goo.gl/o8hPg2ap39zBX77H7'
                } else if (isToongabbie) {
                  mapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3315.965734607781!2d150.94737837564423!3d-33.78738301484629!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b129950237d3ef5%3A0x14338f06235cd8bf!2sJS%20Car%20wash%20and%20Premium%20Detailing!5e0!3m2!1sen!2slk!4v1764846756939!5m2!1sen!2slk'
                  directionsUrl = 'https://maps.app.goo.gl/PgpM3vrZHKQ1rK8B8'
                }

                return (
                  <div key={branch.id} className="branch-card">
                    <div className="branch-header">
                      <h3 className="branch-name">{branch.branch_name}</h3>
                      <p className="branch-subtitle">
                        {isDubbo ? 'Dubbo' : isToongabbie ? 'Toongabbie' : ''}
                      </p>
                    </div>

                    <div className="contact-info-section">
                      <div className="contact-info-grid">
                        <div className="contact-info-card">
                          <div className="contact-icon">
                            <i className="fas fa-phone"></i>
                          </div>
                          <div className="contact-info-content">
                            <h3 className="contact-info-title">Call Us Anytime</h3>
                            <p className="contact-info-value">
                              <a href={`tel:${branch.phone_number.trim()}`} className="contact-link">
                                {branch.phone_number.trim()}
                              </a>
                            </p>
                          </div>
                        </div>

                        <div className="contact-info-card">
                          <div className="contact-icon">
                            <i className="fas fa-envelope"></i>
                          </div>
                          <div className="contact-info-content">
                            <h3 className="contact-info-title">SEND US MAIL</h3>
                            <p className="contact-info-value">
                              <a href={`mailto:${branch.email_address}`} className="contact-link">
                                {branch.email_address}
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="branch-info">
                      <div className="branch-address">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{branch.address}</span>
                      </div>
                      <div className="branch-actions">
                        {directionsUrl && (
                          <a
                            href={directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="branch-directions-btn"
                          >
                            <i className="fas fa-directions"></i>
                            Get Directions
                          </a>
                        )}
                      </div>
                    </div>
                    {mapUrl && (
                      <div className="branch-map">
                        <iframe
                          src={mapUrl}
                          width="100%"
                          height="450"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="branch-map-iframe"
                          title={branch.branch_name}
                        ></iframe>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
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
            {submitError && (
              <div className="error-message-box">
                <div className="error-message-icon">
                  <i className="fas fa-exclamation-circle"></i>
                </div>
                <div className="error-message-content">
                  <p className="error-message-text">{submitError}</p>
                </div>
              </div>
            )}

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
                  disabled={!!user}
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
                  disabled={!!user}
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

            <button type="submit" className="form-submit-button" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
      <FooterPage />
      <ContactSuccessModal
        isOpen={submitSuccess}
        onClose={() => setSubmitSuccess(false)}
      />
    </div>
  )
}

export default ContactUsPage

