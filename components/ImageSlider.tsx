'use client'

import { useState } from 'react'
import Image from 'next/image'

const slides = [
  {
    id: 1,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/8327e3bf1cc4b0879c5c6e445dc27305afbd0795?width=1336'
  },
  {
    id: 2,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/dd3b697ca0d3ef83a64c4b812706fae22e6774f2?width=1336'
  },
  {
    id: 3,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/a868e3c3ae04f8cde35d9705cad41f2bccbeb7da?width=1376'
  }
]

export default function ImageSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="slider-section">
      <Image
        src="https://api.builder.io/api/v1/image/assets/TEMP/dc622b97235b892ac997a36da4ca4fc5bbe221a9?width=1376"
        alt="Slide 1"
        width={688}
        height={380}
        style={{ borderRadius: '16px', position: 'absolute', left: '-672px', top: '0px' }}
      />
      <Image
        src="https://api.builder.io/api/v1/image/assets/TEMP/8327e3bf1cc4b0879c5c6e445dc27305afbd0795?width=1336"
        alt="Slide 2"
        width={668}
        height={380}
        style={{ borderRadius: '16px', position: 'absolute', left: '40px', top: '0px' }}
      />
      <Image
        src="https://api.builder.io/api/v1/image/assets/TEMP/dd3b697ca0d3ef83a64c4b812706fae22e6774f2?width=1336"
        alt="Slide 3"
        width={668}
        height={380}
        style={{ borderRadius: '16px', position: 'absolute', left: '732px', top: '0px' }}
      />
      <Image
        src="https://api.builder.io/api/v1/image/assets/TEMP/a868e3c3ae04f8cde35d9705cad41f2bccbeb7da?width=1376"
        alt="Slide 4"
        width={688}
        height={380}
        style={{ borderRadius: '16px', position: 'absolute', left: '1424px', top: '0px' }}
      />

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

      <style jsx>{`
        .slider-section {
          width: 1440px;
          height: 380px;
          position: relative;
          overflow: hidden;
        }

        .slider-controls {
          display: flex;
          width: 1392px;
          justify-content: space-between;
          align-items: flex-start;
          position: absolute;
          left: 24px;
          top: 168px;
          height: 44px;
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
