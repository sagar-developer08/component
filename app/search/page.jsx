'use client'

import Navigation from '@/components/Navigation'
import ProductCard from '@/components/ProductCard'
import SectionHeader from '@/components/SectionHeader'
import Footer from '@/components/Footer'
import FilterDrawer from '@/components/FilterDrawer'
import SortDropdown from '@/components/SortDropdown'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'next/navigation'
import { searchProducts } from '@/store/slices/productsSlice'
import { buildFacetsFromProducts } from '@/utils/facets'
import { buildFacetsFromSearchFilters } from '@/utils/searchFilters'
import { search } from '@/store/api/endpoints'

// Helper function to transform API product data to match ProductCard component format
const transformProductData = (apiProduct) => {
  // Get the primary image or first available image
  const primaryImage = apiProduct.images?.find(img => img.is_primary) || apiProduct.images?.[0];

  // Use placeholder image if no valid image URL
  const imageUrl = primaryImage?.url || 'https://api.builder.io/api/v1/image/assets/TEMP/0ef2d416817956be0fe96760f14cbb67e415a446?width=644';

  // Calculate savings for offer badge
  const savings = apiProduct.is_offer && apiProduct.price && apiProduct.discount_price
    ? apiProduct.price - apiProduct.discount_price
    : 0;

  return {
    id: apiProduct._id || apiProduct.slug,
    title: apiProduct.title || 'Product Title',
    price: `AED ${apiProduct.discount_price || apiProduct.price || '0'}`,
    rating: apiProduct.average_rating?.toString() || '0',
    deliveryTime: '30 Min', // Default delivery time since it's not in API
    image: imageUrl,
    badge: apiProduct.is_offer && savings > 0 ? `Save AED ${savings}` : null
  }
}

export default function SearchPage() {
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState({})
  const [debouncedFilters, setDebouncedFilters] = useState({})
  const [sortBy, setSortBy] = useState('relevance')
  const [filterData, setFilterData] = useState(null)
  const [loadingFilters, setLoadingFilters] = useState(false)
  const searchParams = useSearchParams()
  const query = useMemo(() => searchParams.get('q'), [searchParams])
  const dispatch = useDispatch()
  
  const { searchResults, searchQuery, searchLoading, searchError, searchPagination } = useSelector(state => state.products)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20

  useEffect(() => {
    setCurrentPage(1)
  }, [query, searchResults])

  const totalResults = useMemo(() => {
    if (typeof searchPagination?.total === 'number') {
      return searchPagination.total
    }
    return Array.isArray(searchResults) ? searchResults.length : 0
  }, [searchResults, searchPagination?.total])

  const totalPages = useMemo(() => {
    if (!totalResults) {
      return 1
    }
    return Math.max(1, Math.ceil(totalResults / pageSize))
  }, [totalResults, pageSize])

  const paginatedResults = useMemo(() => {
    if (!Array.isArray(searchResults)) {
      return []
    }

    const start = (currentPage - 1) * pageSize
    return searchResults.slice(start, start + pageSize)
  }, [searchResults, currentPage, pageSize])

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }, [totalPages])

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return
    }
    setCurrentPage(page)
  }

  const handlePreviousPage = () => handlePageChange(currentPage - 1)
  const handleNextPage = () => handlePageChange(currentPage + 1)

  // Debounce filter changes to allow multiple selections
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(selectedFilters)
    }, 300) // 300ms delay for filter changes

    return () => clearTimeout(timer)
  }, [selectedFilters])

  // Fetch filter data when query or debounced filters change
  useEffect(() => {
    const fetchFilterData = async () => {
      if (!query) return

      try {
        setLoadingFilters(true)
        
        // Build filter params
        const params = new URLSearchParams()
        
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

        const url = search.searchFilters(query, Object.fromEntries(params))
        const response = await fetch(url)

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            setFilterData(data.data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch search filters:', error)
      } finally {
        setLoadingFilters(false)
      }
    }

    fetchFilterData()
  }, [query, debouncedFilters])

  // Debounce search query and filters to prevent too many API calls
  useEffect(() => {
    if (query) {
      const timer = setTimeout(() => {
        dispatch(searchProducts({ query, filters: debouncedFilters, sort: sortBy }))
      }, 300) // 300ms delay for search page

      return () => clearTimeout(timer)
    }
  }, [dispatch, query, debouncedFilters, sortBy])

  // Build facets from filter API response for proper filter display
  const facets = useMemo(() => {
    if (filterData) {
      return buildFacetsFromSearchFilters(filterData)
    }
    // Fallback to search results if no filter data available
    if (!Array.isArray(searchResults) || searchResults.length === 0) {
      return []
    }
    return buildFacetsFromProducts(searchResults)
  }, [filterData, searchResults])

  const handleFilterChange = (key, value) => {
    setSelectedFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSelectedFilters({})
  }

  const handleSortChange = (newSort) => {
    setSortBy(newSort)
  }

  return (
    <main className="home-page">
      <Navigation />

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
              <div className="section-header sticky-header">
                <h2 className="section-title">
                  {query ? `Search Results for "${query}"` : "Search Results"}
                </h2>
                <div className="section-actions">
                  <SortDropdown 
                    currentSort={sortBy}
                    onSortChange={handleSortChange}
                  />
                </div>
              </div>

              <div className="products-scroll-container">
                <div className="grid-3">
                  {searchLoading ? (
                    Array.from({ length: Math.min(pageSize, 6) }).map((_, index) => (
                      <div key={`skeleton-${index}`} className="grid-item">
                        <ProductCard 
                          id={`placeholder-${index}`}
                          slug={`placeholder-${index}`}
                          title="Loading..."
                          price="AED 0"
                          rating="0"
                          deliveryTime="30 Min"
                          image="/iphone.jpg"
                        />
                      </div>
                    ))
                  ) : searchError ? (
                    <div style={{ gridColumn: '1 / -1', color: 'red' }}>Failed to load search results: {searchError}</div>
                  ) : paginatedResults.length > 0 ? (
                    paginatedResults.map((product, index) => (
                      <div key={product._id || product.id || `p-${index}`} className="grid-item">
                        <ProductCard 
                          id={product._id || product.id}
                          slug={product.slug || product._id || product.id}
                          title={product.title || product.name || 'Product'}
                          price={product.price ? `AED ${product.price}` : 'AED 0'}
                          rating={product.average_rating || product.rating || '4.0'}
                          deliveryTime={product.deliveryTime || '30 Min'}
                          image={product.images?.[0]?.url || product.image || '/iphone.jpg'}
                        />
                      </div>
                    ))
                  ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                      No products found for this search.
                    </div>
                  )}
                </div>
              </div>

              {!searchLoading && !searchError && paginatedResults.length > 0 && totalPages > 1 && (
                <div className="pagination-controls" role="navigation" aria-label="Search results pagination">
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
                      onClick={() => handlePageChange(page)}
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

      {/* Drawer for small screens or other triggers (unchanged elsewhere) */}
      <FilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} facets={facets} selected={selectedFilters} onChange={handleFilterChange} onClear={handleClearFilters} />

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

        .pagination-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 32px;
          flex-wrap: wrap;
        }

        .pagination-button {
          min-width: 40px;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: #ffffff;
          color: #111827;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pagination-button:hover:not(:disabled) {
          border-color: #111827;
          color: #111827;
          background: #f9fafb;
        }

        .pagination-button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .pagination-button.active {
          background: #111827;
          color: #ffffff;
          border-color: #111827;
        }

        .sticky-header {
          position: sticky;
          top: 0;
          z-index: 5;
          background: #ffffff;
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
