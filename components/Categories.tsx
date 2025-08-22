import Image from 'next/image'

const categories = [
  {
    name: 'Bakeries',
    icon: 'https://api.builder.io/api/v1/image/assets/TEMP/f135c2608686bede16f4abec2b403a01ab7eadbb?width=160',
    bgColor: 'rgba(0, 157, 224, 0.16)'
  },
  {
    name: 'Groceries',
    icon: 'https://api.builder.io/api/v1/image/assets/TEMP/fc1c7e0e80a7c38e3ff9c097466b278b1e658d94?width=160',
    bgColor: 'rgba(31, 199, 10, 0.16)'
  },
  {
    name: 'Pharmacy',
    icon: 'https://api.builder.io/api/v1/image/assets/TEMP/6c8400c771ae4cb7fe6f74d708d2c0f629db951b?width=160',
    bgColor: 'rgba(198, 128, 0, 0.16)'
  },
  {
    name: 'Florists',
    icon: 'https://api.builder.io/api/v1/image/assets/TEMP/bf6e7f121518b57c4d990d28cf218dc7630121a2?width=160',
    bgColor: 'rgba(0, 157, 224, 0.16)'
  },
  {
    name: 'Supermarket',
    icon: 'https://api.builder.io/api/v1/image/assets/TEMP/6ff5b7f57c77eb65e479b49fe6e61de35bfcf1f1?width=160',
    bgColor: 'rgba(203, 89, 101, 0.16)'
  },
  {
    name: 'Hypermarket',
    icon: 'https://api.builder.io/api/v1/image/assets/TEMP/ad72e444d9b21352f7e61f696c51995f1bb1b2ac?width=160',
    bgColor: 'rgba(31, 199, 10, 0.16)'
  },
  {
    name: 'Brands Stores',
    icon: 'https://api.builder.io/api/v1/image/assets/TEMP/d99f33c16f906ea5e1d2cfd35a57afe07035c217?width=160',
    bgColor: 'rgba(198, 128, 0, 0.16)'
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
