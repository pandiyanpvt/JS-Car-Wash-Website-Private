import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FooterPage } from '../footer'
import Navbar from '../../components/navbar/Navbar'
import './CarDetailing.css'

function CarDetailing() {
  const navigate = useNavigate()
  
  const jsMiniDetailFeatures = [
    'Include JS police',
    'Interior Polish'
  ]

  const jsExteriorDetailFeatures = [
    'Include Exterior wash',
    'Clay bar/ Spot buff',
    'Exterior Hand Polish',
    'Wheel & Tyres',
    'Engine clean (Upon request)'
  ]

  const jsInteriorDetailFeatures = [
    'Include Js platinum',
    'interior plastic Clean',
    'Leather seat Clean',
    'fabric Seats Steam Clean',
    'Carpets & Matts Steam Clean',
    'Leather polish'
  ]

  const jsFullDetailFeatures = [
    'Include JS Polish',
    'JS Interior Details',
    'Engine Clean (Upon request)',
    'Buff (Additional charge)'
  ]

  const paintProtectionFeatures = [
    'Include JS Full Detail',
    'JS Paint Protection Treatment',
    'Buff & Cut (Additional charge)'
  ]

  return (
    <div className="car-detailing-page">
      <Navbar className="fixed-navbar" />
      {/* Page Heading Section */}
      <section className="page-heading-section">
        <div className="page-heading-overlay"></div>
        <div className="page-heading-content">
          <h1 className="page-heading-title">Car Detailing</h1>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="car-detailing-pricing-section">
        <div className="container">
          <div className="pricing-header">
            <p className="pricing-subtitle">JS CAR WASH & DETAILING</p>
            <h2 className="pricing-title">
              Car Detailing <span className="pricing-title-red">Pricing</span>
            </h2>
            <div className="pricing-lines">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className="pricing-cards-grid">
            {/* JS Mini Detail Card */}
            <motion.div
              className="pricing-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="pricing-card-header">
                <div className="pricing-price">$189 <span className="pricing-price-suffix">/ start from</span></div>
                <h3 className="pricing-card-title">JS Mini Detail</h3>
              </div>
              <button className="pricing-book-btn" onClick={() => navigate('/booking')}>Book Now</button>
              <div className="pricing-features">
                <h4 className="pricing-features-title">Package includes</h4>
                <ul className="pricing-features-list">
                  {jsMiniDetailFeatures.map((feature, index) => (
                    <li key={index} className="pricing-feature-item">
                      <i className="fas fa-check-circle pricing-check-icon"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* JS Exterior Detail Card */}
            <motion.div
              className="pricing-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="pricing-card-header">
                <div className="pricing-price">$185 <span className="pricing-price-suffix">/ start from</span></div>
                <h3 className="pricing-card-title">JS Exterior Detail</h3>
              </div>
              <button className="pricing-book-btn" onClick={() => navigate('/booking')}>Book Now</button>
              <div className="pricing-features">
                <h4 className="pricing-features-title">Package includes</h4>
                <ul className="pricing-features-list">
                  {jsExteriorDetailFeatures.map((feature, index) => (
                    <li key={index} className="pricing-feature-item">
                      <i className="fas fa-check-circle pricing-check-icon"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* JS Interior Detail Card */}
            <motion.div
              className="pricing-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="pricing-card-header">
                <div className="pricing-price">$259 <span className="pricing-price-suffix">/ start from</span></div>
                <h3 className="pricing-card-title">JS Interior Detail</h3>
              </div>
              <button className="pricing-book-btn" onClick={() => navigate('/booking')}>Book Now</button>
              <div className="pricing-features">
                <h4 className="pricing-features-title">Package includes</h4>
                <ul className="pricing-features-list">
                  {jsInteriorDetailFeatures.map((feature, index) => (
                    <li key={index} className="pricing-feature-item">
                      <i className="fas fa-check-circle pricing-check-icon"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* JS Full Detail Card */}
            <motion.div
              className="pricing-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="pricing-card-header">
                <div className="pricing-price">$350 <span className="pricing-price-suffix">/ start from</span></div>
                <h3 className="pricing-card-title">JS Full detail</h3>
              </div>
              <button className="pricing-book-btn" onClick={() => navigate('/booking')}>Book Now</button>
              <div className="pricing-features">
                <h4 className="pricing-features-title">Package includes</h4>
                <ul className="pricing-features-list">
                  {jsFullDetailFeatures.map((feature, index) => (
                    <li key={index} className="pricing-feature-item">
                      <i className="fas fa-check-circle pricing-check-icon"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Paint Protection Card */}
            <motion.div
              className="pricing-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="pricing-card-header">
                <div className="pricing-price">$799 <span className="pricing-price-suffix">/ start from</span></div>
                <h3 className="pricing-card-title">Paint protection & Ceramic Coding</h3>
              </div>
              <button className="pricing-book-btn" onClick={() => navigate('/booking')}>Book Now</button>
              <div className="pricing-features">
                <h4 className="pricing-features-title">Package includes</h4>
                <ul className="pricing-features-list">
                  {paintProtectionFeatures.map((feature, index) => (
                    <li key={index} className="pricing-feature-item">
                      <i className="fas fa-check-circle pricing-check-icon"></i>
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

export default CarDetailing
