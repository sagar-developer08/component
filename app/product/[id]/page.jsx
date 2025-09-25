'use client'
import ProductDetails from '../../../components/productDetailPage/ProductDetails'
import ProductSections from '../../../components/productDetailPage/ProductSections'
import Navigation from '../../../components/Navigation'
import Footer from '../../../components/Footer'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '@/store/slices/productsSlice'

// Mock product data - in a real app this would come from an API
const mockProduct = {
  id: "nike-airforce-01",
  name: "Airforce 01",
  brand: "Nike",
  price: 1200,
  originalPrice: 1600,
  discount: 25,
  rating: 5,
  stock: "In Stock",
  deliveryTime: "Available in 30 Minutes",
  boughtCount: "1000+ Bought in past month",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  images: [
    "/shoes.jpg",
    "/shoes.jpg",
    "/shoes.jpg",
    "/shoes.jpg"

  ],
  colors: ["White", "Black"],
  sizes: ["04", "05", "06", "07", "08"]
}

const productData = [
  {
    id: "nike-airforce-01",
    title: "Vorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: "AED 1,600",
    rating: "4.0",
    deliveryTime: "30 Min",
    image: "/shoes.jpg"
  },
  {
    id: "nike-dunk-low",
    title: "Vorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: "AED 1,600",
    rating: "4.0",
    deliveryTime: "30 Min",
    image: "/shoes.jpg"
  },
  {
    id: "nike-air-max",
    title: "Vorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: "AED 1,600",
    rating: "4.0",
    deliveryTime: "30 Min",
    image: "/shoes.jpg"
  },
  {
    id: "nike-airforce-01-black",
    title: "Vorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: "AED 1,600",
    rating: "4.0",
    deliveryTime: "30 Min",
    image: "/shoes.jpg"
  }
]

export default function ProductPage({ params }) {
  const dispatch = useDispatch()
  const { products, loading, error } = useSelector(state => state.products)
  const [productData, setProductData] = useState(null)
  const [productLoading, setProductLoading] = useState(true)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  useEffect(() => {
    const fetchProductBySlug = async () => {
      if (params.id) {
        try {
          setProductLoading(true)
          const response = await fetch(`${process.env.NEXT_PUBLIC_CATALOG_BASE_URL}/products/slug/${params.id}`)
          console.log(response)
          if (response.ok) {
            const data = await response.json()
            setProductData(data)
          }
        } catch (error) {
          console.error('Error fetching product:', error)
        } finally {
          setProductLoading(false)
        }
      }
    }

    fetchProductBySlug()
  }, [params.id])

  // Map the fetched product data to the format expected by ProductDetails
  const mappedProduct = productData ? {
    id: productData._id,
    slug: productData.slug || params.id,
    name: productData.title,
    brand: productData.brand_id?.name || 'Brand',
    price: productData.discount_price || productData.price,
    originalPrice: productData.price,
    discount: productData.discount_price ? Math.round(((productData.price - productData.discount_price) / productData.price) * 100) : 0,
    rating: productData.average_rating || 5,
    stock: productData.stock_quantity > 0 ? "In Stock" : "Out of Stock",
    deliveryTime: "Available in 30 Minutes",
    boughtCount: `${productData.total_reviews || 0}+ Bought in past month`,
    description: productData.description || productData.short_description || "Product description",
    images: productData.images?.map(img => img.url) || ["/shoes.jpg"],
    colors: productData.attributes?.color ? [productData.attributes.color] : ["Default"],
    sizes: ["04", "05", "06", "07", "08"] // Default sizes since not in API
  } : mockProduct

  // Map API products to the format expected by ProductSections
  const relatedProducts = products && products.length > 0 
    ? products.map(product => ({
        id: product._id || product.id,
        slug: product.slug || product._id || product.id,
        title: product.name || product.title || 'Product',
        price: product.price ? `AED ${product.price}` : 'AED 0',
        rating: product.rating || '4.0',
        deliveryTime: product.deliveryTime || '30 Min',
        image: product.image || product.images?.[0] || '/shoes.jpg'
      }))
    : productData // Fallback to mock data if no API data

  return (
    <div className="product-page">
      <Navigation />

      <main className="main-content">
        {productLoading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Loading product...</div>
        ) : (
          <>
            <ProductDetails product={mappedProduct} />
            <ProductSections 
              relatedProducts={relatedProducts}
              productData={productData}
            />
          </>
        )}
      </main>

      <Footer />

      <style jsx>{`
        .product-page {
          min-height: 100vh;
          background: #fafafa;
        }

        .main-content {
          margin-top: 20px;
    
        }
      `}</style>
    </div>
  )
}
