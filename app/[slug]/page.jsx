'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import SectionHeader from '@/components/SectionHeader'
import ProductCard from '@/components/ProductCard'
import FilterDrawer from '@/components/FilterDrawer'
import { fetchProducts } from '@/store/slices/productsSlice'
import { catalog, search } from '@/store/api/endpoints'
import { buildFacetsFromCategoryFilters } from '@/utils/categoryFilters'
import { buildFacetsFromBrandFilters } from '@/utils/brandFilters'
import { buildFacetsFromStoreFilters } from '@/utils/storeFilters'

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
  const [filterData, setFilterData] = useState(null)
  const [selectedFilters, setSelectedFilters] = useState({})

  // Fetch products when component mounts
  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  // Fetch filter data for category, brand, and store pages
  useEffect(() => {
    const fetchFilterData = async () => {
      if (categoryLevel && slug) {
        // Fetch category filters
        try {
          const response = await fetch(search.categoryFilters(slug, categoryLevel))
          if (response.ok) {
            const data = await response.json()
            console.log('Category Filter API Response:', data)
            if (data.success && data.data) {
              setFilterData(data.data)
            }
          }
        } catch (error) {
          console.error('Error fetching category filter data:', error)
        }
      } else if (storeId) {
        // Fetch store filters
        try {
          const response = await fetch(search.storeFilters(storeId))
          if (response.ok) {
            const data = await response.json()
            console.log('Store Filter API Response:', data)
            if (data.success && data.data) {
              setFilterData(data.data)
            }
          }
        } catch (error) {
          console.error('Error fetching store filter data:', error)
        }
      } else if (slug) {
        // Fetch brand filters (when it's not a store and not a category)
        try {
          const response = await fetch(search.brandFilters(slug))
          if (response.ok) {
            const data = await response.json()
            console.log('Brand Filter API Response:', data)
            if (data.success && data.data) {
              setFilterData(data.data)
            }
          }
        } catch (error) {
          console.error('Error fetching brand filter data:', error)
        }
      }
    }

    fetchFilterData()
  }, [slug, categoryLevel, storeId])

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
            
            // Build filter params for store
            const params = new URLSearchParams()
            
            // Price filter
            if (selectedFilters.price?.min !== undefined && selectedFilters.price?.min !== '') {
              params.append('min_price', selectedFilters.price.min)
            }
            if (selectedFilters.price?.max !== undefined && selectedFilters.price?.max !== '') {
              params.append('max_price', selectedFilters.price.max)
            }
            
            // Availability filter
            if (selectedFilters.availability instanceof Set) {
              if (selectedFilters.availability.has('in') && !selectedFilters.availability.has('out')) {
                params.append('in_stock', 'true')
              } else if (selectedFilters.availability.has('out') && !selectedFilters.availability.has('in')) {
                params.append('in_stock', 'false')
              }
            }
            
            // Rating filter
            if (typeof selectedFilters.rating === 'number') {
              params.append('min_rating', selectedFilters.rating)
            }
            
            // Brand filter (multiple)
            if (selectedFilters.brand instanceof Set && selectedFilters.brand.size > 0) {
              Array.from(selectedFilters.brand).forEach(b => params.append('brand_id', b))
            }
            
            // Dynamic attribute filters (attr.*)
            Object.keys(selectedFilters).forEach(key => {
              if (key.startsWith('attr.')) {
                const attrKey = key.substring(5)
                const values = selectedFilters[key] instanceof Set ? Array.from(selectedFilters[key]) : []
                values.forEach(v => params.append(`attr_${attrKey}`, v))
              }
            })
            
            // Dynamic specification filters (spec.*)
            Object.keys(selectedFilters).forEach(key => {
              if (key.startsWith('spec.')) {
                const specKey = key.substring(5)
                const values = selectedFilters[key] instanceof Set ? Array.from(selectedFilters[key]) : []
                values.forEach(v => params.append(`spec_${specKey}`, v))
              }
            })
            
            // Fetch store products with filters
            const url = params.toString() 
              ? `${catalog.productsByStore(storeId)}?${params.toString()}`
              : catalog.productsByStore(storeId)
            
            const response = await fetch(url)

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
            
            // Build filter params
            const params = new URLSearchParams()
            
            // Price filter
            if (selectedFilters.price?.min !== undefined && selectedFilters.price?.min !== '') {
              params.append('min_price', selectedFilters.price.min)
            }
            if (selectedFilters.price?.max !== undefined && selectedFilters.price?.max !== '') {
              params.append('max_price', selectedFilters.price.max)
            }
            
            // Availability filter
            if (selectedFilters.availability instanceof Set) {
              if (selectedFilters.availability.has('in') && !selectedFilters.availability.has('out')) {
                params.append('in_stock', 'true')
              } else if (selectedFilters.availability.has('out') && !selectedFilters.availability.has('in')) {
                params.append('in_stock', 'false')
              }
            }
            
            // Rating filter
            if (typeof selectedFilters.rating === 'number') {
              params.append('min_rating', selectedFilters.rating)
            }
            
            // Brand filter (multiple)
            if (selectedFilters.brand instanceof Set && selectedFilters.brand.size > 0) {
              Array.from(selectedFilters.brand).forEach(b => params.append('brand_id', b))
            }
            
            // Store filter (multiple)
            if (selectedFilters.store instanceof Set && selectedFilters.store.size > 0) {
              Array.from(selectedFilters.store).forEach(s => params.append('store_id', s))
            }
            
            // Dynamic attribute filters (attr.*)
            Object.keys(selectedFilters).forEach(key => {
              if (key.startsWith('attr.')) {
                const attrKey = key.substring(5)
                const values = selectedFilters[key] instanceof Set ? Array.from(selectedFilters[key]) : []
                values.forEach(v => params.append(`attr_${attrKey}`, v))
              }
            })
            
            // Dynamic specification filters (spec.*)
            Object.keys(selectedFilters).forEach(key => {
              if (key.startsWith('spec.')) {
                const specKey = key.substring(5)
                const values = selectedFilters[key] instanceof Set ? Array.from(selectedFilters[key]) : []
                values.forEach(v => params.append(`spec_${specKey}`, v))
              }
            })
            
            // Fetch category products with filters
            const url = params.toString() 
              ? `${catalog.productsByLevel4Category(slug)}${params.toString() ? '&' + params.toString() : ''}`
              : catalog.productsByLevel4Category(slug)
            
            const response = await fetch(url)

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
            
            // Build filter params for brand
            const params = new URLSearchParams()
            
            // Price filter
            if (selectedFilters.price?.min !== undefined && selectedFilters.price?.min !== '') {
              params.append('min_price', selectedFilters.price.min)
            }
            if (selectedFilters.price?.max !== undefined && selectedFilters.price?.max !== '') {
              params.append('max_price', selectedFilters.price.max)
            }
            
            // Availability filter
            if (selectedFilters.availability instanceof Set) {
              if (selectedFilters.availability.has('in') && !selectedFilters.availability.has('out')) {
                params.append('in_stock', 'true')
              } else if (selectedFilters.availability.has('out') && !selectedFilters.availability.has('in')) {
                params.append('in_stock', 'false')
              }
            }
            
            // Rating filter
            if (typeof selectedFilters.rating === 'number') {
              params.append('min_rating', selectedFilters.rating)
            }
            
            // Store filter (multiple)
            if (selectedFilters.store instanceof Set && selectedFilters.store.size > 0) {
              Array.from(selectedFilters.store).forEach(s => params.append('store_id', s))
            }
            
            // Dynamic attribute filters (attr.*)
            Object.keys(selectedFilters).forEach(key => {
              if (key.startsWith('attr.')) {
                const attrKey = key.substring(5)
                const values = selectedFilters[key] instanceof Set ? Array.from(selectedFilters[key]) : []
                values.forEach(v => params.append(`attr_${attrKey}`, v))
              }
            })
            
            // Dynamic specification filters (spec.*)
            Object.keys(selectedFilters).forEach(key => {
              if (key.startsWith('spec.')) {
                const specKey = key.substring(5)
                const values = selectedFilters[key] instanceof Set ? Array.from(selectedFilters[key]) : []
                values.forEach(v => params.append(`spec_${specKey}`, v))
              }
            })
            
            // Fetch brand data with filters
            const url = params.toString() 
              ? `${catalog.base}/products/brand/${slug}?${params.toString()}`
              : `${catalog.base}/products/brand/${slug}`
            
            const response = await fetch(url)

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
  }, [slug, storeId, categoryLevel, selectedFilters])

  // Transform API data
  const transformedProducts = brandProducts.map(transformProductData)

  // Build facets from filter API response for category, brand, or store pages
  const facets = useMemo(() => {
    if (isCategory && filterData) {
      return buildFacetsFromCategoryFilters(filterData)
    } else if (isStore && filterData) {
      return buildFacetsFromStoreFilters(filterData)
    } else if (!isStore && !isCategory && filterData) {
      // It's a brand page
      return buildFacetsFromBrandFilters(filterData)
    }
    return []
  }, [isCategory, isStore, filterData])

  const handleFilterChange = (key, value) => {
    setSelectedFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSelectedFilters({})
  }

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
              <FilterDrawer 
                open={true} 
                inline 
                sticky 
                stickyTop={112} 
                facets={facets}
                selected={selectedFilters}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
                onClose={() => { }} 
              />
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
      <FilterDrawer 
        open={filterOpen} 
        onClose={() => setFilterOpen(false)} 
        facets={facets}
        selected={selectedFilters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />

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
