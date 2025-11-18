import React from 'react';
import './BrandOfferCard.css';

const BrandOfferCard = () => {
  return (
    <div className="boc-card">
      <h3 className="boc-title">Price offers directly from the brand</h3>

      <div className="boc-grid">
        <div className="boc-badge boc-badge--samsung">
          <span className="boc-badge__text">SAMSUNG</span>
        </div>

        <div className="boc-badge boc-badge--nike">
          <svg className="boc-nike-swoosh" viewBox="0 0 69 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M68.56 4L18.4 25.36Q12.16 28 7.92 28q-4.8 0-6.96-3.36-1.36-2.16-.8-5.48t2.96-7.08q2-3.04 6.56-8-1.6 2.56-2.6 5.04-.88 2.16-.4 3.8t1.68 2.92q2.08 1.68 5.8 1.68 2.24 0 5.04-.72L68.56 4z" fill="currentColor"/>
          </svg>
        </div>

        <div className="boc-badge boc-badge--apple">
          <div className="boc-apple"></div>
        </div>

        <div className="boc-badge boc-badge--sony">
          <span className="boc-badge__text boc-badge__text--sony">SONY</span>
        </div>
      </div>
    </div>
  );
};

export default BrandOfferCard;
