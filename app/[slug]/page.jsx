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
  const [hasMoreProducts, setHasMoreProducts] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  
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
    setHasMoreProducts(true)
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
            params.append('limit', '10')
            
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
                
                if (currentPage === 1) {
                  // First page - replace products
                  setBrandProducts(newProducts)
                } else {
                  // Subsequent pages - append products
                  setBrandProducts(prev => [...prev, ...newProducts])
                }
                
                // Check if there are more products
                const pagination = data.data.pagination
                setHasMoreProducts(pagination && currentPage < pagination.pages)
              }
            }
          } else if (categoryLevel) {
            setIsStore(false)
            setIsCategory(true)
            
            // Build filter params
            const params = new URLSearchParams()
            
            // Add pagination params
            params.append('page', currentPage.toString())
            params.append('limit', '10')
            
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
                
                if (currentPage === 1) {
                  // First page - replace products
                  setBrandProducts(newProducts)
                } else {
                  // Subsequent pages - append products
                  setBrandProducts(prev => [...prev, ...newProducts])
                }
                
                // Check if there are more products
                const pagination = data.data.pagination
                setHasMoreProducts(pagination && currentPage < pagination.pages)
              }
            }
          } else {
            setIsStore(false)
            setIsCategory(false)
            
            // Build filter params for brand
            const params = new URLSearchParams()
            
            // Add pagination params
            params.append('page', currentPage.toString())
            params.append('limit', '10')
            
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
                
                if (currentPage === 1) {
                  // First page - replace products
                  setBrandProducts(newProducts)
                } else {
                  // Subsequent pages - append products
                  setBrandProducts(prev => [...prev, ...newProducts])
                }
                
                // Check if there are more products
                const pagination = data.data.pagination
                setHasMoreProducts(pagination && currentPage < pagination.pages)
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

  // Load more products function
  const loadMoreProducts = () => {
    if (!loadingMore && hasMoreProducts) {
      setLoadingMore(true)
      setCurrentPage(prev => prev + 1)
    }
  }

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || !hasMoreProducts) return
      
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        setLoadingMore(true)
        setCurrentPage(prev => prev + 1)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadingMore, hasMoreProducts])

  // Reset loading more when page changes
  useEffect(() => {
    setLoadingMore(false)
  }, [currentPage])

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
              <div className="section-header">
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
                  {loadingMore && (
                    <div className="loading-more">
                      <div className="loading-spinner"></div>
                      <p>Loading more products...</p>
                    </div>
                  )}
                  {!hasMoreProducts && transformedProducts.length > 0 && (
                    <div className="no-more-products">
                      <p>No more products to load</p>
                    </div>
                  )}
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

        .loading-more {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          margin-top: 20px;
        }

        .loading-more .loading-spinner {
          width: 24px;
          height: 24px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }

        .no-more-products {
          text-align: center;
          padding: 20px;
          color: #666;
          font-style: italic;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
