/**
 * Utility functions for product-related operations
 */

/**
 * Generate product URL with proper structure
 * @param {string} productId - The product ID
 * @param {string} productSlug - The product slug
 * @returns {string} - Formatted product URL
 */
export const generateProductUrl = (productId, productSlug) => {
  if (productId) {
    return `/product/${productSlug}?pid=${productId}`;
  }
  return `/product/${productSlug}`;
};

/**
 * Generate variant URL when variant is selected
 * @param {Object} variant - The variant object
 * @returns {string} - Formatted variant URL
 */
export const generateVariantUrl = (variant) => {
  if (!variant || !variant._id || !variant.slug) {
    throw new Error('Invalid variant object');
  }
  return `/product/${variant.slug}?pid=${variant._id}`;
};

/**
 * Extract product ID and slug from URL
 * @param {string} pathname - The pathname from useRouter
 * @param {string} searchParams - The search params string
 * @returns {Object} - Object containing productId and productSlug
 */
export const parseProductUrl = (pathname, searchParams) => {
  const slug = pathname.split('/').pop();
  const urlParams = new URLSearchParams(searchParams);
  const productId = urlParams.get('pid');
  
  return {
    productId,
    productSlug: slug
  };
};

/**
 * Check if a variant is available based on stock
 * @param {Object} variant - The variant object
 * @returns {boolean} - Whether the variant is available
 */
export const isVariantAvailable = (variant) => {
  return variant && variant.stock_quantity > 0 && variant.status === 'active';
};

/**
 * Get available variants for a specific attribute combination
 * @param {Array} variants - Array of all variants
 * @param {Object} selectedAttributes - Currently selected attributes
 * @param {string} attributeType - The attribute type to filter by
 * @returns {Array} - Available options for the attribute type
 */
export const getAvailableOptions = (variants, selectedAttributes, attributeType) => {
  const availableOptions = new Set();
  
  variants.forEach(variant => {
    if (isVariantAvailable(variant)) {
      // Check if this variant matches all other selected attributes
      const matchesOtherAttributes = Object.keys(selectedAttributes).every(key => {
        if (key === attributeType) return true; // Skip the current attribute type
        return variant.variant_attributes?.[key] === selectedAttributes[key];
      });
      
      if (matchesOtherAttributes) {
        const optionValue = variant.variant_attributes?.[attributeType];
        if (optionValue) {
          availableOptions.add(optionValue);
        }
      }
    }
  });
  
  return Array.from(availableOptions);
};

/**
 * Find the best matching variant based on selected attributes
 * @param {Array} variants - Array of all variants
 * @param {Object} selectedAttributes - Currently selected attributes
 * @returns {Object|null} - The matching variant or null
 */
export const findMatchingVariant = (variants, selectedAttributes) => {
  return variants.find(variant => {
    return Object.keys(selectedAttributes).every(key => 
      variant.variant_attributes?.[key] === selectedAttributes[key]
    );
  });
};

/**
 * Format product price with currency
 * @param {number} price - The price value
 * @param {string} currency - The currency code (default: 'AED')
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price, currency = 'AED') => {
  if (typeof price !== 'number') return `${currency} 0`;
  return `${currency} ${price.toLocaleString()}`;
};

/**
 * Calculate discount percentage
 * @param {number} originalPrice - The original price
 * @param {number} discountPrice - The discounted price
 * @returns {number} - Discount percentage
 */
export const calculateDiscountPercentage = (originalPrice, discountPrice) => {
  if (!originalPrice || !discountPrice || originalPrice <= discountPrice) {
    return 0;
  }
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
};

/**
 * Get primary image from product images array
 * @param {Array} images - Array of image objects
 * @returns {string} - Primary image URL or placeholder
 */
export const getPrimaryImage = (images) => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return '/placeholder.jpg';
  }
  
  const primaryImage = images.find(img => img.is_primary);
  return primaryImage?.url || images[0]?.url || '/placeholder.jpg';
};

/**
 * Transform API product data to component format
 * @param {Object} apiProduct - Product data from API
 * @returns {Object} - Transformed product data
 */
export const transformProductData = (apiProduct) => {
  if (!apiProduct) return null;
  
  return {
    id: apiProduct._id,
    slug: apiProduct.slug,
    title: apiProduct.title,
    description: apiProduct.description || apiProduct.short_description,
    brand: apiProduct.brand_id?.name || '',
    store: apiProduct.store_id?.name || '',
    price: apiProduct.discount_price || apiProduct.price,
    originalPrice: apiProduct.price,
    discount: calculateDiscountPercentage(apiProduct.price, apiProduct.discount_price),
    rating: apiProduct.average_rating || 0,
    stock: apiProduct.stock_quantity > 0 ? "In Stock" : "Out of Stock",
    stockQuantity: apiProduct.stock_quantity,
    images: apiProduct.images?.map(img => img.url) || [],
    primaryImage: getPrimaryImage(apiProduct.images),
    variantAttributes: apiProduct.variant_attributes || {},
    specifications: apiProduct.specifications || {},
    attributes: apiProduct.attributes || {},
    isOffer: apiProduct.is_offer || false,
    totalReviews: apiProduct.total_reviews || 0,
    status: apiProduct.status || 'active'
  };
};
