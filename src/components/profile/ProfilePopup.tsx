import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { orderApi, reviewApi, type ApiOrder, type ApiReview } from '../../services/api'
import ReviewSuccessModal from './ReviewSuccessModal'
import ConfirmationModal from './ConfirmationModal'
import './ProfilePopup.css'

type TabType = 'profile' | 'orders' | 'reviews'

interface ProfilePopupProps {
  isOpen: boolean
  onClose: () => void
}

function ProfilePopup({ isOpen, onClose }: ProfilePopupProps) {
  const { user, logout } = useAuth()
  const [activeTab] = useState<TabType>('profile')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [selectedOrderForReview, setSelectedOrderForReview] = useState<string | null>(null)
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [showReviewSuccessModal, setShowReviewSuccessModal] = useState(false)
  const [apiOrders, setApiOrders] = useState<ApiOrder[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, { services: boolean; products: boolean; extraWorks: boolean }>>({})
  const [apiReviews, setApiReviews] = useState<ApiReview[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewsError, setReviewsError] = useState<string | null>(null)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState<ApiReview | null>(null)

  useEffect(() => {
    if (user) {
      setEditFirstName(user.firstName)
      setEditLastName(user.lastName)
      setEditEmail(user.email)
      setEditPhone(user.phone)
    }
  }, [user])

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !isOpen) return

      try {
        setOrdersLoading(true)
        setOrdersError(null)
        const response = await orderApi.getByUserId(user.id)
        if (response.success && response.data) {
          const activeOrders = response.data.filter(order => order.is_active)
          setApiOrders(activeOrders)
        }
      } catch (err) {
        setOrdersError(err instanceof Error ? err.message : 'Failed to load orders')
      } finally {
        setOrdersLoading(false)
      }
    }

    if (isOpen && activeTab === 'orders') {
      fetchOrders()
    }
  }, [user, isOpen, activeTab])

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user || !isOpen) return

      try {
        setReviewsLoading(true)
        setReviewsError(null)
        const response = await reviewApi.getByUserId(user.id)
        if (response.success && response.data) {
          const activeReviews = response.data.filter(review => review.is_active)
          setApiReviews(activeReviews)
        }
      } catch (err) {
        setReviewsError(err instanceof Error ? err.message : 'Failed to load reviews')
      } finally {
        setReviewsLoading(false)
      }
    }

    if (isOpen && activeTab === 'reviews') {
      fetchReviews()
    }
  }, [user, isOpen, activeTab])

  const orders = useMemo(() => {
    return apiOrders.map((apiOrder): import('../../contexts/AuthContext').Order => {
      const items: Array<{ name: string; quantity: number; price: number }> = []

      apiOrder.product_details.forEach(pd => {
        if (pd.product) {
          items.push({
            name: pd.product.product_name,
            quantity: pd.quantity,
            price: parseFloat(pd.amount)
          })
        }
      })

      apiOrder.service_details.forEach(sd => {
        if (sd.package) {
          items.push({
            name: sd.package.package_name,
            quantity: 1,
            price: parseFloat(sd.package.total_amount)
          })
        }
      })

      apiOrder.extra_work_details.forEach(ewd => {
        if (ewd.extra_work) {
          items.push({
            name: ewd.extra_work.name,
            quantity: 1,
            price: parseFloat(ewd.extra_work.amount)
          })
        }
      })

      return {
        id: apiOrder.id.toString(),
        date: apiOrder.order_at || apiOrder.createdAt,
        items,
        total: parseFloat(apiOrder.total_amount),
        status: apiOrder.status as 'pending' | 'completed' | 'cancelled'
      }
    })
  }, [apiOrders])

  const reviews = useMemo(() => {
    return apiReviews.map((apiReview): import('../../contexts/AuthContext').Review => {
      const order = orders.find(o => o.id === apiReview.order_id.toString())
      return {
        id: apiReview.id.toString(),
        orderId: apiReview.order_id.toString(),
        orderDate: order?.date || apiReview.createdAt,
        items: order?.items || [],
        rating: apiReview.rating,
        comment: apiReview.review,
        date: apiReview.createdAt
      }
    })
  }, [apiReviews, orders])

  useEffect(() => {
    if (editingReviewId) {
      const apiReview = apiReviews.find(r => r.id === editingReviewId)
      if (apiReview) {
        setReviewRating(apiReview.rating)
        setReviewComment(apiReview.review)
      }
    }
  }, [editingReviewId, apiReviews])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      
      // Lock body scroll when popup is open
      const originalOverflow = document.body.style.overflow
      const originalPosition = document.body.style.position
      const scrollY = window.scrollY
      
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      
      // Prevent scroll events from propagating to window (which would trigger navbar hide)
      const preventScrollPropagation = (e: Event) => {
        e.stopPropagation()
      }
      window.addEventListener('scroll', preventScrollPropagation, true)
      window.addEventListener('wheel', preventScrollPropagation, true)
      document.addEventListener('scroll', preventScrollPropagation, true)
      
      // Prevent any click events from bubbling up (but allow button clicks)
      const preventClickBubble = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        // Don't prevent clicks on buttons - let them work normally
        if (target.closest('button') || target.closest('.profile-popup-close-btn') || target.closest('.profile-popup-logout-btn')) {
          return
        }
        if (target.closest('.profile-popup') || target.closest('.profile-popup-backdrop')) {
          e.stopPropagation()
        }
      }
      document.addEventListener('click', preventClickBubble, true)
      
      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.removeEventListener('click', preventClickBubble, true)
        window.removeEventListener('scroll', preventScrollPropagation, true)
        window.removeEventListener('wheel', preventScrollPropagation, true)
        document.removeEventListener('scroll', preventScrollPropagation, true)
        document.body.style.overflow = originalOverflow
        document.body.style.position = originalPosition
        document.body.style.top = ''
        document.body.style.width = ''
        window.scrollTo(0, scrollY)
      }
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
    }
  }, [isOpen, onClose])

  const handleLogout = () => {
    logout()
    onClose()
  }

  // Helper functions
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#10b981'
      case 'pending':
        return '#f59e0b'
      case 'cancelled':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  const handleChangePassword = async () => {
    if (!user) return

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill all password fields')
      return
    }

    if (newPassword !== confirmPassword) {
      alert('New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long')
      return
    }

    try {
      // You would implement the password change API call here
      // For now, just show a success message
      alert('Password changed successfully!')
      setIsChangingPassword(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      alert('Failed to change password')
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return

    try {
      // You would implement the profile update API call here
      // For now, just show a success message
      alert('Profile updated successfully!')
      setIsEditingProfile(false)
    } catch (error) {
      alert('Failed to update profile')
    }
  }

  if (!isOpen || !user) {
    return null
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            className="profile-popup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <motion.div
            className="profile-popup"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
            onMouseDown={(e) => {
              e.stopPropagation()
            }}
            style={{
              top: '50%',
              left: '50%',
              x: '-50%',
              y: '-40%',
              pointerEvents: 'auto'
            }}
          >
            {/* Profile Popup Header */}
            <div className="profile-popup-header">
              <div className="profile-popup-header-content">
                <div className="profile-popup-avatar">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="profile-main-content">
                  <AnimatePresence mode="wait">
                    {activeTab === 'profile' && (
                      <motion.div
                        key="profile"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="profile-tab-content"
                      >
                        <div className="profile-header-section">
                          <h3 className="profile-content-title">Profile Information</h3>
                        </div>
                        <div className="profile-action-buttons">
                          <button
                            className="profile-edit-btn"
                            onClick={() => {
                              setIsEditingProfile(!isEditingProfile)
                              setIsChangingPassword(false)
                            }}
                          >
                            <i className="fas fa-edit"></i>
                            {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                          </button>
                          <button
                            className="profile-password-btn"
                            onClick={() => {
                              setIsChangingPassword(!isChangingPassword)
                              setIsEditingProfile(false)
                            }}
                          >
                            <i className="fas fa-key"></i>
                            {isChangingPassword ? 'Cancel' : 'Change Password'}
                          </button>
                        </div>

                        {isChangingPassword ? (
                          <div className="profile-password-section">
                            <h4 className="profile-section-subtitle">Change Password</h4>
                            <div className="profile-form">
                              <div className="profile-form-group">
                                <label>Current Password *</label>
                                <input
                                  type="password"
                                  value={currentPassword}
                                  onChange={(e) => setCurrentPassword(e.target.value)}
                                  placeholder="Enter current password"
                                />
                              </div>
                              <div className="profile-form-group">
                                <label>New Password *</label>
                                <input
                                  type="password"
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  placeholder="Enter new password"
                                />
                              </div>
                              <div className="profile-form-group">
                                <label>Confirm New Password *</label>
                                <input
                                  type="password"
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  placeholder="Confirm new password"
                                />
                              </div>
                              <button
                                className="profile-save-btn"
                                onClick={handleChangePassword}
                              >
                                Update Password
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="profile-details-section">
                            <div className="profile-details-grid">
                              <div className="profile-detail-item">
                                <label>First Name</label>
                                {isEditingProfile ? (
                                  <input
                                    type="text"
                                    value={editFirstName}
                                    onChange={(e) => setEditFirstName(e.target.value)}
                                    className="profile-edit-input"
                                  />
                                ) : (
                                  <div className="profile-detail-value">{user.firstName}</div>
                                )}
                              </div>
                              <div className="profile-detail-item">
                                <label>Last Name</label>
                                {isEditingProfile ? (
                                  <input
                                    type="text"
                                    value={editLastName}
                                    onChange={(e) => setEditLastName(e.target.value)}
                                    className="profile-edit-input"
                                  />
                                ) : (
                                  <div className="profile-detail-value">{user.lastName}</div>
                                )}
                              </div>
                              <div className="profile-detail-item">
                                <label>User Name</label>
                                <div className="profile-detail-value">@{user.userName}</div>
                              </div>
                              <div className="profile-detail-item">
                                <label>Email</label>
                                {isEditingProfile ? (
                                  <input
                                    type="email"
                                    value={editEmail}
                                    onChange={(e) => setEditEmail(e.target.value)}
                                    className="profile-edit-input"
                                  />
                                ) : (
                                  <div className="profile-detail-value">{user.email}</div>
                                )}
                              </div>
                              <div className="profile-detail-item">
                                <label>Phone</label>
                                {isEditingProfile ? (
                                  <input
                                    type="tel"
                                    value={editPhone}
                                    onChange={(e) => setEditPhone(e.target.value)}
                                    className="profile-edit-input"
                                  />
                                ) : (
                                  <div className="profile-detail-value">{user.phone}</div>
                                )}
                              </div>
                            </div>
                            {isEditingProfile && (
                              <div className="profile-save-actions">
                                <button
                                  className="profile-save-btn"
                                  onClick={handleSaveProfile}
                                >
                                  Save Changes
                                </button>
                                <button
                                  className="profile-cancel-btn"
                                  onClick={() => {
                                    setIsEditingProfile(false)
                                    if (user) {
                                      setEditFirstName(user.firstName)
                                      setEditLastName(user.lastName)
                                      setEditEmail(user.email)
                                      setEditPhone(user.phone)
                                    }
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}


                    {activeTab === 'orders' && (
                      <motion.div
                        key="orders"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="profile-tab-content"
                      >
                        <h3 className="profile-content-title">My Orders</h3>
                        {ordersLoading ? (
                          <div className="profile-no-orders">
                            <i className="fas fa-spinner fa-spin"></i>
                            <p>Loading orders...</p>
                          </div>
                        ) : ordersError ? (
                          <div className="profile-no-orders">
                            <i className="fas fa-exclamation-triangle"></i>
                            <p>{ordersError}</p>
                          </div>
                        ) : orders.length === 0 ? (
                          <div className="profile-no-orders">
                            <i className="fas fa-shopping-bag"></i>
                            <p>No orders yet</p>
                          </div>
                        ) : (
                          <div className="profile-orders-list">
                            {orders.map((order) => {
                              const apiOrder = apiOrders.find(ao => ao.id.toString() === order.id)
                              const orderKey = order.id
                              const expanded = expandedSections[orderKey] || { services: false, products: false, extraWorks: false }
                              
                              const toggleSection = (section: 'services' | 'products' | 'extraWorks') => {
                                setExpandedSections(prev => ({
                                  ...prev,
                                  [orderKey]: {
                                    services: prev[orderKey]?.services || false,
                                    products: prev[orderKey]?.products || false,
                                    extraWorks: prev[orderKey]?.extraWorks || false,
                                    [section]: !(prev[orderKey]?.[section] || false)
                                  }
                                }))
                              }

                              const hasServices = apiOrder?.service_details && apiOrder.service_details.length > 0
                              const hasProducts = apiOrder?.product_details && apiOrder.product_details.length > 0
                              const hasExtraWorks = apiOrder?.extra_work_details && apiOrder.extra_work_details.length > 0

                              return (
                                <div key={order.id} className="profile-order-item">
                                  <div className="profile-order-header">
                                    <div className="profile-order-info">
                                      <span className="profile-order-id">Order #{order.id}</span>
                                      <span className="profile-order-date">{formatDate(order.date)}</span>
                                      {apiOrder?.branch && (
                                        <span className="profile-order-branch" style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>
                                          <i className="fas fa-map-marker-alt"></i> {apiOrder.branch.branch_name}
                                        </span>
                                      )}
                                    </div>
                                    <span
                                      className="profile-order-status"
                                      style={{ color: getStatusColor(order.status) }}
                                    >
                                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                  </div>

                                  {hasServices && (
                                    <div className="profile-order-section">
                                      <button
                                        className="profile-order-section-header"
                                        onClick={() => toggleSection('services')}
                                      >
                                        <span>
                                          <i className="fas fa-car"></i> Service Details
                                        </span>
                                        <i className={`fas fa-chevron-${expanded.services ? 'up' : 'down'}`}></i>
                                      </button>
                                      {expanded.services && (
                                        <div className="profile-order-section-content">
                                          {apiOrder.service_details.map((service, idx) => (
                                            <div key={idx} className="profile-order-detail-item">
                                              <div className="profile-order-detail-row">
                                                <span className="profile-order-detail-label">Package:</span>
                                                <span>{service.package?.package_name || 'N/A'}</span>
                                              </div>
                                              {service.vehicle_type && (
                                                <div className="profile-order-detail-row">
                                                  <span className="profile-order-detail-label">Vehicle Type:</span>
                                                  <span>{service.vehicle_type}</span>
                                                </div>
                                              )}
                                              {service.vehicle_number && (
                                                <div className="profile-order-detail-row">
                                                  <span className="profile-order-detail-label">Vehicle Number:</span>
                                                  <span>{service.vehicle_number}</span>
                                                </div>
                                              )}
                                              {service.arrival_date && (
                                                <div className="profile-order-detail-row">
                                                  <span className="profile-order-detail-label">Arrival Date:</span>
                                                  <span>{service.arrival_date}</span>
                                                </div>
                                              )}
                                              {service.arrival_time && (
                                                <div className="profile-order-detail-row">
                                                  <span className="profile-order-detail-label">Arrival Time:</span>
                                                  <span>{service.arrival_time}</span>
                                                </div>
                                              )}
                                              {service.package?.total_amount && (
                                                <div className="profile-order-detail-row">
                                                  <span className="profile-order-detail-label">Amount:</span>
                                                  <span>${parseFloat(service.package.total_amount).toFixed(2)}</span>
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {hasProducts && (
                                    <div className="profile-order-section">
                                      <button
                                        className="profile-order-section-header"
                                        onClick={() => toggleSection('products')}
                                      >
                                        <span>
                                          <i className="fas fa-shopping-bag"></i> Product Details
                                        </span>
                                        <i className={`fas fa-chevron-${expanded.products ? 'up' : 'down'}`}></i>
                                      </button>
                                      {expanded.products && (
                                        <div className="profile-order-section-content">
                                          {apiOrder.product_details.map((product, idx) => (
                                            <div key={idx} className="profile-order-detail-item">
                                              <div className="profile-order-detail-row">
                                                <span className="profile-order-detail-label">Product:</span>
                                                <span>{product.product?.product_name || 'N/A'}</span>
                                              </div>
                                              <div className="profile-order-detail-row">
                                                <span className="profile-order-detail-label">Quantity:</span>
                                                <span>{product.quantity}</span>
                                              </div>
                                              <div className="profile-order-detail-row">
                                                <span className="profile-order-detail-label">Amount:</span>
                                                <span>${parseFloat(product.amount).toFixed(2)}</span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {hasExtraWorks && (
                                    <div className="profile-order-section">
                                      <button
                                        className="profile-order-section-header"
                                        onClick={() => toggleSection('extraWorks')}
                                      >
                                        <span>
                                          <i className="fas fa-tools"></i> Extra Work Details
                                        </span>
                                        <i className={`fas fa-chevron-${expanded.extraWorks ? 'up' : 'down'}`}></i>
                                      </button>
                                      {expanded.extraWorks && (
                                        <div className="profile-order-section-content">
                                          {apiOrder.extra_work_details.map((extraWork, idx) => (
                                            <div key={idx} className="profile-order-detail-item">
                                              <div className="profile-order-detail-row">
                                                <span className="profile-order-detail-label">Service:</span>
                                                <span>{extraWork.extra_work?.name || 'N/A'}</span>
                                              </div>
                                              {extraWork.extra_work?.description && (
                                                <div className="profile-order-detail-row">
                                                  <span className="profile-order-detail-label">Description:</span>
                                                  <span>{extraWork.extra_work.description}</span>
                                                </div>
                                              )}
                                              {extraWork.extra_work?.amount && (
                                                <div className="profile-order-detail-row">
                                                  <span className="profile-order-detail-label">Amount:</span>
                                                  <span>${parseFloat(extraWork.extra_work.amount).toFixed(2)}</span>
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  <div className="profile-order-total">
                                    <span>Total:</span>
                                    <span>${order.total.toFixed(2)}</span>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === 'reviews' && (
                      <motion.div
                        key="reviews"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="profile-tab-content"
                      >
                        <h3 className="profile-content-title">My Reviews</h3>
                        
                        {reviewsLoading ? (
                          <div className="profile-no-reviews">
                            <i className="fas fa-spinner fa-spin"></i>
                            <p>Loading reviews...</p>
                          </div>
                        ) : reviewsError ? (
                          <div className="profile-no-reviews">
                            <i className="fas fa-exclamation-triangle"></i>
                            <p>{reviewsError}</p>
                          </div>
                        ) : selectedOrderForReview || editingReviewId ? (
                          <div className="profile-review-form-section">
                            <div className="profile-review-form-header">
                              <button
                                className="profile-review-back-btn"
                                onClick={() => {
                                  setSelectedOrderForReview(null)
                                  setEditingReviewId(null)
                                  setReviewRating(0)
                                  setReviewComment('')
                                }}
                              >
                                <i className="fas fa-arrow-left"></i>
                                Back
                              </button>
                              <h4 className="profile-review-form-title">
                                {editingReviewId ? 'Edit Review' : 'Write a Review'}
                              </h4>
                            </div>
                            {(() => {
                              if (editingReviewId) {
                                const apiReview = apiReviews.find(r => r.id === editingReviewId)
                                if (!apiReview) return null
                                const order = orders.find(o => o.id === apiReview.order_id.toString())
                                if (!order) return null
                                return (
                                  <div className="profile-review-order-info">
                                    <p className="profile-review-order-id">Order #{order.id.slice(-6)}</p>
                                    <p className="profile-review-order-date">{formatDate(order.date)}</p>
                                    <div className="profile-review-order-items">
                                      {order.items.map((item, index) => (
                                        <div key={index} className="profile-review-order-item">
                                          <span>{item.name} x{item.quantity}</span>
                                          <span>${item.price.toFixed(2)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )
                              }
                              const order = orders.find(o => o.id === selectedOrderForReview)
                              if (!order) return null
                              return (
                                <div className="profile-review-order-info">
                                  <p className="profile-review-order-id">Order #{order.id.slice(-6)}</p>
                                  <p className="profile-review-order-date">{formatDate(order.date)}</p>
                                  <div className="profile-review-order-items">
                                    {order.items.map((item, index) => (
                                      <div key={index} className="profile-review-order-item">
                                        <span>{item.name} x{item.quantity}</span>
                                        <span>${item.price.toFixed(2)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                            })()}
                            <form
                              className="profile-review-form"
                              onSubmit={async (e) => {
                                e.preventDefault()
                                if (!user) return

                                if (reviewRating === 0) {
                                  alert('Please select a rating')
                                  return
                                }
                                if (!reviewComment.trim()) {
                                  alert('Please write a comment')
                                  return
                                }

                                try {
                                  setSubmittingReview(true)

                                  if (editingReviewId) {
                                    const response = await reviewApi.update(editingReviewId, {
                                      rating: reviewRating,
                                      review: reviewComment.trim(),
                                      is_show_others: true
                                    })

                                    if (response.success) {
                                      await reviewApi.getByUserId(user.id).then(res => {
                                        if (res.success && res.data) {
                                          const activeReviews = res.data.filter(review => review.is_active)
                                          setApiReviews(activeReviews)
                                        }
                                      })
                                      setEditingReviewId(null)
                                      setReviewRating(0)
                                      setReviewComment('')
                                      setShowReviewSuccessModal(true)
                                    } else {
                                      alert(response.message || 'Failed to update review')
                                    }
                                  } else {
                                    const order = orders.find(o => o.id === selectedOrderForReview)
                                    if (!order) return

                                    const apiOrder = apiOrders.find(ao => ao.id.toString() === order.id)
                                    if (!apiOrder) {
                                      alert('Order not found')
                                      return
                                    }

                                    if (apiOrder.status !== 'completed') {
                                      alert('Only completed orders can be reviewed')
                                      return
                                    }

                                    const response = await reviewApi.create({
                                      order_id: apiOrder.id,
                                      rating: reviewRating,
                                      review: reviewComment.trim(),
                                      is_show_others: true,
                                      is_active: true
                                    })

                                    if (response.success) {
                                      await reviewApi.getByUserId(user.id).then(res => {
                                        if (res.success && res.data) {
                                          const activeReviews = res.data.filter(review => review.is_active)
                                          setApiReviews(activeReviews)
                                        }
                                      })
                                      setSelectedOrderForReview(null)
                                      setReviewRating(0)
                                      setReviewComment('')
                                      setShowReviewSuccessModal(true)
                                    } else {
                                      alert(response.message || 'Failed to submit review')
                                    }
                                  }
                                } catch (err) {
                                  alert(err instanceof Error ? err.message : 'Failed to submit review')
                                } finally {
                                  setSubmittingReview(false)
                                }
                              }}
                            >
                              <div className="profile-review-rating-section">
                                <label className="profile-review-rating-label">Rating *</label>
                                <div className="profile-review-stars">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      className={`profile-review-star ${reviewRating >= star ? 'active' : ''}`}
                                      onClick={() => setReviewRating(star)}
                                    >
                                      <i className="fas fa-star"></i>
                                    </button>
                                  ))}
                                </div>
                                {reviewRating > 0 && (
                                  <p className="profile-review-rating-text">
                                    {reviewRating === 1 && 'Poor'}
                                    {reviewRating === 2 && 'Fair'}
                                    {reviewRating === 3 && 'Good'}
                                    {reviewRating === 4 && 'Very Good'}
                                    {reviewRating === 5 && 'Excellent'}
                                  </p>
                                )}
                              </div>
                              <div className="profile-review-form-group">
                                <label htmlFor="review-comment">Your Review *</label>
                                <textarea
                                  id="review-comment"
                                  value={reviewComment}
                                  onChange={(e) => setReviewComment(e.target.value)}
                                  placeholder="Share your experience with this service..."
                                  rows={6}
                                  className="profile-review-textarea"
                                  required
                                />
                              </div>
                              <div className="profile-review-form-actions">
                                <button
                                  type="button"
                                  className="profile-review-cancel-btn"
                                  onClick={() => {
                                    setSelectedOrderForReview(null)
                                    setEditingReviewId(null)
                                    setReviewRating(0)
                                    setReviewComment('')
                                  }}
                                >
                                  Cancel
                                </button>
                                <button type="submit" className="profile-review-submit-btn" disabled={submittingReview}>
                                  {submittingReview ? (
                                    <>
                                      <i className="fas fa-spinner fa-spin"></i>
                                      <span>{editingReviewId ? 'Updating...' : 'Submitting...'}</span>
                                    </>
                                  ) : (
                                    editingReviewId ? 'Update Review' : 'Submit Review'
                                  )}
                                </button>
                              </div>
                            </form>
                          </div>
                        ) : (
                          <>
                            {(() => {
                              const completedOrders = orders.filter(o => o.status === 'completed')
                              const reviewedOrderIds = reviews.map(r => r.orderId)
                              const availableOrdersToReview = completedOrders.filter(o => !reviewedOrderIds.includes(o.id))
                              
                              const hasCompletedOrders = completedOrders.length > 0
                              
                              return (
                                <>
                                  {!hasCompletedOrders && (
                                    <div className="profile-no-reviews">
                                      <i className="fas fa-info-circle"></i>
                                      <p>No completed orders yet</p>
                                      <p className="profile-no-reviews-subtitle">
                                        Complete an order to leave a review
                                      </p>
                                    </div>
                                  )}
                                  {hasCompletedOrders && availableOrdersToReview.length > 0 && (
                                    <div className="profile-reviews-section">
                                      <h4 className="profile-reviews-section-title">Available Orders to Review</h4>
                                      <div className="profile-orders-to-review">
                                        {availableOrdersToReview.map((order) => (
                                          <div key={order.id} className="profile-order-to-review">
                                            <div className="profile-order-to-review-info">
                                              <div>
                                                <p className="profile-order-to-review-id">Order #{order.id.slice(-6)}</p>
                                                <p className="profile-order-to-review-date">{formatDate(order.date)}</p>
                                              </div>
                                              <button
                                                className="profile-review-order-btn"
                                                onClick={() => {
                                                  const apiOrder = apiOrders.find(ao => ao.id.toString() === order.id)
                                                  if (apiOrder && apiOrder.status === 'completed') {
                                                    setSelectedOrderForReview(order.id)
                                                  } else {
                                                    alert('Only completed orders can be reviewed')
                                                  }
                                                }}
                                              >
                                                <i className="fas fa-star"></i>
                                                Write Review
                                              </button>
                                            </div>
                                            <div className="profile-order-to-review-items">
                                              {order.items.map((item, index) => (
                                                <span key={index} className="profile-order-to-review-item">
                                                  {item.name} x{item.quantity}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  <div className="profile-reviews-section">
                                    <h4 className="profile-reviews-section-title">
                                      {reviews.length > 0 ? 'Your Reviews' : 'No Reviews Yet'}
                                    </h4>
                                    {reviews.length === 0 ? (
                                      <div className="profile-no-reviews">
                                        <i className="fas fa-star"></i>
                                        <p>You haven't left any reviews yet.</p>
                                        <p className="profile-no-reviews-subtitle">
                                          {availableOrdersToReview.length > 0
                                            ? 'Review your completed orders above'
                                            : 'Complete an order to leave a review'}
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="profile-reviews-list">
                                        {reviews.map((review) => {
                                          const apiReview = apiReviews.find(r => r.id.toString() === review.id)
                                          return (
                                            <div key={review.id} className="profile-review-item">
                                              <div className="profile-review-item-header">
                                                <div className="profile-review-item-info">
                                                  <p className="profile-review-item-order">Order #{review.orderId.slice(-6)}</p>
                                                  <p className="profile-review-item-date">{formatDate(review.date)}</p>
                                                </div>
                                                <div className="profile-review-item-rating">
                                                  {[1, 2, 3, 4, 5].map((star) => (
                                                    <i
                                                      key={star}
                                                      className={`fas fa-star ${review.rating >= star ? 'active' : ''}`}
                                                    ></i>
                                                  ))}
                                                </div>
                                              </div>
                                              <div className="profile-review-item-items">
                                                {review.items.map((item, index) => (
                                                  <span key={index} className="profile-review-item-service">
                                                    {item.name}
                                                  </span>
                                                ))}
                                              </div>
                                              <p className="profile-review-item-comment">{review.comment}</p>
                                              <div className="profile-review-item-actions">
                                                <button
                                                  className="profile-review-edit-btn"
                                                  onClick={() => {
                                                    if (apiReview) {
                                                      setEditingReviewId(apiReview.id)
                                                      setReviewRating(apiReview.rating)
                                                      setReviewComment(apiReview.review)
                                                      setSelectedOrderForReview(null)
                                                    }
                                                  }}
                                                >
                                                  <i className="fas fa-edit"></i>
                                                  Edit
                                                </button>
                                                <button
                                                  className="profile-review-delete-btn"
                                                  onClick={() => {
                                                    if (apiReview) {
                                                      setReviewToDelete(apiReview)
                                                      setShowDeleteConfirm(true)
                                                    }
                                                  }}
                                                  disabled={deletingReviewId === apiReview?.id}
                                                >
                                                  {deletingReviewId === apiReview?.id ? (
                                                    <>
                                                      <i className="fas fa-spinner fa-spin"></i>
                                                      <span>Deleting...</span>
                                                    </>
                                                  ) : (
                                                    <>
                                                      <i className="fas fa-trash"></i>
                                                      <span>Delete</span>
                                                    </>
                                                  )}
                                                </button>
                                              </div>
                                            </div>
                                          )
                                        })}
                                      </div>
                                    )}
                                  </div>
                                </>
                              )
                            })()}
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <button
                className="profile-popup-close-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  onClose()
                }}
                aria-label="Close profile"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Profile Popup Content */}
            <div className="profile-popup-content">
              {/* User Details Section */}
              <div className="profile-popup-section">
                <h3 className="profile-popup-section-title">Account Information</h3>
                <div className="profile-popup-details">
                  <div className="profile-popup-detail-item">
                    <i className="fas fa-envelope"></i>
                    <div>
                      <span className="profile-popup-detail-label">Email</span>
                      <span className="profile-popup-detail-value">{user.email}</span>
                    </div>
                  </div>
                  <div className="profile-popup-detail-item">
                    <i className="fas fa-phone"></i>
                    <div>
                      <span className="profile-popup-detail-label">Phone</span>
                      <span className="profile-popup-detail-value">{user.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders Section */}
              {orders && orders.length > 0 && (
                <div className="profile-popup-section">
                  <h3 className="profile-popup-section-title">Recent Orders</h3>
                  <div className="profile-popup-orders">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="profile-popup-order-item">
                        <div className="profile-popup-order-info">
                          <span className="profile-popup-order-id">Order #{order.id}</span>
                          <span className="profile-popup-order-date">
                            {new Date(order.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="profile-popup-order-status">
                          <span className={`profile-popup-status-badge ${order.status}`}>
                            {order.status}
                          </span>
                          <span className="profile-popup-order-total">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions Section */}
              <div className="profile-popup-actions">
                <button
                  className="profile-popup-logout-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLogout()
                  }}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  Log Out
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
      <ReviewSuccessModal
        isOpen={showReviewSuccessModal}
        onClose={() => setShowReviewSuccessModal(false)}
      />
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={async () => {
          if (!reviewToDelete || !user) return

          try {
            setDeletingReviewId(reviewToDelete.id)
            setShowDeleteConfirm(false)
            const response = await reviewApi.delete(reviewToDelete.id)
            if (response.success) {
              // Refresh reviews list to update the UI immediately
              const res = await reviewApi.getByUserId(user.id)
              if (res.success && res.data) {
                const activeReviews = res.data.filter(review => review.is_active)
                setApiReviews(activeReviews)
                // The order will automatically appear in "Available Orders to Review" 
                // because the reviews list is updated and the useMemo will recalculate
              }
            } else {
              alert(response.message || 'Failed to delete review')
            }
          } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete review')
          } finally {
            setDeletingReviewId(null)
            setReviewToDelete(null)
          }
        }}
        onCancel={() => {
          setShowDeleteConfirm(false)
          setReviewToDelete(null)
        }}
      />
    </AnimatePresence>
  )
}

export default ProfilePopup
