'use client'

import Navigation from '@/components/Navigation'
import Categories from '@/components/Categories'
import HypermarketCard from '@/components/hypermarketcard'
import ImageSlider from '@/components/ImageSlider'
import ProductCard from '@/components/ProductCard'
import StoreCard from '@/components/StoreCard'
import SectionHeader from '@/components/SectionHeader'
import Banner from '@/components/Banner'
import CategoryCard from '@/components/CategoryCard'
import InfluencerCard from '@/components/InfluencerCard'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import QuickNav from '@/components/QuickNav'
import Image from 'next/image'
import FilterDrawer from '@/components/FilterDrawer'
import { useEffect, useState, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHypermarketStores, fetchFastestDeliveryStores, fetchBestCheapDeals, fetchBestBundleDeals } from '@/store/slices/storesSlice'
import { fetchProducts, fetchProductsByCategory } from '@/store/slices/productsSlice'
import { useRouter } from 'next/navigation'
import { buildFacetsFromProducts, applyFiltersToProducts } from '@/utils/facets'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation as SwiperNavigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const hypermarketCategoryId = '68e775f44f4cbd5c2fa2e9c1';

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

  // Format savings to 2 decimal places
  const formattedSavings = savings > 0 ? savings.toFixed(2) : 0;

  return {
    id: apiProduct._id || apiProduct.slug,
    slug: apiProduct.slug,
    title: apiProduct.title || 'Product Title',
    price: `AED ${apiProduct.discount_price || apiProduct.price || '0'}`,
    rating: apiProduct.average_rating?.toString() || '0',
    deliveryTime: '30 Min', // Default delivery time since it's not in API
    image: imageUrl,
    badge: apiProduct.is_offer && savings > 0 ? `Save AED ${formattedSavings}` : null
  }
}

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

export default function Home() {
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState({})
  const [isMobile, setIsMobile] = useState(false)
  const fastestDeliverySwiperRef = useRef(null)
  const bestCheapDealsSwiperRef = useRef(null)
  const bestBundlesSwiperRef = useRef(null)
  const bestCashbackSwiperRef = useRef(null)
  const dispatch = useDispatch()
  const router = useRouter()
  const { hypermarketStores, fastestDeliveryStores, bestCheapDeals, bestBundleDeals, loading, error } = useSelector(state => state.stores)
  const { products, categoryProducts = [], categoryProductsLoading } = useSelector(state => state.products)
  const [userLocation, setUserLocation] = useState(null)

  // Check screen size for mobile detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkScreenSize()

    // Add event listener
    window.addEventListener('resize', checkScreenSize)

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Get user location
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            })
          },
          (error) => {
            console.error('Error getting location:', error)
            // Default to Dubai Marina if location access denied
            setUserLocation({
              latitude: 25.0772,
              longitude: 55.1398
            })
          }
        )
      } else {
        // Default to Dubai Marina if geolocation not supported
        setUserLocation({
          latitude: 25.0772,
          longitude: 55.1398
        })
      }
    }
    getLocation()
  }, [])

  useEffect(() => {
    dispatch(fetchHypermarketStores())
    dispatch(fetchProducts())
    dispatch(fetchProductsByCategory(hypermarketCategoryId))
  }, [dispatch])

  // Fetch fastest delivery stores when location is available
  useEffect(() => {
    if (userLocation) {
      dispatch(fetchFastestDeliveryStores({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        storeType: 'hypermarket'
      }))
      dispatch(fetchBestCheapDeals({ storeType: 'hypermarket', page: 1, limit: 20 }))
      dispatch(fetchBestBundleDeals({ storeType: 'hypermarket', page: 1, limit: 20 }))
    }
  }, [userLocation, dispatch])

  // Build facets from products for proper filter display
  const facets = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) {
      return []
    }
    return buildFacetsFromProducts(products)
  }, [products])

  // Apply filters to products
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) {
      return productData // fallback to static data
    }
    const filtered = applyFiltersToProducts(products, selectedFilters)
    return filtered.length > 0 ? filtered.map(transformProductData) : productData
  }, [products, selectedFilters])

  const handleFilterChange = (key, value) => {
    setSelectedFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSelectedFilters({})
  }

  // Transform category products
  const transformedCategoryProducts = useMemo(() => {
    if (!Array.isArray(categoryProducts) || categoryProducts.length === 0) {
      return []
    }
    return categoryProducts.map(transformProductData)
  }, [categoryProducts])

  // Navigation handlers
  const handleFastestDeliveryPrev = () => {
    if (fastestDeliverySwiperRef.current?.swiper) {
      fastestDeliverySwiperRef.current.swiper.slidePrev()
    }
  }

  const handleFastestDeliveryNext = () => {
    if (fastestDeliverySwiperRef.current?.swiper) {
      fastestDeliverySwiperRef.current.swiper.slideNext()
    }
  }

  const handleBestCheapDealsPrev = () => {
    if (bestCheapDealsSwiperRef.current?.swiper) {
      bestCheapDealsSwiperRef.current.swiper.slidePrev()
    }
  }

  const handleBestCheapDealsNext = () => {
    if (bestCheapDealsSwiperRef.current?.swiper) {
      bestCheapDealsSwiperRef.current.swiper.slideNext()
    }
  }

  const handleBestBundlesPrev = () => {
    if (bestBundlesSwiperRef.current?.swiper) {
      bestBundlesSwiperRef.current.swiper.slidePrev()
    }
  }

  const handleBestBundlesNext = () => {
    if (bestBundlesSwiperRef.current?.swiper) {
      bestBundlesSwiperRef.current.swiper.slideNext()
    }
  }

  const handleBestCashbackPrev = () => {
    if (bestCashbackSwiperRef.current?.swiper) {
      bestCashbackSwiperRef.current.swiper.slidePrev()
    }
  }

  const handleBestCashbackNext = () => {
    if (bestCashbackSwiperRef.current?.swiper) {
      bestCashbackSwiperRef.current.swiper.slideNext()
    }
  }

  return (
    <main className="home-page">
      <Navigation />
      {/* <QuickNav /> */}

      <HypermarketCard />

      {/* Fastest Delivery */}
      <section className="section">
        <div className="container">
          <SectionHeader
            title="Fastest Delivery"
            showNavigation={true}
            onPrev={handleFastestDeliveryPrev}
            onNext={handleFastestDeliveryNext}
          />
          {loading && (!hypermarketStores || hypermarketStores.length === 0) ? (
            <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
              {productData.map((product, index) => (
                <StoreCard key={`skeleton-${index}`} {...product} />
              ))}
            </div>
          ) : (hypermarketStores && hypermarketStores.length > 0) ? (
            <Swiper
              ref={fastestDeliverySwiperRef}
              modules={[SwiperNavigation]}
              slidesPerView={isMobile ? 1.2 : 'auto'}
              spaceBetween={isMobile ? 16 : 24}
              grabCursor={true}
              freeMode={true}
              className="bestsellers-swiper"
            >
              {hypermarketStores.map((store, index) => (
                <SwiperSlide key={store._id || store.id || `store-${index}`} className="bestseller-slide">
                  <StoreCard
                    id={store._id || store.id}
                    title={store.name || 'Store'}
                    category={store.category?.name || store.category || 'General'}
                    rating={store.rating || '4.0'}
                    deliveryTime={store.deliveryTime || '30 Min'}
                    image={store.banner || store.logo || '/iphone.jpg'}
                    logo={store.logo}
                    location={(store.address && store.address.city) || 'Dubai, UAE'}
                    onClick={() => {
                      const slug = store.slug || store.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                      router.push(`/${slug}?storeId=${store._id || store.id}`);
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
              {productData.map((product, index) => (
                <StoreCard key={index} {...product} />
              ))}
            </div>
          )}
        </div>
      </section>
      {/* Best & Cheap Deals */}
      <section className="section">
        <div className="container">
          <SectionHeader
            title="Best & Cheap Deals"
            showNavigation={true}
            onPrev={handleBestCheapDealsPrev}
            onNext={handleBestCheapDealsNext}
          />
          {loading && (!bestCheapDeals || bestCheapDeals.length === 0) ? (
            <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
              {productData.map((product, index) => (
                <ProductCard key={`skeleton-${index}`} {...product} />
              ))}
            </div>
          ) : (bestCheapDeals && bestCheapDeals.length > 0) ? (
            <Swiper
              ref={bestCheapDealsSwiperRef}
              modules={[SwiperNavigation]}
              slidesPerView={isMobile ? 1.2 : 'auto'}
              spaceBetween={isMobile ? 16 : 24}
              grabCursor={true}
              freeMode={true}
              className="bestsellers-swiper"
            >
              {bestCheapDeals.map((deal, index) => {
                const product = transformProductData(deal);
                return (
                  <SwiperSlide key={deal._id || deal.id || `deal-${index}`} className="bestseller-slide">
                    <ProductCard
                      {...product}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          ) : (
            <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
              {productData.map((product, index) => (
                <ProductCard key={index} {...product} />
              ))}
            </div>
          )}
        </div>
      </section>
      {/* Best Bundles Deals */}
      <section className="section">
        <div className="container">
          <SectionHeader
            title="Best Bundles Deals"
            showNavigation={true}
            onPrev={handleBestBundlesPrev}
            onNext={handleBestBundlesNext}
          />
          {loading && (!bestBundleDeals || bestBundleDeals.length === 0) ? (
            <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
              {productData.map((product, index) => (
                <ProductCard key={`skeleton-${index}`} {...product} />
              ))}
            </div>
          ) : (bestBundleDeals && bestBundleDeals.length > 0) ? (
            <Swiper
              ref={bestBundlesSwiperRef}
              modules={[SwiperNavigation]}
              slidesPerView={isMobile ? 1.2 : 'auto'}
              spaceBetween={isMobile ? 16 : 24}
              grabCursor={true}
              freeMode={true}
              className="bestsellers-swiper"
            >
              {bestBundleDeals.map((bundle, index) => {
                const mainProduct = bundle.main_product_id;
                const product = transformProductData({
                  ...mainProduct,
                  title: bundle.title || mainProduct?.title,
                  discount_price: bundle.total_price,
                  price: bundle.original_price,
                  is_offer: true,
                });
                return (
                  <SwiperSlide key={bundle._id || `bundle-${index}`} className="bestseller-slide">
                    <ProductCard
                      {...product}
                      badge={bundle.savings ? `Save AED ${bundle.savings}` : product.badge}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          ) : (
            <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
              {productData.map((product, index) => (
                <ProductCard key={index} {...product} />
              ))}
            </div>
          )}
        </div>
      </section>
      {/* Best Cashback - Show products with special deals for Qliq Plus */}
      <section className="section">
        <div className="container">
          <SectionHeader
            title="Best Cashback"
            showNavigation={true}
            onPrev={handleBestCashbackPrev}
            onNext={handleBestCashbackNext}
          />
          {loading && (!products || products.length === 0) ? (
            <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
              {productData.map((product, index) => (
                <ProductCard key={`skeleton-${index}`} {...product} />
              ))}
            </div>
          ) : (products && products.length > 0) ? (
            <Swiper
              ref={bestCashbackSwiperRef}
              modules={[SwiperNavigation]}
              slidesPerView={isMobile ? 1.2 : 'auto'}
              spaceBetween={isMobile ? 16 : 24}
              grabCursor={true}
              freeMode={true}
              className="bestsellers-swiper"
            >
              {products
                .filter(product => product.special_deals_for_qliq_plus || product.is_offer)
                .slice(0, 20)
                .map((product, index) => {
                  const transformed = transformProductData(product);
                  return (
                    <SwiperSlide key={product._id || product.id || `cashback-${index}`} className="bestseller-slide">
                      <ProductCard
                        {...transformed}
                        badge={product.special_deals_for_qliq_plus ? 'Qliq Plus Deal' : transformed.badge}
                      />
                    </SwiperSlide>
                  );
                })}
            </Swiper>
          ) : (
            <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
              {productData.map((product, index) => (
                <ProductCard key={index} {...product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        facets={facets}
        selected={selectedFilters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      <Footer />
    </main>
  )
}
