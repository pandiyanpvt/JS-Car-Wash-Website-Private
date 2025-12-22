import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FooterPage } from '../footer'
import Navbar from '../../components/navbar/Navbar'
import { packageApi } from '../../services/api'
import type { ServicePackage } from '../../services/api'
import './CarWash.css'

function CarWash() {
  const navigate = useNavigate()
  const [packages, setPackages] = useState<ServicePackage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true)
        // Fetch packages for Car Wash (service_type_id = 1)
        const response = await packageApi.getByType(1)
        if (response.success && response.data) {
          // Filter only active packages
          const activePackages = response.data.filter(pkg => pkg.is_active)
          setPackages(activePackages)
        }
      } catch (error) {
        console.error('Error fetching packages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [])

  const formatPrice = (amount: string) => {
    const numAmount = parseFloat(amount)
    return numAmount.toFixed(0)
  }

  const getPackageFeatures = (pkg: ServicePackage) => {
    if (!pkg.details || pkg.details.length === 0) return []
    return pkg.details
      .filter(detail => detail.is_active && detail.package_includes)
      .map(detail => detail.package_includes!.includes_details)
  }

  return (
    <div className="car-wash-page">
      <Navbar className="fixed-navbar" hideLogo={true} />
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
            {loading ? (
              <div className="loading-message">Loading packages...</div>
            ) : packages.length === 0 ? (
              <div className="no-packages-message">No packages available at the moment.</div>
            ) : (
              packages.map((pkg, index) => {
                const features = getPackageFeatures(pkg)
                return (
                  <motion.div
                    key={pkg.id}
                    className="pricing-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                  >
                    <div className="pricing-card-header">
                      <div className="pricing-price">
                        ${formatPrice(pkg.total_amount)} <span className="pricing-price-suffix">/ start from</span>
                      </div>
                      <h3 className="pricing-card-title">{pkg.package_name}</h3>
                    </div>
                    <button className="pricing-book-btn" onClick={() => navigate('/booking')}>Book Now</button>
                    <div className="pricing-features">
                      <h4 className="pricing-features-title">Package includes</h4>
                      <ul className="pricing-features-list">
                        {features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="pricing-feature-item">
                            <i className="fas fa-check-circle pricing-check-icon"></i>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>
      </section>

      <FooterPage />
    </div>
  )
}

export default CarWash
