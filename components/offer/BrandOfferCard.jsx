'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './BrandOfferCard.css';

const BrandOfferCard = ({
  title,
  brands = [],
  categories = [],
  ctaLink,
  ctaText = 'View all',
  itemType = 'auto', // 'auto', 'brand', 'hypermarket', 'supermarket', 'store', 'category'
  categoryId = null, // Optional category ID to filter products by level4 category
  level4CategoryIds = [] // Array of level4 category IDs from section config
}) => {
  const router = useRouter();

  // If brands exist, use only brands; otherwise use categories
  // Take first 4 items
  const items = brands.length > 0 ? brands.slice(0, 4) : categories.slice(0, 4);

  // If no items, show placeholder
  const displayItems = items.length > 0 ? items : [];

  // Determine item type for each item
  const getItemType = (item, index) => {
    if (itemType !== 'auto') return itemType;

    // If brands array is used, it's a brand
    if (brands.length > 0) return 'brand';

    // Check if item has store-specific properties
    if (item._id && (item.logo || item.slug)) {
      // Could be hypermarket, supermarket, or regular store
      // We'll need to check from parent component or use a flag
      return 'store'; // Default to store, parent can override
    }

    // Otherwise it's a category
    return 'category';
  };

  // Handle icon click - navigate to appropriate page with filters
  const handleIconClick = (item, type) => {
    // Get the first level4 category ID from the array (or use categoryId if provided)
    const level4CategoryId = categoryId || (level4CategoryIds && level4CategoryIds.length > 0 ? level4CategoryIds[0] : null);

    if (type === 'brand') {
      // For brands, navigate directly to the brand page using its slug (no category filters)
      const brandSlug = item.slug || item.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      if (brandSlug) {
        console.log('Navigating to brand page:', brandSlug, 'for brand:', item.name);
        router.push(`/${brandSlug}`);
      } else {
        console.warn('Brand slug not found for item:', item);
      }
    } else if (type === 'hypermarket' && item.slug) {
      // For hypermarkets, navigate directly to the store's own page using its slug
      const params = new URLSearchParams();
      params.append('categoryLevel', '4');
      params.append('source', 'hypermarket');
      // Add level4CategoryId from section config
      if (level4CategoryId) {
        params.append('categoryId', level4CategoryId);
        console.log('Using level4CategoryId from section config:', level4CategoryId);
      } else if (categoryId) {
        params.append('categoryId', categoryId);
        console.log('Using categoryId prop:', categoryId);
      }
      console.log('Navigating to hypermarket store page:', item.slug, 'for store:', item.name, 'with categoryId:', level4CategoryId || categoryId);
      router.push(`/${item.slug}?${params.toString()}`);
    } else if (type === 'supermarket' && item.slug) {
      // For supermarkets, navigate directly to the store's own page using its slug
      const params = new URLSearchParams();
      params.append('categoryLevel', '4');
      params.append('source', 'supermarket');
      // Add level4CategoryId from section config
      if (level4CategoryId) {
        params.append('categoryId', level4CategoryId);
        console.log('Using level4CategoryId from section config:', level4CategoryId);
      } else if (categoryId) {
        params.append('categoryId', categoryId);
        console.log('Using categoryId prop:', categoryId);
      }
      console.log('Navigating to supermarket store page:', item.slug, 'for store:', item.name, 'with categoryId:', level4CategoryId || categoryId);
      router.push(`/${item.slug}?${params.toString()}`);
    } else if (type === 'store' && item.slug) {
      // For regular stores, navigate directly to the store's own page using its slug
      const params = new URLSearchParams();
      params.append('categoryLevel', '4');
      // Add level4CategoryId from section config
      if (level4CategoryId) {
        params.append('categoryId', level4CategoryId);
        console.log('Using level4CategoryId from section config:', level4CategoryId);
      } else if (categoryId) {
        params.append('categoryId', categoryId);
        console.log('Using categoryId prop:', categoryId);
      }
      console.log('Navigating to store page:', item.slug, 'for store:', item.name, 'with categoryId:', level4CategoryId || categoryId);
      router.push(`/${item.slug}?${params.toString()}`);
    } else if (type === 'category') {
      // For categories, navigate directly to the category's own page using its slug
      const categorySlug = item.slug || item.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      if (categorySlug) {
        const params = new URLSearchParams();
        params.append('categoryLevel', '4');
        console.log('Navigating to category page:', categorySlug, 'for category:', item.name);
        router.push(`/${categorySlug}?${params.toString()}`);
      } else {
        console.warn('Category slug not found for item:', item);
      }
    }
  };

  return (
    <div className="boc-card">
      <div className="boc-card-content">
        <h3 className="boc-title">{title || 'Price offers directly from the brand'}</h3>

        <div className="boc-grid">
          {displayItems.map((item, index) => {
            const imageUrl = item.logo || item.icon;
            const name = item.name || '';
            const type = getItemType(item, index);

            return (
              <div
                key={index}
                className="boc-badge"
                style={{
                  background: index % 2 === 0 ? '#000' : '#fff',
                  border: '1px solid #0082FF',
                  cursor: 'pointer'
                }}
                onClick={() => handleIconClick(item, type)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleIconClick(item, type);
                  }
                }}
                aria-label={`View ${name} products`}
              >
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
      {/*
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
      */}
    </div>
  );
};

export default BrandOfferCard;
