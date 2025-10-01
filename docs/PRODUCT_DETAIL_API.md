# Product Detail API Implementation

This document describes the implementation of the product detail functionality with variant selection support.

## API Endpoints

The product detail API supports two endpoint structures:

### 1. With Product ID (Recommended)
```
GET /api/products/{productId}/slug/{productSlug}
```

### 2. Slug Only (Fallback)
```
GET /api/products/slug/{productSlug}
```

### Example URLs
```
# With product ID (recommended)
http://localhost:8001/api/products/68dce0040e29f02bb591da9d/slug/iphone-15-pro-silver-256gb

# Slug only (fallback)
http://localhost:8001/api/products/slug/iphone-15-pro-silver-256gb
```

## URL Structure for Frontend

The frontend supports two URL structures:

### 1. With Product ID (for specific variants)
```
/product/{productSlug}?pid={productId}
```

### 2. Without Product ID (slug-only, will fetch product by slug)
```
/product/{productSlug}
```

### Example Frontend URLs
```
# With product ID (recommended for variants)
/product/iphone-15-pro-silver-256gb?pid=68dce0040e29f02bb591da9d

# Without product ID (will work but less efficient)
/product/iphone-15-pro-silver-256gb
```

## API Response Structure

The API can return two different response structures:

### 1. Single Product Response (Current)
```json
{
  "success": true,
  "message": "Product fetched successfully",
  "data": {
    "_id": "68dce0040e29f02bb591da99",
    "title": "iPhone 15 Pro - Silver - 64GB",
    "slug": "iphone-15-pro-silver-64gb",
    "parent_product_id": "68d5196ad94106806cb27eb6",
    "is_parent": false,
    "variant_attributes": {
      "color": "Silver",
      "storage": "64GB"
    },
    "price": 1299,
    "discount_price": 1199,
    "stock_quantity": 22,
    "brand_id": { "name": "Sony", "slug": "sony" },
    "store_id": { "name": "Grocery World" },
    "images": [...],
    // ... other product fields
  }
}
```

### 2. Full Response with Variants (Future)
```json
{
  "success": true,
  "data": {
    "product": {...},
    "parent": {...},
    "variants": [...],
    "variant_options": {
      "color": ["Black", "White", "Blue", "Silver"],
      "storage": ["64GB", "128GB", "256GB"]
    }
  }
}
```

## Variant Fetching

When a single product is returned, the system automatically fetches all variants using:

```
GET /api/products/{parentProductId}/variants
```

### Example Variant Endpoint
```
GET /api/products/68d5196ad94106806cb27eb6/variants
```

This endpoint returns all variants for a given parent product ID, allowing the system to:
1. Display all available color and storage options
2. Enable variant selection functionality
3. Update URLs when different variants are selected

```json
{
  "success": true,
  "message": "Product fetched successfully",
  "data": {
    "product": {
      "_id": "68dce0040e29f02bb591da9d",
      "title": "iPhone 15 Pro - Silver - 256GB",
      "slug": "iphone-15-pro-silver-256gb",
      "description": "Apple flagship smartphone. (color: Silver, storage: 256GB)",
      "short_description": "Apple flagship smartphone.",
      "parent_product_id": "68d5196ad94106806cb27eb6",
      "is_parent": false,
      "variant_attributes": {
        "color": "Silver",
        "storage": "256GB"
      },
      "price": 1299,
      "discount_price": 1199,
      "stock_quantity": 18,
      "images": [...],
      "brand_id": {...},
      "store_id": {...},
      "specifications": {...},
      "attributes": {...}
    },
    "parent": {
      // Parent product data (if this is a variant)
    },
    "variants": [
      // Array of all available variants
    ],
    "variant_options": {
      "color": ["Black", "White", "Blue", "Silver"],
      "storage": ["64GB", "128GB", "256GB"]
    },
    "total_variant_stock": 275
  }
}
```

## Redux Store Structure

### Product Detail Slice

The `productDetailSlice` manages:

```javascript
{
  product: null,           // Current product being viewed
  parent: null,            // Parent product (if viewing a variant)
  variants: [],            // All available variants
  variantOptions: {},      // Available options for each attribute
  totalVariantStock: 0,    // Total stock across all variants
  selectedVariant: null,   // Currently selected variant
  selectedAttributes: {},  // Selected color, size, etc.
  loading: false,
  error: null,
  success: false
}
```

### Actions

- `fetchProductDetail({ id, slug })` - Fetch product with variants
- `fetchProductVariant({ id, slug })` - Fetch specific variant
- `setSelectedAttributes({ key, value })` - Update selected attributes
- `selectVariant(attributes)` - Select variant by attributes
- `clearProductDetail()` - Clear all product data

## Component Integration

### Product Detail Page (`app/product/[id]/page.jsx`)

```javascript
// Extract product ID and slug from URL
const productId = searchParams.get('pid') || params.id
const productSlug = params.id

// Fetch product data
useEffect(() => {
  if (productId && productSlug) {
    dispatch(fetchProductDetail({ id: productId, slug: productSlug }))
  }
}, [dispatch, productId, productSlug])

// Handle variant selection
const handleVariantChange = (attributeType, value) => {
  dispatch(setSelectedAttributes({ key: attributeType, value }))
  
  const newAttributes = { ...selectedAttributes, [attributeType]: value }
  const matchingVariant = findMatchingVariant(variants, newAttributes)
  
  if (matchingVariant) {
    const newUrl = generateVariantUrl(matchingVariant)
    router.push(newUrl)
  }
}
```

### Product Details Component

The component receives variant selection handlers:

```javascript
<ProductDetails 
  product={{
    ...product,
    colors: variantOptions.color || [],
    sizes: variantOptions.storage || [],
    onColorChange: (color) => handleVariantChange('color', color),
    onSizeChange: (size) => handleVariantChange('storage', size),
    selectedColor: selectedAttributes.color,
    selectedSize: selectedAttributes.storage
  }} 
/>
```

## Utility Functions

### `utils/productUtils.js`

Key utility functions:

- `generateProductUrl(productId, productSlug)` - Generate product URL
- `generateVariantUrl(variant)` - Generate variant URL
- `findMatchingVariant(variants, selectedAttributes)` - Find variant by attributes
- `getAvailableOptions(variants, selectedAttributes, attributeType)` - Get available options
- `transformProductData(apiProduct)` - Transform API data to component format
- `formatPrice(price, currency)` - Format price with currency
- `calculateDiscountPercentage(originalPrice, discountPrice)` - Calculate discount

## Usage Examples

### 1. Navigate to Product

```javascript
import { generateProductUrl } from '@/utils/productUtils'

const productUrl = generateProductUrl('68dce0040e29f02bb591da9d', 'iphone-15-pro-silver-256gb')
router.push(productUrl)
// Result: /product/iphone-15-pro-silver-256gb?pid=68dce0040e29f02bb591da9d
```

### 2. Handle Variant Selection

```javascript
const handleColorChange = (color) => {
  const newAttributes = { ...selectedAttributes, color }
  const matchingVariant = findMatchingVariant(variants, newAttributes)
  
  if (matchingVariant) {
    const newUrl = generateVariantUrl(matchingVariant)
    router.push(newUrl)
  }
}
```

### 3. Check Variant Availability

```javascript
import { isVariantAvailable, getAvailableOptions } from '@/utils/productUtils'

// Check if variant is available
const isAvailable = isVariantAvailable(variant)

// Get available colors for selected storage
const availableColors = getAvailableOptions(variants, selectedAttributes, 'color')
```

## API Endpoints Configuration

### `store/api/endpoints.js`

```javascript
export const catalog = {
  // ... other endpoints
  productById: (id) => `${BASES.catalog}/products/${id}`,
  productBySlug: (id, slug) => `${BASES.catalog}/products/${id}/slug/${slug}`,
}
```

## Error Handling

The implementation includes comprehensive error handling:

- Network errors during API calls
- Invalid product IDs or slugs
- Missing variant data
- Stock availability checks

## Performance Considerations

- Debounced variant selection to prevent excessive API calls
- Cached product data in Redux store
- Optimized re-renders with proper state management
- Lazy loading of variant data

## SEO Considerations

- Proper URL structure with product slugs
- Meta tags from product data
- Structured data for search engines
- Shareable URLs for specific variants
