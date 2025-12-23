import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import './ConfirmationModal.css'

interface ConfirmationModalProps {
  isOpen: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  type?: 'danger' | 'warning' | 'info'
}

function ConfirmationModal({
  isOpen,
  title = 'Confirm Action',
  message,
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'danger'
}: ConfirmationModalProps) {
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

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="confirmation-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onCancel}
          />
          <div className="confirmation-modal-wrapper">
            <motion.div
              className="confirmation-modal"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="confirmation-modal-content">
                <div className={`confirmation-modal-icon confirmation-modal-icon-${type}`}>
                  {type === 'danger' && <i className="fas fa-exclamation-triangle"></i>}
                  {type === 'warning' && <i className="fas fa-exclamation-circle"></i>}
                  {type === 'info' && <i className="fas fa-info-circle"></i>}
                </div>
                <h3 className="confirmation-modal-title">{title}</h3>
                <p className="confirmation-modal-message">{message}</p>
                <div className="confirmation-modal-actions">
                  <button
                    className="confirmation-modal-cancel-btn"
                    onClick={onCancel}
                  >
                    {cancelText}
                  </button>
                  <button
                    className={`confirmation-modal-confirm-btn confirmation-modal-confirm-btn-${type}`}
                    onClick={onConfirm}
                  >
                    {confirmText}
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

export default ConfirmationModal

