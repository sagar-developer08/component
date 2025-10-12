# Frontend Environment Variables Setup

## Overview
This document describes all environment variables required for the frontend application.

## Setup Instructions

1. Create a `.env.local` file in the root of the `frontend` directory
2. Copy the variables below and update with your actual values
3. Never commit `.env.local` to version control

## Environment Variables

### API Base URLs

```bash
# Product Catalog Service
NEXT_PUBLIC_CATALOG_BASE_URL=http://localhost:8003/api

# Search & Filter Service
NEXT_PUBLIC_SEARCH_BASE_URL=http://localhost:8081/api

# Authentication Service
NEXT_PUBLIC_AUTH_BASE_URL=http://localhost:8888/api

# Cart & Wishlist Service
NEXT_PUBLIC_CART_BASE_URL=http://localhost:8002/api

# Payment Service (same as cart service)
NEXT_PUBLIC_PAYMENT_BASE_URL=http://localhost:8002/api

# Media Upload Service
NEXT_PUBLIC_UPLOAD_BASE_URL=http://localhost:5005/api

# Review Service
NEXT_PUBLIC_REVIEW_BASE_URL=http://localhost:8008/api
```

## Production Configuration

For production deployment, update the URLs:

```bash
NEXT_PUBLIC_CATALOG_BASE_URL=https://backendcatalog.qliq.ae/api
NEXT_PUBLIC_SEARCH_BASE_URL=https://search.qliq.ae/api
NEXT_PUBLIC_AUTH_BASE_URL=https://backendauth.qliq.ae/api
NEXT_PUBLIC_CART_BASE_URL=https://backendcart.qliq.ae/api
NEXT_PUBLIC_PAYMENT_BASE_URL=https://backendcart.qliq.ae/api
NEXT_PUBLIC_UPLOAD_BASE_URL=https://upload.qliq.ae/api
NEXT_PUBLIC_REVIEW_BASE_URL=https://review.qliq.ae/api
```

## Additional Configuration

```bash
# Google Maps API Key (for location features)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Environment Mode
NEXT_PUBLIC_ENVIRONMENT=development
```

## Where These Variables Are Used

- **`frontend/store/api/endpoints.js`**: Centralized API endpoint configuration
- **`frontend/components/ForgotPasswordModal.jsx`**: Password reset functionality
- **`frontend/store/slices/cartSlice.js`**: Shopping cart operations

## Notes

- All frontend environment variables must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser
- Fallback values are defined in the code but should not be relied upon for production
- Restart the development server after changing environment variables

