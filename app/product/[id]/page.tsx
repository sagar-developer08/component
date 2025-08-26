'use client'
import ProductDetails from '../../../components/productDetailPage/ProductDetails'
import ProductSections from '../../../components/productDetailPage/ProductSections'
import Navigation from '../../../components/Navigation'
import Footer from '../../../components/Footer'

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
    "/images/nike-airforce-01-white.jpg",
    "/images/nike-airforce-01-white-2.jpg",
    "/images/nike-airforce-01-white-3.jpg",
    "/images/nike-airforce-01-white-4.jpg",
    "/images/nike-airforce-01-white-5.jpg"
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
    image: "https://api.builder.io/api/v1/image/assets/TEMP/0ef2d416817956be0fe96760f14cbb67e415a446?width=644"
  },
  {
    id: "nike-dunk-low",
    title: "Vorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: "AED 1,600",
    rating: "4.0",
    deliveryTime: "30 Min",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/0ef2d416817956be0fe96760f14cbb67e415a446?width=644"
  },
  {
    id: "nike-air-max",
    title: "Vorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: "AED 1,600",
    rating: "4.0",
    deliveryTime: "30 Min",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/0ef2d416817956be0fe96760f14cbb67e415a446?width=644"
  },
  {
    id: "nike-airforce-01-black",
    title: "Vorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: "AED 1,600",
    rating: "4.0",
    deliveryTime: "30 Min",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/0ef2d416817956be0fe96760f14cbb67e415a446?width=644"
  }
]

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="product-page">
      <Navigation />

      <main className="main-content">
        <ProductDetails product={mockProduct} />
        <ProductSections relatedProducts={productData} />
      </main>

      <Footer />

      <style jsx>{`
        .product-page {
          min-height: 100vh;
          background: #fafafa;
        }

        .main-content {
          padding-top: 40px; /* Account for fixed navigation */
        }
      `}</style>
    </div>
  )
}
