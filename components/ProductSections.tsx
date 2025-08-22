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
      </section>

      {/* Product Description Section */}
      <section className="section">
        <h2 className="section-title">Product Description</h2>
        <div className="description-content">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
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
          margin-bottom: 60px;
        }

        .section-title {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 40px 0;
          text-align: center;
          line-height: 1.2;
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

        .accordion {
          display: flex;
          flex-direction: column;
          gap: 0;
          max-width: 800px;
          margin: 0 auto;
        }

        .accordion-item {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 16px;
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .accordion-item:last-child {
          margin-bottom: 0;
        }

        .accordion-item.expanded {
          border-color: #0082FF;
          box-shadow: 0 4px 12px rgba(0, 130, 255, 0.15);
        }

        .accordion-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px;
          background: #f9fafb;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          width: 100%;
          text-align: left;
        }

        .accordion-item.expanded .accordion-header {
          background: #f0f8ff;
          border-bottom: 1px solid #e5e7eb;
        }

        .accordion-header:hover {
          background: #f3f4f6;
        }

        .accordion-item.expanded .accordion-header:hover {
          background: #e6f3ff;
        }

        .accordion-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .accordion-toggle {
          background: none;
          border: none;
          font-size: 24px;
          color: #6b7280;
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .accordion-toggle:hover {
          background: rgba(0, 0, 0, 0.05);
          color: #374151;
        }

        .accordion-content {
          padding: 24px;
          background: white;
          line-height: 1.6;
        }

        .accordion-content p {
          margin: 0;
          line-height: 1.6;
          color: #4b5563;
          font-size: 15px;
        }

        .description-content {
          background: white;
          padding: 32px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          max-width: 800px;
          margin: 0 auto;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .description-content p {
          margin: 0 0 20px 0;
          line-height: 1.7;
          color: #4b5563;
          font-size: 15px;
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
            font-size: 24px;
            margin-bottom: 24px;
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

          .description-content {
            padding: 24px;
          }

          .manufacturer-image {
            height: 200px;
          }
        }
      `}</style>
    </div>
  )
}
