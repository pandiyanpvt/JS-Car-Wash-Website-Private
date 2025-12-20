import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/navbar/Navbar'
import { useAuth } from '../../contexts/AuthContext'
import './BookingPage.css'
import '../home/HomePage.css'
import '../about/AboutPage.css'

interface Branch {
  id: string
  name: string
  location: string
  mapUrl: string
}

interface VehicleModel {
  id: string
  name: string
  image: string
}

interface Package {
  id: string
  name: string
  price: number
  serviceType: 'carwash' | 'cardetailing'
  features: string[]
  excludedFeatures?: string[]
}

interface Extra {
  id: string
  name: string
  price: number
}

interface Product {
  id: string
  name: string
  price: number
}

interface SelectedProduct {
  productId: string
  quantity: number
}

function BookingPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  // Branches - matching HomePage structure
  const branches: Branch[] = useMemo(() => [
    {
      id: 'dubbo',
      name: 'SERVICE DUBBO',
      location: '66-72 Windsor parade, Dubbo, 2830, NSW',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d431895.0726953198!2d148.631!3d-32.253232!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b0f734ad0c1d615%3A0xe2dddee3b54e4e93!2sJS%20Car%20Wash%20and%20Detailing!5e0!3m2!1sen!2sus!4v1763647268513!5m2!1sen!2sus'
    },
    {
      id: 'sydney',
      name: 'SERVICE SYDNEY',
      location: '123 Main Street, Sydney, 2000, NSW',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d431895.0726953198!2d148.631!3d-32.253232!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b0f734ad0c1d615%3A0xe2dddee3b54e4e93!2sJS%20Car%20Wash%20and%20Detailing!5e0!3m2!1sen!2sus!4v1763647268513!5m2!1sen!2sus'
    }
  ], [])

  // Step management
  const [currentStep, setCurrentStep] = useState(1)
  const [packageStep, setPackageStep] = useState(0) // For handling multiple package selections

  // Form data
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedVehicleModel, setSelectedVehicleModel] = useState<VehicleModel | null>(null)
  const [carNumber, setCarNumber] = useState('')
  const [selectedPackages, setSelectedPackages] = useState<Package[]>([])
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false)

  // Lock body scroll when popup is open
  useEffect(() => {
    if (showConfirmationPopup) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showConfirmationPopup])

  // Auto-select branch from HomePage selection (only if authenticated)
  useEffect(() => {
    if (!isAuthenticated) return // Don't auto-select if not signed in
    if (selectedBranch) return // Already selected, don't override
    
    try {
      const stored = localStorage.getItem('selectedBranch')
      if (stored) {
        const homePageBranch = JSON.parse(stored)
        // Map HomePage branch (with subtitle) to BookingPage branch (with id and name)
        const matchedBranch = branches.find(branch => 
          branch.name === homePageBranch.subtitle || 
          branch.name === homePageBranch.name
        )
        if (matchedBranch) {
          setSelectedBranch(matchedBranch)
        }
      }
    } catch (error) {
      console.error('Failed to load selected branch from localStorage:', error)
    }
  }, [branches, selectedBranch, isAuthenticated])

  // Vehicle models
  const vehicleModels: VehicleModel[] = [
    { id: 'hatchback', name: 'Hatchback', image: '/Model/Hatchback.png' },
    { id: 'sedan', name: 'Sedan', image: '/Model/Sedan.png' },
    { id: 'sports', name: 'Sports', image: '/Model/Sports.png' },
    { id: 'suv', name: 'SUV', image: '/Model/Suv.png' },
    { id: 'wagon', name: 'Wagon', image: '/Model/Wagon.png' },
    { id: 'xlarge', name: 'X-Large', image: '/Model/X-Large.png' }
  ]

  // Auto-select vehicle model from HomePage selection (only if authenticated)
  useEffect(() => {
    if (!isAuthenticated) return // Don't auto-select if not signed in
    if (selectedVehicleModel) return // Already selected, don't override
    
    try {
      const stored = localStorage.getItem('selectedVehicleModel')
      if (stored) {
        const vehicleModel = JSON.parse(stored)
        // Find matching vehicle model
        const matchedModel = vehicleModels.find(model => 
          model.id === vehicleModel.id || 
          model.name.toLowerCase() === vehicleModel.name?.toLowerCase()
        )
        if (matchedModel) {
          setSelectedVehicleModel(matchedModel)
        }
      }
    } catch (error) {
      console.error('Failed to load selected vehicle model from localStorage:', error)
    }
  }, [vehicleModels, selectedVehicleModel, isAuthenticated])

  // Car Wash Packages
  const carWashPackages: Package[] = [
    { 
      id: 'js-polish', 
      name: 'JS Polish', 
      price: 149, 
      serviceType: 'carwash',
      features: [
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
    },
    { 
      id: 'js-platinum', 
      name: 'JS Platinum', 
      price: 69, 
      serviceType: 'carwash',
      features: [
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
    },
    { 
      id: 'js-express', 
      name: 'JS Express', 
      price: 39, 
      serviceType: 'carwash',
      features: [
        'High - Pressure - rinse',
        'Exterior Wash with pH neutral shampoo',
        'Apply tyer shine',
        'Exterior windows and side mirrirs clean'
      ],
      excludedFeatures: [
        'Mag wheel wash process',
        'Vacuum interior floor mats and footwells',
        'Vacuum seats and boot',
        'Wipe door and boot jambs',
        'Interior windows and mirrors clean',
        'Clean and wipe dashboard and console',
        'Clean and wipe door trims'
      ]
    }
  ]

  // Car Detailing Packages
  const carDetailingPackages: Package[] = [
    { 
      id: 'js-mini-detail', 
      name: 'JS Mini Detail', 
      price: 189, 
      serviceType: 'cardetailing',
      features: [
        'Include JS police',
        'Interior Polish'
      ]
    },
    { 
      id: 'js-exterior-detail', 
      name: 'JS Exterior Detail', 
      price: 185, 
      serviceType: 'cardetailing',
      features: [
        'Include Exterior wash',
        'Clay bar/ Spot buff',
        'Exterior Hand Polish',
        'Wheel & Tyres',
        'Engine clean (Upon request)'
      ]
    },
    { 
      id: 'js-interior-detail', 
      name: 'JS Interior Detail', 
      price: 259, 
      serviceType: 'cardetailing',
      features: [
        'Include Js platinum',
        'interior plastic Clean',
        'Leather seat Clean',
        'fabric Seats Steam Clean',
        'Carpets & Matts Steam Clean',
        'Leather polish'
      ]
    },
    { 
      id: 'js-full-detail', 
      name: 'JS Full detail', 
      price: 350, 
      serviceType: 'cardetailing',
      features: [
        'Include JS Polish',
        'JS Interior Details',
        'Engine Clean (Upon request)',
        'Buff (Additional charge)'
      ]
    },
    { 
      id: 'paint-protection', 
      name: 'Paint protection & Ceramic Coding', 
      price: 799, 
      serviceType: 'cardetailing',
      features: [
        'Include JS Full Detail',
        'JS Paint Protection Treatment',
        'Buff & Cut (Additional charge)'
      ]
    }
  ]

  // Extras
  const extras: Extra[] = [
    { id: 'engine-clean', name: 'Engine Clean', price: 50 },
    { id: 'buff-cut', name: 'Buff & Cut', price: 100 },
    { id: 'interior-protection', name: 'Interior Protection', price: 75 },
    { id: 'headlight-restoration', name: 'Headlight Restoration', price: 120 }
  ]

  // Products
  const products: Product[] = [
    { id: 'wax', name: 'Premium Wax', price: 25 },
    { id: 'shampoo', name: 'Car Shampoo', price: 15 },
    { id: 'tire-shine', name: 'Tire Shine', price: 20 },
    { id: 'interior-cleaner', name: 'Interior Cleaner', price: 30 }
  ]

  // Time slots
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM'
  ]

  // Handle service selection
  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    )
  }

  // Handle vehicle model selection
  const handleVehicleModelSelect = (model: VehicleModel) => {
    setSelectedVehicleModel(model)
    // Save selected vehicle model to localStorage
    try {
      localStorage.setItem('selectedVehicleModel', JSON.stringify(model))
    } catch (error) {
      console.error('Failed to save selected vehicle model to localStorage:', error)
    }
  }

  // Handle package selection
  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackages(prev => {
      const exists = prev.find(p => p.id === pkg.id)
      if (exists) {
        // If clicking the same package, deselect it
        return prev.filter(p => p.id !== pkg.id)
      }
      // Remove any existing package from the same service type
      const filtered = prev.filter(p => p.serviceType !== pkg.serviceType)
      // Add the new package
      return [...filtered, pkg]
    })
  }

  // Get available packages based on selected services
  const getAvailablePackages = (): Package[] => {
    const packages: Package[] = []
    if (selectedServices.includes('carwash')) {
      packages.push(...carWashPackages)
    }
    if (selectedServices.includes('cardetailing')) {
      packages.push(...carDetailingPackages)
    }
    return packages
  }

  // Get packages to show in current package step
  const getCurrentPackageSet = (): Package[] => {
    const allPackages = getAvailablePackages()
    if (selectedServices.length === 1) {
      return allPackages
    }
    if (selectedServices.includes('carwash') && packageStep === 0) {
      return carWashPackages
    }
    if (selectedServices.includes('cardetailing') && packageStep === 1) {
      return carDetailingPackages
    }
    return []
  }

  // Handle next step
  const handleNext = () => {
    if (currentStep === 1) {
      // Validate step 1
      if (!selectedBranch || selectedServices.length === 0 || !selectedVehicleModel || !carNumber) {
        alert('Please fill all required fields')
        return
      }
      setCurrentStep(2)
      setPackageStep(0)
    } else if (currentStep === 2) {
      // Check if we need to show more packages
      const hasCarWash = selectedServices.includes('carwash')
      const hasCarDetailing = selectedServices.includes('cardetailing')
      
      if (hasCarWash && hasCarDetailing && packageStep === 0) {
        // Show car detailing packages next
        setPackageStep(1)
      } else {
        // Move to step 3
        if (selectedPackages.length === 0) {
          alert('Please select at least one package')
          return
        }
        setCurrentStep(3)
      }
    } else if (currentStep === 3) {
      // Validate step 3
      if (!selectedDate || !selectedTime) {
        alert('Please select date and time')
        return
      }
      setCurrentStep(4) // Show order summary
    }
  }

  // Handle back step
  const handleBack = () => {
    if (currentStep === 2 && packageStep === 1) {
      setPackageStep(0)
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const [calendarDate, setCalendarDate] = useState(new Date())

  const handleDateSelect = (day: number) => {
    const newDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day)
    setSelectedDate(newDate)
  }

  const handleCalendarPrevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))
  }

  const handleCalendarNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))
  }

  // Calculate total
  const calculateTotal = () => {
    let total = 0
    selectedPackages.forEach(pkg => total += pkg.price)
    selectedExtras.forEach(extraId => {
      const extra = extras.find(e => e.id === extraId)
      if (extra) total += extra.price
    })
    selectedProducts.forEach(selectedProduct => {
      const product = products.find(p => p.id === selectedProduct.productId)
      if (product) total += product.price * selectedProduct.quantity
    })
    return total
  }

  // Get service text
  const getServiceText = () => {
    if (selectedServices.includes('carwash') && selectedServices.includes('cardetailing')) {
      return 'Car Wash, Car Detailing'
    } else if (selectedServices.includes('carwash')) {
      return 'Car Wash'
    } else if (selectedServices.includes('cardetailing')) {
      return 'Car Detailing'
    }
    return ''
  }

  return (
    <div className="booking-page">
      <Navbar className="fixed-navbar" hideLogo={true} />
      {/* Page Heading Section */}
      <section className="page-heading-section">
        <div className="page-heading-overlay"></div>
        <div className="page-heading-content">
          <h1 className="page-heading-title">Booking</h1>
        </div>
      </section>
      
      <div className="booking-container">
        <div className="booking-container-inner">
          {/* Right Content Area */}
          <div className="booking-right-content-wrapper">
          <div className="booking-right-content">
          <AnimatePresence mode="wait">
            {/* Step 1: Branch, Service, Vehicle, Car Number */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="booking-step"
              >
                <h2 className="booking-step-title">Select Branch & Service</h2>

                {/* Branch and Service in One Row */}
                <div className="booking-branch-service-row">
                  {/* Branch Selection */}
                  <div className="booking-form-section booking-form-section-half">
                    <h3>Select Branch</h3>
                    <div className="booking-branch-buttons">
                      {branches.map(branch => (
                        <button
                          key={branch.id}
                          className={`booking-branch-btn ${selectedBranch?.id === branch.id ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedBranch(branch)
                            // Save selected branch to localStorage
                            try {
                              localStorage.setItem('selectedBranch', JSON.stringify(branch))
                            } catch (error) {
                              console.error('Failed to save selected branch to localStorage:', error)
                            }
                          }}
                        >
                          {branch.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Service Selection */}
                  <div className="booking-form-section booking-form-section-half">
                    <h3>Select Service</h3>
                    <div className="booking-service-checkboxes">
                      <label className="booking-checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedServices.includes('carwash')}
                          onChange={() => handleServiceToggle('carwash')}
                        />
                        <span>Car Wash</span>
                      </label>
                      <label className="booking-checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedServices.includes('cardetailing')}
                          onChange={() => handleServiceToggle('cardetailing')}
                        />
                        <span>Car Detailing</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Vehicle Model Selection */}
                <div className="booking-form-section">
                  <h3>Select Vehicle Model</h3>
                  <div className="booking-vehicle-models">
                    {vehicleModels.map(model => (
                      <motion.div
                        key={model.id}
                        className={`booking-vehicle-card ${selectedVehicleModel?.id === model.id ? 'selected' : ''}`}
                        onClick={() => handleVehicleModelSelect(model)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img src={model.image} alt={model.name} />
                        <p>{model.name}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Car Number */}
                <div className="booking-form-section">
                  <h3>Enter Car Number</h3>
                  <input
                    type="text"
                    className="booking-input"
                    placeholder="Enter your car number"
                    value={carNumber}
                    onChange={(e) => setCarNumber(e.target.value.toUpperCase())}
                  />
                </div>

                <button className="booking-next-btn" onClick={handleNext}>
                  Next
                </button>
              </motion.div>
            )}

            {/* Step 2: Package Selection */}
            {currentStep === 2 && (
              <motion.div
                key={`step2-${packageStep}`}
                initial={{ opacity: 0, rotateY: -90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: 90 }}
                transition={{ duration: 0.5 }}
                className="booking-step"
              >
                <h2 className="booking-step-title">
                  {selectedServices.includes('carwash') && selectedServices.includes('cardetailing') && packageStep === 0
                    ? 'Select Car Wash Package'
                    : selectedServices.includes('carwash') && selectedServices.includes('cardetailing') && packageStep === 1
                    ? 'Select Car Detailing Package'
                    : 'Select Package'}
                </h2>

                <div className="booking-packages-grid">
                  {getCurrentPackageSet().map(pkg => (
                    <motion.div
                      key={pkg.id}
                      className={`booking-package-card ${selectedPackages.find(p => p.id === pkg.id) ? 'selected' : ''}`}
                      onClick={() => handlePackageSelect(pkg)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="booking-package-card-header">
                        <div className="booking-package-price">
                          ${pkg.price} <span className="booking-package-price-suffix">/ start from</span>
                        </div>
                        <h3 className="booking-package-card-title">{pkg.name}</h3>
                      </div>
                      <div className="booking-package-check">
                        {selectedPackages.find(p => p.id === pkg.id) && '✓'}
                      </div>
                      <div className="booking-package-features">
                        <h4 className="booking-package-features-title">Package includes</h4>
                        <ul className="booking-package-features-list">
                          {pkg.features.map((feature, index) => (
                            <li key={index} className="booking-package-feature-item">
                              <i className="fas fa-check-circle booking-package-check-icon"></i>
                              <span>{feature}</span>
                            </li>
                          ))}
                          {pkg.excludedFeatures && pkg.excludedFeatures.map((feature, index) => (
                            <li key={`excluded-${index}`} className="booking-package-feature-item booking-package-feature-excluded">
                              <i className="fas fa-times-circle booking-package-x-icon"></i>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="booking-step-buttons">
                  <button className="booking-back-btn" onClick={handleBack}>
                    Back
                  </button>
                  <button className="booking-next-btn" onClick={handleNext}>
                    {selectedServices.includes('carwash') && selectedServices.includes('cardetailing') && packageStep === 0
                      ? 'Next: Car Detailing Packages'
                      : 'Next'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Extras, Products, Date & Time */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="booking-step"
              >
                <h2 className="booking-step-title">Extras & Schedule</h2>

                {/* Extras */}
                <div className="booking-form-section">
                  <h3>Extras (Optional)</h3>
                  <div className="booking-extras-grid">
                    {extras.map(extra => (
                      <label key={extra.id} className="booking-extra-item">
                        <input
                          type="checkbox"
                          checked={selectedExtras.includes(extra.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedExtras([...selectedExtras, extra.id])
                            } else {
                              setSelectedExtras(selectedExtras.filter(id => id !== extra.id))
                            }
                          }}
                        />
                        <div>
                          <span>{extra.name}</span>
                          <span className="booking-extra-price">+${extra.price}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Products */}
                <div className="booking-form-section">
                  <h3>Products (Optional)</h3>
                  <div className="booking-products-grid">
                    {products.map(product => {
                      const selectedProduct = selectedProducts.find(sp => sp.productId === product.id)
                      const isSelected = !!selectedProduct
                      return (
                        <div key={product.id} className={`booking-product-item-wrapper ${isSelected ? 'selected' : ''}`}>
                          <label className="booking-product-item">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedProducts([...selectedProducts, { productId: product.id, quantity: 1 }])
                                } else {
                                  setSelectedProducts(selectedProducts.filter(sp => sp.productId !== product.id))
                                }
                              }}
                            />
                            <div>
                              <span>{product.name}</span>
                              <span className="booking-product-price">+${product.price}</span>
                            </div>
                          </label>
                          {isSelected && (
                            <div className="booking-product-quantity">
                              <label>Quantity:</label>
                              <input
                                type="number"
                                min="1"
                                value={selectedProduct.quantity}
                                onChange={(e) => {
                                  const quantity = parseInt(e.target.value) || 1
                                  setSelectedProducts(selectedProducts.map(sp => 
                                    sp.productId === product.id 
                                      ? { ...sp, quantity: Math.max(1, quantity) }
                                      : sp
                                  ))
                                }}
                                className="booking-quantity-input"
                              />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Date & Time Selection */}
                <div className="booking-form-section">
                  <h3>Select Arrival Date & Time</h3>
                  
                  <div className="booking-date-time-container">
                    {/* Calendar */}
                    <div className="booking-calendar">
                    <div className="booking-calendar-header">
                      <button onClick={handleCalendarPrevMonth} className="booking-calendar-nav">
                        ‹
                      </button>
                      <h4>
                        {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h4>
                      <button onClick={handleCalendarNextMonth} className="booking-calendar-nav active">
                        ›
                      </button>
                    </div>
                    
                    <div className="booking-calendar-weekdays">
                      {['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'].map(day => (
                        <div key={day} className="booking-calendar-weekday">{day}.</div>
                      ))}
                    </div>
                    
                    <div className="booking-calendar-days">
                      {(() => {
                        const { daysInMonth, startingDayOfWeek } = getDaysInMonth(calendarDate)
                        const days = []
                        
                        // Empty cells for days before month starts
                        for (let i = 0; i < startingDayOfWeek; i++) {
                          days.push(<div key={`empty-${i}`} className="booking-calendar-day empty"></div>)
                        }
                        
                        // Days of the month
                        for (let day = 1; day <= daysInMonth; day++) {
                          const date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day)
                          const isSelected = selectedDate && 
                            date.getDate() === selectedDate.getDate() &&
                            date.getMonth() === selectedDate.getMonth() &&
                            date.getFullYear() === selectedDate.getFullYear()
                          const isToday = date.toDateString() === new Date().toDateString()
                          const isPast = date < new Date() && !isToday
                          const isSelectable = !isPast
                          
                          days.push(
                            <div
                              key={day}
                              className={`booking-calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isPast ? 'past' : ''} ${isSelectable && !isPast ? 'selectable' : ''}`}
                              onClick={() => !isPast && handleDateSelect(day)}
                            >
                              {day}
                            </div>
                          )
                        }
                        
                        return days
                      })()}
                    </div>
                  </div>

                    {/* Time Slots */}
                    <div className="booking-time-slots">
                      {selectedDate ? (
                        <>
                          <h4 className="booking-selected-date">
                            {selectedDate.toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              day: 'numeric', 
                              month: 'long' 
                            })}
                          </h4>
                          <div className="booking-time-grid">
                            {timeSlots.map(time => (
                              <button
                                key={time}
                                className={`booking-time-btn ${selectedTime === time ? 'selected' : ''}`}
                                onClick={() => setSelectedTime(time)}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                          {selectedTime && (
                            <button className="booking-continue-btn" onClick={handleNext}>
                              Continue
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="booking-time-placeholder">
                          Select a date to view available times
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="booking-step-buttons">
                  <button className="booking-back-btn" onClick={handleBack}>
                    Back
                  </button>
                </div>

              </motion.div>
            )}

            {/* Step 4: Order Summary */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="booking-step"
              >
                <h2 className="booking-step-title">Order Summary</h2>

                <div className="booking-summary">
                  {/* Row 1: Branch, Service, Vehicle */}
                  <div className="booking-summary-row">
                    <div className="booking-summary-section">
                      <h3>Branch</h3>
                      <p>{selectedBranch?.name}</p>
                      <p className="booking-summary-subtext">{selectedBranch?.location}</p>
                    </div>

                    <div className="booking-summary-section">
                      <h3>Services</h3>
                      <p>{selectedServices.map(s => s === 'carwash' ? 'Car Wash' : 'Car Detailing').join(', ')}</p>
                    </div>

                    <div className="booking-summary-section">
                      <h3>Vehicle</h3>
                      <p>{selectedVehicleModel?.name}</p>
                      <p className="booking-summary-subtext">Car Number: {carNumber}</p>
                    </div>
                  </div>

                  {/* Row 2: Packages */}
                  <div className="booking-summary-row">
                    <div className="booking-summary-section booking-summary-section-full">
                      <h3>Packages</h3>
                      {selectedPackages.map(pkg => (
                        <div key={pkg.id} className="booking-summary-item">
                          <span>{pkg.name}</span>
                          <span>${pkg.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Row 3: Extras and Products */}
                  {(selectedExtras.length > 0 || selectedProducts.length > 0) && (
                    <div className={`booking-summary-row ${selectedExtras.length > 0 && selectedProducts.length > 0 ? 'booking-summary-row-two' : 'booking-summary-row-one'}`}>
                      {selectedExtras.length > 0 && (
                        <div className="booking-summary-section">
                          <h3>Extras</h3>
                          {selectedExtras.map(extraId => {
                            const extra = extras.find(e => e.id === extraId)
                            return extra ? (
                              <div key={extra.id} className="booking-summary-item">
                                <span>{extra.name}</span>
                                <span>${extra.price}</span>
                              </div>
                            ) : null
                          })}
                        </div>
                      )}

                      {selectedProducts.length > 0 && (
                        <div className="booking-summary-section">
                          <h3>Products</h3>
                          {selectedProducts.map(selectedProduct => {
                            const product = products.find(p => p.id === selectedProduct.productId)
                            return product ? (
                              <div key={product.id} className="booking-summary-item">
                                <span>{product.name} {selectedProduct.quantity > 1 ? `(x${selectedProduct.quantity})` : ''}</span>
                                <span>${(product.price * selectedProduct.quantity).toFixed(2)}</span>
                              </div>
                            ) : null
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Row 4: Schedule */}
                  <div className="booking-summary-row">
                    <div className="booking-summary-section booking-summary-section-full">
                      <h3>Schedule</h3>
                      <p>
                        {selectedDate?.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="booking-summary-subtext">Time: {selectedTime}</p>
                    </div>
                  </div>

                  <div className="booking-summary-total">
                    <h3>Total</h3>
                    <h2>${calculateTotal()}</h2>
                  </div>

                  <button className="booking-confirm-btn" onClick={() => setShowConfirmationPopup(true)}>
                    Confirm Booking
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Summary Sidebar */}
        <div className="booking-right-summary">
          <div className="booking-total-summary">
            <div className="booking-total-summary-header">
              <h2 className="booking-total-summary-title">Total Summary</h2>
              <svg className="booking-total-summary-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div className="booking-total-summary-table">
              <div className="booking-total-summary-header-row">
                <span className="booking-total-summary-header-name">Name</span>
                <span className="booking-total-summary-header-total">Total</span>
              </div>

              <div className="booking-total-summary-row">
                <span className="booking-total-summary-name">Vehicle Type</span>
                <span className="booking-total-summary-total">
                  {selectedVehicleModel ? selectedVehicleModel.name.toUpperCase() : '-'}
                </span>
              </div>

              <div className="booking-total-summary-divider"></div>

              <div className="booking-total-summary-row">
                <div className="booking-total-summary-name-col">
                  <span className="booking-total-summary-name">Package Name</span>
                  {selectedPackages.length > 0 ? (
                    <div className="booking-total-summary-package-list">
                      {selectedPackages.map(pkg => (
                        <div key={pkg.id} className="booking-total-summary-package-item">
                          {pkg.name}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="booking-total-summary-total-col">
                  {selectedPackages.length > 0 ? (
                    <>
                      <span className="booking-total-summary-total">
                        From $ {selectedPackages.reduce((sum, pkg) => sum + pkg.price, 0).toFixed(2)}
                      </span>
                      <div className="booking-total-summary-package-price-list">
                        {selectedPackages.map(pkg => (
                          <div key={pkg.id} className="booking-total-summary-package-price">
                            $ {pkg.price.toFixed(2)}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <span className="booking-total-summary-total">From $ 0.00</span>
                  )}
                </div>
              </div>

              <div className="booking-total-summary-divider"></div>

              <div className="booking-total-summary-row">
                <div className="booking-total-summary-name-col">
                  <span className="booking-total-summary-name">Extras (Optional)</span>
                  {selectedExtras.length > 0 ? (
                    <div className="booking-total-summary-package-list">
                      {selectedExtras.map(extraId => {
                        const extra = extras.find(e => e.id === extraId)
                        return extra ? (
                          <div key={extra.id} className="booking-total-summary-package-item">
                            {extra.name}
                          </div>
                        ) : null
                      })}
                    </div>
                  ) : null}
                </div>
                <div className="booking-total-summary-total-col">
                  {selectedExtras.length > 0 ? (
                    <>
                      <span className="booking-total-summary-total">
                        From $ {selectedExtras.reduce((sum, extraId) => {
                          const extra = extras.find(e => e.id === extraId)
                          return sum + (extra ? extra.price : 0)
                        }, 0).toFixed(2)}
                      </span>
                      <div className="booking-total-summary-package-price-list">
                        {selectedExtras.map(extraId => {
                          const extra = extras.find(e => e.id === extraId)
                          return extra ? (
                            <div key={extra.id} className="booking-total-summary-package-price">
                              $ {extra.price.toFixed(2)}
                            </div>
                          ) : null
                        })}
                      </div>
                    </>
                  ) : (
                    <span className="booking-total-summary-total">From $ 0.00</span>
                  )}
                </div>
              </div>

              {selectedProducts.length > 0 && (
                <>
                  <div className="booking-total-summary-divider"></div>

                  <div className="booking-total-summary-row">
                    <div className="booking-total-summary-name-col">
                      <span className="booking-total-summary-name">Products</span>
                      <div className="booking-total-summary-package-list">
                        {selectedProducts.map(selectedProduct => {
                          const product = products.find(p => p.id === selectedProduct.productId)
                          return product ? (
                            <div key={product.id} className="booking-total-summary-package-item">
                              <span className="booking-total-summary-product-name-text">{product.name}</span>
                              {selectedProduct.quantity > 1 && <span className="booking-total-summary-quantity"> (x{selectedProduct.quantity})</span>}
                            </div>
                          ) : null
                        })}
                      </div>
                    </div>
                    <div className="booking-total-summary-total-col">
                      <span className="booking-total-summary-total">
                        From $ {selectedProducts.reduce((sum, selectedProduct) => {
                          const product = products.find(p => p.id === selectedProduct.productId)
                          return sum + (product ? product.price * selectedProduct.quantity : 0)
                        }, 0).toFixed(2)}
                      </span>
                      <div className="booking-total-summary-package-price-list">
                        {selectedProducts.map(selectedProduct => {
                          const product = products.find(p => p.id === selectedProduct.productId)
                          return product ? (
                            <div key={product.id} className="booking-total-summary-package-price">
                              $ {(product.price * selectedProduct.quantity).toFixed(2)}
                            </div>
                          ) : null
                        })}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="booking-total-summary-divider"></div>

              <div className="booking-total-summary-row booking-total-summary-row-final">
                <span className="booking-total-summary-name booking-total-summary-name-final">Total</span>
                <span className="booking-total-summary-total booking-total-summary-total-final">
                  $ {calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
        </div>
        </div>
      </div>

      {/* Confirmation Popup */}
      <AnimatePresence>
        {showConfirmationPopup && (
          <>
            <motion.div
              className="booking-popup-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowConfirmationPopup(false)}
            />
            <motion.div
              className="booking-confirmation-popup"
              initial={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              exit={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            >
              <div className="booking-popup-icon">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="32" r="32" fill="#4caf50" opacity="0.1"/>
                  <path d="M32 16C23.163 16 16 23.163 16 32C16 40.837 23.163 48 32 48C40.837 48 48 40.837 48 32C48 23.163 40.837 16 32 16ZM28 38L20 30L22.83 27.17L28 32.34L41.17 19.17L44 22L28 38Z" fill="#4caf50"/>
                </svg>
              </div>
              <h2 className="booking-popup-title">Booking Confirmed!</h2>
              <p className="booking-popup-message">
                Your booking has been confirmed successfully. You will receive a confirmation email shortly.
              </p>
              <button 
                className="booking-popup-ok-btn"
                onClick={() => {
                  setShowConfirmationPopup(false)
                  navigate('/')
                }}
              >
                OK
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  )
}

export default BookingPage
