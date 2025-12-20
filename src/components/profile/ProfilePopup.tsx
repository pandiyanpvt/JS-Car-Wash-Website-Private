import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import './ProfilePopup.css'

interface ProfilePopupProps {
  isOpen: boolean
  onClose: () => void
}

function ProfilePopup({ isOpen, onClose }: ProfilePopupProps) {
  const { user, logout, orders } = useAuth()

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
            style={{ pointerEvents: 'none' }}
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
                <div className="profile-popup-user-info">
                  <h2 className="profile-popup-name">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="profile-popup-username">@{user.userName}</p>
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
    </AnimatePresence>
  )
}

export default ProfilePopup
