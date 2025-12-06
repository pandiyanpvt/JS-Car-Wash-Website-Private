import { useState, useCallback, useMemo } from 'react'
import Navbar from '../../components/navbar/Navbar'
import { FooterPage } from '../footer'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import AuthModal from '../../components/auth/AuthModal'
import './ProductPage.css'

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  image: string
  category: string
  rating?: number
}

function ProductPage() {
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high' | 'stock'>('name')
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin')

  const products: Product[] = useMemo(() => [
    {
      id: 1,
      name: 'Premium Car Wax',
      description: 'High-quality car wax for long-lasting shine and protection',
      price: 134.12,
      stock: 25,
      image: '/JS Car Wash Images/Hand Polish.jpg',
      category: 'Wax & Polish',
      rating: 5.0
    },
    {
      id: 2,
      name: 'Interior Cleaner',
      description: 'Professional interior cleaner for all car surfaces',
      price: 89.99,
      stock: 18,
      image: '/JS Car Wash Images/Leather Clean.png',
      category: 'Interior Care',
      rating: 5.0
    },
    {
      id: 3,
      name: 'Tire Shine Spray',
      description: 'Premium tire shine for a glossy, black finish',
      price: 45.50,
      stock: 32,
      image: '/JS Car Wash Images/Tyre Shine.png',
      category: 'Tire Care',
      rating: 5.0
    },
    {
      id: 4,
      name: 'Headlight Restorer',
      description: 'Restore cloudy headlights to crystal clear',
      price: 67.99,
      stock: 15,
      image: '/JS Car Wash Images/Headlight Restoration.jpg',
      category: 'Restoration',
      rating: 5.0
    },
    {
      id: 5,
      name: 'Clay Bar Kit',
      description: 'Complete clay bar kit for paint decontamination',
      price: 125.00,
      stock: 20,
      image: '/JS Car Wash Images/Clay Bar.jpg',
      category: 'Paint Care',
      rating: 5.0
    },
    {
      id: 6,
      name: 'Buff Polish Compound',
      description: 'Professional buff polish for removing scratches',
      price: 98.75,
      stock: 22,
      image: '/JS Car Wash Images/Buff Polish.jpg',
      category: 'Wax & Polish',
      rating: 5.0
    },
    {
      id: 7,
      name: 'Carpet Steam Cleaner',
      description: 'Deep cleaning solution for car carpets and mats',
      price: 76.50,
      stock: 28,
      image: '/JS Car Wash Images/Carpet Steam Clean.jpg',
      category: 'Interior Care',
      rating: 5.0
    },
    {
      id: 8,
      name: 'Sticker Remover',
      description: 'Safe adhesive remover for stickers and decals',
      price: 34.99,
      stock: 40,
      image: '/JS Car Wash Images/Sticker Removal.jpg',
      category: 'Restoration',
      rating: 5.0
    },
    {
      id: 9,
      name: 'Full Duco Wax',
      description: 'Premium hand wax polish for complete car protection',
      price: 149.99,
      stock: 12,
      image: '/JS Car Wash Images/Full Duco Hand Wax Polish.jpg',
      category: 'Wax & Polish',
      rating: 5.0
    },
    {
      id: 10,
      name: 'Bugs & Tar Remover',
      description: 'Effective cleaner for removing bugs and tar',
      price: 55.25,
      stock: 30,
      image: '/JS Car Wash Images/Bugs & Tar Removal.png',
      category: 'Paint Care',
      rating: 5.0
    }
  ], [])

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)))
    return uniqueCategories.sort()
  }, [products])

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'stock':
          return b.stock - a.stock
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }, [products, searchQuery, selectedCategory, sortBy])

  const handleAddToCart = useCallback((product: Product) => {
    if (!isAuthenticated) {
      setAuthModalTab('signin')
      setAuthModalOpen(true)
      return
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      category: product.category
    })
  }, [addToCart, isAuthenticated])

  return (
    <div className="product-page">
      <Navbar className="fixed-navbar" hideLogo={true} />
      
      {/* Page Heading Section */}
      <section className="page-heading-section">
        <div className="page-heading-overlay"></div>
        <div className="page-heading-content">
          <h1 className="page-heading-title">Products</h1>
        </div>
      </section>
      
      {/* Search Bar Section - Below Navbar */}
      <div className="product-search-section">
        <div className="product-search-wrapper">
          <div className="product-search-row">
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
            
            <div className="product-category-filter">
              <button
                className={`category-filter-btn ${selectedCategory === 'All' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('All')}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-filter-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="product-filter-options">
              <select
                className="product-filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price-low' | 'price-high' | 'stock')}
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="stock">Stock: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="product-page-content">
        <div className="product-page-container">
          {selectedCategory !== 'All' && (
            <div className="product-category-header">
              <h2 className="product-category-title">{selectedCategory}</h2>
              <p className="product-category-count">{filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}</p>
            </div>
          )}

          {/* Products Grid - All products in one grid */}
          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-card-image-wrapper">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-card-image"
                      loading="lazy"
                    />
                    <div className="product-card-category-badge">{product.category}</div>
                  </div>
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
          ) : (
            <div className="product-empty-state">
              <div className="product-empty-icon">
                <i className="fas fa-search"></i>
              </div>
              <p>No products found matching your search.</p>
            </div>
          )}
        </div>
      </div>
      <FooterPage />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
      />
    </div>
  )
}

export default ProductPage

