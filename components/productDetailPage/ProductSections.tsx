import ProductCard from '@/components/ProductCard'
import SectionHeader from '@/components/SectionHeader'
import ProductInformation from '@/components/productDetailPage/ProductInformation'
import { useState } from 'react'

interface ProductSectionsProps {
  relatedProducts: Array<{
    id: string
    title: string
    price: string
    rating: string
    deliveryTime: string
    image: string
    badge?: string
  }>
}

export default function ProductSections({ relatedProducts }: ProductSectionsProps) {
  const [expandedItem, setExpandedItem] = useState(0)
  const [manufacturerImageIndex, setManufacturerImageIndex] = useState(0)

  const toggleAccordion = (index: number) => {
    setExpandedItem(expandedItem === index ? -1 : index)
  }

  // Sample manufacturer images
  const manufacturerImages = [
    "/images/manufacturer-sneakers.jpg",
    "/images/manufacturer-2.jpg", 
    "/images/manufacturer-3.jpg"
  ]

  const nextImage = () => {
    setManufacturerImageIndex((prevIndex) => 
      prevIndex === manufacturerImages.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevImage = () => {
    setManufacturerImageIndex((prevIndex) => 
      prevIndex === 0 ? manufacturerImages.length - 1 : prevIndex - 1
    )
  }

  return (
    <div>
      {/* Related Products Section */}
      <section className="section">
        <div className="container">
          <SectionHeader
            title="Related Products"
            showNavigation={true}
            showButton={true}
            buttonText="Upgrade"
          />
          <div className="products-grid">
            {relatedProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Product Information Section */}
      <ProductInformation />

      {/* Product Description Section */}
      <section className="section">
        <div className="container">
          <SectionHeader
            title="Product Description"
            showNavigation={false}
            showButton={false}
            buttonText="Upgrade"
          />
          <div className="description-content">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
          </div>
        </div>
      </section>

      {/* From The Manufacturer Section */}
      <section className="section">
        <div className="container">
          <SectionHeader
            title="From The Manufacturer"
            showNavigation={false}
            showButton={false}
          />
        </div>
        
        {/* Full-width image container */}
        <div className="manufacturer-full-width">
          <div className="manufacturer-carousel">
            <button className="carousel-arrow left" onClick={prevImage}>‹</button>
            <div className="manufacturer-image">
              <img
                src={manufacturerImages[manufacturerImageIndex]}
                alt="Product from manufacturer"
                className="manufacturer-img"
              />
            </div>
            <button className="carousel-arrow right" onClick={nextImage}>›</button>
          </div>
        </div>
      </section>

      {/* Customer Also Liked Section */}
      <section className="section">
        <div className="container">
          <SectionHeader
            title="Customer Also Liked These Products"
            showNavigation={true}
            showButton={false}
          />
          <div className="products-grid">
            {relatedProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .product-sections {
          max-width: 1360px;
          margin: auto;
        }

        .section-title {
          font-size: 32px;
          font-weight: 700;
          color: #000000;
          margin: 0 0 48px 0;
          text-align: center;
          line-height: 1.2;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
        }

        .products-carousel {
          position: relative;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .manufacturer-full-width {
          width: 100%;
          margin-top: 24px;
        }

        .manufacturer-carousel {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .carousel-arrow {
          position: absolute;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: transparent;
          color: #000;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .carousel-arrow.left {
          left: 60px;
        }

        .carousel-arrow.right {
          right: 60px;
        }

        .accordion-container {
          max-width: 900px;
          margin: 0 auto;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          background: white;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .accordion {
          display: flex;
          flex-direction: column;
        }

        .accordion-item {
          border: none;
          border-bottom: 1px solid #e5e7eb;
          border-radius: 0;
          overflow: hidden;
          margin-bottom: 0;
          background: white;
          box-shadow: none;
          transition: all 0.2s ease;
        }

        .accordion-item:last-child {
          border-bottom: none;
        }

        .accordion-item.expanded {
          border-color: #e5e7eb;
          box-shadow: none;
        }

        .accordion-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 32px;
          background: #ffffff;
          cursor: pointer;
          transition: background 0.2s ease;
          border: none;
          width: 100%;
          text-align: left;
        }

        .accordion-item.expanded .accordion-header {
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .accordion-header:hover {
          background: #f9f9f9;
        }

        .accordion-title {
          font-size: 16px;
          font-weight: 500;
          color: #000000;
          margin: 0;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
        }

        .accordion-toggle {
          background: none;
          border: none;
          font-size: 24px;
          color: #666666;
          cursor: pointer;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          margin: 0;
          transition: all 0.2s ease;
        }

        .accordion-content {
          padding: 24px 32px;
          background: white;
          line-height: 1.6;
        }

        .accordion-content p {
          margin: 0;
          line-height: 1.6;
          color: #666666;
          font-size: 15px;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
        }

        .description-container {
          max-width: 900px;
          margin: 0 auto;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .description-content {
          max-width: 1392px;
          width: 100%;
          background: white;
          padding-left: 24px;
          padding-right: 24px;
          border: none;
          border-radius: 0;
          box-shadow: none;
        }

        .description-content p {
          line-height: 150%;
          color: #000;
          font-size: 16px;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          font-weight: 600;
        }

        .description-content p:last-child {
          margin-bottom: 0;
        }

        .manufacturer-image {
          width: 100%;
          height: 500px;
          overflow: hidden;
          background: #f0f8ff;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .manufacturer-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 28px;
            margin-bottom: 32px;
          }

          .section {
            margin-bottom: 60px;
          }

          .accordion-container {
            max-width: 100%;
            border-radius: 12px;
          }

          .accordion-header {
            padding: 20px 24px;
          }

          .accordion-title {
            font-size: 15px;
          }

          .accordion-toggle {
            font-size: 22px;
            width: 24px;
            height: 24px;
          }

          .accordion-content {
            padding: 20px 24px;
          }

          .accordion-content p {
            font-size: 14px;
          }

          .description-container {
            max-width: 100%;
            border-radius: 12px;
          }

          .description-content {
            padding: 24px;
          }

          .description-content p {
            font-size: 14px;
            margin-bottom: 16px;
          }

          .carousel-arrow {
            width: 40px;
            height: 40px;
            font-size: 20px;
          }

          .carousel-arrow.left {
            left: 10px;
          }

          .carousel-arrow.right {
            right: 10px;
          }

          .manufacturer-image {
            height: 300px;
          }
        }

        @media (max-width: 480px) {
          .section-title {
            font-size: 24px;
            margin-bottom: 24px;
          }

          .accordion-header {
            padding: 16px 20px;
          }

          .accordion-content {
            padding: 16px 20px;
          }

          .description-content {
            padding: 20px;
          }

          .manufacturer-image {
            height: 200px;
          }

          .carousel-arrow {
            width: 36px;
            height: 36px;
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  )
}