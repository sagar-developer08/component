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
import Image from 'next/image'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHypermarketLevel2Categories } from '@/store/slices/categoriesSlice'
import { useRouter } from 'next/navigation'

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

export default function Home() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { hypermarketLevel2Categories, loading, error } = useSelector(state => state.categories)

  // Fetch hypermarket level 2 categories when component mounts
  useEffect(() => {
    dispatch(fetchHypermarketLevel2Categories())
  }, [dispatch])

  // Transform API data
  const transformedCategories = hypermarketLevel2Categories && hypermarketLevel2Categories.length > 0
    ? hypermarketLevel2Categories.map(transformCategoryData)
    : []

  const handleCategoryClick = (category) => {
    // Use the slug from the API data or create a slug from the name
    const slug = category.slug || category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    router.push(`/category/${slug}`);
  }

  return (
    <main className="home-page">
      <Navigation />
      <div className="banner-container">
        <div className="banner-section">
          <div className="banner-content">
            <button className="banner-back-btn" onClick={() => window.history.back()}>
              Back
            </button>
            <div className="banner-info">
              <div className="banner-title">Hypermarket</div>
              <div className="banner-desc">
                Browse through our wide range of hypermarket categories and find everything you need.
              </div>
            </div>
            {/* <button className="banner-follow-btn">Follow</button> */}
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <SectionHeader title="Categories" showNavigation={true} />
          {loading ? (
            <div className="categories-grid">
              {[...Array(6)].map((_, index) => (
                <div key={`skeleton-${index}`} style={{ width: '200px', height: '200px', background: '#f0f0f0', borderRadius: '12px' }} />
              ))}
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
              Error loading categories: {error}
            </div>
          ) : transformedCategories.length > 0 ? (
            <div className="categories-grid">
              {transformedCategories.map((category, index) => (
                <CategoryCard 
                  key={category.id || index} 
                  {...category}
                  onClick={() => handleCategoryClick(category)}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              No categories available
            </div>
          )}
        </div>
      </section>


      {/* Bestsellers Section */}
      <section className="section">
        <div className="container">
          <SectionHeader title="Our Bestsellers" showNavigation={true} />
          <div className="products-grid">
            {productData.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="section">
        <div className="container">
          <SectionHeader title="Offers For You"
            showNavigation={true} />
          <div className="products-grid">
            {productData.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Special Deals Section */}
      <section className="section">
        <div className="container">
          <SectionHeader
            title="New Arrivals"
            showNavigation={true}
            showButton={false}
            buttonText="Upgrade"
          />
          <div className="products-grid">
            {productData.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <style jsx>{`
      .blue-bar-section {
        width: 100%;
        background: #CBE6FF;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 56px;
        margin: 32px 0;
      }
      .blue-bar-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0;
        width: 100%;
        max-width: 1360px;
        height: 56px;
      }
      .blue-bar-item {
        color: #0082FF;
        font-size: 16px;
        font-weight: 600;
        font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
        padding: 0 18px;
        white-space: nowrap;
      }
      .blue-bar-sep {
        color: #0082FF;
        font-size: 16px;
        font-weight: 600;
        font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
        opacity: 0.7;
      }
        .promo-cards-container {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 0px 24px;
          box-sizing: border-box;
          margin: 32px 0 0 0;
        }
        .promo-cards-row {
          display: flex;
          gap: 32px;
          justify-content: flex-start;
          align-items: flex-start;
          width: 100%;
          max-width: 1360px;
        }
        .promo-card {
          display: flex;
          align-items: center;
          border-radius: 16px;
          padding: 18px 28px;
          min-width: 340px;
          box-sizing: border-box;
          gap: 18px;
        }
        .promo-card-outline {
          border: 2px solid #2196F3;
          background: #fff;
        }
        .promo-card-filled {
          background: #2196F3;
          border: none;
        }
        .promo-card-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .promo-card-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .promo-card-title {
          font-size: 18px;
          font-weight: 600;
          color: #000;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
        }
        .promo-card-link {
          font-size: 16px;
          font-weight: 600;
          color: #000;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
        }
        .promo-card-title-white {
          color: #fff;
        }
        .promo-card-link-white {
          color: #fff;
        }
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
        
        @media (max-width: 900px) {
          .promo-cards-container {
            padding: 0px 24px;
          }
          .promo-cards-row {
            flex-direction: column;
            gap: 18px;
          }
          .promo-card {
            min-width: 0;
            width: 100%;
            padding: 16px 18px;
          }
          
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