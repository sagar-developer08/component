import Image from 'next/image'

const categories = [
  {
    name: 'Hypermarket',
    icon: '/hypermarket.svg',
    bgColor: 'rgba(31, 199, 10, 0.16)'
  },
  {
    name: 'Supermarket',
    icon: '/supermarket.svg',
    bgColor: 'rgba(203, 89, 101, 0.16)'
  },
  {
    name: 'Brands Stores',
    icon: '/brandStore.svg',
    bgColor: 'rgba(198, 128, 0, 0.16)'
  },
  {
    name: 'Bakeries',
    icon: '/Bakeries.svg',
    bgColor: 'rgba(0, 157, 224, 0.16)'
  },
  {
    name: 'Groceries',
    icon: '/Grocires.svg',
    bgColor: 'rgba(31, 199, 10, 0.16)'
  },
  {
    name: 'Pharmacy',
    icon: 'pharmacy.svg',
    bgColor: 'rgba(198, 128, 0, 0.16)'
  },
  {
    name: 'Florists',
    icon: '/florist.svg',
    bgColor: 'rgba(0, 157, 224, 0.16)'
  }
  
]

export default function Categories() {
  return (
    <div className="categories-section">
      <div className="container">
        <div className="categories-content">
          {categories.map((category, index) => (
            <div key={index} className="category-item">
              <div
                className="category-icon"
                style={{ background: category.bgColor }}
              >
                <Image
                  src={category.icon}
                  alt={category.name}
                  width={80}
                  height={80}
                />
              </div>
              <div className="category-text">
                <h3>{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .categories-section {
          display: flex;
          width: 100%;
          padding: 40px 0;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .categories-content {
          display: flex;
          width: 100%;
          justify-content: center;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .category-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .category-item:hover {
          transform: translateY(-5px);
        }

        .category-icon {
          display: flex;
          width: 140px;
          height: 80px;
          justify-content: center;
          align-items: center;
          border-radius: 16px;
          position: relative;
        }

        .category-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          align-self: stretch;
        }

        .category-text h3 {
          color: #000;
          text-align: center;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 16px;
          font-weight: 700;
          line-height: 150%;
          margin: 0;
        }

        @media (max-width: 768px) {
          .categories-content {
            gap: 16px;
          }
          
          .category-icon {
            width: 120px;
            height: 60px;
          }
          
          .category-text h3 {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  )
}
