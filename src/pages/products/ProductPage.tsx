import { useState, useCallback, useMemo, useEffect } from 'react'
import Navbar from '../../components/navbar/Navbar'
import { FooterPage } from '../footer'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import AuthModal from '../../components/auth/AuthModal'
import { productApi, productCategoryApi } from '../../services/api'
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
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const [productsResponse, categoriesResponse] = await Promise.all([
          productApi.getAll(),
          productCategoryApi.getAll()
        ])

        if (productsResponse.success && productsResponse.data) {
          const mappedProducts: Product[] = productsResponse.data
            .filter(p => p.is_active)
            .map(p => ({
              id: p.id,
              name: p.product_name,
              description: p.description,
              price: parseFloat(p.amount),
              stock: p.stock,
              image: p.img_url,
              category: p.category.category
            }))
          setProducts(mappedProducts)
        }

        if (categoriesResponse.success && categoriesResponse.data) {
          const categoryNames = categoriesResponse.data
            .filter(c => {
              // Handle both backend formats: mapped (status) and raw (is_active)
              const isActive = c.status === 'active' || c.is_active === true || c.status !== 'inactive'
              return isActive
            })
            .map(c => {
              // Handle both 'name' (from mapped backend format) and 'category' (from raw format)
              return c.name || c.category || ''
            })
            .filter(name => name !== '') // Remove empty strings
            .sort()
          setCategories(categoryNames)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const searchProducts = async () => {
      if (!searchQuery.trim()) {
        const response = await productApi.getAll()
        if (response.success && response.data) {
          const mappedProducts: Product[] = response.data
            .filter(p => p.is_active)
            .map(p => ({
              id: p.id,
              name: p.product_name,
              description: p.description,
              price: parseFloat(p.amount),
              stock: p.stock,
              image: p.img_url,
              category: p.category.category
            }))
          setProducts(mappedProducts)
        }
        return
      }

      try {
        setSearchLoading(true)
        const response = await productApi.search(searchQuery)
        if (response.success && response.data) {
          const mappedProducts: Product[] = response.data
            .filter(p => p.is_active)
            .map(p => ({
              id: p.id,
              name: p.product_name,
              description: p.description,
              price: parseFloat(p.amount),
              stock: p.stock,
              image: p.img_url,
              category: p.category.category
            }))
          setProducts(mappedProducts)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed')
      } finally {
        setSearchLoading(false)
      }
    }

    const timeoutId = setTimeout(searchProducts, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
      return matchesCategory
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

  const handleAddToCart = useCallback(async (product: Product) => {
    if (!isAuthenticated) {
      setAuthModalTab('signin')
      setAuthModalOpen(true)
      return
    }
    await addToCart({
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

          {loading || searchLoading ? (
            <div className="product-empty-state">
              <div className="product-empty-icon">
                <i className="fas fa-spinner fa-spin"></i>
              </div>
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className="product-empty-state">
              <div className="product-empty-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <p>{error}</p>
            </div>
          ) : filteredProducts.length > 0 ? (
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

