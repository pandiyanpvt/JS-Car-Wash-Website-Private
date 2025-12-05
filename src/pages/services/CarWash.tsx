import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FooterPage } from '../footer'
import Navbar from '../../components/navbar/Navbar'
import './CarWash.css'

function CarWash() {
  const navigate = useNavigate()
  
  const jsPolishFeatures = [
    'High - Pressure - rinse',
    'Exterior Wash with pH neutral shampoo',
    'Apply tyer shine',
    'Exterior windows and side mirrirs clean',
    'Mag wheel wash process',
    'Vacuum interior floor mats and footwells',
    'Vacuum seats and boot',
    'Wipe door and boot jambs',
    'Interior windows and mirrors clean',
    'Clean and wipe dashboard and console',
    'Clean and wipe door trims',
    'Full Duco Hand Wax Polish'
  ]

  const jsPlatinumFeatures = [
    'High - Pressure - rinse',
    'Exterior Wash with pH neutral shampoo',
    'Apply tyer shine',
    'Exterior windows and side mirrirs clean',
    'Mag wheel wash process',
    'Vacuum interior floor mats and footwells',
    'Vacuum seats and boot',
    'Wipe door and boot jambs',
    'Interior windows and mirrors clean',
    'Clean and wipe dashboard and console',
    'Clean and wipe door trims'
  ]

  const jsExpressFeatures = [
    'High - Pressure - rinse',
    'Exterior Wash with pH neutral shampoo',
    'Apply tyer shine',
    'Exterior windows and side mirrirs clean'
  ]

  const jsExpressExcluded = [
    'Mag wheel wash process',
    'Vacuum interior floor mats and footwells',
    'Vacuum seats and boot',
    'Wipe door and boot jambs',
    'Interior windows and mirrors clean',
    'Clean and wipe dashboard and console',
    'Clean and wipe door trims'
  ]

  return (
    <div className="car-wash-page">
      <Navbar className="fixed-navbar" />
      {/* Page Heading Section */}
      <section className="page-heading-section">
        <div className="page-heading-overlay"></div>
        <div className="page-heading-content">
          <h1 className="page-heading-title">Car Wash</h1>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="car-wash-pricing-section">
        <div className="container">
          <div className="pricing-header">
            <p className="pricing-subtitle">JS CAR WASH</p>
            <h2 className="pricing-title">
              Car Wash <span className="pricing-title-red">Pricing</span>
            </h2>
            <div className="pricing-lines">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className="pricing-cards-grid">
            {/* JS Polish Card */}
            <motion.div
              className="pricing-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="pricing-card-header">
                <div className="pricing-price">$149 <span className="pricing-price-suffix">/ start from</span></div>
                <h3 className="pricing-card-title">JS Polish</h3>
              </div>
              <button className="pricing-book-btn" onClick={() => navigate('/booking')}>Book Now</button>
              <div className="pricing-features">
                <h4 className="pricing-features-title">Package includes</h4>
                <ul className="pricing-features-list">
                  {jsPolishFeatures.map((feature, index) => (
                    <li key={index} className="pricing-feature-item">
                      <i className="fas fa-check-circle pricing-check-icon"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* JS Platinum Card */}
            <motion.div
              className="pricing-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="pricing-card-header">
                <div className="pricing-price">$69 <span className="pricing-price-suffix">/ start from</span></div>
                <h3 className="pricing-card-title">JS Platinum</h3>
              </div>
              <button className="pricing-book-btn" onClick={() => navigate('/booking')}>Book Now</button>
              <div className="pricing-features">
                <h4 className="pricing-features-title">Package includes</h4>
                <ul className="pricing-features-list">
                  {jsPlatinumFeatures.map((feature, index) => (
                    <li key={index} className="pricing-feature-item">
                      <i className="fas fa-check-circle pricing-check-icon"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* JS Express Card */}
            <motion.div
              className="pricing-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="pricing-card-header">
                <div className="pricing-price">$39 <span className="pricing-price-suffix">/ start from</span></div>
                <h3 className="pricing-card-title">JS Express</h3>
              </div>
              <button className="pricing-book-btn" onClick={() => navigate('/booking')}>Book Now</button>
              <div className="pricing-features">
                <h4 className="pricing-features-title">Package includes</h4>
                <ul className="pricing-features-list">
                  {jsExpressFeatures.map((feature, index) => (
                    <li key={index} className="pricing-feature-item">
                      <i className="fas fa-check-circle pricing-check-icon"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                  {jsExpressExcluded.map((feature, index) => (
                    <li key={`excluded-${index}`} className="pricing-feature-item pricing-feature-excluded">
                      <i className="fas fa-times-circle pricing-x-icon"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <FooterPage />
    </div>
  )
}

export default CarWash
