import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import DeliveryNoticeModal from './DeliveryNoticeModal'
import './CartSidebar.css'

function CartSidebar() {
  const navigate = useNavigate()
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    isCartOpen,
    closeCart
  } = useCart()
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)

  const handleCheckout = () => {
    if (cartItems.length === 0) return
    setShowDeliveryModal(true)
  }

  const handleConfirmDelivery = () => {
    setShowDeliveryModal(false)
    closeCart()
    navigate('/checkout')
  }

  const handleCancelDelivery = () => {
    setShowDeliveryModal(false)
  }

  // Close cart on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart()
      }
    }

    if (isCartOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isCartOpen, closeCart])

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              className="cart-sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeCart}
            />
            <motion.div
              className="cart-sidebar"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="cart-sidebar-header">
                <h2 className="cart-sidebar-title">Shopping Cart</h2>
                <button
                  className="cart-sidebar-close"
                  onClick={closeCart}
                  aria-label="Close cart"
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <div className="cart-sidebar-content">
                {cartItems.length === 0 ? (
                  <div className="cart-empty-state">
                    <div className="cart-empty-icon">
                      <i className="fas fa-shopping-cart"></i>
                    </div>
                    <p>Your cart is empty</p>
                    <button className="cart-continue-shopping-btn" onClick={closeCart}>
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="cart-items-list">
                      {cartItems.map((item) => (
                        <div key={item.id} className="cart-item">
                          <div className="cart-item-image">
                            <img src={item.image} alt={item.name} />
                          </div>
                          <div className="cart-item-details">
                            <h3 className="cart-item-name">{item.name}</h3>
                            <p className="cart-item-price">${item.price.toFixed(2)}</p>
                            <div className="cart-item-actions">
                              <div className="cart-item-quantity">
                                <button
                                  className="quantity-btn"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  aria-label="Decrease quantity"
                                >
                                  <i className="fas fa-minus"></i>
                                </button>
                                <span className="quantity-value">{item.quantity}</span>
                                <button
                                  className="quantity-btn"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  aria-label="Increase quantity"
                                >
                                  <i className="fas fa-plus"></i>
                                </button>
                              </div>
                              <button
                                className="cart-item-remove"
                                onClick={() => removeFromCart(item.id)}
                                aria-label="Remove item"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="cart-sidebar-footer">
                      <div className="cart-total">
                        <span className="cart-total-label">Total:</span>
                        <span className="cart-total-price">${getTotalPrice().toFixed(2)}</span>
                      </div>
                      <button className="cart-checkout-btn" onClick={handleCheckout}>
                        Checkout ({getTotalItems()})
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <DeliveryNoticeModal
        isOpen={showDeliveryModal}
        onConfirm={handleConfirmDelivery}
        onCancel={handleCancelDelivery}
      />
    </>
  )
}

export default CartSidebar

