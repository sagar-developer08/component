# ProductReviews Component

## Overview
Displays all reviews for a product fetched from the backend API.

## Features
- ✅ Fetches reviews from API automatically
- ✅ Shows review ratings with stars
- ✅ Displays review images
- ✅ Shows pros/cons if available
- ✅ Status badges (approved/pending/rejected)
- ✅ Verified purchase badge
- ✅ Helpful count
- ✅ Responsive design
- ✅ Loading and error states

## Usage

### Basic Usage
```jsx
import ProductReviews from '@/components/ProductReviews/ProductReviews'

export default function ProductPage() {
  const productId = "68ebae97923c05f282009293"
  
  return (
    <div>
      <ProductReviews productId={productId} />
    </div>
  )
}
```

### In Product Detail Page
```jsx
'use client'

import ProductReviews from '@/components/ProductReviews/ProductReviews'
import { useParams } from 'next/navigation'

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id
  
  return (
    <div>
      {/* Other product details */}
      
      {/* Reviews Section */}
      <ProductReviews productId={productId} />
    </div>
  )
}
```

## API Integration

### Endpoint
```
GET http://localhost:8008/api/product-reviews/product/:productId
```

### Response Format
```json
{
  "success": true,
  "message": "Product reviews retrieved successfully",
  "data": [
    {
      "_id": "68ee00df6f682474ab689392",
      "userId": "a2361074-a001-70a0-2487-c8a6f91cbe78",
      "productId": "68edfb7814b82ecd1d2b0c45",
      "rating": 4,
      "title": "Rohit Upadhyay",
      "comment": "Test Review",
      "images": ["https://..."],
      "pros": [],
      "cons": [],
      "isVerified": false,
      "isHelpful": 0,
      "status": "approved",
      "isActive": true,
      "createdAt": "2025-10-14T07:50:55.959Z",
      "updatedAt": "2025-10-14T07:50:55.959Z"
    }
  ]
}
```

## Redux Integration

### State Structure
```javascript
{
  review: {
    reviews: [],      // Array of reviews
    loading: false,   // Loading state
    error: null,      // Error message
    success: false    // Success state
  }
}
```

### Actions Used
```javascript
import { getProductReviews } from '@/store/slices/reviewSlice'

// Fetch reviews
dispatch(getProductReviews(productId))
```

## Styling

The component uses CSS modules. Customize by editing `ProductReviews.module.css`.

### Key Classes
- `.reviewsContainer` - Main container
- `.reviewCard` - Individual review card
- `.stars` - Star rating display
- `.statusBadge` - Status badge (approved/pending/rejected)
- `.reviewImages` - Review images grid

## States

### Loading State
```jsx
{loading && <div>Loading reviews...</div>}
```

### Error State  
```jsx
{error && <div>Error: {error}</div>}
```

### Empty State
```jsx
{reviews.length === 0 && <div>No reviews yet</div>}
```

## Example Output

The component displays:
1. **Review Header** - Reviewer name, date, star rating
2. **Status Badge** - Approval status
3. **Verified Badge** - If verified purchase
4. **Comment** - Review text
5. **Images** - Review photos (if any)
6. **Pros/Cons** - Lists (if provided)
7. **Helpful Count** - Number of helpful votes

## Customization

### Change Star Color
```css
.starFilled {
  color: #your-color;
}
```

### Adjust Card Spacing
```css
.reviewsList {
  gap: your-spacing;
}
```

### Modify Layout
```css
.reviewsContainer {
  max-width: your-width;
}
```

## Notes

- Component automatically fetches reviews when `productId` changes
- Reviews are cached in Redux store
- No authentication required for viewing reviews
- Images are lazy-loaded with Next.js Image component
- Responsive design works on all screen sizes

## Testing

```jsx
// Test with different product IDs
<ProductReviews productId="68ebae97923c05f282009293" />

// Check console for API calls
// Browser DevTools > Console
```

