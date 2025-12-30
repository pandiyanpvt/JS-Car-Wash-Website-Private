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

  const getPackageFeatures = (pkg: ServicePackage) => {
    if (!pkg.details || pkg.details.length === 0) return []
    return pkg.details
      .filter(detail => detail.is_active && detail.package_includes)
      .map(detail => detail.package_includes!.includes_details)
  }

  const getPackagePricesByBranch = (pkg: ServicePackage) => {
    if (!pkg.prices || pkg.prices.length === 0) return []
    
    // Group prices by branch
    const branchMap = new Map<number, { branchName: string; prices: { vehicleType: string; price: number }[] }>()
    
    pkg.prices
      .filter(price => price && price.is_active && price.price)
      .forEach(price => {
        const priceStr = String(price.price || '0').trim()
        const parsedPrice = parseFloat(priceStr)
        if (isNaN(parsedPrice) || parsedPrice <= 0) return
        
        const branchId = price.branch_id
        const branchName = price.branch?.branch_name || `Branch ${branchId}`
        const vehicleType = price.vehicle_type || ''
        
        if (!branchMap.has(branchId)) {
          branchMap.set(branchId, { branchName, prices: [] })
        }
        
        branchMap.get(branchId)!.prices.push({
          vehicleType,
          price: parsedPrice
        })
      })
    
    // Convert map to array
    return Array.from(branchMap.entries()).map(([branchId, data]) => ({
      branchId,
      branchName: data.branchName,
      prices: data.prices.sort((a, b) => {
        // Sort by vehicle type order: Sedan, SUV, Hatchback, Wagon, Sports, X-Large
        const order = ['Sedan', 'SUV', 'Hatchback', 'Wagon', 'Sports', 'X-Large']
        const aIndex = order.indexOf(a.vehicleType)
        const bIndex = order.indexOf(b.vehicleType)
        if (aIndex === -1 && bIndex === -1) return 0
        if (aIndex === -1) return 1
        if (bIndex === -1) return -1
        return aIndex - bIndex
      })
    }))
  }

  const [expandedDropdowns, setExpandedDropdowns] = useState<{ [key: string]: boolean }>({})
  
  const toggleDropdown = (packageId: number, branchId: number) => {
    const key = `${packageId}-${branchId}`
    setExpandedDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
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
                const branchPrices = getPackagePricesByBranch(pkg)
                return (
                  <motion.div
                    key={pkg.id}
                    className="pricing-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                  >
                    <div className="pricing-card-header">
                      <h3 className="pricing-card-title">{pkg.package_name}</h3>
                      {branchPrices.length > 0 ? (
                        <div className="pricing-branch-prices">
                          {branchPrices.map(branchPrice => {
                            const dropdownKey = `${pkg.id}-${branchPrice.branchId}`
                            const isExpanded = expandedDropdowns[dropdownKey] || false
                            const minPrice = Math.min(...branchPrice.prices.map(p => p.price))
                            
                            return (
                              <div key={branchPrice.branchId} className="pricing-branch-price-wrapper">
                                <div 
                                  className="pricing-branch-header"
                                  onClick={() => toggleDropdown(pkg.id, branchPrice.branchId)}
                                >
                                  <span className="pricing-branch-name">{branchPrice.branchName}</span>
                                  <div className="pricing-branch-header-right">
                                    <span className="pricing-branch-price-value">start from ${minPrice.toFixed(2)}</span>
                                    <svg 
                                      className={`pricing-dropdown-arrow ${isExpanded ? 'expanded' : ''}`}
                                      width="16" 
                                      height="16" 
                                      viewBox="0 0 16 16" 
                                      fill="none"
                                    >
                                      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </div>
                                </div>
                                {isExpanded && (
                                  <div className="pricing-vehicle-types-list">
                                    {branchPrice.prices.map((price, idx) => (
                                      <div key={idx} className="pricing-vehicle-type-item">
                                        <span className="pricing-vehicle-type-name">{price.vehicleType}</span>
                                        <span className="pricing-vehicle-type-price">start from ${price.price.toFixed(2)}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="pricing-price">
                          <span className="pricing-price-suffix">Price unavailable</span>
                        </div>
                      )}
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
