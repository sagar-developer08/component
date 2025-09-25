'use client'

import React from 'react'

// Skeleton loader for product cards
export function ProductCardSkeleton() {
  return (
    <div className="product-card-skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-price"></div>
        <div className="skeleton-rating"></div>
        <div className="skeleton-delivery"></div>
      </div>
      <style jsx>{`
        .product-card-skeleton {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          position: relative;
          width: 322px;
          height: 400px;
        }

        .skeleton-image {
          width: 322px;
          height: 222px;
          border-radius: 16px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }

        .skeleton-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          width: 100%;
        }

        .skeleton-title {
          width: 80%;
          height: 20px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }

        .skeleton-price {
          width: 60%;
          height: 18px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }

        .skeleton-rating {
          width: 40%;
          height: 16px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }

        .skeleton-delivery {
          width: 50%;
          height: 16px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }

        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  )
}

// Skeleton loader for category cards
export function CategoryCardSkeleton() {
  return (
    <div className="category-card-skeleton">
      <div className="skeleton-category-image"></div>
      <div className="skeleton-category-name"></div>
      <style jsx>{`
        .category-card-skeleton {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          width: 140px;
          height: 120px;
        }

        .skeleton-category-image {
          width: 80px;
          height: 80px;
          border-radius: 16px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }

        .skeleton-category-name {
          width: 80%;
          height: 16px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }

        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  )
}

// Skeleton loader for store cards
export function StoreCardSkeleton() {
  return (
    <div className="store-card-skeleton">
      <div className="skeleton-store-image"></div>
      <div className="skeleton-store-content">
        <div className="skeleton-store-title"></div>
        <div className="skeleton-store-category"></div>
        <div className="skeleton-store-rating"></div>
        <div className="skeleton-store-delivery"></div>
      </div>
      <style jsx>{`
        .store-card-skeleton {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 20px;
          border-radius: 16px;
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 300px;
        }

        .skeleton-store-image {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }

        .skeleton-store-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          width: 100%;
        }

        .skeleton-store-title {
          width: 70%;
          height: 18px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }

        .skeleton-store-category {
          width: 50%;
          height: 14px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }

        .skeleton-store-rating {
          width: 40%;
          height: 14px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }

        .skeleton-store-delivery {
          width: 60%;
          height: 14px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }

        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  )
}

// Generic skeleton loader
export function SkeletonLoader({ width = '100%', height = '20px', className = '' }) {
  return (
    <div 
      className={`skeleton-loader ${className}`}
      style={{ width, height }}
    >
      <style jsx>{`
        .skeleton-loader {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }

        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  )
}
