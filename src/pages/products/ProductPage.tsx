import { useState, useCallback, useMemo } from 'react'
import PageHeading from '../../components/PageHeading'
import './ProductPage.css'

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  image: string
  rating?: number
}

function ProductPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Sample products data
  const products: Product[] = useMemo(() => [
    {
      id: 1,
      name: 'Premium Car Wax',
      description: 'High-quality car wax for long-lasting shine and protection',
      price: 134.12,
      stock: 25,
      image: '/JS Car Wash Images/Hand Polish.jpg',
      rating: 5.0
    },
    {
      id: 2,
      name: 'Interior Cleaner',
      description: 'Professional interior cleaner for all car surfaces',
      price: 89.99,
      stock: 18,
      image: '/JS Car Wash Images/Leather Clean.png',
      rating: 5.0
    },
    {
      id: 3,
      name: 'Tire Shine Spray',
      description: 'Premium tire shine for a glossy, black finish',
      price: 45.50,
      stock: 32,
      image: '/JS Car Wash Images/Tyre Shine.png',
      rating: 5.0
    },
    {
      id: 4,
      name: 'Headlight Restorer',
      description: 'Restore cloudy headlights to crystal clear',
      price: 67.99,
      stock: 15,
      image: '/JS Car Wash Images/Headlight Restoration.jpg',
      rating: 5.0
    },
    {
      id: 5,
      name: 'Clay Bar Kit',
      description: 'Complete clay bar kit for paint decontamination',
      price: 125.00,
      stock: 20,
      image: '/JS Car Wash Images/Clay Bar.jpg',
      rating: 5.0
    },
    {
      id: 6,
      name: 'Buff Polish Compound',
      description: 'Professional buff polish for removing scratches',
      price: 98.75,
      stock: 22,
      image: '/JS Car Wash Images/Buff Polish.jpg',
      rating: 5.0
    },
    {
      id: 7,
      name: 'Carpet Steam Cleaner',
      description: 'Deep cleaning solution for car carpets and mats',
      price: 76.50,
      stock: 28,
      image: '/JS Car Wash Images/Carpet Steam Clean.jpg',
      rating: 5.0
    },
    {
      id: 8,
      name: 'Sticker Remover',
      description: 'Safe adhesive remover for stickers and decals',
      price: 34.99,
      stock: 40,
      image: '/JS Car Wash Images/Sticker Removal.jpg',
      rating: 5.0
    },
    {
      id: 9,
      name: 'Full Duco Wax',
      description: 'Premium hand wax polish for complete car protection',
      price: 149.99,
      stock: 12,
      image: '/JS Car Wash Images/Full Duco Hand Wax Polish.jpg',
      rating: 5.0
    },
    {
      id: 10,
      name: 'Bugs & Tar Remover',
      description: 'Effective cleaner for removing bugs and tar',
      price: 55.25,
      stock: 30,
      image: '/JS Car Wash Images/Bugs & Tar Removal.png',
      rating: 5.0
    }
  ], [])


  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    })
  }, [products, searchQuery])

  const handleAddToCart = useCallback((product: Product) => {
    // Add to cart logic here
    console.log('Added to cart:', product)
    // You can implement cart state management here
  }, [])

  return (
    <div className="product-page">
      <PageHeading title="Products" />
      {/* Top Navigation Bar */}
      <div className="product-page-header">
        <div className="product-header-content">
          {/* Search Bar */}
          <div className="product-search-container">
            <input
              type="text"
              className="product-search-input"
              placeholder="Search your product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="product-search-icon-btn" aria-label="Search">
              <i className="fas fa-search"></i>
            </button>
          </div>

          {/* Right Side Icons */}
          <div className="product-header-icons">
            {/* Shopping Cart */}
            <button className="product-header-icon-btn" aria-label="Shopping Cart">
              <i className="fas fa-shopping-cart"></i>
            </button>

            {/* Notification Bell */}
            <button className="product-header-icon-btn notification-btn" aria-label="Notifications">
              <i className="fas fa-bell"></i>
              <span className="notification-badge">3</span>
            </button>

            {/* User Profile with Dropdown */}
            <div className="product-user-profile">
              <button className="product-header-icon-btn user-profile-btn" aria-label="User Profile">
                <div className="user-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <i className="fas fa-angle-down"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="product-page-content">
        <div className="product-page-container">
          {/* Products Grid - 5 cards per row */}
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                {/* Product Image */}
                <div className="product-card-image-wrapper">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-card-image"
                    loading="lazy"
                  />
                </div>

                {/* Product Info */}
                <div className="product-card-content">
                  <h3 className="product-card-name">{product.name}</h3>
                  <p className="product-card-description">{product.description}</p>
                  
                  <div className="product-card-details">
                    <div className="product-stock">
                      <span className="product-stock-label">Available Stock:</span>
                      <span className="product-stock-value">{product.stock}</span>
                    </div>
                    <div className="product-price">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    className="product-add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="product-empty-state">
              <p>No products found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductPage

