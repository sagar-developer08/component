'use client'

import Navigation from '@/components/Navigation'
import Categories from '@/components/Categories'
import ImageSlider from '@/components/ImageSlider'
import ProductCard from '@/components/ProductCard'
import StoreCard from '@/components/StoreCard'
import SectionHeader from '@/components/SectionHeader'
import Footer from '@/components/Footer'
import FilterDrawer from '@/components/FilterDrawer'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'next/navigation'
import { fetchStoreProducts, clearStoreProducts } from '@/store/slices/productsSlice'

const productData = [
  {
    id: "nike-airforce-01",
    title: "Vorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: "AED 1,600",
    rating: "4.0",
    deliveryTime: "30 Min",
    image: "/iphone.jpg"
  },
  {
    id: "nike-dunk-low",
    title: "Vorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: "AED 1,600",
    rating: "4.0",
    deliveryTime: "30 Min",
    image: "/iphone.jpg"
  },
  {
    id: "nike-air-max",
    title: "Vorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: "AED 1,600",
    rating: "4.0",
    deliveryTime: "30 Min",
    image: "/iphone.jpg"
  },
  {
    id: "nike-airforce-01-black",
    title: "Vorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: "AED 1,600",
    rating: "4.0",
    deliveryTime: "30 Min",
    image: "/iphone.jpg"
  }
]

export default function StoreDetail() {
  const [filterOpen, setFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const searchParams = useSearchParams()
  const storeId = useMemo(() => searchParams.get('storeId'), [searchParams])
  const dispatch = useDispatch()
  const { storeProducts, loading, error, storePagination } = useSelector(state => state.products)
  const limit = 20

  // Reset state whenever the store changes and on unmount
  useEffect(() => {
    if (!storeId) {
      return
    }

    setCurrentPage(1)
    dispatch(clearStoreProducts())

    return () => {
      dispatch(clearStoreProducts())
    }
  }, [dispatch, storeId])

  // Fetch products for the current store and page
  useEffect(() => {
    if (!storeId) {
      return
    }

    dispatch(fetchStoreProducts({ storeId, page: currentPage, limit }))
  }, [dispatch, storeId, currentPage])

  const totalPages = useMemo(() => {
    if (storePagination?.pages) {
      return storePagination.pages
    }

    if (storePagination?.total) {
      return Math.max(1, Math.ceil(storePagination.total / limit))
    }

    return 1
  }, [storePagination, limit])

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }, [totalPages])

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return
    }
    setCurrentPage(page)
  }

  const handlePrevious = () => {
    handlePageChange(currentPage - 1)
  }

  const handleNext = () => {
    handlePageChange(currentPage + 1)
  }
  return (
    <main className="home-page">
      <Navigation />

      <section className="section">
        <div className="container">
          <div className="listing-layout">
            {/* Sticky Filter Sidebar */}
            <aside className="filters-sidebar">
              <FilterDrawer open={true} inline sticky stickyTop={112} onClose={() => { }} />
            </aside>

            {/* Main Content Area with Scrollable Products */}
            <div className="content-area">
              <div className="sticky-header">
                <SectionHeader
                  title="Products"
                  showNavigation={false}
                  showButton={true}
                  buttonText="Sort By"
                  onButtonClick={() => {}}
                />
              </div>

              <div className="products-scroll-container">
                <div className="grid-3">
                  {loading ? (
                    productData.slice(0,6).map((product, index) => (
                      <div key={`skeleton-${index}`} className="grid-item">
                        <ProductCard {...product} />
                      </div>
                    ))
                  ) : error ? (
                    <div style={{ gridColumn: '1 / -1', color: 'red' }}>Failed to load products: {error}</div>
                  ) : (
                    (Array.isArray(storeProducts) && storeProducts.length > 0 ? (
                      storeProducts.map((product, index) => (
                        <div key={product._id || product.id || `p-${index}`} className="grid-item">
                          <ProductCard 
                            id={product._id || product.id}
                            slug={product.slug || product._id || product.id}
                            title={product.title || product.name || 'Product'}
                            price={product.discount_price ? `AED ${product.discount_price}` : product.price ? `AED ${product.price}` : 'AED 0'}
                            rating={product.average_rating || product.rating || '4.0'}
                            deliveryTime={product.deliveryTime || '30 Min'}
                            image={product.images?.[0]?.url || product.image || '/iphone.jpg'}
                          />
                        </div>
                      ))
                    ) : (
                      <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '24px 0', color: '#6b7280' }}>
                        No products found for this store.
                      </div>
                    ))
                  )}
                </div>
              </div>

              {!loading && totalPages > 1 && (
                <div className="pagination-controls" role="navigation" aria-label="Store products pagination">
                  <button
                    type="button"
                    className="pagination-button"
                    onClick={handlePrevious}
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
                    onClick={handleNext}
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

        .sticky-header {
          position: sticky;
          top: 0;
          z-index: 5;
          background: #ffffff;
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
          background: #0082FF;
          color: #111827;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pagination-button:hover:not(:disabled) {
          border-color: #111827;
          color: #0082FF;
          background: #0082FF;
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
      `}</style>
    </main>
  )
}
