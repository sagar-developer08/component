'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import SectionHeader from '@/components/SectionHeader'
import ProductCard from '@/components/ProductCard'
import FilterDrawer from '@/components/FilterDrawer'
import { fetchProducts } from '@/store/slices/productsSlice'
import { catalog } from '@/store/api/endpoints'

// Helper function to transform API product data
const transformProductData = (apiProduct) => {
  const savings = apiProduct.discount_price ? apiProduct.price - apiProduct.discount_price : 0
  return {
    id: apiProduct._id,
    slug: apiProduct.slug,
    title: apiProduct.title,
    price: apiProduct.discount_price || apiProduct.price,
    originalPrice: apiProduct.price,
    rating: apiProduct.average_rating || 4.5,
    deliveryTime: "30 Min",
    image: apiProduct.images?.[0]?.url || '/iphone.jpg',
    badge: savings > 0 ? `Save AED ${savings}` : null
  }
}

export default function BrandPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const dispatch = useDispatch()
  const slug = params.slug
  const storeId = searchParams.get('storeId')
  
  const { products, loading, error } = useSelector(state => state.products)
  const [brandInfo, setBrandInfo] = useState(null)
  const [brandProducts, setBrandProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [isStore, setIsStore] = useState(false)

  // Fetch products when component mounts
  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  // Fetch brand/store info and products by slug
  useEffect(() => {
    const fetchData = async () => {
      if (slug) {
        try {
          setLoadingProducts(true)
          
          // Check if this is a store (has storeId parameter) or a brand
          if (storeId) {
            setIsStore(true)
            // Fetch store products using the store API endpoint
            const response = await fetch(catalog.productsByStore(storeId))
            
            if (response.ok) {
              const data = await response.json()
              console.log('Store API Response:', data)
              
              if (data.success && data.data) {
                // Extract store info from the first product's store_id
                const firstProduct = data.data.products?.[0]
                if (firstProduct?.store_id) {
                  setBrandInfo(firstProduct.store_id) // Store info
                }
                setBrandProducts(data.data.products || [])
              }
            }
          } else {
            setIsStore(false)
            // Fetch brand data using the correct API endpoint format: /products/brand/[slug]
            const response = await fetch(`${catalog.base}/products/brand/${slug}`)
            
            if (response.ok) {
              const data = await response.json()
              console.log('Brand API Response:', data)
              
              if (data.success && data.data) {
                setBrandInfo(data.data.brand)
                setBrandProducts(data.data.products || [])
              }
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error)
        } finally {
          setLoadingProducts(false)
        }
      }
    }

    fetchData()
  }, [slug, storeId])

  // Transform API data
  const transformedProducts = brandProducts.map(transformProductData)

  const handleBack = () => {
    router.push('/')
  }

  return (
    <main className="home-page">
      <Navigation />

      {/* Brand Header Section */}
      <section className="section">
        <div className="container">
          <div className="brand-header">
            <button className="back-button" onClick={handleBack}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Home
            </button>
            
            {brandInfo && (
              <div className="brand-info">
                <div className="brand-logo">
                  <img 
                    src={brandInfo.logo || '/logo.png'} 
                    alt={brandInfo.name}
                    width={120}
                    height={120}
                  />
                </div>
                <div className="brand-details">
                  <h1>{brandInfo.name}</h1>
                  <p>{brandInfo.description || 'Discover amazing products from this brand'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="section">
        <div className="container">
          <div className="listing-layout">
            {/* Sticky Filter Sidebar */}
            <aside className="filters-sidebar">
              <FilterDrawer open={true} inline sticky stickyTop={112} onClose={() => {}} />
            </aside>

            {/* Main Content Area with Scrollable Products */}
            <div className="content-area">
              <SectionHeader
                title={`${brandInfo?.name || (isStore ? 'Store' : 'Brand')} Products`}
                showNavigation={false}
                showButton={true}
                buttonText="Sort By"
                onButtonClick={() => {}}
              />
              
              {loadingProducts ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading products...</p>
                </div>
              ) : transformedProducts.length > 0 ? (
                <div className="products-scroll-container">
                  <div className="grid-3">
                    {transformedProducts.map((product, index) => (
                      <div key={product.id || index} className="grid-item">
                        <ProductCard {...product} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="no-products">
                  <p>No products found for this {isStore ? 'store' : 'brand'}.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Drawer for small screens */}
      <FilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} />

      <Footer />

      <style jsx>{`
        .brand-header {
          padding: 40px 0;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: #666;
          font-size: 16px;
          cursor: pointer;
          margin-bottom: 24px;
          transition: color 0.2s ease;
        }

        .back-button:hover {
          color: #000;
        }

        .brand-info {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 32px;
          background: #f8f9fa;
          border-radius: 16px;
        }

        .brand-logo img {
          border-radius: 12px;
          object-fit: cover;
        }

        .brand-details h1 {
          font-size: 32px;
          font-weight: 600;
          color: #000;
          margin: 0 0 8px 0;
        }

        .brand-details p {
          font-size: 16px;
          color: #666;
          margin: 0;
          line-height: 1.5;
        }

        .listing-layout {
          display: flex;
          gap: 24px;
          min-height: 600px;
        }

        .filters-sidebar {
          width: 300px;
          flex-shrink: 0;
        }

        .content-area {
          flex: 1;
          min-width: 0;
        }

        .products-scroll-container {
          max-height: calc(100vh - 200px);
          overflow-y: auto;
          padding-right: 8px;
        }

        .grid-3 {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .grid-item {
          width: 100%;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          color: #666;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .no-products {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          color: #666;
          font-size: 18px;
        }

        @media (max-width: 768px) {
          .brand-info {
            flex-direction: column;
            text-align: center;
            padding: 24px;
          }

          .brand-details h1 {
            font-size: 24px;
          }

          .listing-layout {
            flex-direction: column;
          }

          .filters-sidebar {
            width: 100%;
          }

          .grid-3 {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 16px;
          }
        }
      `}</style>
    </main>
  )
}
