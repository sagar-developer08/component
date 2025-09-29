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
  const categoryLevel = searchParams.get('categoryLevel')

  const { products, loading, error } = useSelector(state => state.products)
  const [brandInfo, setBrandInfo] = useState(null)
  const [brandProducts, setBrandProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [isStore, setIsStore] = useState(false)
  const [isCategory, setIsCategory] = useState(false)

  // Fetch products when component mounts
  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  // Fetch brand/store/category info and products by slug
  useEffect(() => {
    const fetchData = async () => {
      if (slug) {
        try {
          setLoadingProducts(true)

          // Check if this is a store (has storeId parameter), category (has categoryLevel), or a brand
          if (storeId) {
            setIsStore(true)
            setIsCategory(false)
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
          } else if (categoryLevel) {
            setIsStore(false)
            setIsCategory(true)
            // Fetch category products using the level4 category API endpoint
            const response = await fetch(catalog.productsByLevel4Category(slug))

            if (response.ok) {
              const data = await response.json()
              console.log('Category API Response:', data)

              if (data.success && data.data) {
                setBrandInfo(data.data.category) // Category info
                setBrandProducts(data.data.products || [])
              }
            }
          } else {
            setIsStore(false)
            setIsCategory(false)
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
  }, [slug, storeId, categoryLevel])

  // Transform API data
  const transformedProducts = brandProducts.map(transformProductData)

  const handleBack = () => {
    router.push('/')
  }

  return (
    <main className="home-page">
      <Navigation />
      {/* Products Section */}
      <section className="section">
        <div className="container">
          <div className="listing-layout">
            {/* Sticky Filter Sidebar */}
            <aside className="filters-sidebar">
              <FilterDrawer open={true} inline sticky stickyTop={112} onClose={() => { }} />
            </aside>

            {/* Main Content Area with Scrollable Products */}
            <div className="content-area">
              <SectionHeader
                title={`${brandInfo?.name || (isStore ? 'Store' : isCategory ? 'Category' : 'Brand')} Products`}
                showNavigation={false}
                showButton={true}
                buttonText="Sort By"
                onButtonClick={() => { }}
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
                  <p>No products found for this {isStore ? 'store' : isCategory ? 'category' : 'brand'}.</p>
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
        .listing-layout {
          display: flex;
          gap: 24px;
          align-items: flex-start;
          min-height: calc(100vh - 200px);
        }
        
        .filters-sidebar {
          position: sticky;
          top: 112px; /* below fixed navbar */
          width: 320px;
          flex-shrink: 0;
          z-index: 10;
          height: fit-content;
          max-height: calc(100vh - 112px);
          overflow-y: auto;
           /* Hide scrollbar, keep scroll functionality */
           -ms-overflow-style: none; /* IE and Edge */
           scrollbar-width: none; /* Firefox */
        }
         .filters-sidebar::-webkit-scrollbar { display: none; }

        .content-area { 
          flex: 1;
          min-width: 0; /* allows flex item to shrink below content size */
        }
        
        .products-scroll-container {
          width: 100%;
          max-height: calc(100vh - 200px);
          overflow-y: auto;
          padding-right: 8px; /* space for scrollbar */
           /* Hide scrollbar, keep scroll functionality */
           -ms-overflow-style: none; /* IE and Edge */
           scrollbar-width: none; /* Firefox */
        }
         .products-scroll-container::-webkit-scrollbar { display: none; }
        
        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          padding-bottom: 40px; /* extra space at bottom */
        }
        
        .grid-item { 
          display: flex; 
          justify-content: center; 
        }

        @media (max-width: 1024px) {
          .listing-layout { 
            flex-direction: column; 
            gap: 16px;
          }
          
          .filters-sidebar { 
            position: relative; 
            top: 0; 
            width: 100%; 
            z-index: 1;
            max-height: none;
            overflow-y: visible;
          }
          
          .products-scroll-container {
            max-height: none;
            overflow-y: visible;
            padding-right: 0;
          }
          
          .grid-3 { 
            grid-template-columns: repeat(2, minmax(0, 1fr)); 
            gap: 16px;
          }
        }
        
        @media (max-width: 640px) {
          .grid-3 { 
            grid-template-columns: 1fr; 
            gap: 16px;
          }
        }
      `}</style>
    </main>
  )
}
