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

// Star icon component
const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
  </svg>
)

export default function Home() {
  return (
    <main className="home-page">
      <Navigation />

      {/* Banner with seller profile at bottom */}
      <div className="banner-container">
        <div className="banner-section">
          <div className="banner-content">
            <div className="seller-profile-container">
              <div className="seller-profile-card">
                <div className="seller-info-section">
                  {/* <div className="seller-avatar">
                    <div className="avatar-placeholder">TG</div>
                  </div> */}
                  <div className="seller-details">
                    <h2 className="seller-name">TeleGX</h2>
                    <div className="seller-contact">
                      <span className="contact-item">example@gmail.com</span>
                      <span className="contact-item">+971 555 5687</span>
                    </div>
                    <p className="seller-since">Seller since March 2024</p>
                  </div>
                </div>

                <div className="seller-stats-section">
                  <div className="rating-stat">
                    <h3 className="stat-title">Seller Rating</h3>
                    <div className="rating-value">
                      {/* <StarIcon /> */}
                      <span>4.0</span>
                    </div>
                    <p className="rating-percentage">79% Positive Rating</p>
                  </div>

                  <div className="customers-stat">
                    <h3 className="stat-title">Customers</h3>
                    <div className="customers-value">5K+</div>
                    <p className="customers-period">During the last 90 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <SectionHeader
            title="Reviews & Ratings"
            showNavigation={false}
            showButton={false}
          />
        </div>
        <div className="reviews-ratings-container">
          <div className="reviews-left">
            {/* Overall Rating Summary */}
            <div className="overall-rating-box">
              <div className="overall-rating-label">Overall Rating</div>
              <div className="overall-rating-score">4.0</div>
              <div className="overall-rating-stars">
                {[1, 2, 3, 4, 5].map(i => (
                  <svg key={i} width="28" height="28" viewBox="0 0 24 24" fill={i <= 4 ? "#2196F3" : "#E0E0E0"} style={{ marginRight: 2 }}>
                    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                  </svg>
                ))}
              </div>
              <div className="overall-rating-based">Based on 25 ratings</div>
              <div className="overall-rating-bars">
                <div className="rating-bar-row">
                  <span className="rating-bar-label"><svg width="18" height="18" viewBox="0 0 24 24" fill="#2196F3" style={{ verticalAlign: 'middle' }}><path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" /></svg> 5</span>
                  <div className="rating-bar-track"><div className="rating-bar-fill" style={{ width: '79%', background: '#2196F3' }}></div></div>
                  <span className="rating-bar-percent">79%</span>
                </div>
                <div className="rating-bar-row">
                  <span className="rating-bar-label"><svg width="18" height="18" viewBox="0 0 24 24" fill="#4CAF50" style={{ verticalAlign: 'middle' }}><path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" /></svg> 4</span>
                  <div className="rating-bar-track"><div className="rating-bar-fill" style={{ width: '9%', background: '#4CAF50' }}></div></div>
                  <span className="rating-bar-percent">09%</span>
                </div>
                <div className="rating-bar-row">
                  <span className="rating-bar-label"><svg width="18" height="18" viewBox="0 0 24 24" fill="#FFC107" style={{ verticalAlign: 'middle' }}><path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" /></svg> 3</span>
                  <div className="rating-bar-track"><div className="rating-bar-fill" style={{ width: '3%', background: '#FFC107' }}></div></div>
                  <span className="rating-bar-percent">03%</span>
                </div>
                <div className="rating-bar-row">
                  <span className="rating-bar-label"><svg width="18" height="18" viewBox="0 0 24 24" fill="#A0522D" style={{ verticalAlign: 'middle' }}><path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" /></svg> 2</span>
                  <div className="rating-bar-track"><div className="rating-bar-fill" style={{ width: '2%', background: '#A0522D' }}></div></div>
                  <span className="rating-bar-percent">02%</span>
                </div>
                <div className="rating-bar-row">
                  <span className="rating-bar-label"><svg width="18" height="18" viewBox="0 0 24 24" fill="#F44336" style={{ verticalAlign: 'middle' }}><path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" /></svg> 1</span>
                  <div className="rating-bar-track"><div className="rating-bar-fill" style={{ width: '8%', background: '#F44336' }}></div></div>
                  <span className="rating-bar-percent">08%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="reviews-right">
            <div className="reviews-summary">
              <div className="summary-title">3334 Reviews, summarised</div>
              <ul className="summary-list">
                <li>Stunning display and powerful performance make it a top-tier phone.</li>
                <li>The pro-grade camera system captures incredible photos and videos.</li>
                <li>Innovative AI features enhance productivity and user experience.</li>
                <li>Some users have reported battery drain and heating issues.</li>
              </ul>
              <div className="customer-photos-row">
                <span className="customer-photos-title">Customers Photos (1332)</span>
                <a className="customer-photos-viewall" href="#">View All</a>
              </div>
              <div className="customer-photos-list">
                {[...Array(7)].map((_, i) => (
                  <div className="customer-photo" key={i}></div>
                ))}
              </div>
            </div>
            <div className="reviews-list">
              {[...Array(4)].map((_, i) => (
                <div className="review-item" key={i}>
                  <div className="review-photo"></div>
                  <div className="review-content">
                    <div className="review-text">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit Suspendisse varius enim in eros elementum tristique | orem ipsum dolor sit amet, consectetur adipiscing.
                    </div>
                    <div className="review-meta">
                      <span className="review-author">Ama Cruize</span>
                      <span className="review-verified">
                        <svg width="18" height="18" viewBox="0 0 18 18" style={{ verticalAlign: 'middle', marginRight: 4 }}><circle cx="9" cy="9" r="9" fill="#111" /><path d="M13 7l-4 4-2-2" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Verified Purchase
                      </span>
                    </div>
                    <span className="review-date">Nov 12, 2024</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeader
            title="Products by this seller"
            showNavigation={false}
            showButton={true}
            buttonText="View All"
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
        .reviews-right {
          flex: 2.2;
          min-width: 0;
        }
        .reviews-summary {
          margin-bottom: 24px;
        }
        .summary-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 12px;
        }
        .summary-list {
          margin: 0 0 18px 0;
          padding-left: 18px;
          font-size: 16px;
          color: #222;
          font-weight: 600;
        }
        .customer-photos-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .customer-photos-title {
          font-size: 15px;
          font-weight: 600;
          color: #222;
        }
        .customer-photos-viewall {
          font-size: 15px;
          color: #007aff;
          font-weight: 500;
          text-decoration: none;
        }
        .customer-photos-list {
          display: flex;
          gap: 16px;
          margin-bottom: 18px;
        }
        .customer-photo {
          width: 108px;
          height: 108px;
          border-radius: 12px;
          background: #111;
          display: inline-block;
        }
        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .review-item {
          display: flex;
          gap: 18px;
          align-items: flex-start;
          flex-direction: column;
        }
        .review-photo {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          background: #111;
          flex-shrink: 0;
        }
        .review-content {
          flex: 1;
        }
        .review-text {
          font-size: 16px;
          color: #222;
          font-weight: 500;
          margin-bottom: 8px;
        }
        .review-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          color: #222;
          margin-bottom: 4px;
        }
        .review-author {
          font-weight: 600;
          font-size: 16px;
          color: #000;
        }
        .review-verified {
          display: flex;
          align-items: center;
          gap: 2px;
          font-weight: 600;
          font-size: 16px;
          color: #000;
        }
        .review-date {
          color: #000;
          font-size: 14px;
          font-weight: 600;
        }
       .reviews-ratings-container {
          display: flex;
          gap: 48px;
          max-width: 1392px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .reviews-left {
          flex: 1;
          max-width: 340px;
        }
        .reviews-title {
          font-size: 32px;
          font-weight: 600;
          margin-bottom: 8px;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
        }
          .reviews-title-2 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 16px;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
        }
        .overall-rating-box {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          margin-bottom: 32px;
          min-width: 320px;
          max-width: 340px;
        }
        .overall-rating-label {
          font-size: 24px;
          font-weight: 600;
          color: #000;
          margin-bottom: 0;
        }
        .overall-rating-score {
          font-size: 48px;
          font-weight: 700;
          color: #111;
          margin-bottom: 4px;
        }
        .overall-rating-stars {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }
        .overall-rating-based {
          font-size: 15px;
          color: #222;
          margin-bottom: 18px;
        }
        .overall-rating-bars {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .rating-bar-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
        }
        .rating-bar-label {
          width: 48px;
          display: flex;
          align-items: center;
          gap: 2px;
          font-weight: 600;
        }
        .rating-bar-track {
          flex: 1;
          height: 8px;
          background: #eee;
          border-radius: 8px;
          overflow: hidden;
          margin: 0 8px;
        }
        .rating-bar-fill {
          height: 100%;
          border-radius: 8px;
        }
        .rating-bar-percent {
          width: 38px;
          text-align: right;
          font-weight: 600;
        }
        @media (max-width: 1100px) {
          .reviews-ratings-container {
            flex-direction: column;
            gap: 32px;
            padding: 0 12px;
          }
          .reviews-left, .reviews-right {
            max-width: 100%;
          }
        }
        @media (max-width: 768px) {
          .reviews-title {
            font-size: 1.3rem;
            margin-bottom: 18px;
          }
          .reviews-ratings-container {
            padding: 0 4px;
          }
          .customer-photo {
            width: 54px;
            height: 54px;
          }
          .review-photo {
            width: 36px;
            height: 36px;
          }
        }
        @media (max-width: 480px) {
          .reviews-title {
            font-size: 1.1rem;
          }
          .customer-photo {
            width: 38px;
            height: 38px;
          }
          .review-photo {
            width: 28px;
            height: 28px;
          }
        }
        .seller-profile-container {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 24px;
          box-sizing: border-box;
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 2;
        }
        
        .seller-profile-card {
          width: 100%;
          max-width: 1360px;
          display: flex;
          padding: 24px;
          border-radius: 16px;
          background: transparent;
          box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08);
          gap: 40px;
        }
        
        .seller-info-section {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }
        
        .seller-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #F0F2F5;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .avatar-placeholder {
          color: #667085;
          font-size: 20px;
          font-weight: 600;
        }
        
        .seller-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .seller-name {
          color: #fff;
          font-size: 32px;
          font-weight: 600;
          margin: 0;
          line-height: 130%;
        }
        
        .seller-contact {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .contact-item {
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          line-height: 150%;
        }
        
        .seller-since {
          color: #fff;
          font-size: 16px;
          margin: 4px 0 0 0;
          line-height: 150%;
          font-weight: 600;
        }
        
        .seller-stats-section {
          display: flex;
          gap: 40px;
          flex: 1;
          justify-content: flex-end;
        }
        
        .rating-stat, .customers-stat {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }
        
        .stat-title {
          color: #fff;
          font-size: 16px;
          font-weight: 400;
          margin: 0;
          line-height: 150%;
        }
        
        .rating-value {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #fff;
          font-size: 40px;
          font-weight: 600;
        }
        
        .rating-percentage {
          color: #fff;
          font-size: 16px;
          margin: 0;
          font-weight: 600;
          line-height: 150%;
        }
        
        .customers-value {
          color: #fff;
          font-size: 40px;
          font-weight: 600;
        }
        
        .customers-period {
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          margin: 0;
          line-height: 150%;
        }
        
        .banner-container {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 60px 24px;
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
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-start;
          border-radius: 24px;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.60) 100%), 
                      url('https://api.builder.io/api/v1/image/assets/TEMP/df43c644b630e11e75c5cfa0820db4ef46176c34?width=2720') lightgray 50% / cover no-repeat;
        }

        @media (max-width: 768px) {
          .seller-profile-container {
            padding: 16px;
          }
          
          .seller-profile-card {
            flex-direction: column;
            gap: 24px;
            padding: 16px;
          }
          
          .seller-stats-section {
            justify-content: space-between;
          }
          
          .banner-container {
            padding: 0 16px;
          }
          
          .banner-content {
            align-items: center;
          }
        }
      `}</style>
    </main>
  )
}