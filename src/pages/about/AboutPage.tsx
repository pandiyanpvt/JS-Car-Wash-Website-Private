import { motion } from 'framer-motion'
import './AboutPage.css'

function AboutPage() {
  return (
    <div className="about-page">
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
                  src="/JS Car Wash Images/zas-890x664-1.png"
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
                  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                  </svg>
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
                  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor"/>
                  </svg>
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
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
                  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                  </svg>
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
                  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                  </svg>
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
    </div>
  )
}

export default AboutPage


