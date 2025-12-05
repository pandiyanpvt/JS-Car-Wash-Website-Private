import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import './OrderSuccessModal.css'

interface OrderSuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

function OrderSuccessModal({ isOpen, onClose }: OrderSuccessModalProps) {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="order-success-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          <div className="order-success-modal-wrapper">
            <motion.div
              className="order-success-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="order-success-modal-content">
                <div className="order-success-modal-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h3 className="order-success-modal-title">Order Placed Successfully</h3>
                <p className="order-success-modal-message">
                  Order placed successfully! You can pay and pick up from the shop.
                </p>
                <div className="order-success-modal-actions">
                  <button
                    className="order-success-modal-ok-btn"
                    onClick={onClose}
                  >
                    OK
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default OrderSuccessModal

