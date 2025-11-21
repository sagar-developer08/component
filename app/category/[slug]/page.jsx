'use client'

import { useRouter, useParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation as SwiperNavigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import Navigation from '@/components/Navigation'
import ProductCard from '@/components/ProductCard'
import CategoryCard from '@/components/CategoryCard'
import SectionHeader from '@/components/SectionHeader'
import Footer from '@/components/Footer'
import { fetchCategoryChildren, fetchHypermarketLevel2Categories, fetchSupermarketLevel2Categories } from '@/store/slices/categoriesSlice'
import { fetchProductsByStoreSlug, clearStoreSlugProducts } from '@/store/slices/productsSlice'
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

// Helper function to transform API category data to match CategoryCard component format
const transformCategoryData = (apiCategory) => {
  // Use placeholder images as fallback if icon is not provided
  const placeholderImages = [
    'https://api.builder.io/api/v1/image/assets/TEMP/b96c7d3062a93a3b6d8e9a2a4bd11acfa542dced?width=412',
    'https://api.builder.io/api/v1/image/assets/TEMP/81e3ee1beeaa2c8941600c27d3ec9733bac0869c?width=412',
    'https://api.builder.io/api/v1/image/assets/TEMP/5839901b9e3641626fef47388dc1036c852a0aa5?width=412',
    'https://api.builder.io/api/v1/image/assets/TEMP/4a25e8a2b689f4d8cf2f809de9e46f2c26c36d46?width=412',
    'https://api.builder.io/api/v1/image/assets/TEMP/bb3de20fdb53760293d946ca033adbf4489bed56?width=412',
    'https://api.builder.io/api/v1/image/assets/TEMP/f291940d1feaf8e5cb0a7335f629e12091d26a73?width=412'
  ]

  // Use icon from database if available, otherwise use placeholder
  let categoryImage = apiCategory.icon;
  
  // If no icon from database, use hash-based placeholder assignment
  if (!categoryImage) {
    const hash = apiCategory.name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    const imageIndex = Math.abs(hash) % placeholderImages.length
    categoryImage = placeholderImages[imageIndex]
  }

  return {
    id: apiCategory._id,
    name: apiCategory.name || 'Category Name',
    image: categoryImage,
    slug: apiCategory.slug || apiCategory.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    level: apiCategory.level
  }
}

// Static product data for fallback
const productData = [
  {
    id: "nike-airforce-01",
    title: "Vorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: "AED 1,600",
    rating: "4.0",
    deliveryTime: "30 Min",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/0ef2d416817956be0fe96760f14cbb67e415a446?width=644"
  },
  {
    id: "nike-dunk-low",
    title: "Vorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: "AED 1,600",
    rating: "4.0",
    deliveryTime: "30 Min",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/0ef2d416817956be0fe96760f14cbb67e415a446?width=644"
  },
  {
    id: "nike-air-max",
    title: "Vorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: "AED 1,600",
    rating: "4.0",
    deliveryTime: "30 Min",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/0ef2d416817956be0fe96760f14cbb67e415a446?width=644"
  },
  {
    id: "nike-airforce-01-black",
    title: "Vorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: "AED 1,600",
    rating: "4.0",
    deliveryTime: "30 Min",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/0ef2d416817956be0fe96760f14cbb67e415a446?width=644"
  }
]

export default function CategoryPage() {
  const router = useRouter()
  const params = useParams()
  const dispatch = useDispatch()
  const slug = params.slug

  const { categoryChildren, hypermarketLevel2Categories, supermarketLevel2Categories, loading, error } = useSelector(state => state.categories)
  const { storeSlugProducts, storeSlugProductsLoading, storeSlugProductsError } = useSelector(state => state.products)
  
  const [categoryInfo, setCategoryInfo] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isStoreSlug, setIsStoreSlug] = useState(false)
  
  // Determine if this is actually a store slug based on data presence
  // Note: Redux stores action.payload.data directly in storeSlugProducts
  const isActuallyStoreSlug = !!storeSlugProducts?.store
  
  // Determine loading state - loading if either category or store is loading
  const isLoading = loading || storeSlugProductsLoading
  // Determine error state - show error if category failed and it's not a store, or if store failed and it is a store
  const hasError = (isActuallyStoreSlug && storeSlugProductsError) || (!isActuallyStoreSlug && error)

  // Swiper refs
  const bestsellersSwiperRef = useRef(null)
  const offersSwiperRef = useRef(null)
  const newArrivalsSwiperRef = useRef(null)
  const otherCategoriesSwiperRef = useRef(null)

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

  // First, try to fetch products by store slug
  useEffect(() => {
    if (slug) {
      // Try to fetch products by store slug first
      dispatch(fetchProductsByStoreSlug({ storeSlug: slug, limit: 100 }))
        .then((result) => {
          if (result.meta.requestStatus === 'fulfilled' && result.payload?.success && result.payload?.data?.store) {
            // It's a store slug
            setIsStoreSlug(true)
            setCategoryInfo({
              name: result.payload.data.store.name,
              description: result.payload.data.store.description || 'Browse all products from this store'
            })
          } else {
            // Not a store slug, fetch category children
            setIsStoreSlug(false)
            dispatch(fetchCategoryChildren(slug))
          }
        })
        .catch(() => {
          // Error fetching store, try category instead
          setIsStoreSlug(false)
          dispatch(fetchCategoryChildren(slug))
        })
      
      // Also fetch hypermarket and supermarket level 2 categories
      dispatch(fetchHypermarketLevel2Categories())
      dispatch(fetchSupermarketLevel2Categories())
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearStoreSlugProducts())
    }
  }, [dispatch, slug])

  // Update isStoreSlug when storeSlugProducts data loads
  useEffect(() => {
    if (storeSlugProducts?.store) {
      setIsStoreSlug(true)
      setCategoryInfo({
        name: storeSlugProducts.store.name,
        description: storeSlugProducts.store.description || 'Browse all products from this store'
      })
    }
  }, [storeSlugProducts])

  // Update category info when category children data is loaded (only if not a store)
  useEffect(() => {
    if (!isStoreSlug && categoryChildren?.data?.category) {
      setCategoryInfo(categoryChildren.data.category)
    }
  }, [categoryChildren, isStoreSlug])

  // Transform API data - use store products if it's a store slug, otherwise use category children
  // Note: Redux stores action.payload.data directly in storeSlugProducts, so we access it directly
  const getProductsForSection = (sectionName) => {
    // Check if we have store slug products (storeSlugProducts is already the data object)
    if (storeSlugProducts?.store && storeSlugProducts?.productsByCategory) {
      // Use products from store slug
      const sectionProducts = storeSlugProducts.productsByCategory[sectionName] || []
      if (sectionProducts.length > 0) {
        return sectionProducts.map(transformProductData)
      }
    }
    
    // Fall back to category children if no store products
    if (categoryChildren?.data?.products) {
      const sectionProducts = categoryChildren.data.products[sectionName] || []
      if (sectionProducts.length > 0) {
        return sectionProducts.map(transformProductData)
      }
    }
    
    return []
  }

  const transformedBestsellers = getProductsForSection('bestsellers') || []
  const transformedOffers = getProductsForSection('offers') || []
  const transformedNewArrivals = getProductsForSection('newArrivals') || []

  // Get all products if it's a store slug for displaying in a grid
  const allStoreProducts = (storeSlugProducts?.success && storeSlugProducts?.data?.products)
    ? storeSlugProducts.data.products.map(transformProductData)
    : []
  
  // Use hypermarket or supermarket level 2 categories if available, otherwise use category children level4Categories
  const categoriesToDisplay = (hypermarketLevel2Categories && hypermarketLevel2Categories.length > 0)
    ? hypermarketLevel2Categories.map(transformCategoryData)
    : (supermarketLevel2Categories && supermarketLevel2Categories.length > 0)
    ? supermarketLevel2Categories.map(transformCategoryData)
    : (categoryChildren?.data?.level4Categories?.map(transformCategoryData) || [])
  
  const transformedCategories = categoriesToDisplay

  const handleBack = () => {
    router.push('/')
  }

  const handleCategoryClick = (category) => {
    // Use the slug from the API data or create a slug from the name
    const slug = category.slug || category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    // For level 2 categories (hypermarket), navigate to category page
    // For level 4 categories, navigate to the slug page
    if (category.level === 2) {
      router.push(`/category/${slug}`);
    } else {
      router.push(`/${slug}?categoryLevel=4`);
    }
  }

  // Navigation handlers for swipers
  const handleBestsellersPrev = () => {
    if (bestsellersSwiperRef.current && bestsellersSwiperRef.current.swiper) {
      bestsellersSwiperRef.current.swiper.slidePrev()
    }
  }

  const handleBestsellersNext = () => {
    if (bestsellersSwiperRef.current && bestsellersSwiperRef.current.swiper) {
      bestsellersSwiperRef.current.swiper.slideNext()
    }
  }

  const handleOffersPrev = () => {
    if (offersSwiperRef.current && offersSwiperRef.current.swiper) {
      offersSwiperRef.current.swiper.slidePrev()
    }
  }

  const handleOffersNext = () => {
    if (offersSwiperRef.current && offersSwiperRef.current.swiper) {
      offersSwiperRef.current.swiper.slideNext()
    }
  }

  const handleNewArrivalsPrev = () => {
    if (newArrivalsSwiperRef.current && newArrivalsSwiperRef.current.swiper) {
      newArrivalsSwiperRef.current.swiper.slidePrev()
    }
  }

  const handleNewArrivalsNext = () => {
    if (newArrivalsSwiperRef.current && newArrivalsSwiperRef.current.swiper) {
      newArrivalsSwiperRef.current.swiper.slideNext()
    }
  }

  const handleProductsPrev = () => {
    if (productsSwiperRef.current && productsSwiperRef.current.swiper) {
      productsSwiperRef.current.swiper.slidePrev()
    }
  }

  const handleProductsNext = () => {
    if (productsSwiperRef.current && productsSwiperRef.current.swiper) {
      productsSwiperRef.current.swiper.slideNext()
    }
  }
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

  return (
    <main className="home-page">
      <Navigation />

      {/* Category Banner Section */}
      <section className="section">
        <div className="banner-container">
          <div className="banner-section">
            <div className="banner-content">
              {/* <button className="banner-back-btn" onClick={handleBack}>
                Back
              </button> */}
              <div className="banner-info">
                <div className="banner-title">
                  {categoryInfo?.name || storeSlugProducts?.store?.name || slug?.toUpperCase() || 'CATEGORY'}
                </div>
                <div className="banner-desc">
                  {categoryInfo?.description || storeSlugProducts?.store?.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.'}
                </div>
              </div>
              {/* <button className="banner-follow-btn">Follow</button> */}
            </div>
          </div>
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
           {isLoading ? (
             <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
               {[...Array(6)].map((_, index) => (
                 <CategoryCardSkeleton key={`skeleton-${index}`} />
               ))}
             </div>
           ) : hasError ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
              Error loading {isActuallyStoreSlug ? 'store' : 'categories'}: {hasError}
            </div>
          ) : transformedCategories.length > 0 ? (
            <Swiper
              ref={otherCategoriesSwiperRef}
              modules={[SwiperNavigation]}
              slidesPerView={isMobile ? 2.08 : 'auto'}
              spaceBetween={isMobile ? 12 : 24}
              grabCursor={true}
              freeMode={true}
              className="other-categories-swiper"
            >
              {transformedCategories.map((category, index) => (
                <SwiperSlide key={category.name || index} style={{ width: 'auto' }}>
                  <CategoryCard {...category} onClick={() => handleCategoryClick(category)} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              No categories to Display
            </div>
          )}
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
          {isLoading ? (
            <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
              {[...Array(4)].map((_, index) => (
                <ProductCardSkeleton key={`skeleton-${index}`} />
              ))}
            </div>
          ) : hasError ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
              Error loading products: {error}
            </div>
          ) : (transformedBestsellers.length > 0 || allStoreProducts.length > 0) ? (
            <Swiper
              ref={bestsellersSwiperRef}
              modules={[SwiperNavigation]}
              slidesPerView="auto"
              spaceBetween={24}
              grabCursor={true}
              freeMode={true}
              style={{ width: '1360px' }}
            >
              {(transformedBestsellers.length > 0 ? transformedBestsellers : allStoreProducts.slice(0, 20)).map((product, index) => (
                <SwiperSlide key={product.id || index} style={{ width: 'auto' }}>
                  <ProductCard {...product} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              No bestsellers available at the moment.
            </div>
          )}
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
          {isLoading ? (
            <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
              {[...Array(4)].map((_, index) => (
                <ProductCardSkeleton key={`skeleton-${index}`} />
              ))}
            </div>
          ) : hasError ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
              Error loading products: {error}
            </div>
          ) : (transformedOffers.length > 0 || allStoreProducts.length > 0) ? (
            <Swiper
              ref={offersSwiperRef}
              modules={[SwiperNavigation]}
              slidesPerView="auto"
              spaceBetween={24}
              grabCursor={true}
              freeMode={true}
              style={{ width: '1360px' }}
            >
              {(transformedOffers.length > 0 ? transformedOffers : allStoreProducts.slice(20, 40)).map((product, index) => (
                <SwiperSlide key={product.id || index} style={{ width: 'auto' }}>
                  <ProductCard {...product} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              No offers available at the moment.
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="section">
        <div className="container">
          <SectionHeader
            title="New Arrivals"
            showNavigation={true}
            onPrev={handleNewArrivalsPrev}
            onNext={handleNewArrivalsNext}
          />
          {isLoading ? (
            <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
              {[...Array(4)].map((_, index) => (
                <ProductCardSkeleton key={`skeleton-${index}`} />
              ))}
            </div>
          ) : hasError ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
              Error loading products: {hasError}
            </div>
          ) : (transformedNewArrivals.length > 0 || allStoreProducts.length > 0) ? (
            <Swiper
              ref={newArrivalsSwiperRef}
              modules={[SwiperNavigation]}
              slidesPerView="auto"
              spaceBetween={24}
              grabCursor={true}
              freeMode={true}
              style={{ width: '1360px' }}
            >
              {(transformedNewArrivals.length > 0 ? transformedNewArrivals : allStoreProducts.slice(40, 60)).map((product, index) => (
                <SwiperSlide key={product.id || index} style={{ width: 'auto' }}>
                  <ProductCard {...product} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              No new arrivals available at the moment.
            </div>
          )}
        </div>
      </section>


      <Footer />

      <style jsx>{`
        .banner-container {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 0px 24px;
          box-sizing: border-box;
          position: relative;
        }
        
        .banner-section {
          width: 100%;
          max-width: 1360px;
          height: 324px;
          position: relative;
          border-radius: 24px;
          overflow: hidden;
        }

        .banner-content {
          display: flex;
          width: 100%;
          height: 324px;
          flex-direction: row;
          justify-content: space-between;
          align-items: flex-end;
          border-radius: 24px;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.60) 100%), 
                      url('/2.jpg') lightgray 50% / cover no-repeat;
          padding: 0 48px 40px 48px;
          box-sizing: border-box;
          position: relative;
        }
        
        .banner-back-btn {
          background: #fff;
          color: #111;
          font-size: 18px;
          font-weight: 600;
          border: none;
          border-radius: 24px;
          padding: 12px 36px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          transition: background 0.2s;
          position: absolute;
          top: 24px;
          left: 48px;
          z-index: 10;
        }
        
        .banner-back-btn:hover {
          background: #f0f0f0;
        }
        
        .banner-info {
          display: flex;
          flex-direction: column;
          gap: 18px;
          position: relative;
        }
        
        .banner-title {
          font-size: 32px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
        }
        
        .banner-desc {
          font-size: 18px;
          color: #fff;
          font-weight: 500;
          max-width: 600px;
          line-height: 1.5;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
        }
        
        .banner-follow-btn {
          background: #fff;
          color: #111;
          font-size: 18px;
          font-weight: 600;
          border: none;
          border-radius: 24px;
          padding: 12px 36px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          transition: background 0.2s;
        }
        
        .banner-follow-btn:hover {
          background: #f0f0f0;
        }
        
        .swiper-container {
          width: 100%;
          overflow: hidden;
        }
        
        .swiper-slide {
          width: auto !important;
          flex-shrink: 0;
        }
        
        @media (max-width: 900px) {
          .banner-content {
            flex-direction: column;
            align-items: flex-start;
            padding: 0 24px 24px 24px;
          }
          
          .banner-back-btn {
            left: 24px;
          }
          
          .banner-follow-btn {
            margin-top: 24px;
          }
        }
      `}</style>
    </main>
  )
}