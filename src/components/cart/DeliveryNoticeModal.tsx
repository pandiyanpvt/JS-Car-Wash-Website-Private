import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import './DeliveryNoticeModal.css'

interface DeliveryNoticeModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

function DeliveryNoticeModal({ isOpen, onConfirm, onCancel }: DeliveryNoticeModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel()
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
  }, [isOpen, onCancel])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="delivery-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          <div className="delivery-modal-wrapper">
            <motion.div
              className="delivery-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
            <div className="delivery-modal-content">
              <div className="delivery-modal-icon">
                <i className="fas fa-info-circle"></i>
              </div>
              <h3 className="delivery-modal-title">Delivery Notice</h3>
              <p className="delivery-modal-message">
                Delivery is not available, you can pay and pick from the shop directly
              </p>
              <div className="delivery-modal-actions">
                <button
                  className="delivery-modal-cancel-btn"
                  onClick={onCancel}
                >
                  Cancel
                </button>
                <button
                  className="delivery-modal-ok-btn"
                  onClick={onConfirm}
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

export default DeliveryNoticeModal

