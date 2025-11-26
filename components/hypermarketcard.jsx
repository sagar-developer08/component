'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHypermarketStores, fetchSupermarketStores } from '@/store/slices/storesSlice'
import { useRouter, usePathname } from 'next/navigation'

export default function HypermarketCard() {
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const { hypermarketStores, supermarketStores, loading, error } = useSelector(state => state.stores)

  // Determine which stores to use based on the current pathname
  const isSupermarketPage = pathname?.includes('/supermarket')
  const isHypermarketPage = pathname?.includes('/hypermarket')

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    // Fetch stores based on the current page
    if (isSupermarketPage) {
      dispatch(fetchSupermarketStores())
    } else if (isHypermarketPage) {
      dispatch(fetchHypermarketStores())
    } else {
      // Fetch both if pathname is not available yet or on other pages
      dispatch(fetchSupermarketStores())
      dispatch(fetchHypermarketStores())
    }
  }, [dispatch, isSupermarketPage, isHypermarketPage]);

  const handleStoreClick = (store) => {
    const slug = store.slug || store.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    // Navigate to category page instead of store detail page
    // Add source query param based on current page
    const source = isSupermarketPage ? 'supermarket' : (isHypermarketPage ? 'hypermarket' : 'store');
    router.push(`/category/${slug}?source=${source}`);
  };

  // Use the appropriate stores based on the current page
  const stores = isSupermarketPage 
    ? supermarketStores 
    : (isHypermarketPage ? hypermarketStores : (supermarketStores && supermarketStores.length > 0 ? supermarketStores : hypermarketStores));

  return (
    <section className="section">
      <div className="container">
        <div className="hypermarket-cards-container">
          {loading && (!stores || stores.length === 0) ? (
            <div className="loading-placeholder">Loading stores...</div>
          ) : error ? (
            <div className="error-message">Error loading stores: {error}</div>
          ) : (stores && stores.length > 0) ? (
            stores.map((store, index) => (
              <div key={store._id || store.id || `store-${index}`} className="hypermarket-card-wrapper">
                <div className="hypermarket-card" onClick={() => handleStoreClick(store)}>
                  <Image
                    src={ store.logo || '/iphone.jpg'}
                    alt={store.name || 'Store'}
                    width={isMobile ? 160 : 160}
                    height={isMobile ? 160 : 160}
                    style={{ borderRadius: '100px', objectFit: 'contain', border: '1px solid #0082FF' }}
                  />
                </div>
                <div className="hypermarket-name">
                  <h3>
                    {store.name && store.name.includes(' - ') ? (
                      <>
                        {store.name.split(' - ')[0]}
                        <br />
                        {store.name.split(' - ')[1]}
                      </>
                    ) : (
                      store.name || 'Store'
                    )}
                  </h3>
                </div>
              </div>
            ))
          ) : (
            <div className="no-stores">No stores available</div>
          )}
        </div>

        <style jsx>{`
          .hypermarket-cards-container {
            display: flex;
            gap: 24px;
            overflow-x: auto;
            padding-bottom: 8px;
            flex-wrap: wrap;
            justify-content: center;
          }

          .hypermarket-card-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            min-width: 160px;
          }

          .hypermarket-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            background: rgba(247, 247, 247, 0.00);
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .hypermarket-name {
            display: flex;
            padding: 0 8px;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            width: 100%;
          }

          .hypermarket-name h3 {
            width: 100%;
            color: #000;
            text-align: center;
            font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
            font-size: 16px;
            font-weight: 600;
            line-height: 150%;
            margin: 0;
            word-wrap: break-word;
            display: block;
            overflow: hidden;
          }

          .loading-placeholder,
          .error-message,
          .no-stores {
            width: 100%;
            text-align: center;
            padding: 20px;
            color: #666;
            font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          }

          .error-message {
            color: #d32f2f;
          }

          @media (max-width: 768px) {
            .hypermarket-name h3 {
              font-size: 16px;
            }

            .hypermarket-cards-container {
              gap: 16px;
            }
          }
        `}</style>
      </div>
    </section>
  )
}
