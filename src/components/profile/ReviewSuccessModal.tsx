import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import './ReviewSuccessModal.css'

interface ReviewSuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

function ReviewSuccessModal({ isOpen, onClose }: ReviewSuccessModalProps) {
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
            className="review-success-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          <div className="review-success-modal-wrapper">
            <motion.div
              className="review-success-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="review-success-modal-content">
                <div className="review-success-modal-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h3 className="review-success-modal-title">Review Submitted Successfully</h3>
                <p className="review-success-modal-message">
                  Thank you for your feedback! Your review has been submitted.
                </p>
                <div className="review-success-modal-actions">
                  <button
                    className="review-success-modal-ok-btn"
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

export default ReviewSuccessModal

