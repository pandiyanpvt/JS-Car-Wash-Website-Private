import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FooterPage } from '../footer'
import Navbar from '../../components/navbar/Navbar'
import type { ApiReview } from '../../services/api'
import { reviewApi } from '../../services/api'
import SEO from '../../components/SEO'
import './AboutPage.css'

function AboutPage() {
  const [reviews, setReviews] = useState<ApiReview[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loadingReviews, setLoadingReviews] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchReviews = async () => {
      try {
        const response = await reviewApi.getAll()
        if (!isMounted) return

        const visibleReviews = (response.data || []).filter(
          (review) => review.is_active && review.is_show_others
        )

        setReviews(visibleReviews)
        setCurrentIndex(0)
      } catch (error) {
        console.error('Failed to load reviews:', error)
      } finally {
        if (isMounted) {
          setLoadingReviews(false)
        }
      }
    }

    fetchReviews()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!reviews.length) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [reviews.length])

  useEffect(() => {
    if (currentIndex >= reviews.length && reviews.length > 0) {
      setCurrentIndex(0)
    }
  }, [reviews.length, currentIndex])

  const slides = useMemo(() => reviews, [reviews])

  const handlePrevious = () => {
    if (!slides.length) return
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const handleNext = () => {
    if (!slides.length) return
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  return (
    <div className="about-page" id="about">
      <SEO
        title="About Us | JS Car Wash & Detailing"
        description="Learn more about JS Car Wash & Detailing. A family-owned business providing professional hand wash and car detailing in Australia for over 10 years."
        canonical="https://www.jscarwash.com/aboutus"
      />
      <Navbar className="fixed-navbar" hideLogo={true} />
      {/* Page Heading Section */}
      <section className="page-heading-section">
        <div className="page-heading-overlay"></div>
        <div className="page-heading-content">
          <h1 className="page-heading-title">About Us</h1>
        </div>
      </section>
      {/* About JS Car Wash Section */}
      <section className="about-js-section">
        <div className="container">
          <div className="about-js-content">
            {/* Left Side - Text Content */}
            <motion.div
              className="about-js-text-wrapper"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="about-js-heading">
                <p className="about-js-subtitle">JS CAR WASH</p>
                <h2 className="about-js-title">
                  About <span className="about-js-title-accent">JS Car Wash</span>
                </h2>
                <div className="about-js-lines">
                  <div className="about-js-line about-js-line-red"></div>
                  <div className="about-js-line about-js-line-red"></div>
                  <div className="about-js-line about-js-line-red"></div>
                </div>
              </div>
              <div className="about-js-description">
                <p>
                  JS Car Wash is Australia's premier professional hand wash and detailing provider.
                  For over 10 years, JS Car Wash has been a family-owned, private company that thrives
                  in an atmosphere of determination and innovation. We take pride in offering unparalleled service,
                  ensuring that every customer leaves with that new car feeling. JS Car Wash is dedicated to making
                  car cleaning an affordable and convenient experience.
                </p>
              </div>
              {/* Contact Information */}
              <div className="about-js-contact">
                <div className="about-js-contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor" />
                  </svg>
                </div>
                <div className="about-js-contact-info">
                  <p className="about-js-contact-label">Contact now</p>
                  <p className="about-js-contact-phone">02 5804 5720</p>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Image */}
            <motion.div
              className="about-js-images-wrapper"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="about-js-images-container">
                <div className="about-js-image-single">
                  <img
                    src="/JS Car Wash Images/5659.png"
                    alt="JS Car Wash"
                    className="about-js-img"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefit of Service Section */}
      <section className="benefit-section">
        <div className="container">
          <div className="benefit-content">
            {/* Left Side - Image */}
            <motion.div
              className="benefit-image-wrapper"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="benefit-image-container">
                <img
                  src="/JS Car Wash Images/Clean and Wipe Dashboard and Console.png"
                  alt="Car Interior Cleaning"
                  className="benefit-image"
                />
              </div>
            </motion.div>

            {/* Right Side - Text Content with Heading */}
            <motion.div
              className="benefit-text-wrapper"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Heading Section */}
              <div className="benefit-heading">
                <p className="benefit-subtitle">JS CAR WASH</p>
                <h2 className="benefit-title">
                  Benefit of <span className="benefit-title-accent">Service</span>
                </h2>
                <div className="benefit-lines">
                  <div className="benefit-line benefit-line-red"></div>
                  <div className="benefit-line benefit-line-red"></div>
                  <div className="benefit-line benefit-line-red"></div>
                </div>
              </div>

              <p className="benefit-text">
                <strong>JS Car Wash's</strong> dedication to excellence has drawn top talent from across the car wash industry. Our entire senior leadership team brings hands-on experience, having owned and operated car wash sites themselves. They are deeply committed to constantly refining the car wash process to enhance the customer experience.
              </p>

              <p className="benefit-quote">
                A passion for car detailing is at the heart of everything we do
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="about-testimonials-section">
        <div className="container">
          <div className="about-testimonials-header">
            <p className="about-testimonials-subtitle">JS CAR WASH</p>
            <h2 className="about-testimonials-title">
              What our <span className="about-testimonials-accent">customers</span> say
            </h2>
            <div className="about-testimonials-lines">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className="about-testimonials-wrapper">
            <button
              className="about-testimonials-nav about-testimonials-nav-prev"
              type="button"
              onClick={handlePrevious}
              aria-label="Previous testimonial"
              disabled={!slides.length}
            >
              ‹
            </button>

            <div className="about-testimonials-window">
              <div
                className="about-testimonials-track"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {slides.length === 0 && !loadingReviews ? (
                  <div className="about-testimonials-empty">
                    <p>No testimonials to show yet.</p>
                  </div>
                ) : (
                  slides.map((review) => {
                    const reviewerName =
                      review.order?.user_full_name ||
                      [review.order?.user?.first_name, review.order?.user?.last_name]
                        .filter(Boolean)
                        .join(' ') ||
                      'Customer'
                    const reviewerEmail = review.order?.user_email_address || review.order?.user?.email_address

                    return (
                      <div className="about-testimonial-card" key={review.id}>
                        <div className="about-testimonial-rating">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <span
                              key={index}
                              className={index < review.rating ? 'star filled' : 'star'}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <p className="about-testimonial-text">{review.review}</p>
                        <div className="about-testimonial-author">
                          <div className="about-testimonial-avatar" aria-hidden>
                            {reviewerName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="about-testimonial-name">{reviewerName}</p>
                            {reviewerEmail && (
                              <p className="about-testimonial-email">{reviewerEmail}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            <button
              className="about-testimonials-nav about-testimonials-nav-next"
              type="button"
              onClick={handleNext}
              aria-label="Next testimonial"
              disabled={!slides.length}
            >
              ›
            </button>
          </div>

          <div className="about-testimonials-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`about-testimonials-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Show testimonial ${index + 1}`}
              />
            ))}
          </div>

          {loadingReviews && (
            <div className="about-testimonials-loading">
              <p>Loading testimonials...</p>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section with Car Image */}
      <section className="benefits-section">
        <div className="container">
          <div className="benefits-grid">
            {/* Left Column - Two Feature Blocks */}
            <div className="benefits-column">
              {/* Professional Team */}
              <motion.div
                className="feature-block"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="feature-icon-container">
                  <i className="fas fa-users feature-icon"></i>
                </div>
                <h3 className="feature-title">Professional Team</h3>
                <p className="feature-description">
                  Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches.
                </p>
              </motion.div>

              {/* Delivery on Time */}
              <motion.div
                className="feature-block"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="feature-icon-container">
                  <i className="fas fa-shipping-fast feature-icon"></i>
                </div>
                <h3 className="feature-title">Delivery on Time</h3>
                <p className="feature-description">
                  Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches.
                </p>
              </motion.div>
            </div>

            {/* Middle Column - Car Wireframe Image */}
            <motion.div
              className="car-wireframe-wrapper"
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              <div className="car-wireframe-container">
                <img
                  src="/JS Car Wash Images/gtr-1.png"
                  alt="Car Wireframe"
                  className="car-wireframe-img"
                />
              </div>
            </motion.div>

            {/* Right Column - Two Feature Blocks */}
            <div className="benefits-column">
              {/* Quality Products */}
              <motion.div
                className="feature-block"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="feature-icon-container">
                  <i className="fas fa-award feature-icon"></i>
                </div>
                <h3 className="feature-title">Quality Products</h3>
                <p className="feature-description">
                  Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches.
                </p>
              </motion.div>

              {/* Manufacturing Unit */}
              <motion.div
                className="feature-block"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="feature-icon-container">
                  <i className="fas fa-industry feature-icon"></i>
                </div>
                <h3 className="feature-title">Manufacturing Unit</h3>
                <p className="feature-description">
                  Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      <FooterPage />
    </div>
  )
}

export default AboutPage


