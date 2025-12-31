import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/navbar/Navbar'
import { FooterPage } from '../footer'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import { orderApi, contactApi, productApi, type Branch, type Product as ApiProduct, type ProductStockEntry } from '../../services/api'
import OrderSuccessModal from '../../components/cart/OrderSuccessModal'
import './CheckoutPage.css'

function CheckoutPage() {
  const navigate = useNavigate()
  const { cartItems, getTotalPrice, getTotalItems, clearCart, updateQuantity, removeFromCart } = useCart()
  const { user, addOrder } = useAuth()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [branches, setBranches] = useState<Branch[]>([])
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const getAvailableBranchStock = (product: ApiProduct, branchId: number) => {
    const activeEntries = (product.stock_entries || []).filter(
      (entry: ProductStockEntry) => entry.is_active !== false
    )
    const branchEntry = activeEntries.find(entry => entry.branch_id === branchId)

    if (branchEntry) return branchEntry.stock || 0

    // Fallback to legacy stock field if branch-specific data is missing
    return typeof product.stock === 'number' ? product.stock : 0
  }

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true)
        const response = await contactApi.getBranches()
        if (response.success && response.data) {
          const activeBranches = response.data.filter(branch => branch.is_active)
          setBranches(activeBranches)
          if (activeBranches.length > 0) {
            setSelectedBranchId(activeBranches[0].id)
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load branches')
      } finally {
        setLoading(false)
      }
    }

    fetchBranches()
  }, [])

  const handlePlaceOrder = async () => {
    if (!user) {
      setError('Please sign in to place an order')
      return
    }

    if (!selectedBranchId) {
      setError('Please select a branch')
      return
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty')
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      const productsResponse = await productApi.getAll()
      if (!productsResponse.success || !productsResponse.data) {
        throw new Error('Failed to check product stock')
      }

      // Handle paginated response
      const productsArray = 'items' in productsResponse.data && 'pagination' in productsResponse.data
        ? productsResponse.data.items
        : Array.isArray(productsResponse.data)
        ? productsResponse.data
        : []

      const productMap = new Map<number, ApiProduct>(
        productsArray
          .filter((product: ApiProduct) => product.is_active)
          .map((product: ApiProduct) => [product.id, product])
      )

      for (const item of cartItems) {
        const product = productMap.get(item.id)
        if (!product) {
          setError(`${item.name} is unavailable right now.`)
          return
        }

        const availableStock = getAvailableBranchStock(product, selectedBranchId)
        if (availableStock <= 0) {
          setError(`${item.name} is out of stock at the selected branch.`)
          return
        }

        if (availableStock < item.quantity) {
          setError(`Only ${availableStock} of ${item.name} available at the selected branch.`)
          return
        }
      }

      const orderData = {
        user_id: user.id,
        branch_id: selectedBranchId,
        services: [],
        products: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        extra_works: []
      }

      const response = await orderApi.create(orderData)

      if (response.success) {
        const order = {
          id: response.data?.id?.toString() || Date.now().toString(),
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
        await clearCart()
        setShowSuccessModal(true)
        
        setTimeout(() => {
          setShowSuccessModal(false)
          navigate('/products')
        }, 2000)
      } else {
        throw new Error(response.message || 'Failed to place order')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
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
                      <div className="checkout-item-quantity-controls">
                        <button
                          className="checkout-quantity-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={submitting}
                          aria-label="Decrease quantity"
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        <span className="checkout-item-quantity">Qty: {item.quantity}</span>
                        <button
                          className="checkout-quantity-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={submitting}
                          aria-label="Increase quantity"
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                      <span className="checkout-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    className="checkout-item-remove"
                    onClick={() => removeFromCart(item.id)}
                    disabled={submitting}
                    aria-label={`Remove ${item.name}`}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
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

            <div className="checkout-branch-selection">
              <h3 className="checkout-branch-title">Select Pickup Branch</h3>
              {loading ? (
                <div className="checkout-branch-loading">
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Loading branches...</span>
                </div>
              ) : branches.length > 0 ? (
                <div className="checkout-branch-list">
                  {branches.map((branch) => (
                    <div
                      key={branch.id}
                      className={`checkout-branch-item ${selectedBranchId === branch.id ? 'selected' : ''}`}
                      onClick={() => setSelectedBranchId(branch.id)}
                    >
                      <div className="checkout-branch-radio">
                        <input
                          type="radio"
                          name="branch"
                          value={branch.id}
                          checked={selectedBranchId === branch.id}
                          onChange={() => setSelectedBranchId(branch.id)}
                        />
                      </div>
                      <div className="checkout-branch-info">
                        <h4 className="checkout-branch-name">{branch.branch_name}</h4>
                        <p className="checkout-branch-address">{branch.address}</p>
                        <p className="checkout-branch-contact">
                          <i className="fas fa-phone"></i> {branch.phone_number}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="checkout-branch-error">
                  <p>No branches available</p>
                </div>
              )}
            </div>

            <div className="checkout-pickup-notice">
              <div className="checkout-notice-icon">
                <i className="fas fa-info-circle"></i>
              </div>
              <p>Please note: Delivery is not available. You can pay and pick up from the shop directly.</p>
            </div>

            {error && (
              <div className="checkout-error-message">
                <i className="fas fa-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              className="checkout-submit-btn"
              disabled={submitting || !selectedBranchId || loading}
            >
              {submitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Placing Order...</span>
                </>
              ) : (
                'Place Order'
              )}
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

