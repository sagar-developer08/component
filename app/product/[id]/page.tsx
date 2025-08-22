'use client'
import ProductDetails from '../../../components/ProductDetails'
import ProductSections from '../../../components/ProductSections'
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
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
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

const mockRelatedProducts = [
  {
    id: "nike-airforce-01-white",
    title: "Vorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: "AED 1,600",
    rating: "4.0",
    deliveryTime: "30 Min",
    image: "/images/nike-airforce-01-white.jpg",
    badge: "-$500 on your first order"
  },
  {
    id: "nike-dunk-low",
    title: "Vorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: "AED 1,600",
    rating: "4.0",
    deliveryTime: "30 Min",
    image: "/images/nike-dunk-low.jpg",
    badge: "-$500 on your first order"
  },
  {
    id: "nike-airforce-01-black",
    title: "Vorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: "AED 1,600",
    rating: "4.0",
    deliveryTime: "30 Min",
    image: "/images/nike-airforce-01-black.jpg",
    badge: "-$500 on your first order"
  },
  {
    id: "nike-air-max",
    title: "Vorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: "AED 1,600",
    rating: "4.0",
    deliveryTime: "30 Min",
    image: "/images/nike-air-max.jpg",
    badge: "-$500 on your first order"
  }
]

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="product-page">
      <Navigation />
      
      <main className="main-content">
        <ProductDetails product={mockProduct} />
        <ProductSections relatedProducts={mockRelatedProducts} />
      </main>
      
      <Footer />

      <style jsx>{`
        .product-page {
          min-height: 100vh;
          background: #fafafa;
        }

        .main-content {
          padding-top: 80px; /* Account for fixed navigation */
        }
      `}</style>
    </div>
  )
}
