'use client'

import Navigation from '@/components/Navigation'
import Categories from '@/components/Categories'
import ImageSlider from '@/components/ImageSlider'
import ProductCard from '@/components/ProductCard'
import StoreCard from '@/components/StoreCard'
import SectionHeader from '@/components/SectionHeader'
import Banner from '@/components/Banner'
import CategoryCard from '@/components/CategoryCard'
import InfluencerCard from '@/components/InfluencerCard'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import QuickNav from '@/components/QuickNav'
import FilterDrawer from '@/components/FilterDrawer'
import Image from 'next/image'
import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSupermarketStores } from '@/store/slices/storesSlice'
import { fetchProducts } from '@/store/slices/productsSlice'
import { useRouter } from 'next/navigation'
import { buildFacetsFromProducts, applyFiltersToProducts } from '@/utils/facets'

const productData = [
  {
    id: "nike-airforce-01",
    title: "Vorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: "AED 1,600",
    rating: "4.0",
    deliveryTime: "30 Min",
    image: "/iphone.jpg"
  },
  {
    id: "nike-dunk-low",
    title: "Vorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: "AED 1,600",
    rating: "4.0",
    deliveryTime: "30 Min",
    image: "/iphone.jpg"
  },
  {
    id: "nike-air-max",
    title: "Vorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: "AED 1,600",
    rating: "4.0",
    deliveryTime: "30 Min",
    image: "/iphone.jpg"
  },
  {
    id: "nike-airforce-01-black",
    title: "Vorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: "AED 1,600",
    rating: "4.0",
    deliveryTime: "30 Min",
    image: "/iphone.jpg"
  }
]

export default function Home() {
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState({})
  const dispatch = useDispatch()
  const router = useRouter()
  const { supermarketStores, loading, error } = useSelector(state => state.stores)
  const { products } = useSelector(state => state.products)

  useEffect(() => {
    dispatch(fetchSupermarketStores())
    dispatch(fetchProducts())
  }, [dispatch])

  // Build facets from products for proper filter display
  const facets = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) {
      return []
    }
    return buildFacetsFromProducts(products)
  }, [products])

  // Apply filters to products
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) {
      return productData // fallback to static data
    }
    const filtered = applyFiltersToProducts(products, selectedFilters)
    return filtered.length > 0 ? filtered.map(transformProductData) : productData
  }, [products, selectedFilters])

  const handleFilterChange = (key, value) => {
    setSelectedFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSelectedFilters({})
  }

  // Transform product data helper function
  const transformProductData = (apiProduct) => {
    const primaryImage = apiProduct.images?.find(img => img.is_primary) || apiProduct.images?.[0];
    const imageUrl = primaryImage?.url || 'https://api.builder.io/api/v1/image/assets/TEMP/0ef2d416817956be0fe96760f14cbb67e415a446?width=644';
    const savings = apiProduct.is_offer && apiProduct.price && apiProduct.discount_price
      ? apiProduct.price - apiProduct.discount_price
      : 0;

    return {
      id: apiProduct._id || apiProduct.slug,
      title: apiProduct.title || 'Product Title',
      price: `AED ${apiProduct.discount_price || apiProduct.price || '0'}`,
      rating: apiProduct.average_rating?.toString() || '0',
      deliveryTime: '30 Min',
      image: imageUrl,
      badge: apiProduct.is_offer && savings > 0 ? `Save AED ${savings}` : null
    }
  }
  return (
    <main className="home-page">
      <Navigation />
      {/* <QuickNav /> */}

      <Categories />

      {/* Fastest Delivery */}
      <section className="section">
        <div className="container">
          <SectionHeader title="Fastest Delivery" showNavigation={true} />
          <div className="products-grid">
            {productData.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </div>
      </section>


      {/* Fastest Delivery */}

      <section className="section">
        <div className="container">
          <SectionHeader
            title="Supermarket"
            showNavigation={false}
            showButton={false}
            buttonText="Filter"
            onButtonClick={() => setFilterOpen(true)}
          />
          {error && (
            <div style={{ margin: '16px 0', color: 'red' }}>{error}</div>
          )}
          <div className="stores-grid">
            {(loading && (!supermarketStores || supermarketStores.length === 0)) ? (
              productData.map((product, index) => (
                <StoreCard key={`skeleton-${index}`} {...product} />
              ))
            ) : (
              (supermarketStores || []).map((store, index) => (
                <StoreCard
                  key={store._id || store.id || `store-${index}`}
                  id={store._id || store.id}
                  title={store.name || 'Store'}
                  category={store.category?.name || store.category || 'General'}
                  rating={store.rating || '4.0'}
                  deliveryTime={store.deliveryTime || '30 Min'}
                  image= '/iphone.jpg'
                  location={(store.address && store.address.city) || 'Dubai, UAE'}
                  onClick={() => {
                    const slug = store.slug || store.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                    router.push(`/${slug}?storeId=${store._id || store.id}`);
                  }}
                />
              ))
            )}
          </div>
        </div>
      </section>
      <FilterDrawer 
        open={filterOpen} 
        onClose={() => setFilterOpen(false)}
        facets={facets}
        selected={selectedFilters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />
      <Footer />
    </main>
  )
}
