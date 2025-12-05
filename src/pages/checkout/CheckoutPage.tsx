import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/navbar/Navbar'
import { FooterPage } from '../footer'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import OrderSuccessModal from '../../components/cart/OrderSuccessModal'
import './CheckoutPage.css'

function CheckoutPage() {
  const navigate = useNavigate()
  const { cartItems, getTotalPrice, getTotalItems, clearCart } = useCart()
  const { addOrder } = useAuth()
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handlePlaceOrder = () => {
    const order = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: getTotalPrice(),
      status: 'pending' as const
    }
    addOrder(order)
    console.log('Order submitted:', { cartItems })
    setShowSuccessModal(true)
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
    clearCart()
    navigate('/products')
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <Navbar className="fixed-navbar" hideLogo={true} />
        <div className="checkout-empty">
          <div className="checkout-empty-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <h2>Your cart is empty</h2>
          <p>Add some products to your cart before checkout</p>
          <button
            className="checkout-back-to-products-btn"
            onClick={() => navigate('/products')}
          >
            Browse Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <Navbar className="fixed-navbar" hideLogo={true} />
      
      {/* Page Heading */}
      <section className="checkout-heading-section">
        <div className="checkout-heading-overlay"></div>
        <div className="checkout-heading-content">
          <h1 className="checkout-heading-title">Checkout</h1>
        </div>
      </section>

      <div className="checkout-container">
        <div className="checkout-content">
          {/* Order Summary */}
          <div className="checkout-order-summary">
            <h2 className="checkout-section-title">Order Summary</h2>
            <div className="checkout-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="checkout-item">
                  <div className="checkout-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="checkout-item-info">
                    <h3 className="checkout-item-name">{item.name}</h3>
                    <div className="checkout-item-details">
                      <span className="checkout-item-quantity">Qty: {item.quantity}</span>
                      <span className="checkout-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="checkout-summary-total">
              <div className="checkout-summary-row">
                <span>Subtotal:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="checkout-summary-row">
                <span>Items ({getTotalItems()}):</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="checkout-summary-total-row">
                <span>Total:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            <div className="checkout-pickup-notice">
              <div className="checkout-notice-icon">
                <i className="fas fa-info-circle"></i>
              </div>
              <p>Please note: Delivery is not available. You can pay and pick up from the shop directly.</p>
            </div>

            <button onClick={handlePlaceOrder} className="checkout-submit-btn">
              Place Order
            </button>
          </div>
        </div>
      </div>
      <FooterPage />
      <OrderSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
      />
    </div>
  )
}

export default CheckoutPage

