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
import { fetchStoreProducts } from '@/store/slices/productsSlice'

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
  const searchParams = useSearchParams()
  const storeId = useMemo(() => searchParams.get('storeId'), [searchParams])
  const dispatch = useDispatch()
  const { storeProducts, loading, error } = useSelector(state => state.products)

  useEffect(() => {
    if (storeId) {
      dispatch(fetchStoreProducts(storeId))
    }
  }, [dispatch, storeId])
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
              <SectionHeader
                title="Products"
                showNavigation={false}
                showButton={true}
                buttonText="Sort By"
                onButtonClick={() => {}}
              />

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
                    (storeProducts && storeProducts.length > 0 ? storeProducts : []).map((product, index) => (
                      <div key={product._id || product.id || `p-${index}`} className="grid-item">
                        <ProductCard 
                          id={product._id || product.id}
                          slug={product.slug || product._id || product.id}
                          title={product.name || product.title || 'Product'}
                          price={product.price ? `AED ${product.price}` : 'AED 0'}
                          rating={product.rating || '4.0'}
                          deliveryTime={product.deliveryTime || '30 Min'}
                          image={product.image || product.images?.[0] || '/iphone.jpg'}
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
