import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import ReviewSuccessModal from './ReviewSuccessModal'
import './ProfilePopup.css'

interface ProfilePopupProps {
  isOpen: boolean
  onClose: () => void
}

type TabType = 'profile' | 'orders' | 'reviews'

function ProfilePopup({ isOpen, onClose }: ProfilePopupProps) {
  const { user, logout, orders, reviews, addReview } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>('profile')
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
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [showReviewSuccessModal, setShowReviewSuccessModal] = useState(false)

  useEffect(() => {
    if (user) {
      setEditFirstName(user.firstName)
      setEditLastName(user.lastName)
      setEditEmail(user.email)
      setEditPhone(user.phone)
    }
  }, [user])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleLogout = () => {
    logout()
    onClose()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4caf50'
      case 'pending':
        return '#ff9800'
      case 'cancelled':
        return '#f44336'
      default:
        return '#666'
    }
  }

  const handleSaveProfile = () => {
    if (user) {
      const updatedUser = {
        ...user,
        firstName: editFirstName,
        lastName: editLastName,
        email: editEmail,
        phone: editPhone
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      window.location.reload()
    }
    setIsEditingProfile(false)
  }

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!')
      return
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters!')
      return
    }
    alert('Password changed successfully!')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setIsChangingPassword(false)
  }

  if (!user) return null

  return (
    <AnimatePresence>
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
          <div className="profile-popup-wrapper">
            <motion.div
              className="profile-popup"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="profile-popup-close"
                onClick={onClose}
                aria-label="Close"
              >
                <i className="fas fa-times"></i>
              </button>

              <div className="profile-popup-container">
                <div className="profile-sidebar">
                  <div className="profile-sidebar-header">
                    <div className="profile-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <h2 className="profile-name">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="profile-username">@{user.userName}</p>
                  </div>

                  <div className="profile-tabs">
                    <button
                      className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
                      onClick={() => setActiveTab('profile')}
                    >
                      <i className="fas fa-user"></i>
                      <span>Profile</span>
                    </button>
                    <button
                      className={`profile-tab ${activeTab === 'orders' ? 'active' : ''}`}
                      onClick={() => setActiveTab('orders')}
                    >
                      <i className="fas fa-shopping-bag"></i>
                      <span>Orders</span>
                    </button>
                    <button
                      className={`profile-tab ${activeTab === 'reviews' ? 'active' : ''}`}
                      onClick={() => setActiveTab('reviews')}
                    >
                      <i className="fas fa-star"></i>
                      <span>Reviews</span>
                    </button>
                  </div>

                  <button className="profile-logout-btn" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Sign Out</span>
                  </button>
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
                        {orders.length === 0 ? (
                          <div className="profile-no-orders">
                            <i className="fas fa-shopping-bag"></i>
                            <p>No orders yet</p>
                          </div>
                        ) : (
                          <div className="profile-orders-list">
                            {orders.map((order) => (
                              <div key={order.id} className="profile-order-item">
                                <div className="profile-order-header">
                                  <div className="profile-order-info">
                                    <span className="profile-order-id">Order #{order.id.slice(-6)}</span>
                                    <span className="profile-order-date">{formatDate(order.date)}</span>
                                  </div>
                                  <span
                                    className="profile-order-status"
                                    style={{ color: getStatusColor(order.status) }}
                                  >
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </span>
                                </div>
                                <div className="profile-order-items">
                                  {order.items.map((item, index) => (
                                    <div key={index} className="profile-order-item-detail">
                                      <span>{item.name} x{item.quantity}</span>
                                      <span>${item.price.toFixed(2)}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="profile-order-total">
                                  <span>Total:</span>
                                  <span>${order.total.toFixed(2)}</span>
                                </div>
                              </div>
                            ))}
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
                        
                        {selectedOrderForReview ? (
                          <div className="profile-review-form-section">
                            <div className="profile-review-form-header">
                              <button
                                className="profile-review-back-btn"
                                onClick={() => {
                                  setSelectedOrderForReview(null)
                                  setReviewRating(0)
                                  setReviewComment('')
                                }}
                              >
                                <i className="fas fa-arrow-left"></i>
                                Back
                              </button>
                              <h4 className="profile-review-form-title">Write a Review</h4>
                            </div>
                            {(() => {
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
                              onSubmit={(e) => {
                                e.preventDefault()
                                if (reviewRating === 0) {
                                  alert('Please select a rating')
                                  return
                                }
                                if (!reviewComment.trim()) {
                                  alert('Please write a comment')
                                  return
                                }
                                const order = orders.find(o => o.id === selectedOrderForReview)
                                if (order) {
                                  const newReview = {
                                    id: 'REV-' + Date.now().toString(),
                                    orderId: order.id,
                                    orderDate: order.date,
                                    items: order.items,
                                    rating: reviewRating,
                                    comment: reviewComment.trim(),
                                    date: new Date().toISOString()
                                  }
                                  addReview(newReview)
                                  setSelectedOrderForReview(null)
                                  setReviewRating(0)
                                  setReviewComment('')
                                  setShowReviewSuccessModal(true)
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
                                    setReviewRating(0)
                                    setReviewComment('')
                                  }}
                                >
                                  Cancel
                                </button>
                                <button type="submit" className="profile-review-submit-btn">
                                  Submit Review
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
                              
                              return (
                                <>
                                  {availableOrdersToReview.length > 0 && (
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
                                                onClick={() => setSelectedOrderForReview(order.id)}
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
                                        {reviews.map((review) => (
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
                                          </div>
                                        ))}
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
            </motion.div>
          </div>
        </>
      )}
      <ReviewSuccessModal
        isOpen={showReviewSuccessModal}
        onClose={() => setShowReviewSuccessModal(false)}
      />
    </AnimatePresence>
  )

  return isOpen ? createPortal(modalContent, document.body) : null
}

export default ProfilePopup
