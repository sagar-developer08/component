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
import { fetchCategoryChildren } from '@/store/slices/categoriesSlice'
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

  return {
    name: apiCategory.name || 'Category Name',
    image: placeholderImages[imageIndex]
  }
}

// Static category data for fallback
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

  const { categoryChildren, loading, error } = useSelector(state => state.categories)
  const [categoryInfo, setCategoryInfo] = useState(null)

  // Swiper refs
  const bestsellersSwiperRef = useRef(null)
  const offersSwiperRef = useRef(null)
  const newArrivalsSwiperRef = useRef(null)
  const otherCategoriesSwiperRef = useRef(null)

  // Fetch category children when component mounts or slug changes
  useEffect(() => {
    if (slug) {
      dispatch(fetchCategoryChildren(slug))
    }
  }, [dispatch, slug])

  // Update category info when data is loaded
  useEffect(() => {
    if (categoryChildren?.data?.category) {
      setCategoryInfo(categoryChildren.data.category)
    }
  }, [categoryChildren])

  // Transform API data
  const transformedBestsellers = categoryChildren?.data?.products?.bestsellers?.map(transformProductData) || productData
  const transformedOffers = categoryChildren?.data?.products?.offers?.map(transformProductData) || productData
  const transformedNewArrivals = categoryChildren?.data?.products?.newArrivals?.map(transformProductData) || productData
  const transformedCategories = categoryChildren?.data?.level4Categories?.map(transformCategoryData) || categoryData

  const handleBack = () => {
    router.push('/')
  }

  const handleCategoryClick = (category) => {
    // Use the slug from the API data or create a slug from the name
    const slug = category.slug || category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    router.push(`/category/${slug}`);
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
              <button className="banner-back-btn" onClick={handleBack}>
                Back
              </button>
              <div className="banner-info">
                <div className="banner-title">
                  {categoryInfo?.name || slug?.toUpperCase() || 'CATEGORY'}
                </div>
                <div className="banner-desc">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
                </div>
              </div>
              <button className="banner-follow-btn">Follow</button>
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
           {loading ? (
             <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
               {[...Array(6)].map((_, index) => (
                 <CategoryCardSkeleton key={`skeleton-${index}`} />
               ))}
             </div>
           ) : error ? (
             <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
               Error loading categories: {error}
             </div>
          ) : (transformedCategories.length > 0 || categoryData.length > 0) ? (
            <Swiper
              ref={otherCategoriesSwiperRef}
              modules={[SwiperNavigation]}
              slidesPerView="auto"
              spaceBetween={24}
              grabCursor={true}
              freeMode={true}
              style={{ width: '1360px' }}
            >
              {(transformedCategories.length > 0 ? transformedCategories : categoryData).map((category, index) => (
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
          ) : transformedBestsellers.length > 0 ? (
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
          ) : transformedOffers.length > 0 ? (
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
          ) : transformedNewArrivals.length > 0 ? (
            <Swiper
              ref={newArrivalsSwiperRef}
              modules={[SwiperNavigation]}
              slidesPerView="auto"
              spaceBetween={24}
              grabCursor={true}
              freeMode={true}
              style={{ width: '1360px' }}
            >
              {transformedNewArrivals.map((product, index) => (
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
                      url('https://api.builder.io/api/v1/image/assets/TEMP/df43c644b630e11e75c5cfa0820db4ef46176c34?width=2720') lightgray 50% / cover no-repeat;
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