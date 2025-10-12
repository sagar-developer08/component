# E-Shop Brands API Flow & Logic

Complete documentation of how brands are displayed on `localhost:3000/eshop` page.

---

## 🎯 Overview

The E-Shop page (`/eshop`) displays "Top Brands" section by fetching brands from the backend API.

---

## 📡 API Flow

### 1. **Frontend Calls API**

**File**: `frontend/app/eshop/page.jsx`

```javascript
// Line 24: Import Redux action
import { fetchBrands } from '@/store/slices/brandsSlice'

// Line 110: Dispatch action on component mount
useEffect(() => {
  dispatch(fetchBrands());  // ← Triggers API call
  // ... other fetches
}, [dispatch]);
```

### 2. **Redux Slice Makes HTTP Request**

**File**: `frontend/store/slices/brandsSlice.js`

```javascript
// Lines 5-21: Async thunk
export const fetchBrands = createAsyncThunk(
  'brands/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(catalog.brands)  // ← API endpoint
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)
```

### 3. **API Endpoint Configuration**

**File**: `frontend/store/api/endpoints.js`

```javascript
// Lines 4-10: Base URLs
export const BASES = {
  catalog: 'https://backendcatalog.qliq.ae/api',
  // or 'http://localhost:8003/api' for development
}

// Line 21: Brands endpoint
export const catalog = {
  brands: `${BASES.catalog}/brands/top`,  // ← THE API BEING CALLED
}
```

**Resulting API URL**: 
```
https://backendcatalog.qliq.ae/api/brands/top
```

### 4. **Backend Route Handler**

**File**: `product-category-catalog-service/routes/brand.routes.ts`

```typescript
// Line 36: Route definition
router.get('/top', asyncHandler(getTopBrands));
```

### 5. **Backend Controller Logic**

**File**: `product-category-catalog-service/controllers/brandController.ts` (Lines 538-588)

```typescript
const getTopBrands = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, isActive } = req.query;

  const cacheKey = `brands:top:${JSON.stringify({ page, limit, isActive })}`;
  const cacheService = CacheService.getInstance();

  const result = await cacheService.getOrSet(
    cacheKey,
    async () => {
      // Build filter
      const filter: any = {
        isTopBrand: true  // ← ONLY RETURNS TOP BRANDS
      };

      if (isActive !== undefined) {
        filter.isActive = isActive === 'true';
      }

      const skip = (Number(page) - 1) * Number(limit);

      // Query database
      const brands = await Brand.find(filter)
        .populate('storeId', 'name slug')
        .populate('level1', 'name slug level path')  // ← POPULATES CATEGORIES
        .populate('level2', 'name slug level path')  // ← POPULATES CATEGORIES
        .populate('level3', 'name slug level path')  // ← POPULATES CATEGORIES
        .populate('level4', 'name slug level path')  // ← POPULATES CATEGORIES
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean();

      const total = await Brand.countDocuments(filter);

      return {
        brands,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      };
    },
    { prefix: 'brand' } // Cache indefinitely
  );

  res.json({
    success: true,
    message: 'Top brands fetched successfully',
    data: result.data,
  });
};
```

---

## 🔍 Backend Logic Breakdown

### Filter Criteria

```typescript
const filter = {
  isTopBrand: true  // Only brands where isTopBrand = true
};
```

### What Gets Returned

The API returns brands that have:
- ✅ `isTopBrand: true`
- ✅ All their category associations (level1-4) populated
- ✅ Store information populated (if available)

### Response Structure

```json
{
  "success": true,
  "message": "Top brands fetched successfully",
  "data": {
    "brands": [
      {
        "_id": "68e79301e6bef1c83828f131",
        "name": "Apple",
        "slug": "apple",
        "description": "Innovative consumer electronics...",
        "logo": "https://logo.clearbit.com/apple.com",
        "isTopBrand": true,
        "isActive": true,
        "level1": {
          "_id": "68e72160e1764e8d5b19fec6",
          "name": "E-commerce",
          "slug": "ecommerce",
          "level": 1,
          "path": ["ecommerce"]
        },
        "level2": {
          "_id": "68e72172e1764e8d5b19feca",
          "name": "Electronics",
          "slug": "electronics",
          "level": 2,
          "path": ["ecommerce", "electronics"]
        },
        "level3": null,
        "level4": {
          "_id": "68e7219be1764e8d5b19fed6",
          "name": "iPhone",
          "slug": "iphone",
          "level": 4
        },
        "createdAt": "2025-10-10T...",
        "updatedAt": "2025-10-10T..."
      },
      {
        "_id": "68e79301e6bef1c83828f134",
        "name": "Samsung",
        "slug": "samsung",
        // ... similar structure
      }
      // ... more brands
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 8,
      "pages": 1
    }
  }
}
```

---

## 🎨 Frontend Display Logic

### 1. **Data Transformation** (Lines 52-59)

```javascript
const transformBrandData = (apiBrand) => {
  return {
    name: apiBrand.name || 'Brand Name',
    image: apiBrand.logo || 'default-placeholder.jpg',
    slug: apiBrand.slug || apiBrand.name?.toLowerCase()
  }
}
```

### 2. **Redux State Management** (Lines 92-122)

```javascript
// Get brands from Redux store
const { brands, loading, error } = useSelector(state => state.brands);

// Transform for display
const transformedBrands = brands.map(transformBrandData);
```

### 3. **Render in UI** (Lines 420-455)

```javascript
<section className="section">
  <div className="container">
    <SectionHeader title="Top Brands" />
    {brandsLoading ? (
      <div>Loading brands...</div>
    ) : brandsError ? (
      <div>Error loading brands: {brandsError}</div>
    ) : (
      <Swiper>
        {transformedBrands.map((brand, index) => (
          <SwiperSlide key={brand.name || index}>
            <CategoryCard 
              {...brand} 
              onClick={() => handleBrandClick(brand)}  // ← Click handler
            />
          </SwiperSlide>
        ))}
      </Swiper>
    )}
  </div>
</section>
```

### 4. **Click Handler** (Lines 254-258)

```javascript
const handleBrandClick = (brand) => {
  const slug = brand.slug || brand.name.toLowerCase();
  router.push(`/${slug}`);  // ← Navigate to brand page
};
```

---

## 🔑 Key Points

### API Being Used:
```
GET https://backendcatalog.qliq.ae/api/brands/top
```

### Query Parameters (Optional):
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `isActive` - Filter active brands (default: undefined = all)

### Filter Logic:
```typescript
{
  isTopBrand: true,  // ← ONLY TOP BRANDS
  isActive: true     // ← If specified in query
}
```

### Does It Filter by Category?
**❌ NO** - The `/brands/top` endpoint does NOT filter by category.

It only filters by:
- ✅ `isTopBrand: true`
- ✅ `isActive` (if provided in query)

### But... Does It RETURN Category Data?
**✅ YES** - It populates all category levels (level1-4) in the response!

```typescript
.populate('level1', 'name slug level path')
.populate('level2', 'name slug level path')
.populate('level3', 'name slug level path')
.populate('level4', 'name slug level path')
```

---

## 📊 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User visits localhost:3000/eshop                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. React Component Mounts                                   │
│    useEffect() → dispatch(fetchBrands())                    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Redux Thunk Executes                                     │
│    fetch(catalog.brands)                                    │
│    = fetch('https://backendcatalog.qliq.ae/api/brands/top') │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Backend Route Handler                                    │
│    GET /api/brands/top → getTopBrands()                    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Database Query                                           │
│    Brand.find({ isTopBrand: true })                        │
│      .populate('level1 level2 level3 level4')              │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Response Returned                                        │
│    { success: true, data: { brands: [...], pagination } }  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Redux Updates State                                      │
│    state.brands = response.data.brands                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. React Component Re-renders                               │
│    transformedBrands.map(brand => <CategoryCard />)        │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. User Sees Brands (Swiper Carousel)                      │
│    [Apple] [Samsung] [LEGO] [Dell] ...                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 💡 Why Category Data is Included (Even Though Not Used for Filtering)

### The API Response Includes Categories Because:

1. **Future Use**: Frontend might need category info for breadcrumbs or filters
2. **SEO**: Category data helps with structured data/metadata
3. **Navigation**: Helps build category-based navigation if needed
4. **Data Completeness**: Provides full brand context

### Example Brand Response:

```json
{
  "name": "Apple",
  "slug": "apple",
  "logo": "https://logo.clearbit.com/apple.com",
  "isTopBrand": true,
  "level1": { "name": "E-commerce", "slug": "ecommerce" },
  "level2": { "name": "Electronics", "slug": "electronics" },
  "level3": null,
  "level4": { "name": "iPhone", "slug": "iphone" }
}
```

**On Frontend Display**:
- Shows: Brand name (`Apple`) and logo
- Doesn't show: Category information (but has it available if needed)

---

## 🎯 Which Brands Appear on E-Shop?

### Criteria (from backend filter):

```typescript
const filter = {
  isTopBrand: true  // ← ONLY THIS MATTERS
};
```

### Based on Your Database:

From the brand check we ran earlier, these brands have `isTopBrand: true`:

✅ **Top Brands (will appear on eshop)**:
1. Apple
2. Samsung
3. Dell
4. LEGO
5. Hasbro
6. L'Oréal
7. Penguin Random House
8. Microsoft

❌ **Regular Brands (won't appear)**:
- Sony, Bose, HP, Lenovo, Dove, Nivea, Olay, MAC, Maybelline, etc.

---

## 🔄 Alternative Brand APIs Available

Your backend supports multiple brand endpoints:

| Endpoint | URL | Filter Logic | Use Case |
|----------|-----|--------------|----------|
| **Get All Brands** | `GET /api/brands` | Can filter by `level1`, `level2`, `level3`, `level4` | Get brands by category |
| **Get Top Brands** | `GET /api/brands/top` | `isTopBrand: true` | E-shop page (current) |
| **Get Brand by ID** | `GET /api/brands/:id` | Single brand by ID | Brand details page |
| **Get Brand by Slug** | `GET /api/brands/slug/:slug` | Single brand by slug | SEO-friendly URLs |
| **Get Brands by Store** | `GET /api/brands/store/:storeId` | Brands for specific store | Store page |

---

## 🎨 Example: Get Brands by Category

### If you wanted to show Electronics brands only:

**Frontend API Call**:
```javascript
const response = await fetch(
  'https://backendcatalog.qliq.ae/api/brands?level2=68e72172e1764e8d5b19feca'
);
```

**Backend Logic** (from `getBrands` controller):
```typescript
// Lines 239-253
if (level1) {
  filter.level1 = new Types.ObjectId(level1 as string);
}
if (level2) {
  filter.level2 = new Types.ObjectId(level2 as string);
}
// ... applies category filters
```

**Would Return**: Apple, Samsung, Dell, HP, Lenovo, Sony, Bose (all Electronics brands)

---

## 📝 Summary: Current E-Shop Logic

### API Used:
```
GET https://backendcatalog.qliq.ae/api/brands/top
```

### Filter Applied:
```javascript
{
  isTopBrand: true  // Only top brands
}
```

### Category Involvement:
- **For filtering**: ❌ NO - Categories are NOT used to filter brands
- **In response**: ✅ YES - Category data IS included in the response
- **On display**: ❌ NO - Frontend doesn't show category info

### What Determines Brand Display:
```
Brand appears on eshop IF:
  ✅ isTopBrand = true
  ✅ isActive = true (default)
  
Category assignment:
  ⚠️ NOT REQUIRED for display
  ✅ RECOMMENDED for data completeness
  ✅ USEFUL if you later want category-based brand filtering
```

---

## 🎯 Answer to Your Question

### "Do I need to add categories to brands?"

**For E-Shop Display**: ❌ **NO** - Not required
- Brands display based on `isTopBrand` field only
- Categories are not used for filtering

**For Complete Functionality**: ✅ **YES** - Recommended
- If you use `GET /api/brands?level2=electronics` anywhere
- For product category assignment (products inherit from brand)
- For future features (category-based brand pages)
- For SEO and data organization

### Current Status:
✅ All your 25 brands have categories assigned
✅ Your eshop will show 8 top brands (based on `isTopBrand: true`)
✅ Category data is available but not currently used for filtering

---

## 🚀 How to Test

### Test the API directly:

```bash
# Get top brands
curl https://backendcatalog.qliq.ae/api/brands/top

# Get brands by category (Electronics)
curl "https://backendcatalog.qliq.ae/api/brands?level2=68e72172e1764e8d5b19feca"

# Get all brands
curl https://backendcatalog.qliq.ae/api/brands
```

### In browser:
1. Visit: `localhost:3000/eshop`
2. Open DevTools → Network tab
3. Look for request to: `brands/top`
4. Check response to see which brands were returned


