'use client'

import Navigation from '@/components/Navigation'
import ProductCard from '@/components/ProductCard'
import SectionHeader from '@/components/SectionHeader'
import Footer from '@/components/Footer'
import FilterDrawer from '@/components/FilterDrawer'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'next/navigation'
import { searchProducts } from '@/store/slices/productsSlice'
import { buildFacetsFromProducts } from '@/utils/facets'

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
  const searchParams = useSearchParams()
  const query = useMemo(() => searchParams.get('q'), [searchParams])
  const dispatch = useDispatch()
  
  const { searchResults, searchQuery, searchLoading, searchError, searchPagination } = useSelector(state => state.products)

  // Debounce search query and filters to prevent too many API calls
  useEffect(() => {
    if (query) {
      const timer = setTimeout(() => {
        dispatch(searchProducts({ query, filters: selectedFilters }))
      }, 300) // 300ms delay for search page

      return () => clearTimeout(timer)
    }
  }, [dispatch, query, selectedFilters])

  const facets = useMemo(() => buildFacetsFromProducts(Array.isArray(searchResults) ? searchResults : []), [searchResults])

  const handleFilterChange = (key, value) => {
    setSelectedFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSelectedFilters({})
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
              <SectionHeader
                title={query ? `Search Results for "${query}"` : "Search Results"}
                showNavigation={false}
                showButton={true}
                buttonText="Sort By"
                onButtonClick={() => {}}
              />

              <div className="products-scroll-container">
                <div className="grid-3">
                  {searchLoading ? (
                    searchResults.slice(0,6).map((product, index) => (
                      <div key={`skeleton-${index}`} className="grid-item">
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
                  ) : searchError ? (
                    <div style={{ gridColumn: '1 / -1', color: 'red' }}>Failed to load search results: {searchError}</div>
                  ) : (
                    (Array.isArray(searchResults) && searchResults.length > 0 ? searchResults : []).map((product, index) => (
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
                  )}
                </div>
              </div>
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
