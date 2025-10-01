// Product attributes utility functions

/**
 * Get formatted price with currency
 * @param {number} price - The price value
 * @param {string} currency - Currency code (default: 'AED')
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = 'AED') => {
  if (!price && price !== 0) return `${currency} 0`;
  return `${currency} ${Number(price).toLocaleString()}`;
};

/**
 * Calculate discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} currentPrice - Current/sale price
 * @returns {number} Discount percentage
 */
export const calculateDiscount = (originalPrice, currentPrice) => {
  if (!originalPrice || !currentPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

/**
 * Format product attributes for display
 * @param {Object} attributes - Product attributes object
 * @returns {Object} Formatted attributes
 */
export const formatProductAttributes = (attributes) => {
  if (!attributes || typeof attributes !== 'object') return {};
  
  return {
    color: attributes.color || 'Default',
    size: attributes.size || 'One Size',
    material: attributes.material || 'N/A',
    brand: attributes.brand || 'N/A',
    weight: attributes.weight || 'N/A',
    dimensions: attributes.dimensions || 'N/A'
  };
};

/**
 * Get product availability status
 * @param {number} stockQuantity - Stock quantity
 * @returns {string} Availability status
 */
export const getAvailabilityStatus = (stockQuantity) => {
  if (!stockQuantity || stockQuantity <= 0) return 'Out of Stock';
  if (stockQuantity < 10) return 'Low Stock';
  return 'In Stock';
};

/**
 * Format delivery time
 * @param {string|number} deliveryTime - Delivery time in minutes or string
 * @returns {string} Formatted delivery time
 */
export const formatDeliveryTime = (deliveryTime) => {
  if (!deliveryTime) return 'Available in 30 Minutes';
  
  if (typeof deliveryTime === 'number') {
    if (deliveryTime < 60) return `Available in ${deliveryTime} Minutes`;
    const hours = Math.floor(deliveryTime / 60);
    const minutes = deliveryTime % 60;
    return minutes > 0 ? `Available in ${hours}h ${minutes}m` : `Available in ${hours}h`;
  }
  
  return deliveryTime;
};

/**
 * Generate product slug from title
 * @param {string} title - Product title
 * @returns {string} URL-friendly slug
 */
export const generateSlug = (title) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

/**
 * Validate product data
 * @param {Object} product - Product object
 * @returns {Object} Validation result
 */
export const validateProduct = (product) => {
  const errors = [];
  
  if (!product.title && !product.name) {
    errors.push('Product title is required');
  }
  
  if (!product.price && product.price !== 0) {
    errors.push('Product price is required');
  }
  
  if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
    errors.push('Product images are required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get product rating display
 * @param {number} rating - Product rating
 * @returns {string} Formatted rating
 */
export const formatRating = (rating) => {
  if (!rating && rating !== 0) return 'No rating';
  return `${Number(rating).toFixed(1)}`;
};

/**
 * Get product stock status color
 * @param {string} status - Stock status
 * @returns {string} CSS color class
 */
export const getStockStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'in stock':
      return 'text-green-600';
    case 'low stock':
      return 'text-yellow-600';
    case 'out of stock':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

export default {
  formatPrice,
  calculateDiscount,
  formatProductAttributes,
  getAvailabilityStatus,
  formatDeliveryTime,
  generateSlug,
  validateProduct,
  formatRating,
  getStockStatusColor
};
