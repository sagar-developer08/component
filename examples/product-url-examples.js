/**
 * Examples demonstrating the new product URL structure
 */

import { generateProductUrl, generateVariantUrl } from '../utils/productUtils'

// Example 1: Product with ID (recommended)
const productId = '68dce0040e29f02bb591da9d'
const productSlug = 'iphone-15-pro-silver-256gb'

const urlWithId = generateProductUrl(productId, productSlug)
console.log('URL with ID:', urlWithId)
// Output: /product/iphone-15-pro-silver-256gb?pid=68dce0040e29f02bb591da9d

// Example 2: Product without ID (slug only)
const urlWithoutId = generateProductUrl(null, productSlug)
console.log('URL without ID:', urlWithoutId)
// Output: /product/iphone-15-pro-silver-256gb

// Example 3: Variant selection
const variant = {
  _id: '68dce0040e29f02bb591da9d',
  slug: 'iphone-15-pro-blue-256gb',
  variant_attributes: {
    color: 'Blue',
    storage: '256GB'
  }
}

const variantUrl = generateVariantUrl(variant)
console.log('Variant URL:', variantUrl)
// Output: /product/iphone-15-pro-blue-256gb?pid=68dce0040e29f02bb591da9d

// Example 4: API endpoint usage
// When user visits: /product/iphone-15-pro-silver-256gb
// The system will call: GET /api/products/slug/iphone-15-pro-silver-256gb
// After getting the product data, the URL will be updated to: /product/iphone-15-pro-silver-256gb?pid=68dce0040e29f02bb591da9d

// When user visits: /product/iphone-15-pro-silver-256gb?pid=68dce0040e29f02bb591da9d
// The system will call: GET /api/products/68dce0040e29f02bb591da9d/slug/iphone-15-pro-silver-256gb

// Example 5: Variant selection flow
const handleColorChange = (color, currentProduct, variants) => {
  const newAttributes = { 
    ...currentProduct.selectedAttributes, 
    color 
  }
  
  const matchingVariant = variants.find(variant => {
    return Object.keys(newAttributes).every(key => 
      variant.variant_attributes?.[key] === newAttributes[key]
    )
  })
  
  if (matchingVariant) {
    const newUrl = generateVariantUrl(matchingVariant)
    // Navigate to new URL
    window.location.href = newUrl
    // Or with Next.js router: router.push(newUrl)
  }
}

export {
  urlWithId,
  urlWithoutId,
  variantUrl,
  handleColorChange
}
