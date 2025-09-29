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
import { fetchStores } from '@/store/slices/storesSlice'
import { fetchPopularCategories, fetchLevel2Categories } from '@/store/slices/categoriesSlice'
import { ProductCardSkeleton, CategoryCardSkeleton } from '@/components/SkeletonLoader'

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
    image: apiBrand.logo || 'https://api.builder.io/api/v1/image/assets/TEMP/12ba4121022e746495773eb8df2e6b4add90148f?width=412',
    slug: apiBrand.slug || apiBrand.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }
}

// Helper function to transform API store data to match CategoryCard component format
const transformStoreData = (apiStore) => {
  return {
    id: apiStore._id,
    name: apiStore.name || 'Store Name',
    slug: apiStore.slug || apiStore.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    image: apiStore.logo || 'https://api.builder.io/api/v1/image/assets/TEMP/12ba4121022e746495773eb8df2e6b4add90148f?width=412'
  }
}

// Helper function to transform API popular category data to match CategoryCard component format
const transformPopularCategoryData = (apiCategory) => {
  console.log('Transforming category:', apiCategory)
  
  // Use a placeholder image since the API doesn't provide category images
  const placeholderImages = [
    'https://api.builder.io/api/v1/image/assets/TEMP/b96c7d3062a93a3b6d8e9a2a4bd11acfa542dced?width=412',
    'https://api.builder.io/api/v1/image/assets/TEMP/81e3ee1beeaa2c8941600c27d3ec9733bac0869c?width=412',
    'https://api.builder.io/api/v1/image/assets/TEMP/5839901b9e3641626fef47388dc1036c852a0aa5?width=412',
    'https://api.builder.io/api/v1/image/assets/TEMP/4a25e8a2b689f4d8cf2f809de9e46f2c26c36d46?width=412',
    'https://api.builder.io/api/v1/image/assets/TEMP/bb3de20fdb53760293d946ca033adbf4489bed56?width=412',
    'https://api.builder.io/api/v1/image/assets/TEMP/f291940d1feaf8e5cb0a7335f629e12091d26a73?width=412'
  ]
  
  // Use a simple hash of the category name to consistently assign the same image
  const hash = apiCategory.name.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  const imageIndex = Math.abs(hash) % placeholderImages.length
  
  const transformed = {
    name: apiCategory.name || 'Category Name',
    image: placeholderImages[imageIndex],
    slug: apiCategory.slug || apiCategory.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }
  
  console.log('Transformed category:', transformed)
  return transformed
}

const categoryData = [
  {
    name: "Pet Supplies",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/b96c7d3062a93a3b6d8e9a2a4bd11acfa542dced?width=412",
    slug: "pet-supplies"
  },
  {
    name: "Health n Beauty",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/81e3ee1beeaa2c8941600c27d3ec9733bac0869c?width=412",
    slug: "health-beauty"
  },
  {
    name: "Books",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/5839901b9e3641626fef47388dc1036c852a0aa5?width=412",
    slug: "books"
  },
  {
    name: "Computers",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/4a25e8a2b689f4d8cf2f809de9e46f2c26c36d46?width=412",
    slug: "computers"
  },
  {
    name: "Electronics",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/bb3de20fdb53760293d946ca033adbf4489bed56?width=412",
    slug: "electronics"
  },
  {
    name: "Home Appliances",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/f291940d1feaf8e5cb0a7335f629e12091d26a73?width=412",
    slug: "home-appliances"
  }
]

const brandData = [
  {
    name: "Samsung",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/12ba4121022e746495773eb8df2e6b4add90148f?width=412"
  },
  {
    name: "Nike",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/5944fb96605e58c0b0a225611b6e462119c6f6bd?width=412"
  },
  {
    name: "Apple",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/66b97f6957f6e465c502e41a9cda2d8b72cc8817?width=412"
  },
  {
    name: "Sony",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/31e4e4b864102352c5e9e341e72064d8251f7320?width=412"
  },
  {
    name: "Nothing",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/0c4ed4c2cd24b5e148c3022cb0106476b3b63754?width=412"
  },
  {
    name: "Samsung",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/12ba4121022e746495773eb8df2e6b4add90148f?width=412"
  },
  {
    name: "Nothing",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/0c4ed4c2cd24b5e148c3022cb0106476b3b63754?width=412"
  },
  {
    name: "OnePlus",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/b6331ae52c82eb8a247a99158e1d71d242182070?width=412"
  }
]

const storeData = [
  {
    id: "store-1",
    name: "TechHub Electronics",
    category: "Electronics",
    rating: "4.8",
    deliveryTime: "45 Min",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/12ba4121022e746495773eb8df2e6b4add90148f?width=412",
    location: "Dubai Mall",
    isTopStore: true,
    isNewStore: false
  },
  {
    id: "store-2",
    name: "Fashion Forward",
    category: "Fashion",
    rating: "4.6",
    deliveryTime: "30 Min",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/5944fb96605e58c0b0a225611b6e462119c6f6bd?width=412",
    location: "Marina Walk",
    isTopStore: true,
    isNewStore: false
  },
  {
    id: "store-3",
    name: "Home & Garden Plus",
    category: "Home & Garden",
    rating: "4.7",
    deliveryTime: "60 Min",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/66b97f6957f6e465c502e41a9cda2d8b72cc8817?width=412",
    location: "JBR",
    isTopStore: true,
    isNewStore: false
  },
  {
    id: "store-4",
    name: "Sports Central",
    category: "Sports",
    rating: "4.5",
    deliveryTime: "40 Min",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/31e4e4b864102352c5e9e341e72064d8251f7320?width=412",
    location: "Downtown",
    isTopStore: true,
    isNewStore: false
  },
  {
    id: "store-5",
    name: "Beauty Essentials",
    category: "Beauty",
    rating: "4.9",
    deliveryTime: "25 Min",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/0c4ed4c2cd24b5e148c3022cb0106476b3b63754?width=412",
    location: "City Centre",
    isTopStore: true,
    isNewStore: false
  },
  {
    id: "store-6",
    name: "Gourmet Delights",
    category: "Food",
    rating: "4.4",
    deliveryTime: "35 Min",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/b6331ae52c82eb8a247a99158e1d71d242182070?width=412",
    location: "DIFC",
    isTopStore: true,
    isNewStore: false
  },
  {
    id: "store-7",
    name: "Bookworm Paradise",
    category: "Books",
    rating: "4.3",
    deliveryTime: "50 Min",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/12ba4121022e746495773eb8df2e6b4add90148f?width=412",
    location: "Knowledge Village",
    isTopStore: false,
    isNewStore: true
  },
  {
    id: "store-8",
    name: "Pet Care Plus",
    category: "Pet Supplies",
    rating: "4.6",
    deliveryTime: "45 Min",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/5944fb96605e58c0b0a225611b6e462119c6f6bd?width=412",
    location: "Jumeirah",
    isTopStore: false,
    isNewStore: true
  }
]

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { products, bestsellers, offers, qliqPlusDeals, featured, loading, error } = useSelector(state => state.products);
  const { brands, loading: brandsLoading, error: brandsError } = useSelector(state => state.brands);
  const { stores, topStores, newStores, loading: storesLoading, error: storesError } = useSelector(state => state.stores);
  const { popularCategories, level2Categories, loading: popularCategoriesLoading, error: popularCategoriesError } = useSelector(state => state.categories);

  const swiperRef = useRef(null);
  const topStoresSwiperRef = useRef(null);
  const topBrandsSwiperRef = useRef(null);
  const bestsellersSwiperRef = useRef(null);
  const offersSwiperRef = useRef(null);
  const specialDealsSwiperRef = useRef(null);
  const featuredOffersSwiperRef = useRef(null);
  const popularCategoriesSwiperRef = useRef(null);
  const otherCategoriesSwiperRef = useRef(null);
  const [activeStoreFilter, setActiveStoreFilter] = useState('all');

  // Fetch products, brands, stores, and categories on component mount
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchBrands());
    dispatch(fetchStores());
    dispatch(fetchPopularCategories());
    dispatch(fetchLevel2Categories());
  }, [dispatch]);

  // Transform API data for different sections
  const transformedProducts = products.map(transformProductData);
  const transformedBestsellers = bestsellers.map(transformProductData);
  const transformedOffers = offers.map(transformProductData);
  const transformedSpecialDeals = qliqPlusDeals.map(transformProductData);
  const transformedFeaturedOffers = featured.map(transformProductData);
  const transformedBrands = brands.map(transformBrandData);
  const transformedTopStores = topStores.map(transformStoreData);
  const transformedNewStores = newStores.map(transformStoreData);
  const transformedPopularCategories = popularCategories.map(transformPopularCategoryData);
  const transformedLevel2Categories = level2Categories.map(transformPopularCategoryData);

  // Debug logging for categories
  console.log('Popular Categories Data:', popularCategories);
  console.log('Transformed Popular Categories:', transformedPopularCategories);
  console.log('Level 2 Categories Data:', level2Categories);
  console.log('Transformed Level 2 Categories:', transformedLevel2Categories);
  console.log('Categories Loading:', popularCategoriesLoading);
  console.log('Categories Error:', popularCategoriesError);

  // Temporary test data to verify rendering works
  const testCategories = [
    { name: "Dairy & Eggs", image: "https://api.builder.io/api/v1/image/assets/TEMP/b96c7d3062a93a3b6d8e9a2a4bd11acfa542dced?width=412" },
    { name: "Electronics", image: "https://api.builder.io/api/v1/image/assets/TEMP/81e3ee1beeaa2c8941600c27d3ec9733bac0869c?width=412" },
    { name: "Fashion", image: "https://api.builder.io/api/v1/image/assets/TEMP/5839901b9e3641626fef47388dc1036c852a0aa5?width=412" }
  ];

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

  const handlePopularCategoriesPrev = () => {
    if (popularCategoriesSwiperRef.current && popularCategoriesSwiperRef.current.swiper) {
      popularCategoriesSwiperRef.current.swiper.slidePrev();
    }
  };

  const handlePopularCategoriesNext = () => {
    if (popularCategoriesSwiperRef.current && popularCategoriesSwiperRef.current.swiper) {
      popularCategoriesSwiperRef.current.swiper.slideNext();
    }
  };

  const handleOtherCategoriesPrev = () => {
    if (otherCategoriesSwiperRef.current && otherCategoriesSwiperRef.current.swiper) {
      otherCategoriesSwiperRef.current.swiper.slidePrev();
    }
  };

  const handleOtherCategoriesNext = () => {
    if (otherCategoriesSwiperRef.current && otherCategoriesSwiperRef.current.swiper) {
      otherCategoriesSwiperRef.current.swiper.slideNext();
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

  const handleCategoryClick = (category) => {
    // Use the slug from the API data or create a slug from the name
    const slug = category.slug || category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    router.push(`/category/${slug}`);
  };

  const handleBrandClick = (brand) => {
    // Use the slug from the API data or create a slug from the name
    const slug = brand.slug || brand.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    router.push(`/${slug}`);
  };

  const handleStoreClick = (store) => {
    // Use the slug from the API data or create a slug from the name
    const slug = store.slug || store.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    router.push(`/${slug}?storeId=${store.id}`);
  };

  const getFilteredStores = () => {
    switch (activeStoreFilter) {
      case 'top':
        return storeData.filter(store => store.isTopStore);
      case 'new':
        return storeData.filter(store => store.isNewStore);
      default:
        return storeData;
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
              <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
                {[...Array(4)].map((_, index) => (
                  <ProductCardSkeleton key={`skeleton-${index}`} />
                ))}
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
            <SectionHeader
              title="Other Categories"
              showNavigation={true}
              onPrev={handleOtherCategoriesPrev}
              onNext={handleOtherCategoriesNext}
            />
            {popularCategoriesLoading ? (
              <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
                {[...Array(6)].map((_, index) => (
                  <CategoryCardSkeleton key={`skeleton-${index}`} />
                ))}
              </div>
            ) : popularCategoriesError ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                Error loading categories: {popularCategoriesError}
              </div>
            ) : (transformedLevel2Categories.length > 0 || categoryData.length > 0) ? (
              <Swiper
                ref={otherCategoriesSwiperRef}
                modules={[SwiperNavigation]}
                slidesPerView="auto"
                spaceBetween={24}
                grabCursor={true}
                freeMode={true}
                style={{ width: '1360px' }}
              >
                {(transformedLevel2Categories.length > 0 ? transformedLevel2Categories : categoryData).map((category, index) => (
                  <SwiperSlide key={category.name || index} style={{ width: 'auto' }}>
                    <CategoryCard {...category} onClick={() => handleCategoryClick(category)} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                No categories available at the moment.
              </div>
            )}
          </div>
        </section>

        {/* Banner 1 */}
        <Banner
          title="How To Refer & Earn on QLIQ"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis."
          buttonText="Learn More"
          backgroundImage="https://api.builder.io/api/v1/image/assets/TEMP/df43c644b630e11e75c5cfa0820db4ef46176c34?width=2720"
        />

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

        {/* Banner 2 */}
        <Banner
          title="How To Pay Using Qoyns"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis."
          buttonText="Learn More"
          backgroundImage="https://api.builder.io/api/v1/image/assets/TEMP/30138089958b1dd1eb8be111e17374ed71a2b6c7?width=2720"
        />

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
              <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
                {[...Array(6)].map((_, index) => (
                  <CategoryCardSkeleton key={`skeleton-${index}`} />
                ))}
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
                    <CategoryCard {...brand} onClick={() => handleBrandClick(brand)} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </section>

        {/* Popular Categories Section */}
        <section className="section">
          <div className="container">
            <SectionHeader
              title="Popular Categories"
              showNavigation={true}
              onPrev={handlePopularCategoriesPrev}
              onNext={handlePopularCategoriesNext}
            />
            {popularCategoriesLoading ? (
              <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
                {[...Array(6)].map((_, index) => (
                  <CategoryCardSkeleton key={`skeleton-${index}`} />
                ))}
              </div>
            ) : popularCategoriesError ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                Error loading popular categories: {popularCategoriesError}
              </div>
            ) : (transformedPopularCategories.length > 0 || testCategories.length > 0) ? (
              <Swiper
                ref={popularCategoriesSwiperRef}
                modules={[SwiperNavigation]}
                slidesPerView="auto"
                spaceBetween={24}
                grabCursor={true}
                freeMode={true}
                style={{ width: '1360px' }}
              >
                {(transformedPopularCategories.length > 0 ? transformedPopularCategories : testCategories).map((category, index) => (
                  <SwiperSlide key={category.name || index} style={{ width: 'auto' }}>
                    <CategoryCard {...category} onClick={() => handleCategoryClick(category)} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                No popular categories available at the moment.
              </div>
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
              <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
                {[...Array(6)].map((_, index) => (
                  <CategoryCardSkeleton key={`skeleton-${index}`} />
                ))}
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

        {/* Banner 3 */}
        <Banner
          title="How To Save on QLIQ"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis."
          buttonText="Learn More"
          backgroundImage="https://api.builder.io/api/v1/image/assets/TEMP/5f1b6b2bdfa8e9703d7d31aedb5e297922c9a082?width=2720"
        />

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
              <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
                {[...Array(6)].map((_, index) => (
                  <CategoryCardSkeleton key={`skeleton-${index}`} />
                ))}
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

        {/* Banner 4 */}
        <Banner
          title="How To Earn Doing a GIG"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis."
          buttonText="Learn More"
          backgroundImage="https://api.builder.io/api/v1/image/assets/TEMP/f70eb37fe9b38478a141ee9536f057811ff47ace?width=2720"
        />

        {/* FAQ Section */}
        <FAQ />

        {/* Final Banner */}
        <Banner
          title="Become a Vendor"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis."
          buttonText="Learn More"
          backgroundImage="https://api.builder.io/api/v1/image/assets/TEMP/c1726d63175ccf7d26ef79e2d2a0ffde926ef9d0?width=2720"
        />
        <Footer />
        {/* Test Authentication Link */}
      </main>
    </>
  )
}
