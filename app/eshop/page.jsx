'use client'

import Navigation from '@/components/Navigation'
import Categories from '@/components/Categories'
import ImageSlider from '@/components/ImageSlider'
import ProductCard from '@/components/ProductCard'
import SectionHeader from '@/components/SectionHeader'
import Banner from '@/components/Banner'
import CategoryCard from '@/components/CategoryCard'
import InfluencerCard from '@/components/InfluencerCard'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import QuickNav from '@/components/QuickNav'
import StoreCard from '@/components/StoreCard'
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation as SwiperNavigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '@/store/slices/productsSlice'
import { fetchBrands } from '@/store/slices/brandsSlice'
import { fetchEshopStores } from '@/store/slices/storesSlice'

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

// Helper function to transform API brand data to match CategoryCard component format
const transformBrandData = (apiBrand) => {
  return {
    name: apiBrand.name || 'Brand Name',
    image: apiBrand.logo || 'https://api.builder.io/api/v1/image/assets/TEMP/12ba4121022e746495773eb8df2e6b4add90148f?width=412'
  }
}

// Helper function to transform API store data to match CategoryCard component format
const transformStoreData = (apiStore) => {
  return {
    id: apiStore._id,
    name: apiStore.name || 'Store Name',
    slug: apiStore.slug,
    description: apiStore.description,
    image: apiStore.logo || 'https://api.builder.io/api/v1/image/assets/TEMP/12ba4121022e746495773eb8df2e6b4add90148f?width=412',
    isTopStore: apiStore.isTopStore,
    email: apiStore.email,
    phone: apiStore.phone,
    address: apiStore.address,
    isActive: apiStore.isActive
  }
}

const categoryData = [
  {
    name: "Pet Supplies",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/b96c7d3062a93a3b6d8e9a2a4bd11acfa542dced?width=412"
  },
  {
    name: "Health n Beauty",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/81e3ee1beeaa2c8941600c27d3ec9733bac0869c?width=412"
  },
  {
    name: "Books",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/5839901b9e3641626fef47388dc1036c852a0aa5?width=412"
  },
  {
    name: "Computers",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/4a25e8a2b689f4d8cf2f809de9e46f2c26c36d46?width=412"
  },
  {
    name: "Electronics",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/bb3de20fdb53760293d946ca033adbf4489bed56?width=412"
  },
  {
    name: "Home Appliances",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/f291940d1feaf8e5cb0a7335f629e12091d26a73?width=412"
  }
]

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { products, bestsellers, offers, qliqPlusDeals, featured, loading, error } = useSelector(state => state.products);
  const { brands, loading: brandsLoading, error: brandsError } = useSelector(state => state.brands);
  const { eshopStores, eshopNewStores, eshopTopStores, loading: storesLoading, error: storesError } = useSelector(state => state.stores);

  const swiperRef = useRef(null);
  const topStoresSwiperRef = useRef(null);
  const topBrandsSwiperRef = useRef(null);
  const bestsellersSwiperRef = useRef(null);
  const offersSwiperRef = useRef(null);
  const specialDealsSwiperRef = useRef(null);
  const featuredOffersSwiperRef = useRef(null);
  const [activeStoreFilter, setActiveStoreFilter] = useState('all');

  // Fetch products, brands, and e-shop stores on component mount
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchBrands());
    dispatch(fetchEshopStores());
  }, [dispatch]);

  // Transform API data for different sections
  const transformedProducts = products.map(transformProductData);
  const transformedBestsellers = bestsellers.map(transformProductData);
  const transformedOffers = offers.map(transformProductData);
  const transformedSpecialDeals = qliqPlusDeals.map(transformProductData);
  const transformedFeaturedOffers = featured.map(transformProductData);
  const transformedBrands = brands.map(transformBrandData);
  const transformedTopStores = eshopTopStores.map(transformStoreData);
  const transformedNewStores = eshopNewStores.map(transformStoreData);

  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const handleTopStoresPrev = () => {
    if (topStoresSwiperRef.current && topStoresSwiperRef.current.swiper) {
      topStoresSwiperRef.current.swiper.slidePrev();
    }
  };

  const handleTopStoresNext = () => {
    if (topStoresSwiperRef.current && topStoresSwiperRef.current.swiper) {
      topStoresSwiperRef.current.swiper.slideNext();
    }
  };

  const handleTopBrandsPrev = () => {
    if (topBrandsSwiperRef.current && topBrandsSwiperRef.current.swiper) {
      topBrandsSwiperRef.current.swiper.slidePrev();
    }
  };

  const handleTopBrandsNext = () => {
    if (topBrandsSwiperRef.current && topBrandsSwiperRef.current.swiper) {
      topBrandsSwiperRef.current.swiper.slideNext();
    }
  };

  const handleBestsellersPrev = () => {
    if (bestsellersSwiperRef.current && bestsellersSwiperRef.current.swiper) {
      bestsellersSwiperRef.current.swiper.slidePrev();
    }
  };

  const handleBestsellersNext = () => {
    if (bestsellersSwiperRef.current && bestsellersSwiperRef.current.swiper) {
      bestsellersSwiperRef.current.swiper.slideNext();
    }
  };

  const handleOffersPrev = () => {
    if (offersSwiperRef.current && offersSwiperRef.current.swiper) {
      offersSwiperRef.current.swiper.slidePrev();
    }
  };

  const handleOffersNext = () => {
    if (offersSwiperRef.current && offersSwiperRef.current.swiper) {
      offersSwiperRef.current.swiper.slideNext();
    }
  };

  const handleSpecialDealsPrev = () => {
    if (specialDealsSwiperRef.current && specialDealsSwiperRef.current.swiper) {
      specialDealsSwiperRef.current.swiper.slidePrev();
    }
  };

  const handleSpecialDealsNext = () => {
    if (specialDealsSwiperRef.current && specialDealsSwiperRef.current.swiper) {
      specialDealsSwiperRef.current.swiper.slideNext();
    }
  };

  const handleFeaturedOffersPrev = () => {
    if (featuredOffersSwiperRef.current && featuredOffersSwiperRef.current.swiper) {
      featuredOffersSwiperRef.current.swiper.slidePrev();
    }
  };

  const handleFeaturedOffersNext = () => {
    if (featuredOffersSwiperRef.current && featuredOffersSwiperRef.current.swiper) {
      featuredOffersSwiperRef.current.swiper.slideNext();
    }
  };

  const handleStoreFilter = (filter) => {
    setActiveStoreFilter(filter);
  };

  const handleSeeAllStores = () => {
    router.push('/store');
  };

  const handleSeeAllFeaturedOffers = () => {
    router.push('/ecommerce');
  };

  const getFilteredStores = () => {
    switch (activeStoreFilter) {
      case 'top':
        return transformedTopStores;
      case 'new':
        return transformedNewStores;
      default:
        return eshopStores.map(transformStoreData);
    }
  };

  return (
    <>
      <Navigation />
      <main className="home-page">
        {/* <QuickNav /> */}

        <Categories />
        <section className="section">
          <div className="container">
            <ImageSlider />
          </div>
        </section>

        {/* Bestsellers Section */}
        <section className="section">
          <div className="container">
            <SectionHeader
              title="Our Bestsellers"
              showNavigation={true}
              onPrev={handleBestsellersPrev}
              onNext={handleBestsellersNext}
            />
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                Loading products...
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                Error loading products: {error}
              </div>
            ) : (
              <Swiper
                ref={bestsellersSwiperRef}
                modules={[SwiperNavigation]}
                slidesPerView="auto"
                spaceBetween={24}
                grabCursor={true}
                freeMode={true}
                style={{ width: '1360px' }}
              >
                {transformedBestsellers.map((product, index) => (
                  <SwiperSlide key={product.id || index} style={{ width: 'auto' }}>
                    <ProductCard {...product} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </section>

        {/* Other Categories Section */}
        <section className="section">
          <div className="container">
            <SectionHeader title="Other Categories" showNavigation={true} />
            <div className="categories-grid">
              {categoryData.map((category, index) => (
                <CategoryCard key={index} {...category} />
              ))}
            </div>
          </div>
        </section>

        {/* Offers Section */}
        <section className="section">
          <div className="container">
            <SectionHeader
              title="Offers For You"
              showNavigation={true}
              onPrev={handleOffersPrev}
              onNext={handleOffersNext}
            />
            <Swiper
              ref={offersSwiperRef}
              modules={[SwiperNavigation]}
              slidesPerView="auto"
              spaceBetween={24}
              grabCursor={true}
              freeMode={true}
              style={{ width: '1360px' }}
            >
              {transformedOffers.map((product, index) => (
                <SwiperSlide key={product.id || index} style={{ width: 'auto' }}>
                  <ProductCard {...product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Special Deals Section */}
        <section className="section">
          <div className="container">
            <SectionHeader
              title="Special Deals For QLIQ+"
              showNavigation={true}
              showButton={true}
              buttonText="Upgrade"
              onPrev={handleSpecialDealsPrev}
              onNext={handleSpecialDealsNext}
            />
            <Swiper
              ref={specialDealsSwiperRef}
              modules={[SwiperNavigation]}
              slidesPerView="auto"
              spaceBetween={24}
              grabCursor={true}
              freeMode={true}
              style={{ width: '1360px' }}
            >
              {transformedSpecialDeals.map((product, index) => (
                <SwiperSlide key={product.id || index} style={{ width: 'auto' }}>
                  <ProductCard {...product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Top Brands Section */}
        <section className="section">
          <div className="container">
            <SectionHeader
              title="Top Brands"
              showNavigation={true}
              onPrev={handleTopBrandsPrev}
              onNext={handleTopBrandsNext}
            />
            {brandsLoading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                Loading brands...
              </div>
            ) : brandsError ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                Error loading brands: {brandsError}
              </div>
            ) : (
              <Swiper
                ref={topBrandsSwiperRef}
                modules={[SwiperNavigation]}
                slidesPerView="auto"
                spaceBetween={24}
                grabCursor={true}
                freeMode={true}
                style={{ width: '1360px' }}
              >
                {transformedBrands.map((brand, index) => (
                  <SwiperSlide key={brand.name || index} style={{ width: 'auto' }}>
                    <CategoryCard {...brand} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </section>

        {/* Featured Offers Section */}
        <section className="section">
          <div className="container">
            <SectionHeader
              title="Featured Offers"
              showNavigation={true}
              showButton={true}
              buttonText="See All"
              onButtonClick={handleSeeAllFeaturedOffers}
              onPrev={handleFeaturedOffersPrev}
              onNext={handleFeaturedOffersNext}
            />
            <Swiper
              ref={featuredOffersSwiperRef}
              modules={[SwiperNavigation]}
              slidesPerView="auto"
              spaceBetween={24}
              grabCursor={true}
              freeMode={true}
              style={{ width: '1360px' }}
            >
              {transformedFeaturedOffers.map((product, index) => (
                <SwiperSlide key={product.id || index} style={{ width: 'auto' }}>
                  <ProductCard {...product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Top Stores Section */}
        <section className="section">
          <div className="container">
            <SectionHeader
              title="Top Stores"
              showNavigation={true}
              showButton={true}
              buttonText={"See All"}
              onButtonClick={handleSeeAllStores}
              onPrev={handleTopStoresPrev}
              onNext={handleTopStoresNext}
            />
            {storesLoading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                Loading stores...
              </div>
            ) : storesError ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                Error loading stores: {storesError}
              </div>
            ) : (
              <Swiper
                ref={topStoresSwiperRef}
                modules={[SwiperNavigation]}
                slidesPerView="auto"
                spaceBetween={24}
                grabCursor={true}
                freeMode={true}
                style={{ width: '1360px' }}
              >
                {transformedTopStores.map((store, index) => (
                  <SwiperSlide key={store.name || index} style={{ width: 'auto' }}>
                    <CategoryCard name={store.name} image={store.image} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </section>

        {/* New Stores Section */}
        <section className="section">
          <div className="container">
            <SectionHeader
              title="New Stores on QLIQ"
              showNavigation={true}
              onPrev={handlePrev}
              onNext={handleNext}
            />
            {storesLoading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                Loading stores...
              </div>
            ) : storesError ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                Error loading stores: {storesError}
              </div>
            ) : (
              <Swiper
                ref={swiperRef}
                modules={[SwiperNavigation]}
                slidesPerView="auto"
                spaceBetween={24}
                grabCursor={true}
                freeMode={true}
                style={{ width: '1360px' }}
              >
                {transformedNewStores.reverse().map((store, index) => (
                  <SwiperSlide key={store.name || index} style={{ width: 'auto' }}>
                    <CategoryCard name={store.name} image={store.image} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </section>
        
        <Footer />
        {/* Test Authentication Link */}
      </main>
    </>
  )
}
