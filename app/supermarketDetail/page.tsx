'use client'

import { useRouter } from 'next/navigation'
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
  const router = useRouter()
  
  return (
    <main className="home-page">
      <Navigation />
      <div className="banner-container">
        <div className="banner-section">
          <div className="banner-content">
            <button className="banner-back-btn" onClick={() => router.push('/supermarket')}>
              Back
            </button>
            <div className="banner-info">
              <div className="banner-title">NIKE</div>
              <div className="banner-desc">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
              </div>
            </div>
            <button className="banner-follow-btn">Follow</button>
          </div>
        </div>
      </div>
      <div className='blue-bar-section'>
        <div className='blue-bar-container'>
          <span className="blue-bar-item">Choose Location</span>
          <span className="blue-bar-sep">|</span>
          <span className="blue-bar-item">Open Until 18:00</span>
          <span className="blue-bar-sep">|</span>
          <span className="blue-bar-item">Min. Order $10,000</span>
          <span className="blue-bar-sep">|</span>
          <span className="blue-bar-item">4.0 Rating</span>
        </div>
      </div>

      {/* Promo Cards Row */}
      <div className="promo-cards-container">
        <div className="promo-cards-row">
          <div className="promo-card promo-card-outline">
            <div className="promo-card-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#111" />
                <path d="M10.5 16.5L21.5 16.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <path d="M16 10.5L16 21.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <path d="M12.5 12.5L19.5 19.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <path d="M19.5 12.5L12.5 19.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="promo-card-content">
              <div className="promo-card-title">O so'm delivery fees for 14 days</div>
              <div className="promo-card-link">Learn More</div>
            </div>
          </div>
          <div className="promo-card promo-card-filled">
            <div className="promo-card-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#fff" />
                <path d="M16 23.5L21.09 26.5L19.82 20.27L24.5 16.14L18.18 15.63L16 9.5L13.82 15.63L7.5 16.14L12.18 20.27L10.91 26.5L16 23.5Z" fill="#2196F3" />
              </svg>
            </div>
            <div className="promo-card-content">
              <div className="promo-card-title promo-card-title-white">Get 0 delivery fee & more!</div>
              <div className="promo-card-link promo-card-link-white">Try 30 Days for Free!</div>
            </div>
          </div>
        </div>
      </div>

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