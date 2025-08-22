import ProductCard from './ProductCard'
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

  const toggleAccordion = (index: number) => {
    setExpandedItem(expandedItem === index ? -1 : index)
  }

  return (
    <div className="product-sections">
      {/* Related Products Section */}
      <section className="section">
        <h2 className="section-title">Related Products</h2>
        <div className="products-carousel">
          <button className="carousel-arrow left">‹</button>
          <div className="products-grid">
            {relatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                title={product.title}
                price={product.price}
                rating={product.rating}
                deliveryTime={product.deliveryTime}
                image={product.image}
                badge={product.badge}
              />
            ))}
          </div>
          <button className="carousel-arrow right">›</button>
        </div>
      </section>

      {/* Product Information Section */}
      <section className="section">
        <h2 className="section-title">Product Information</h2>
        <div className="accordion-container">
          <div className="accordion">
            <div className={`accordion-item ${expandedItem === 0 ? 'expanded' : ''}`}>
              <div className="accordion-header" onClick={() => toggleAccordion(0)}>
                <span className="accordion-title">Question text goes here</span>
                <button className="accordion-toggle">
                  {expandedItem === 0 ? '−' : '+'}
                </button>
              </div>
              {expandedItem === 0 && (
                <div className="accordion-content">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </div>
              )}
            </div>
            
            <div className={`accordion-item ${expandedItem === 1 ? 'expanded' : ''}`}>
              <div className="accordion-header" onClick={() => toggleAccordion(1)}>
                <span className="accordion-title">Question text goes here</span>
                <button className="accordion-toggle">
                  {expandedItem === 1 ? '−' : '+'}
                </button>
              </div>
              {expandedItem === 1 && (
                <div className="accordion-content">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </div>
              )}
            </div>
            
            <div className={`accordion-item ${expandedItem === 2 ? 'expanded' : ''}`}>
              <div className="accordion-header" onClick={() => toggleAccordion(2)}>
                <span className="accordion-title">Question text goes here</span>
                <button className="accordion-toggle">
                  {expandedItem === 2 ? '−' : '+'}
                </button>
              </div>
              {expandedItem === 2 && (
                <div className="accordion-content">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </div>
              )}
            </div>
            
            <div className={`accordion-item ${expandedItem === 3 ? 'expanded' : ''}`}>
              <div className="accordion-header" onClick={() => toggleAccordion(3)}>
                <span className="accordion-title">Question text goes here</span>
                <button className="accordion-toggle">
                  {expandedItem === 3 ? '−' : '+'}
                </button>
              </div>
              {expandedItem === 3 && (
                <div className="accordion-content">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Product Description Section */}
      <section className="section">
        <h2 className="section-title">Product Description</h2>
        <div className="description-container">
          <div className="description-content">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
          </div>
        </div>
      </section>

      {/* From The Manufacturer Section */}
      <section className="section">
        <h2 className="section-title">From The Manufacturer</h2>
        <div className="manufacturer-carousel">
          <button className="carousel-arrow left">‹</button>
          <div className="manufacturer-image">
            <img 
              src="/images/manufacturer-sneakers.jpg" 
              alt="Nike Airforce 01 from manufacturer"
              className="manufacturer-img"
            />
          </div>
          <button className="carousel-arrow right">›</button>
        </div>
      </section>

      {/* Customer Also Liked Section */}
      <section className="section">
        <h2 className="section-title">Customer Also Liked These Products</h2>
        <div className="products-carousel">
          <button className="carousel-arrow left">‹</button>
          <div className="products-grid">
            {relatedProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={`liked-${product.id}`}
                title={product.title}
                price={product.price}
                rating={product.rating}
                deliveryTime={product.deliveryTime}
                image={product.image}
                badge={product.badge}
              />
            ))}
          </div>
          <button className="carousel-arrow right">›</button>
        </div>
      </section>

      <style jsx>{`
        .product-sections {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px 60px 20px;
        }

        .section {
          margin-bottom: 80px;
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

        .carousel-arrow {
          width: 48px;
          height: 48px;
          border: 1px solid #e5e7eb;
          border-radius: 50%;
          background: white;
          color: #666;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .carousel-arrow:hover {
          border-color: #0082FF;
          color: #0082FF;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          flex: 1;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .products-grid::-webkit-scrollbar {
          display: none;
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
          background: white;
          padding: 32px;
          border: none;
          border-radius: 0;
          box-shadow: none;
        }

        .description-content p {
          margin: 0 0 20px 0;
          line-height: 1.6;
          color: #666666;
          font-size: 15px;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
        }

        .description-content p:last-child {
          margin-bottom: 0;
        }

        .manufacturer-carousel {
          position: relative;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .manufacturer-image {
          flex: 1;
          height: 300px;
          border-radius: 16px;
          overflow: hidden;
          background: #f0f8ff;
          display: flex;
          align-items: center;
          justify-content: center;
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

          .products-grid {
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 16px;
          }

          .carousel-arrow {
            width: 40px;
            height: 40px;
            font-size: 20px;
          }

          .manufacturer-image {
            height: 200px;
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
        }
      `}</style>
    </div>
  )
}
