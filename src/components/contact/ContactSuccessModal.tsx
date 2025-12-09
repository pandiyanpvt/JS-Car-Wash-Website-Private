import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import './ContactSuccessModal.css'

interface ContactSuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

function ContactSuccessModal({ isOpen, onClose }: ContactSuccessModalProps) {
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

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="contact-success-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <div className="contact-success-modal-wrapper">
            <motion.div
              className="contact-success-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="contact-success-modal-content">
                <div className="contact-success-modal-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h3 className="contact-success-modal-title">Message Sent Successfully!</h3>
                <p className="contact-success-modal-message">
                  We'll get back to you soon.
                </p>
                <div className="contact-success-modal-actions">
                  <button
                    className="contact-success-modal-ok-btn"
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

  return isOpen ? createPortal(modalContent, document.body) : null
}

export default ContactSuccessModal


