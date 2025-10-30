'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import SectionHeader from '@/components/SectionHeader'
import ProductCard from '@/components/ProductCard'
import FilterDrawer from '@/components/FilterDrawer'
import SortDropdown from '@/components/SortDropdown'
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
  const [debouncedFilters, setDebouncedFilters] = useState({})
  const [sortBy, setSortBy] = useState('relevance')
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [paginationInfo, setPaginationInfo] = useState(null)
  
  // Ref to track if fetch is in progress
  const isFetchingRef = useRef(false)

  // Fetch products when component mounts
  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  // Fetch filter data for category, brand, and store pages
  useEffect(() => {
    const fetchFilterData = async () => {
      console.log('Fetching filter data for:', { slug, categoryLevel, storeId, selectedFilters })
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
        // Fetch store filters with current selected filters for accurate counts
        console.log('Fetching store filters for storeId:', storeId)
        try {
          // Build filter params for the store filters API
          const filterParams = new URLSearchParams()
          
          // Price filter
          if (selectedFilters.price?.min !== undefined && selectedFilters.price?.min !== '') {
            filterParams.append('min_price', selectedFilters.price.min)
          }
          if (selectedFilters.price?.max !== undefined && selectedFilters.price?.max !== '') {
            filterParams.append('max_price', selectedFilters.price.max)
          }
          
          // Availability filter
          if (selectedFilters.availability instanceof Set) {
            if (selectedFilters.availability.has('in') && !selectedFilters.availability.has('out')) {
              filterParams.append('in_stock', 'true')
            } else if (selectedFilters.availability.has('out') && !selectedFilters.availability.has('in')) {
              filterParams.append('in_stock', 'false')
            }
          }
          
          // Rating filter
          if (typeof selectedFilters.rating === 'number') {
            filterParams.append('min_rating', selectedFilters.rating)
          }
          
          // Brand filter (multiple) - send brand names, not IDs
          if (selectedFilters.brand instanceof Set && selectedFilters.brand.size > 0) {
            Array.from(selectedFilters.brand).forEach(b => filterParams.append('brand_id', b))
          }
          
          // Dynamic attribute filters (attr.*)
          Object.keys(selectedFilters).forEach(key => {
            if (key.startsWith('attr.')) {
              const attrKey = key.substring(5)
              const values = selectedFilters[key] instanceof Set ? Array.from(selectedFilters[key]) : []
              values.forEach(v => filterParams.append(`attr_${attrKey}`, v))
            }
          })
          
          // Dynamic specification filters (spec.*)
          Object.keys(selectedFilters).forEach(key => {
            if (key.startsWith('spec.')) {
              const specKey = key.substring(5)
              const values = selectedFilters[key] instanceof Set ? Array.from(selectedFilters[key]) : []
              values.forEach(v => filterParams.append(`spec_${specKey}`, v))
            }
          })
          
          const url = filterParams.toString() 
            ? `${search.storeFilters(storeId)}&${filterParams.toString()}`
            : search.storeFilters(storeId)
          
          console.log('Fetching store filters with URL:', url)
          const response = await fetch(url)
          if (response.ok) {
            const data = await response.json()
            console.log('Store Filter API Response:', data)
            if (data.success && data.data) {
              console.log('Setting filter data:', data.data)
              setFilterData(data.data)
            } else {
              console.error('Store filter API returned unsuccessful response:', data)
            }
          } else {
            console.error('Store filter API error:', response.status, response.statusText)
            const errorText = await response.text()
            console.error('Error response body:', errorText)
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
  }, [slug, categoryLevel, storeId, debouncedFilters])

  // Debounce filter changes to allow multiple selections
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(selectedFilters)
    }, 300) // 300ms delay for filter changes

    return () => clearTimeout(timer)
  }, [selectedFilters])

  // Reset pagination when debounced filters change
  useEffect(() => {
    setCurrentPage(1)
    setPaginationInfo(null)
    setBrandProducts([])
    isFetchingRef.current = false // Reset fetch lock when filters change
  }, [debouncedFilters, slug, storeId, categoryLevel])

  // Fetch brand/store/category info and products by slug
  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return
      
      // Prevent duplicate fetches
      if (isFetchingRef.current) {
        console.log('Fetch already in progress, skipping...')
        return
      }
      
      isFetchingRef.current = true
      
      try {
        setLoadingProducts(true)

        // Check if this is a store (has storeId parameter), category (has categoryLevel), or a brand
        if (storeId) {
          setIsStore(true)
          setIsCategory(false)
            
            // Build filter params for store
            const params = new URLSearchParams()
            
            // Add pagination params
            params.append('page', currentPage.toString())
            params.append('limit', '20')
            
            // Add sort parameter
            params.append('sort', sortBy)
            
            // Price filter
            if (debouncedFilters.price?.min !== undefined && debouncedFilters.price?.min !== '') {
              params.append('min_price', debouncedFilters.price.min)
            }
            if (debouncedFilters.price?.max !== undefined && debouncedFilters.price?.max !== '') {
              params.append('max_price', debouncedFilters.price.max)
            }
            
            // Availability filter
            if (debouncedFilters.availability instanceof Set) {
              if (debouncedFilters.availability.has('in') && !debouncedFilters.availability.has('out')) {
                params.append('in_stock', 'true')
              } else if (debouncedFilters.availability.has('out') && !debouncedFilters.availability.has('in')) {
                params.append('in_stock', 'false')
              }
            }
            
            // Rating filter
            if (typeof debouncedFilters.rating === 'number') {
              params.append('min_rating', debouncedFilters.rating)
            }
            
            // Brand filter (multiple)
            if (debouncedFilters.brand instanceof Set && debouncedFilters.brand.size > 0) {
              Array.from(debouncedFilters.brand).forEach(b => params.append('brand_id', b))
            }
            
            // Dynamic attribute filters (attr.*)
            Object.keys(debouncedFilters).forEach(key => {
              if (key.startsWith('attr.')) {
                const attrKey = key.substring(5)
                const values = debouncedFilters[key] instanceof Set ? Array.from(debouncedFilters[key]) : []
                values.forEach(v => params.append(`attr_${attrKey}`, v))
              }
            })
            
            // Dynamic specification filters (spec.*)
            Object.keys(debouncedFilters).forEach(key => {
              if (key.startsWith('spec.')) {
                const specKey = key.substring(5)
                const values = debouncedFilters[key] instanceof Set ? Array.from(debouncedFilters[key]) : []
                values.forEach(v => params.append(`spec_${specKey}`, v))
              }
            })
            
            // Use search service API for filtered store products (consistent with filter API)
            const url = params.toString()
              ? `${search.storeProducts(storeId, Object.fromEntries(params))}`
              : search.storeProducts(storeId)
             
            const response = await fetch(url)

            if (response.ok) {
              const data = await response.json()
              console.log('Store Catalog API Response:', data)

              if (data.success && data.data) {
                // Extract store info from the first product's store_id
                const firstProduct = data.data.products?.[0]
                if (firstProduct?.store_id && currentPage === 1) {
                  setBrandInfo(firstProduct.store_id) // Store info
                }
                
                const newProducts = data.data.products || []
                setBrandProducts(newProducts)

                const pagination = data.data.pagination
                setPaginationInfo(pagination || null)
              }
            }
          } else if (categoryLevel) {
            setIsStore(false)
            setIsCategory(true)
            
            // Build filter params
            const params = new URLSearchParams()
            
            // Add pagination params
            params.append('page', currentPage.toString())
            params.append('limit', '20')
            
            // Add sort parameter
            params.append('sort', sortBy)
            
            // Price filter
            if (debouncedFilters.price?.min !== undefined && debouncedFilters.price?.min !== '') {
              params.append('min_price', debouncedFilters.price.min)
            }
            if (debouncedFilters.price?.max !== undefined && debouncedFilters.price?.max !== '') {
              params.append('max_price', debouncedFilters.price.max)
            }
            
            // Availability filter
            if (debouncedFilters.availability instanceof Set) {
              if (debouncedFilters.availability.has('in') && !debouncedFilters.availability.has('out')) {
                params.append('in_stock', 'true')
              } else if (debouncedFilters.availability.has('out') && !debouncedFilters.availability.has('in')) {
                params.append('in_stock', 'false')
              }
            }
            
            // Rating filter
            if (typeof debouncedFilters.rating === 'number') {
              params.append('min_rating', debouncedFilters.rating)
            }
            
            // Brand filter (multiple)
            if (debouncedFilters.brand instanceof Set && debouncedFilters.brand.size > 0) {
              Array.from(debouncedFilters.brand).forEach(b => params.append('brand_id', b))
            }
            
            // Store filter (multiple)
            if (debouncedFilters.store instanceof Set && debouncedFilters.store.size > 0) {
              Array.from(debouncedFilters.store).forEach(s => params.append('store_id', s))
            }
            
            // Dynamic attribute filters (attr.*)
            Object.keys(debouncedFilters).forEach(key => {
              if (key.startsWith('attr.')) {
                const attrKey = key.substring(5)
                const values = debouncedFilters[key] instanceof Set ? Array.from(debouncedFilters[key]) : []
                values.forEach(v => params.append(`attr_${attrKey}`, v))
              }
            })
            
            // Dynamic specification filters (spec.*)
            Object.keys(debouncedFilters).forEach(key => {
              if (key.startsWith('spec.')) {
                const specKey = key.substring(5)
                const values = debouncedFilters[key] instanceof Set ? Array.from(debouncedFilters[key]) : []
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
                if (currentPage === 1) {
                  setBrandInfo(data.data.category) // Category info
                }
                
                const newProducts = data.data.products || []
                setBrandProducts(newProducts)

                const pagination = data.data.pagination
                setPaginationInfo(pagination || null)
              }
            }
          } else {
            setIsStore(false)
            setIsCategory(false)
            
            // Build filter params for brand
            const params = new URLSearchParams()
            
            // Add pagination params
            params.append('page', currentPage.toString())
            params.append('limit', '20')
            
            // Add sort parameter
            params.append('sort', sortBy)
            
            // Price filter
            if (debouncedFilters.price?.min !== undefined && debouncedFilters.price?.min !== '') {
              params.append('min_price', debouncedFilters.price.min)
            }
            if (debouncedFilters.price?.max !== undefined && debouncedFilters.price?.max !== '') {
              params.append('max_price', debouncedFilters.price.max)
            }
            
            // Availability filter
            if (debouncedFilters.availability instanceof Set) {
              if (debouncedFilters.availability.has('in') && !debouncedFilters.availability.has('out')) {
                params.append('in_stock', 'true')
              } else if (debouncedFilters.availability.has('out') && !debouncedFilters.availability.has('in')) {
                params.append('in_stock', 'false')
              }
            }
            
            // Rating filter
            if (typeof debouncedFilters.rating === 'number') {
              params.append('min_rating', debouncedFilters.rating)
            }
            
            // Store filter (multiple)
            if (debouncedFilters.store instanceof Set && debouncedFilters.store.size > 0) {
              Array.from(debouncedFilters.store).forEach(s => params.append('store_id', s))
            }
            
            // Dynamic attribute filters (attr.*)
            Object.keys(debouncedFilters).forEach(key => {
              if (key.startsWith('attr.')) {
                const attrKey = key.substring(5)
                const values = debouncedFilters[key] instanceof Set ? Array.from(debouncedFilters[key]) : []
                values.forEach(v => params.append(`attr_${attrKey}`, v))
              }
            })
            
            // Dynamic specification filters (spec.*)
            Object.keys(debouncedFilters).forEach(key => {
              if (key.startsWith('spec.')) {
                const specKey = key.substring(5)
                const values = debouncedFilters[key] instanceof Set ? Array.from(debouncedFilters[key]) : []
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
                if (currentPage === 1) {
                  setBrandInfo(data.data.brand)
                }
                
                const newProducts = data.data.products || []
                setBrandProducts(newProducts)

                const pagination = data.data.pagination
                setPaginationInfo(pagination || null)
              }
            }
          }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoadingProducts(false)
        isFetchingRef.current = false
      }
    }

    fetchData()
  }, [slug, storeId, categoryLevel, debouncedFilters, currentPage, sortBy])

  // Transform API data
  const transformedProducts = brandProducts.map(transformProductData)

  // Build facets from filter API response for category, brand, or store pages
  const facets = useMemo(() => {
    console.log('Building facets with filterData:', filterData, 'isStore:', isStore, 'isCategory:', isCategory)
    if (isCategory && filterData) {
      const result = buildFacetsFromCategoryFilters(filterData)
      console.log('Category facets result:', result)
      return result
    } else if (isStore && filterData) {
      const result = buildFacetsFromStoreFilters(filterData)
      console.log('Store facets result:', result)
      return result
    } else if (!isStore && !isCategory && filterData) {
      // It's a brand page
      const result = buildFacetsFromBrandFilters(filterData)
      console.log('Brand facets result:', result)
      return result
    }
    console.log('No filter data, returning empty facets')
    return []
  }, [isCategory, isStore, filterData])

  const totalPages = useMemo(() => {
    if (paginationInfo?.pages) {
      return Math.max(1, paginationInfo.pages)
    }

    if (paginationInfo?.total) {
      return Math.max(1, Math.ceil(paginationInfo.total / 20))
    }

    return 1
  }, [paginationInfo])

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }, [totalPages])

  const handlePageChangeLocal = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return
    }
    setCurrentPage(page)
  }

  const handlePreviousPage = () => handlePageChangeLocal(currentPage - 1)
  const handleNextPage = () => handlePageChangeLocal(currentPage + 1)

  const handleFilterChange = (key, value) => {
    console.log('Filter changed:', key, value)
    setSelectedFilters(prev => {
      const newFilters = { ...prev, [key]: value }
      console.log('New selected filters:', newFilters)
      return newFilters
    })
  }

  const handleClearFilters = () => {
    setSelectedFilters({})
  }

  const handleSortChange = (newSort) => {
    setSortBy(newSort)
    setCurrentPage(1) // Reset to first page when sorting changes
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

            {/* Main Content Area */}
            <div className="content-area">
              <div className="section-header sticky-header">
                <h2 className="section-title">
                  {`${brandInfo?.name || (isStore ? 'Store' : isCategory ? 'Category' : 'Brand')} Products`}
                </h2>
                <div className="section-actions">
                  <SortDropdown 
                    currentSort={sortBy}
                    onSortChange={handleSortChange}
                  />
                </div>
              </div>

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

              {!loadingProducts && transformedProducts.length > 0 && totalPages > 1 && (
                <div className="pagination-controls" role="navigation" aria-label="Products pagination">
                  <button
                    type="button"
                    className="pagination-button"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      type="button"
                      className={`pagination-button ${page === currentPage ? 'active' : ''}`}
                      onClick={() => handlePageChangeLocal(page)}
                      aria-current={page === currentPage ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="pagination-button"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
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
          padding-bottom: 0; /* extra space at bottom */
        }
        
        .grid-item { 
          display: flex; 
          justify-content: center; 
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 48px 0;
          color: #6b7280;
        }

        .loading-container .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e5e7eb;
          border-top: 3px solid #111827;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .no-products {
          text-align: center;
          padding: 48px 0;
          color: #6b7280;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .pagination-controls {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 8px;
          margin-top: 32px;
          flex-wrap: wrap;
        }

        .pagination-button {
          min-width: 40px;
          padding: 8px 12px;
          border: 1px solid #0082FF;
          border-radius: 8px;
          background: #ffffff;
          color: #0082FF;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pagination-button:hover:not(:disabled) {
          border-color: #0082FF;
          color: #0082FF;
          background: #f9fafb;
        }

        .pagination-button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .pagination-button.active {
          background: #0082FF;
          color: #ffffff;
          border-color: none;
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

        .section-header {
          display: flex;
          width: 100%;
          max-width: 1392px;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-right: 24px;
          padding-left: 24px;
        }

        .section-title {
          color: #000;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 40px;
          font-weight: 700;
          line-height: 120%;
          margin: 0;
        }

        .section-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .sticky-header {
          position: sticky;
          top: 0;
          z-index: 5;
          background: #ffffff;
        }

        @media (max-width: 768px) {
          .section-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .section-title {
            font-size: 28px;
          }
        }
      `}</style>
    </main>
  )
}
