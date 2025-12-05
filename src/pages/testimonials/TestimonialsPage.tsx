import { useState } from 'react'
import { motion } from 'framer-motion'
import { FooterPage } from '../footer'
import Navbar from '../../components/navbar/Navbar'
import './TestimonialsPage.css'

interface Testimonial {
  id: number
  name: string
  email: string
  testimonial: string
  rating: number
}

function TestimonialsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    testimonial: '',
    rating: 0
  })

  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 1,
      name: 'Naju',
      email: 'najukanna123@gmail.com',
      testimonial: 'Good Services',
      rating: 5
    },
    {
      id: 2,
      name: 'Kanna',
      email: 'kanna@gmail.com',
      testimonial: 'Very Good services to provide for customers.',
      rating: 5
    }
  ])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.testimonial && formData.rating > 0) {
      const newTestimonial: Testimonial = {
        id: testimonials.length + 1,
        name: formData.name,
        email: formData.email,
        testimonial: formData.testimonial,
        rating: formData.rating
      }
      setTestimonials(prev => [newTestimonial, ...prev])
      setFormData({
        name: '',
        email: '',
        testimonial: '',
        rating: 0
      })
      alert('Thank you for your feedback!')
    } else {
      alert('Please fill in all required fields (Name, Testimonial, and Rating)')
    }
  }

  return (
    <div className="testimonials-page" id="testimonial">
      <Navbar className="fixed-navbar" hideLogo={true} />
      {/* Page Heading Section */}
      <section className="page-heading-section">
        <div className="page-heading-overlay"></div>
        <div className="page-heading-content">
          <h1 className="page-heading-title">Our Testimonial</h1>
        </div>
      </section>

      {/* Feedback Form Section */}
      <section className="testimonials-form-section">
        <div className="container">
          <div className="testimonials-form-header">
            <p className="testimonials-subtitle">JS CAR WASH</p>
            <h2 className="testimonials-title">
              Write your <span className="testimonials-title-red">Feedback</span>
            </h2>
            <div className="testimonials-lines">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <form className="testimonials-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="testimonial" className="form-label">
                Testimonial <span className="required">*</span>
              </label>
              <textarea
                id="testimonial"
                name="testimonial"
                value={formData.testimonial}
                onChange={handleChange}
                className="form-textarea"
                rows={6}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">
                Rate <span className="required">*</span>
              </label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-button ${formData.rating >= star ? 'star-filled' : 'star-empty'}`}
                    onClick={() => handleRatingClick(star)}
                    aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="submit-button">
              SUBMIT ENTRY
            </button>
          </form>
        </div>
      </section>

      {/* Client Feedbacks Section */}
      <section className="client-feedbacks-section">
        <div className="container">
          <div className="feedbacks-header">
            <p className="feedbacks-subtitle">JS CAR WASH</p>
            <h2 className="feedbacks-title">
              Our Client <span className="feedbacks-title-red">Feedbacks</span>
            </h2>
            <div className="feedbacks-lines">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className="feedbacks-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="feedback-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="feedback-profile">
                  <div className="feedback-avatar">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="feedback-user-info">
                    <h3 className="feedback-name">{testimonial.name}</h3>
                    <p className="feedback-email">{testimonial.email}</p>
                  </div>
                </div>
                <div className="feedback-bubble">
                  <p className="feedback-text">{testimonial.testimonial}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FooterPage />
    </div>
  )
}

export default TestimonialsPage
