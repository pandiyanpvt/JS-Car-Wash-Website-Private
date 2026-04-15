import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../../components/navbar/Navbar'
import {
  contactApi,
  packageApi,
  productApi,
  extraWorkApi,
  orderApi,
  sitePromoApi,
  type ProductStockEntry,
  type Product as ApiProduct,
  type SitePromoSettings
} from '../../services/api'
import {
  computeOfferDiscountAmount,
  eligiblePackageSubtotalForOffer,
  normalizeOfferDiscountType,
  normalizeOfferScope,
  offerScopeLabel,
  promoCountdownActive,
} from '../../utils/sitePromoBill'
import SEO from '../../components/SEO'
import './BookingPage.css'
import '../home/HomePage.css'
import '../about/AboutPage.css'

type ContactFieldKey = 'fullName' | 'email' | 'phone'
type ContactErrors = Partial<Record<ContactFieldKey, string>>

function validatePersonalDetails(fullName: string, email: string, phone: string): ContactErrors {
  const errors: ContactErrors = {}
  const name = fullName.trim()
  if (!name) errors.fullName = 'Enter your full name.'
  else if (name.length < 2) errors.fullName = 'Name must be at least 2 characters.'
  else if (name.length > 120) errors.fullName = 'Name is too long.'

  const em = email.trim()
  if (!em) errors.email = 'Enter your email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) errors.email = 'Enter a valid email address.'

  const ph = phone.trim()
  const digits = ph.replace(/\D/g, '')
  if (!ph) errors.phone = 'Enter your phone number.'
  else if (digits.length < 8) errors.phone = 'Use at least 8 digits (include area code if needed).'
  else if (digits.length > 15) errors.phone = 'Phone number is too long.'

  return errors
}

function hasContactErrors(errors: ContactErrors): boolean {
  return !!(errors.fullName || errors.email || errors.phone)
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function slotToDate(baseDate: Date, slot: string): Date {
  const [timePart, periodRaw] = slot.split(' ')
  const [hRaw, mRaw] = (timePart || '').split(':')
  const period = (periodRaw || '').toUpperCase()
  let hour = Number(hRaw)
  const minute = Number(mRaw)
  if (period === 'PM' && hour !== 12) hour += 12
  if (period === 'AM' && hour === 12) hour = 0
  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    Number.isNaN(hour) ? 0 : hour,
    Number.isNaN(minute) ? 0 : minute,
    0,
    0
  )
}

interface Branch {
  id: number
  name: string
  location: string
  mapUrl?: string
}

interface VehicleModel {
  id: string
  name: string
  image: string
}

interface PackagePrice {
  branchId: number
  branchName: string
  vehicleType: string
  price: number
}

interface Package {
  id: number
  name: string
  prices: PackagePrice[]
  serviceType: 'carwash' | 'cardetailing'
  features: string[]
  excludedFeatures?: string[]
}

interface Extra {
  id: number
  name: string
  price: number
}

interface BookingProduct {
  id: number
  name: string
  price: number
  stockEntries: ProductStockEntry[]
  totalStock: number
}

interface SelectedProduct {
  productId: number
  quantity: number
}

function BookingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [guestFullName, setGuestFullName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')

  // Step management
  const [currentStep, setCurrentStep] = useState(1)
  const [packageStep, setPackageStep] = useState(0) // For handling multiple package selections

  // Form data
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedVehicleModel, setSelectedVehicleModel] = useState<VehicleModel | null>(null)
  const [selectedPackages, setSelectedPackages] = useState<Package[]>([])
  const [selectedExtras, setSelectedExtras] = useState<number[]>([])
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [packagesLoading, setPackagesLoading] = useState(true)
  const [contactErrors, setContactErrors] = useState<ContactErrors>({})
  const [timeNowTick, setTimeNowTick] = useState(() => Date.now())

  // API data
  const [branches, setBranches] = useState<Branch[]>([])
  const [carWashPackages, setCarWashPackages] = useState<Package[]>([])
  const [carDetailingPackages, setCarDetailingPackages] = useState<Package[]>([])
  const [extras, setExtras] = useState<Extra[]>([])
  const [products, setProducts] = useState<BookingProduct[]>([])
  const [productError, setProductError] = useState<string | null>(null)
  const [sitePromo, setSitePromo] = useState<SitePromoSettings | null>(null)
  const [prefilledServiceFromPromo, setPrefilledServiceFromPromo] = useState(false)
  const [prefilledBranchFromPromo, setPrefilledBranchFromPromo] = useState(false)
  const [promoPrefillNotice, setPromoPrefillNotice] = useState<string | null>(null)
  const [promoServiceLocked, setPromoServiceLocked] = useState(false)
  const [promoBranchLocked, setPromoBranchLocked] = useState(false)
  const [promoSource, setPromoSource] = useState<'banner' | 'popup' | null>(null)

  const mapApiProductToBookingProduct = useCallback((product: ApiProduct): BookingProduct => {
    const activeEntries = (product.stock_entries || []).filter(
      (entry: ProductStockEntry) => entry.is_active !== false
    )
    const totalFromEntries = activeEntries.reduce((sum, entry) => sum + (entry.stock || 0), 0)
    const fallbackStock = typeof product.stock === 'number' ? product.stock : 0

    return {
      id: product.id,
      name: product.product_name,
      price: parseFloat(product.amount),
      stockEntries: activeEntries,
      totalStock: activeEntries.length > 0 ? totalFromEntries : fallbackStock,
    }
  }, [])

  const getAvailableStockForBranch = useCallback((productId: number) => {
    const product = products.find(p => p.id === productId)
    if (!product) return 0

    if (selectedBranch) {
      const entry = product.stockEntries.find(
        (stockEntry: ProductStockEntry) => stockEntry.branch_id === selectedBranch.id && stockEntry.is_active !== false
      )
      if (entry) return entry.stock || 0
    }

    return product.totalStock
  }, [products, selectedBranch])

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await contactApi.getBranches()
        if (response.success && response.data) {
          const activeBranches = response.data
            .filter(branch => branch.is_active)
            .map(branch => ({
              id: branch.id,
              name: branch.branch_name,
              location: branch.address,
            }))
          setBranches(activeBranches)
        }
      } catch (error) {
        console.error('Error fetching branches:', error)
      }
    }
    fetchBranches()
  }, [])

  // Fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      setPackagesLoading(true)
      try {
        // Fetch Car Wash packages (service_type_id = 1)
        const carWashResponse = await packageApi.getByType(1)
        if (carWashResponse.success && carWashResponse.data) {
          const packages = carWashResponse.data
            .filter(pkg => pkg.is_active)
            .map(pkg => ({
              id: pkg.id,
              name: pkg.package_name,
              prices: (pkg.prices || [])
                .filter(price => price && price.is_active && price.price)
                .map(price => {
                  const priceStr = String(price.price || '0').trim()
                  const parsedPrice = parseFloat(priceStr)
                  return {
                    branchId: price.branch_id,
                    branchName: price.branch?.branch_name || `Branch ${price.branch_id}`,
                    vehicleType: price.vehicle_type || '',
                    price: isNaN(parsedPrice) || parsedPrice <= 0 ? 0 : parsedPrice
                  }
                })
                .filter(price => price.price > 0),
              serviceType: 'carwash' as const,
              features: pkg.details
                ?.filter(detail => detail.is_active && detail.package_includes)
                .map(detail => detail.package_includes!.includes_details) || [],
            }))
          setCarWashPackages(packages)
        }

        // Fetch Car Detailing packages (service_type_id = 2)
        const carDetailingResponse = await packageApi.getByType(2)
        if (carDetailingResponse.success && carDetailingResponse.data) {
          const packages = carDetailingResponse.data
            .filter(pkg => pkg.is_active)
            .map(pkg => ({
              id: pkg.id,
              name: pkg.package_name,
              prices: (pkg.prices || [])
                .filter(price => price && price.is_active && price.price)
                .map(price => {
                  const priceStr = String(price.price || '0').trim()
                  const parsedPrice = parseFloat(priceStr)
                  return {
                    branchId: price.branch_id,
                    branchName: price.branch?.branch_name || `Branch ${price.branch_id}`,
                    vehicleType: price.vehicle_type || '',
                    price: isNaN(parsedPrice) || parsedPrice <= 0 ? 0 : parsedPrice
                  }
                })
                .filter(price => price.price > 0),
              serviceType: 'cardetailing' as const,
              features: pkg.details
                ?.filter(detail => detail.is_active && detail.package_includes)
                .map(detail => detail.package_includes!.includes_details) || [],
            }))
          setCarDetailingPackages(packages)
        }
      } catch (error) {
        console.error('Error fetching packages:', error)
      } finally {
        setPackagesLoading(false)
      }
    }
    fetchPackages()
  }, [])

  useEffect(() => {
    let cancelled = false
    const loadPromo = async () => {
      try {
        const res = await sitePromoApi.get()
        if (!cancelled && res.success && res.data) setSitePromo(res.data)
      } catch {
        if (!cancelled) setSitePromo(null)
      }
    }
    loadPromo()
    const onFocus = () => {
      loadPromo()
    }
    window.addEventListener('focus', onFocus)
    return () => {
      cancelled = true
      window.removeEventListener('focus', onFocus)
    }
  }, [])

  // Fetch extra works
  useEffect(() => {
    const fetchExtraWorks = async () => {
      try {
        const response = await extraWorkApi.getAll()
        if (response.success && response.data) {
          const activeExtras = response.data
            .filter(extra => extra.is_active)
            .map(extra => {
              // Get branch-specific price if branch is selected
              let price = 0
              if (selectedBranch && extra.branch_prices) {
                const branchPrice = extra.branch_prices.find(
                  bp => bp.branch_id === selectedBranch.id && bp.is_active
                )
                if (branchPrice) {
                  price = parseFloat(branchPrice.amount)
                }
              } else if (extra.branch_prices && extra.branch_prices.length > 0) {
                // Fallback to first available price if no branch selected
                const firstActivePrice = extra.branch_prices.find(bp => bp.is_active)
                if (firstActivePrice) {
                  price = parseFloat(firstActivePrice.amount)
                }
              }

              return {
                id: extra.id,
                name: extra.name,
                price,
              }
            })
          // Show all extra works, even if price is 0 (will show as $0.00)
          setExtras(activeExtras)
        }
      } catch (error) {
        console.error('Error fetching extra works:', error)
      }
    }
    fetchExtraWorks()
  }, [selectedBranch])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.getAll()
        if (response.success && response.data) {
          // Handle paginated response
          const productsArray = 'items' in response.data && 'pagination' in response.data
            ? response.data.items
            : Array.isArray(response.data)
              ? response.data
              : []

          const activeProducts = productsArray
            .filter((product: ApiProduct) => product.is_active)
            .map(mapApiProductToBookingProduct)
          setProducts(activeProducts)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }
    fetchProducts()
  }, [mapApiProductToBookingProduct])

  // Lock body scroll when confirmation popup is open
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

  // Auto-select branch from HomePage selection
  useEffect(() => {
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
          return
        }
      }

      // If user is logged in but has no stored branch, default to first available branch
      if (branches.length > 0) {
        const defaultBranch = branches[0]
        setSelectedBranch(defaultBranch)
        try {
          localStorage.setItem('selectedBranch', JSON.stringify(defaultBranch))
        } catch (error) {
          console.error('Failed to save default selected branch to localStorage:', error)
        }
      }
    } catch (error) {
      console.error('Failed to load selected branch from localStorage:', error)
    }
  }, [branches, selectedBranch])

  // Auto-select service from top-banner promo query params: ?auto_promo=1&service=carwash|cardetailing|both
  useEffect(() => {
    if (prefilledServiceFromPromo) return
    const params = new URLSearchParams(location.search)
    if (params.get('auto_promo') !== '1') return
    const s = (params.get('service') || '').toLowerCase()
    if (s === 'carwash') {
      setSelectedServices(['carwash'])
      setPromoServiceLocked(true)
    } else if (s === 'cardetailing') {
      setSelectedServices(['cardetailing'])
      setPromoServiceLocked(true)
    } else if (s === 'both') {
      setSelectedServices(['carwash', 'cardetailing'])
      setPromoServiceLocked(true)
    } else {
      setPromoServiceLocked(false)
    }
    setPrefilledServiceFromPromo(true)
  }, [location.search, prefilledServiceFromPromo])

  // Auto-select branch from top-banner promo query param: ?branch_id=#
  useEffect(() => {
    if (prefilledBranchFromPromo) return
    const params = new URLSearchParams(location.search)
    if (params.get('auto_promo') !== '1') return
    const branchIdRaw = params.get('branch_id')
    if (!branchIdRaw) {
      setPromoBranchLocked(false)
      setPrefilledBranchFromPromo(true)
      return
    }
    const branchId = Number(branchIdRaw)
    if (!branchId || Number.isNaN(branchId) || branches.length === 0) return
    const matched = branches.find((b) => Number(b.id) === branchId)
    if (matched) {
      setSelectedBranch(matched)
      setPromoBranchLocked(true)
      try {
        localStorage.setItem('selectedBranch', JSON.stringify(matched))
      } catch {
        /* ignore storage quota */
      }
    } else {
      setPromoBranchLocked(false)
    }
    setPrefilledBranchFromPromo(true)
  }, [location.search, branches, prefilledBranchFromPromo])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const sourceRaw = (params.get('promo_source') || '').toLowerCase()
    if (sourceRaw === 'banner' || sourceRaw === 'popup') {
      setPromoSource(sourceRaw)
    }
  }, [location.search])

  // Remove one-time auto prefill query once applied, so user can freely switch branch/service.
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('auto_promo') !== '1') return
    if (!prefilledServiceFromPromo || !prefilledBranchFromPromo) return
    if (!promoPrefillNotice) {
      const serviceRaw = (params.get('service') || '').toLowerCase()
      const sourceRaw = (params.get('promo_source') || '').toLowerCase()
      if (sourceRaw === 'banner' || sourceRaw === 'popup') {
        setPromoSource(sourceRaw)
      }
      const serviceLabel =
        serviceRaw === 'carwash'
          ? 'Car Wash'
          : serviceRaw === 'cardetailing'
            ? 'Car Detailing'
            : 'Car Wash and Car Detailing'
      const hasSpecificBranch = !!params.get('branch_id')
      const branchNote = hasSpecificBranch
        ? 'A branch was fixed for this offer and cannot be changed.'
        : 'You can choose either branch.'
      setPromoPrefillNotice(
        `Welcome! We preselected ${serviceLabel} from the top offer. ${branchNote} Branch can be changed, but service is fixed by this offer.`
      )
    }
    params.delete('auto_promo')
    params.delete('service')
    params.delete('branch_id')
    params.delete('promo_source')
    const nextSearch = params.toString()
    navigate(
      {
        pathname: location.pathname,
        search: nextSearch ? `?${nextSearch}` : '',
      },
      { replace: true }
    )
  }, [
    location.pathname,
    location.search,
    navigate,
    prefilledBranchFromPromo,
    prefilledServiceFromPromo,
    promoPrefillNotice,
  ])

  // Vehicle models
  const vehicleModels: VehicleModel[] = [
    { id: 'hatchback', name: 'Hatchback', image: '/Model/Hatchback.png' },
    { id: 'sedan', name: 'Sedan', image: '/Model/Sedan.png' },
    { id: 'sports', name: 'Sports', image: '/Model/Sports.png' },
    { id: 'suv', name: 'SUV', image: '/Model/Suv.png' },
    { id: 'wagon', name: 'Wagon', image: '/Model/Wagon.png' },
    { id: 'xlarge', name: 'X-Large', image: '/Model/X-Large.png' }
  ]

  // Auto-select vehicle model from HomePage selection
  useEffect(() => {
    if (selectedVehicleModel) return // Already selected, don't override

    try {
      // First, try the detailed object saved by BookingPage itself
      const storedDetailed = localStorage.getItem('selectedVehicleModel')
      if (storedDetailed) {
        const vehicleModel = JSON.parse(storedDetailed)
        const matchedFromDetailed = vehicleModels.find(model =>
          model.id === vehicleModel.id ||
          model.name.toLowerCase() === vehicleModel.name?.toLowerCase()
        )
        if (matchedFromDetailed) {
          setSelectedVehicleModel(matchedFromDetailed)
          return
        }
      }

      // Fallback: try the simple string value saved by HomePage (`selectedCarModel`)
      const storedSimple = localStorage.getItem('selectedCarModel')
      if (storedSimple) {
        const normalized = storedSimple.toLowerCase()
        const matchedFromSimple = vehicleModels.find(model =>
          model.name.toLowerCase() === normalized
        )
        if (matchedFromSimple) {
          setSelectedVehicleModel(matchedFromSimple)
        }
      }
    } catch (error) {
      console.error('Failed to load selected vehicle model from localStorage:', error)
    }
  }, [vehicleModels, selectedVehicleModel])

  // Time slots
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM'
  ]

  useEffect(() => {
    const id = window.setInterval(() => setTimeNowTick(Date.now()), 30000)
    return () => window.clearInterval(id)
  }, [])

  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) return timeSlots
    const now = new Date(timeNowTick)
    if (!isSameCalendarDay(selectedDate, now)) return timeSlots
    return timeSlots.filter((slot) => slotToDate(selectedDate, slot).getTime() > now.getTime())
  }, [selectedDate, timeNowTick])

  useEffect(() => {
    if (!selectedTime) return
    if (!availableTimeSlots.includes(selectedTime)) {
      setSelectedTime('')
    }
  }, [selectedTime, availableTimeSlots])

  // Handle service selection
  const handleServiceToggle = (service: string) => {
    if (promoServiceLocked) return
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
      // Detailed object used by BookingPage
      localStorage.setItem('selectedVehicleModel', JSON.stringify(model))
      // Simple name used by HomePage header/model selection
      localStorage.setItem('selectedCarModel', model.name.toUpperCase())
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
      const personal = validatePersonalDetails(guestFullName, guestEmail, guestPhone)
      setContactErrors(personal)
      if (hasContactErrors(personal)) {
        return
      }
      if (!selectedBranch || selectedServices.length === 0 || !selectedVehicleModel) {
        alert('Please select branch, at least one service, and a vehicle type.')
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
      if (!availableTimeSlots.includes(selectedTime)) {
        alert('Selected time is no longer available. Please choose another time.')
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

  // Get package price for selected branch and vehicle type
  const getPackagePrice = useCallback((pkg: Package) => {
    if (!selectedBranch || !selectedVehicleModel) return 0
    const branchPrice = pkg.prices.find(p =>
      p.branchId === selectedBranch.id &&
      p.vehicleType.toLowerCase() === selectedVehicleModel.name.toLowerCase()
    )
    return branchPrice ? branchPrice.price : 0
  }, [selectedBranch, selectedVehicleModel])

  const bookingBill = useMemo(() => {
    let lineSubtotal = 0
    selectedPackages.forEach(pkg => {
      lineSubtotal += getPackagePrice(pkg)
    })
    selectedExtras.forEach(extraId => {
      const extra = extras.find(e => e.id === extraId)
      if (extra) lineSubtotal += extra.price
    })
    selectedProducts.forEach(selectedProduct => {
      const product = products.find(p => p.id === selectedProduct.productId)
      if (product) lineSubtotal += product.price * selectedProduct.quantity
    })

    const bannerWindowActive =
      !!sitePromo &&
      Boolean(sitePromo.banner_enabled) &&
      promoCountdownActive(sitePromo.countdown_ends_at, sitePromo.countdown_starts_at)
    const popupWindowActive =
      !!sitePromo &&
      Boolean(sitePromo.popup_enabled) &&
      promoCountdownActive(
        sitePromo.popup_countdown_ends_at || sitePromo.countdown_ends_at,
        sitePromo.popup_countdown_starts_at || sitePromo.countdown_starts_at
      )
    const promoOk = !!sitePromo && (bannerWindowActive || popupWindowActive)

    if (!promoOk) {
      return {
        lineSubtotal,
        eligiblePromoSubtotal: 0,
        promoDiscount: 0,
        grandTotal: lineSubtotal,
        showPromoBreakdown: false,
        scopeLabel: '',
      }
    }

    const packageLines = selectedPackages.map(pkg => ({
      serviceType: pkg.serviceType,
      price: getPackagePrice(pkg),
    }))
    const serviceSubtotal = packageLines.reduce((sum, p) => sum + p.price, 0)

    let promoDiscount = 0
    let appliedLabels: string[] = []
    if (bannerWindowActive) {
      const bannerScope = normalizeOfferScope(sitePromo?.banner_offer_discount_scope ?? sitePromo?.offer_discount_scope)
      const bannerType = normalizeOfferDiscountType(sitePromo?.banner_offer_discount_type ?? sitePromo?.offer_discount_type)
      const bannerRawDisc = sitePromo?.banner_offer_discount_value ?? sitePromo?.offer_discount_value
      const bannerDiscVal = typeof bannerRawDisc === 'string' ? parseFloat(bannerRawDisc) : Number(bannerRawDisc ?? 0)
      const bannerDiscValClean = Number.isFinite(bannerDiscVal) && bannerDiscVal > 0 ? bannerDiscVal : 0
      if (bannerDiscValClean > 0) {
        const eligible = eligiblePackageSubtotalForOffer(packageLines, bannerScope)
        promoDiscount += computeOfferDiscountAmount(eligible, bannerType, bannerDiscValClean)
        appliedLabels.push(`Banner: ${offerScopeLabel(bannerScope)}`)
      }
    }
    if (popupWindowActive) {
      const popupScope = normalizeOfferScope(sitePromo?.popup_offer_discount_scope ?? sitePromo?.offer_discount_scope)
      const popupType = normalizeOfferDiscountType(sitePromo?.popup_offer_discount_type ?? sitePromo?.offer_discount_type)
      const popupRawDisc = sitePromo?.popup_offer_discount_value ?? sitePromo?.offer_discount_value
      const popupDiscVal = typeof popupRawDisc === 'string' ? parseFloat(popupRawDisc) : Number(popupRawDisc ?? 0)
      const popupDiscValClean = Number.isFinite(popupDiscVal) && popupDiscVal > 0 ? popupDiscVal : 0
      if (popupDiscValClean > 0) {
        const eligible = eligiblePackageSubtotalForOffer(packageLines, popupScope)
        promoDiscount += computeOfferDiscountAmount(eligible, popupType, popupDiscValClean)
        appliedLabels.push(`Popup: ${offerScopeLabel(popupScope)}`)
      }
    }
    promoDiscount = Math.min(promoDiscount, serviceSubtotal)
    const grandTotal = Math.max(0, Math.round((lineSubtotal - promoDiscount) * 100) / 100)

    return {
      lineSubtotal,
      eligiblePromoSubtotal: serviceSubtotal,
      promoDiscount,
      grandTotal,
      showPromoBreakdown: promoDiscount > 0,
      scopeLabel: appliedLabels.join(' + '),
    }
  }, [
    sitePromo,
    promoSource,
    selectedPackages,
    selectedExtras,
    selectedProducts,
    extras,
    products,
    getPackagePrice,
  ])

  // Format time to HH:MM:SS format
  const formatTimeToAPI = (time: string): string => {
    // Convert "9:00 AM" to "09:00:00"
    const [timePart, period] = time.split(' ')
    const [hours, minutes] = timePart.split(':')
    let hour24 = parseInt(hours)
    if (period === 'PM' && hour24 !== 12) hour24 += 12
    if (period === 'AM' && hour24 === 12) hour24 = 0
    return `${hour24.toString().padStart(2, '0')}:${minutes}:00`
  }

  // Format date to YYYY-MM-DD format
  const formatDateToAPI = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Handle confirm booking
  const handleConfirmBooking = async () => {
    const personal = validatePersonalDetails(guestFullName, guestEmail, guestPhone)
    setContactErrors(personal)
    if (hasContactErrors(personal)) {
      setCurrentStep(1)
      return
    }
    const nameTrim = guestFullName.trim()
    const emailTrim = guestEmail.trim()
    const phoneTrim = guestPhone.trim()
    if (!selectedBranch || !selectedDate || !selectedTime || selectedPackages.length === 0) {
      alert('Please fill all required fields to continue')
      return
    }

    setProductError(null)

    const stockIssue = (() => {
      if (!selectedBranch) return 'Please select a branch to continue.'

      for (const selectedProduct of selectedProducts) {
        const product = products.find(p => p.id === selectedProduct.productId)
        if (!product) return 'A selected product is no longer available.'

        const available = getAvailableStockForBranch(selectedProduct.productId)
        if (available <= 0) return `${product.name} is out of stock at ${selectedBranch.name}.`
        if (selectedProduct.quantity > available) {
          return `Only ${available} of ${product.name} available at ${selectedBranch.name}.`
        }
      }

      return null
    })()

    if (stockIssue) {
      setProductError(stockIssue)
      alert(stockIssue)
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare services array - one service per package
      const services = selectedPackages.map(pkg => ({
        package_id: pkg.id,
        vehicle_type: selectedVehicleModel?.name || '',
        vehicle_number: null,
        arrival_date: formatDateToAPI(selectedDate),
        arrival_time: formatTimeToAPI(selectedTime),
      }))

      // Prepare products array
      const productsRequest = selectedProducts.map(sp => ({
        product_id: sp.productId,
        quantity: sp.quantity,
      }))

      // Prepare extra works array
      const extraWorksRequest = selectedExtras.map(extraId => ({
        extra_works_id: extraId,
      }))

      const orderData = {
        user_full_name: nameTrim,
        user_email_address: emailTrim,
        user_phone_number: phoneTrim,
        branch_id: selectedBranch.id,
        services: services,
        products: productsRequest,
        extra_works: extraWorksRequest,
        apply_site_promo_source: promoSource || undefined,
      }

      const response = await orderApi.createGuest(orderData)

      if (response.success) {
        setShowConfirmationPopup(true)
      } else {
        alert('Failed to create booking: ' + (response.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error creating order:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert('Failed to create booking: ' + errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="booking-page">
      <SEO
        title="Book Online | JS Car Wash & Detailing"
        description="Book your next car wash or detailing service online. Fast, easy, and convenient scheduling for Toongabbie and Dubbo locations."
        canonical="https://www.jscarwash.com/booking"
      />
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
                  {/* Step 1: Personal details, branch, service, vehicle */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="booking-step"
                    >
                      <h2 className="booking-step-title booking-step-title-spaced">Select Branch & Service</h2>
                      {promoPrefillNotice ? (
                        <p className="booking-prefill-notice" role="status">
                          {promoPrefillNotice}
                        </p>
                      ) : null}

                      <fieldset className="booking-form-section booking-contact-section">
                        <legend className="booking-contact-legend">Personal details</legend>
                        <p className="booking-contact-hint" id="booking-contact-hint">
                          Required to confirm your booking and send your confirmation. We handle your details in line with Australian privacy expectations.
                        </p>
                        <div className="booking-field-wrap">
                          <label className="booking-field-label" htmlFor="booking-full-name">
                            Full name <span className="booking-required" aria-hidden="true">*</span>
                          </label>
                          <input
                            id="booking-full-name"
                            type="text"
                            className={`booking-input ${contactErrors.fullName ? 'booking-input-error' : ''}`}
                            placeholder="e.g. Jane Smith"
                            value={guestFullName}
                            onChange={(e) => {
                              setGuestFullName(e.target.value)
                              setContactErrors((prev) => ({ ...prev, fullName: undefined }))
                            }}
                            autoComplete="name"
                            aria-required="true"
                            aria-invalid={contactErrors.fullName ? 'true' : 'false'}
                            aria-describedby={contactErrors.fullName ? 'booking-full-name-err booking-contact-hint' : 'booking-contact-hint'}
                          />
                          {contactErrors.fullName ? (
                            <p id="booking-full-name-err" className="booking-error-message" role="alert">
                              {contactErrors.fullName}
                            </p>
                          ) : null}
                        </div>
                        <div className="booking-field-wrap">
                          <label className="booking-field-label" htmlFor="booking-email">
                            Email <span className="booking-required" aria-hidden="true">*</span>
                          </label>
                          <input
                            id="booking-email"
                            type="email"
                            inputMode="email"
                            className={`booking-input ${contactErrors.email ? 'booking-input-error' : ''}`}
                            placeholder="name@example.com"
                            value={guestEmail}
                            onChange={(e) => {
                              setGuestEmail(e.target.value)
                              setContactErrors((prev) => ({ ...prev, email: undefined }))
                            }}
                            autoComplete="email"
                            aria-required="true"
                            aria-invalid={contactErrors.email ? 'true' : 'false'}
                            aria-describedby={contactErrors.email ? 'booking-email-err booking-contact-hint' : 'booking-contact-hint'}
                          />
                          {contactErrors.email ? (
                            <p id="booking-email-err" className="booking-error-message" role="alert">
                              {contactErrors.email}
                            </p>
                          ) : null}
                        </div>
                        <div className="booking-field-wrap">
                          <label className="booking-field-label" htmlFor="booking-phone">
                            Phone <span className="booking-required" aria-hidden="true">*</span>
                          </label>
                          <input
                            id="booking-phone"
                            type="tel"
                            inputMode="tel"
                            className={`booking-input ${contactErrors.phone ? 'booking-input-error' : ''}`}
                            placeholder="e.g. 0412 345 678 or 02 1234 5678"
                            value={guestPhone}
                            onChange={(e) => {
                              setGuestPhone(e.target.value)
                              setContactErrors((prev) => ({ ...prev, phone: undefined }))
                            }}
                            autoComplete="tel"
                            aria-required="true"
                            aria-invalid={contactErrors.phone ? 'true' : 'false'}
                            aria-describedby={contactErrors.phone ? 'booking-phone-err booking-contact-hint booking-phone-format' : 'booking-contact-hint booking-phone-format'}
                          />
                          <p id="booking-phone-format" className="booking-help-text">
                            Australian or international numbers: include area or country code; digits only are counted for length.
                          </p>
                          {contactErrors.phone ? (
                            <p id="booking-phone-err" className="booking-error-message" role="alert">
                              {contactErrors.phone}
                            </p>
                          ) : null}
                        </div>
                      </fieldset>

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
                                disabled={promoBranchLocked}
                                onClick={() => {
                                  if (promoBranchLocked) return
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
                          {promoBranchLocked ? (
                            <p className="booking-branch-lock-note">
                              Branch is locked by this offer.
                            </p>
                          ) : null}
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
                                disabled={promoServiceLocked}
                              />
                              <span>Car Wash</span>
                            </label>
                            <label className="booking-checkbox-label">
                              <input
                                type="checkbox"
                                checked={selectedServices.includes('cardetailing')}
                                onChange={() => handleServiceToggle('cardetailing')}
                                disabled={promoServiceLocked}
                              />
                              <span>Car Detailing</span>
                            </label>
                          </div>
                          {promoServiceLocked ? (
                            <p className="booking-service-lock-note">
                              Service is locked by this offer.
                            </p>
                          ) : null}
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
                      <div className="booking-step-header">
                        <button
                          className="booking-back-icon-btn"
                          onClick={handleBack}
                          aria-label="Go back"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <h2 className="booking-step-title">
                          {selectedServices.includes('carwash') && selectedServices.includes('cardetailing') && packageStep === 0
                            ? 'Select Car Wash Package'
                            : selectedServices.includes('carwash') && selectedServices.includes('cardetailing') && packageStep === 1
                              ? 'Select Car Detailing Package'
                              : 'Select Package'}
                        </h2>
                      </div>

                      <div className="booking-packages-grid">
                        {packagesLoading ? (
                          <div className="booking-packages-empty">
                            Loading packages...
                          </div>
                        ) : getCurrentPackageSet().length === 0 ? (
                          <div className="booking-packages-empty">
                            No packages available for the selected services.
                          </div>
                        ) : (
                          getCurrentPackageSet().map(pkg => (
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
                                <h3 className="booking-package-card-title">{pkg.name}</h3>
                                {selectedBranch && selectedVehicleModel ? (
                                  (() => {
                                    const matchingPrice = pkg.prices.find(p =>
                                      p.branchId === selectedBranch.id &&
                                      p.vehicleType.toLowerCase() === selectedVehicleModel.name.toLowerCase()
                                    )
                                    const priceNum = matchingPrice ? matchingPrice.price : 0

                                    return priceNum > 0 ? (
                                      <div className="booking-package-price">
                                        <span className="booking-package-price-suffix">Start from /</span>
                                        <span className="booking-package-price-value">${priceNum.toFixed(2)}</span>
                                      </div>
                                    ) : (
                                      <div className="booking-package-price">
                                        <span className="booking-package-price-suffix">Price unavailable</span>
                                      </div>
                                    )
                                  })()
                                ) : (
                                  <div className="booking-package-price">
                                    <span className="booking-package-price-suffix">Select branch and vehicle type</span>
                                  </div>
                                )}
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
                          ))
                        )}
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
                      <div className="booking-step-header">
                        <button
                          className="booking-back-icon-btn"
                          onClick={handleBack}
                          aria-label="Go back"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <h2 className="booking-step-title">Extras & Schedule</h2>
                      </div>

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
                        {productError && (
                          <div className="booking-error-message" style={{ marginBottom: '12px' }}>
                            {productError}
                          </div>
                        )}
                        <div className="booking-products-grid">
                          {products.map(product => {
                            const selectedProduct = selectedProducts.find(sp => sp.productId === product.id)
                            const isSelected = !!selectedProduct
                            const availableStock = getAvailableStockForBranch(product.id)

                            return (
                              <div key={product.id} className={`booking-product-item-wrapper ${isSelected ? 'selected' : ''}`}>
                                <label className="booking-product-item">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    disabled={availableStock <= 0 || !selectedBranch}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        if (!selectedBranch) {
                                          setProductError('Please select a branch to add products.')
                                          return
                                        }

                                        if (availableStock <= 0) {
                                          setProductError(`${product.name} is out of stock at ${selectedBranch.name}.`)
                                          return
                                        }

                                        setSelectedProducts([...selectedProducts, { productId: product.id, quantity: 1 }])
                                        setProductError(null)
                                      } else {
                                        setSelectedProducts(selectedProducts.filter(sp => sp.productId !== product.id))
                                      }
                                    }}
                                  />
                                  <div>
                                    <span>{product.name}</span>
                                    <span className="booking-product-price">+${product.price}</span>
                                    <span className={`booking-product-stock ${availableStock <= 0 ? 'out' : ''}`}>
                                      {selectedBranch
                                        ? `Available: ${availableStock} at ${selectedBranch.name}`
                                        : `Available: ${product.totalStock}`}
                                    </span>
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
                                        const safeQuantity = Math.max(1, Math.min(quantity, availableStock || 1))

                                        if (availableStock > 0 && quantity > availableStock) {
                                          setProductError(`Only ${availableStock} of ${product.name} available at ${selectedBranch?.name || 'this branch'}.`)
                                        } else {
                                          setProductError(null)
                                        }

                                        setSelectedProducts(selectedProducts.map(sp =>
                                          sp.productId === product.id
                                            ? { ...sp, quantity: safeQuantity }
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
                                <div className="booking-time-dropdown">
                                  <label htmlFor="booking-time-select">Select a time</label>
                                  <select
                                    id="booking-time-select"
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                  >
                                    <option value="">Choose a time</option>
                                    {availableTimeSlots.map(time => (
                                      <option key={time} value={time}>
                                        {time}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                {availableTimeSlots.length === 0 ? (
                                  <p className="booking-help-text">No time slots left for today. Please select another date.</p>
                                ) : null}
                                <button
                                  className="booking-continue-btn"
                                  onClick={handleNext}
                                  disabled={!selectedTime}
                                >
                                  Continue
                                </button>
                              </>
                            ) : (
                              <div className="booking-time-placeholder">
                                Select a date to view available times
                              </div>
                            )}
                          </div>
                        </div>
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
                      <div className="booking-step-header">
                        <button
                          className="booking-back-icon-btn"
                          onClick={handleBack}
                          aria-label="Go back"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <h2 className="booking-step-title">Final bill &amp; confirm</h2>
                      </div>

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
                          </div>
                        </div>

                        {/* Row 2: Packages */}
                        <div className="booking-summary-row">
                          <div className="booking-summary-section booking-summary-section-full">
                            <h3>Packages</h3>
                            {selectedPackages.map(pkg => (
                              <div key={pkg.id} className="booking-summary-item">
                                <span>{pkg.name}</span>
                                <span>${getPackagePrice(pkg).toFixed(2)}</span>
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
                                {selectedExtras
                                  .map(extraId => extras.find(e => e.id === extraId))
                                  .filter((extra): extra is Extra => extra !== undefined)
                                  .map(extra => (
                                    <div key={extra.id} className="booking-summary-item">
                                      <span>{extra.name}</span>
                                      <span>${extra.price}</span>
                                    </div>
                                  ))}
                              </div>
                            )}

                            {selectedProducts.length > 0 && (
                              <div className="booking-summary-section">
                                <h3>Products</h3>
                                {selectedProducts
                                  .map(selectedProduct => {
                                    const product = products.find(p => p.id === selectedProduct.productId)
                                    return product ? { product, selectedProduct } : null
                                  })
                                  .filter((item): item is { product: BookingProduct; selectedProduct: SelectedProduct } => item !== null)
                                  .map(({ product, selectedProduct }) => (
                                    <div key={product.id} className="booking-summary-item">
                                      <span>{product.name} {selectedProduct.quantity > 1 ? `(x${selectedProduct.quantity})` : ''}</span>
                                      <span>${(product.price * selectedProduct.quantity).toFixed(2)}</span>
                                    </div>
                                  ))}
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

                        <div className="booking-summary-row">
                          <div className="booking-summary-section booking-summary-section-full">
                            <h3>Personal details</h3>
                            <div className="booking-summary-contact-readonly">
                              <p><strong>Name:</strong> {guestFullName.trim() || '—'}</p>
                              <p><strong>Email:</strong> {guestEmail.trim() || '—'}</p>
                              <p><strong>Phone:</strong> {guestPhone.trim() || '—'}</p>
                              <p className="booking-summary-contact-note">To change these details, go back to step 1.</p>
                            </div>
                          </div>
                        </div>

                        <div className="booking-summary-total">
                          <h3>{bookingBill.showPromoBreakdown ? 'Total to pay' : 'Total'}</h3>
                          {bookingBill.showPromoBreakdown ? (
                            <div className="booking-summary-total-stack">
                              <p className="booking-summary-total-line">
                                <span>Subtotal</span>
                                <span>${bookingBill.lineSubtotal.toFixed(2)}</span>
                              </p>
                              <p className="booking-summary-total-line booking-summary-total-discount">
                                <span>Offer ({bookingBill.scopeLabel})</span>
                                <span>-${bookingBill.promoDiscount.toFixed(2)}</span>
                              </p>
                              <h2 className="booking-summary-total-final">${bookingBill.grandTotal.toFixed(2)}</h2>
                            </div>
                          ) : (
                            <h2>${bookingBill.lineSubtotal.toFixed(2)}</h2>
                          )}
                        </div>

                        <button
                          className="booking-confirm-btn"
                          onClick={handleConfirmBooking}
                          disabled={
                            isSubmitting ||
                            !guestFullName.trim() ||
                            !guestEmail.trim() ||
                            !guestPhone.trim()
                          }
                        >
                          {isSubmitting ? (
                            <>
                              <span className="booking-loading-spinner"></span>
                              Processing...
                            </>
                          ) : (
                            'Confirm Booking'
                          )}
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
                      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                              From $ {selectedPackages.reduce((sum, pkg) => sum + getPackagePrice(pkg), 0).toFixed(2)}
                            </span>
                            <div className="booking-total-summary-package-price-list">
                              {selectedPackages.map(pkg => (
                                <div key={pkg.id} className="booking-total-summary-package-price">
                                  $ {getPackagePrice(pkg).toFixed(2)}
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
                            {selectedExtras
                              .map(extraId => extras.find(e => e.id === extraId))
                              .filter((extra): extra is Extra => extra !== undefined)
                              .map(extra => (
                                <div key={extra.id} className="booking-total-summary-package-item">
                                  {extra.name}
                                </div>
                              ))}
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
                              {selectedExtras
                                .map(extraId => extras.find(e => e.id === extraId))
                                .filter((extra): extra is Extra => extra !== undefined)
                                .map(extra => (
                                  <div key={extra.id} className="booking-total-summary-package-price">
                                    $ {extra.price.toFixed(2)}
                                  </div>
                                ))}
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
                              {selectedProducts
                                .map(selectedProduct => {
                                  const product = products.find(p => p.id === selectedProduct.productId)
                                  return product ? { product, selectedProduct } : null
                                })
                                .filter((item): item is { product: BookingProduct; selectedProduct: SelectedProduct } => item !== null)
                                .map(({ product, selectedProduct }) => (
                                  <div key={product.id} className="booking-total-summary-package-item">
                                    <span className="booking-total-summary-product-name-text">{product.name}</span>
                                    {selectedProduct.quantity > 1 && <span className="booking-total-summary-quantity"> (x{selectedProduct.quantity})</span>}
                                  </div>
                                ))}
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
                              {selectedProducts
                                .map(selectedProduct => {
                                  const product = products.find(p => p.id === selectedProduct.productId)
                                  return product ? { product, selectedProduct } : null
                                })
                                .filter((item): item is { product: BookingProduct; selectedProduct: SelectedProduct } => item !== null)
                                .map(({ product, selectedProduct }) => (
                                  <div key={product.id} className="booking-total-summary-package-price">
                                    $ {(product.price * selectedProduct.quantity).toFixed(2)}
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="booking-total-summary-divider"></div>

                    {bookingBill.showPromoBreakdown ? (
                      <>
                        <div className="booking-total-summary-row">
                          <span className="booking-total-summary-name">Subtotal</span>
                          <span className="booking-total-summary-total">${bookingBill.lineSubtotal.toFixed(2)}</span>
                        </div>
                        <div className="booking-total-summary-row booking-total-summary-row-discount">
                          <span className="booking-total-summary-name">Offer ({bookingBill.scopeLabel})</span>
                          <span className="booking-total-summary-total">-${bookingBill.promoDiscount.toFixed(2)}</span>
                        </div>
                        <div className="booking-total-summary-divider"></div>
                      </>
                    ) : null}

                    <div className="booking-total-summary-row booking-total-summary-row-final">
                      <span className="booking-total-summary-name booking-total-summary-name-final">
                        {bookingBill.showPromoBreakdown ? 'Total to pay' : 'Total'}
                      </span>
                      <span className="booking-total-summary-total booking-total-summary-total-final">
                        $ {(bookingBill.showPromoBreakdown ? bookingBill.grandTotal : bookingBill.lineSubtotal).toFixed(2)}
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
                  <circle cx="32" cy="32" r="32" fill="#4caf50" opacity="0.1" />
                  <path d="M32 16C23.163 16 16 23.163 16 32C16 40.837 23.163 48 32 48C40.837 48 48 40.837 48 32C48 23.163 40.837 16 32 16ZM28 38L20 30L22.83 27.17L28 32.34L41.17 19.17L44 22L28 38Z" fill="#4caf50" />
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
