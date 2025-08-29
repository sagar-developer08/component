'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const slides = [
  {
    id: 1,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/8327e3bf1cc4b0879c5c6e445dc27305afbd0795?width=1336',
    width: 668,
    height: 380
  },
  {
    id: 2,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/dd3b697ca0d3ef83a64c4b812706fae22e6774f2?width=1336',
    width: 668,
    height: 380
  },
  {
    id: 3,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/a868e3c3ae04f8cde35d9705cad41f2bccbeb7da?width=1376',
    width: 688,
    height: 380
  },
  {
    id: 4,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/dc622b97235b892ac997a36da4ca4fc5bbe221a9?width=1376',
    width: 688,
    height: 380
  }
]

export default function ImageSlider() {
  const swiperRef = useRef(null)

  const nextSlide = () => {
    if (swiperRef.current && (swiperRef.current as any).swiper) {
((swiperRef.current as any).swiper as any).slideNext()
    }
  }

  const prevSlide = () => {
    if (swiperRef.current && (swiperRef.current as any).swiper) {
((swiperRef.current as any).swiper as any).slidePrev()
    }
  }

  return (
    <div className="slider-container">
      <div className="slider-section">
        <Swiper
          ref={swiperRef}
          modules={[Navigation]}
          spaceBetween={24}
          slidesPerView={2}
          centeredSlides={false}
          loop={true}
          style={{
            maxWidth: '1392px',
            height: '380px',
            margin: '0 auto'
          }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              <div className="slide-container">
                <Image
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  width={slide.width}
                  height={slide.height}
                  style={{ 
                    borderRadius: '16px',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="slider-controls">
          <button
            className="nav-button prev"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <rect y="44" width="44" height="44" rx="22" transform="rotate(-90 0 44)" fill="white"/>
              <path d="M32 22L11 22M11 22L18.875 14.125M11 22L18.875 29.875" stroke="#0082FF" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button
            className="nav-button next"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <rect x="44" width="44" height="44" rx="22" transform="rotate(90 44 0)" fill="white"/>
              <path d="M11 22L32 22M32 22L24.125 29.875M32 22L24.125 14.125" stroke="#0082FF" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        .slider-container {
          width: 100%;
          display: flex;
          justify-content: center;
        }
        
        .slider-section {
          width: 100%;
          max-width: 1360px;
          position: relative;
          overflow: hidden;
        }

        .slide-container {
          width: 100%;
          height: 380px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .slider-controls {
          display: flex;
          width: 100%;
          justify-content: space-between;
          align-items: center;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 44px;
          z-index: 10;
          pointer-events: none;
          padding: 0 20px;
          box-sizing: border-box;
        }

        .nav-button {
          width: 44px;
          height: 44px;
          border-radius: 22px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          pointer-events: all;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .nav-button:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .nav-button:active {
          transform: scale(0.95);
        }

        @media (max-width: 1392px) {
          .slider-section {
            padding: 0 20px;
          }
          
          .slider-controls {
            padding: 0 40px;
          }
        }

        @media (max-width: 768px) {
          .slider-controls {
            padding: 0 16px;
          }
          
          .nav-button {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </div>
  )
}