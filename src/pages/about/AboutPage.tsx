import { motion } from 'framer-motion'
import { FooterPage } from '../footer'
import PageHeading from '../../components/PageHeading'
import './AboutPage.css'

function AboutPage() {
  return (
    <div className="about-page" id="about">
      <PageHeading title="About Us" />
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
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/>
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


