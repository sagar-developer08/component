# Product Review System with S3 Image Upload

This system allows users to submit product reviews with images, ratings (1-5 stars), and structured feedback.

## 🎯 Features

- ⭐ **Star Rating System** (1-5 stars)
- 📝 **Review Title & Comment**
- 📸 **Image Upload** (up to 5 images per review)
- ✅ **Pros & Cons**
- 🔐 **Authenticated** (requires login)
- ☁️ **S3 Storage** (images stored in AWS S3)
- 🖼️ **Image Optimization** (auto-resize to 800x800)

---

## 📋 Backend APIs

### 1. Upload Review Images (Stream Service)

**Endpoint**: `POST http://localhost:5005/api/upload/review-images`

**Headers**:
```json
{
  "Authorization": "Bearer <accessToken>"
}
```

**Body**: `multipart/form-data`
- `files`: Array of image files (max 5)

**Response**:
```json
{
  "success": true,
  "message": "3 review images uploaded successfully",
  "data": [
    {
      "url": "https://qliq-media.s3.amazonaws.com/reviews/1234567890-uuid.jpg",
      "key": "reviews/1234567890-uuid.jpg",
      "bucket": "qliq-media",
      "size": 45678,
      "mimetype": "image/jpeg"
    }
  ]
}
```

### 2. Create Product Review

**Endpoint**: `POST http://localhost:8004/api/reviews/product`

**Headers**:
```json
{
  "Authorization": "Bearer <accessToken>",
  "Content-Type": "application/json"
}
```

**Body**:
```json
{
  "productId": "68dce0040e29f02bb591da9b",
  "rating": 4,
  "title": "Great product!",
  "comment": "I really love this product. It works perfectly and exceeded my expectations.",
  "images": [
    "https://qliq-media.s3.amazonaws.com/reviews/image1.jpg",
    "https://qliq-media.s3.amazonaws.com/reviews/image2.jpg"
  ],
  "pros": ["Fast delivery", "Good quality", "Great price"],
  "cons": ["Packaging could be better"]
}
```

**Response**:
```json
{
  "success": true,
  "message": "Product review created successfully",
  "data": {
    "review": {
      "id": "68e7775781d4ff2388a072ff",
      "userId": "68dbd162235d14e6f54c3577",
      "productId": "68dce0040e29f02bb591da9b",
      "rating": 4,
      "title": "Great product!",
      "comment": "I really love this product...",
      "images": ["https://..."],
      "pros": ["Fast delivery", "Good quality"],
      "cons": ["Packaging could be better"],
      "status": "pending",
      "isActive": true,
      "createdAt": "2025-10-09T08:50:31.110Z"
    }
  }
}
```

---

## 🚀 Frontend Usage

### Basic Usage

```jsx
import ReviewForm from '@/components/ReviewForm/ReviewForm'

function ProductPage({ productId }) {
  const handleReviewSuccess = (review) => {
    console.log('Review submitted:', review)
    // Show success message, refresh reviews, etc.
  }

  const handleCancel = () => {
    // Close modal, go back, etc.
  }

  return (
    <ReviewForm
      productId={productId}
      onSuccess={handleReviewSuccess}
      onCancel={handleCancel}
    />
  )
}
```

### Advanced Usage (Helper Functions)

```jsx
import { 
  uploadReviewImages, 
  createReviewWithImages,
  validateRating,
  getStarDisplay
} from '@/utils/reviewUploadHelper'

// Example 1: Upload images only
const imageFiles = [file1, file2, file3]
const imageUrls = await uploadReviewImages(imageFiles)
console.log('Uploaded:', imageUrls)
// Output: ['https://...image1.jpg', 'https://...image2.jpg', ...]

// Example 2: Create review with images
const review = await createReviewWithImages({
  productId: '68dce0040e29f02bb591da9b',
  rating: 5,
  title: 'Excellent!',
  comment: 'Best purchase ever!',
  imageFiles: [file1, file2],
  pros: ['Quality', 'Fast'],
  cons: []
})

// Example 3: Validate rating
const validation = validateRating(4)
// Returns: { isValid: true, value: 4 }

const invalid = validateRating(6)
// Returns: { isValid: false, error: 'Rating must be between 1 and 5' }

// Example 4: Display stars
const stars = getStarDisplay(4.5)
console.log(stars) // Output: '★★★★⯨'
```

---

## ⭐ Star Rating System

### Rating Values
- **1 Star** = ★☆☆☆☆ (Poor)
- **2 Stars** = ★★☆☆☆ (Fair)
- **3 Stars** = ★★★☆☆ (Good)
- **4 Stars** = ★★★★☆ (Very Good)
- **5 Stars** = ★★★★★ (Excellent)

### Half Stars
- **4.5 Stars** = ★★★★⯨

---

## 📸 Image Upload Specifications

### Limits
- **Maximum**: 5 images per review
- **File Types**: JPG, PNG, GIF, WebP
- **Max File Size**: Handled by backend

### Optimization
Images are automatically optimized:
- **Max Width**: 800px
- **Max Height**: 800px
- **Quality**: 80%
- **Format**: Original format preserved

### Storage
- **Folder**: `reviews/`
- **Naming**: `{timestamp}-{uuid}.{extension}`
- **Example**: `reviews/1759999831107-abc-123.jpg`

---

## 🔐 Authentication

All endpoints require authentication via Bearer token:

```javascript
// Token is automatically retrieved from encrypted cookies
const token = await getAuthToken()

// Used in API calls
headers: {
  'Authorization': `Bearer ${token}`
}
```

---

## 📦 Complete Example

```jsx
'use client'
import { useState } from 'react'
import ReviewForm from '@/components/ReviewForm/ReviewForm'

export default function ProductReviewSection({ productId }) {
  const [showForm, setShowForm] = useState(false)
  const [reviews, setReviews] = useState([])

  const handleReviewSuccess = (newReview) => {
    // Add new review to list
    setReviews(prev => [newReview, ...prev])
    
    // Close form
    setShowForm(false)
    
    // Show success toast
    alert('Review submitted successfully!')
  }

  return (
    <div>
      <button onClick={() => setShowForm(true)}>
        Write a Review
      </button>

      {showForm && (
        <ReviewForm
          productId={productId}
          onSuccess={handleReviewSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Display existing reviews */}
      <div className="reviews-list">
        {reviews.map(review => (
          <div key={review.id}>
            <div>{getStarDisplay(review.rating)}</div>
            <h3>{review.title}</h3>
            <p>{review.comment}</p>
            {review.images.map((img, i) => (
              <img key={i} src={img} alt={`Review ${i+1}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## 🛠️ API Endpoints Summary

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/upload/review-images` | POST | Upload review images | ✅ Yes |
| `/reviews/product` | POST | Create review | ✅ Yes |
| `/reviews/product/:productId` | GET | Get product reviews | ❌ No |
| `/reviews/:reviewId` | GET | Get single review | ❌ No |
| `/reviews/:reviewId` | PUT | Update review | ✅ Yes |
| `/reviews/:reviewId` | DELETE | Delete review | ✅ Yes |
| `/reviews/:reviewId/helpful` | POST | Mark helpful | ❌ No |
| `/reviews/statistics/product/:productId` | GET | Get statistics | ❌ No |
| `/reviews/user/product-reviews` | GET | Get user reviews | ✅ Yes |

---

## 🚨 Error Handling

### Common Errors

1. **Invalid Rating**
   - Message: "Rating must be between 1 and 5"
   - Solution: Ensure rating is 1, 2, 3, 4, or 5

2. **Too Many Images**
   - Message: "Maximum 5 images allowed per review"
   - Solution: Limit image selection to 5 files

3. **Comment Too Long**
   - Message: "Comment must be less than 2000 characters"
   - Solution: Keep comments under 2000 chars

4. **Authentication Required**
   - Message: "User not authenticated"
   - Solution: Ensure user is logged in

5. **Duplicate Review**
   - Message: "You have already reviewed this product"
   - Solution: User can only review each product once

---

## 🎨 Component Props

### ReviewForm

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `productId` | string | Yes | Product ID to review |
| `onSuccess` | function | No | Called when review is submitted |
| `onCancel` | function | No | Called when user cancels |

### Callback Signatures

```typescript
onSuccess: (review: Review) => void
onCancel: () => void
```

---

## 📊 Data Structure

### Review Object

```typescript
interface Review {
  id: string
  userId: string
  productId: string
  rating: number              // 1-5
  title: string               // Optional
  comment: string             // Required, max 2000 chars
  images: string[]            // Array of S3 URLs, max 5
  pros: string[]              // Array of pros
  cons: string[]              // Array of cons
  isVerified: boolean         // Verified purchase
  isHelpful: number           // Helpful count
  status: 'pending' | 'approved' | 'rejected'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

---

## 🔧 Configuration

### Environment Variables

Add to your `.env` file:

```env
# Stream Services (Upload)
NEXT_PUBLIC_UPLOAD_BASE_URL=http://localhost:5005/api

# Review Service
NEXT_PUBLIC_REVIEW_BASE_URL=http://localhost:8004/api

# AWS S3 (Backend only)
AWS_REGION=us-east-1
AWS_S3_BUCKET=qliq-media
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
```

---

## ✅ Testing

### Test Upload Endpoint

```bash
curl -X POST http://localhost:5005/api/upload/review-images \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@image1.jpg" \
  -F "files=@image2.jpg"
```

### Test Review Creation

```bash
curl -X POST http://localhost:8004/api/reviews/product \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "68dce0040e29f02bb591da9b",
    "rating": 5,
    "title": "Amazing!",
    "comment": "Best product ever!",
    "images": ["https://..."],
    "pros": ["Quality", "Fast"],
    "cons": []
  }'
```

---

## 🎉 Success!

You now have a complete review system with:
- ✅ S3 image upload
- ✅ Star ratings (1-5)
- ✅ Image optimization
- ✅ Authentication
- ✅ React component
- ✅ Helper utilities
- ✅ Error handling

Happy coding! 🚀

