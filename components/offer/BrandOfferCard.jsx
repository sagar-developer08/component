import React from 'react';
import Image from 'next/image';
import './BrandOfferCard.css';

const BrandOfferCard = ({ title, brands = [], categories = [], ctaLink, ctaText = 'View all' }) => {
  // If brands exist, use only brands; otherwise use categories
  // Take first 4 items
  const items = brands.length > 0 ? brands.slice(0, 4) : categories.slice(0, 4);
  
  // If no items, show placeholder
  const displayItems = items.length > 0 ? items : [];

  return (
    <div className="boc-card">
      <div className="boc-card-content">
        <h3 className="boc-title">{title || 'Price offers directly from the brand'}</h3>

        <div className="boc-grid">
          {displayItems.map((item, index) => {
            const imageUrl = item.logo || item.icon;
            const name = item.name || '';
            
            return (
              <div key={index} className="boc-badge" style={{ 
                background: index % 2 === 0 ? '#000' : '#fff',
                border: '1px solid #0082FF'
              }}>
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={name}
                    width={64}
                    height={64}
                    style={{ objectFit: 'contain' }}
                    unoptimized={true}
                  />
                ) : (
                  <span className="boc-badge__text" style={{ 
                    color: index % 2 === 0 ? '#fff' : '#000',
                    fontSize: '12px',
                    fontWeight: 400,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>
                    {name.toUpperCase()}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* View all button inside the card - bottom left */}
      <a 
        href={ctaLink || '#'}
        className="boc-cta-button"
        onClick={(e) => {
          if (!ctaLink) {
            e.preventDefault();
          }
        }}
      >
        View all
      </a>
    </div>
  );
};

export default BrandOfferCard;
