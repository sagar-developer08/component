'use client'

import Navigation from '@/components/Navigation'
import Categories from '@/components/Categories'
import ImageSlider from '@/components/ImageSlider'
import ProductCard from '@/components/ProductCard'
import StoreCard from '@/components/StoreCard'
import SectionHeader from '@/components/SectionHeader'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGeneralStores } from '@/store/slices/storesSlice'
import { useRouter } from 'next/navigation'

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
  const dispatch = useDispatch()
  const { generalStores, loading, error } = useSelector(state => state.stores)
  const router = useRouter()

  useEffect(() => {
    dispatch(fetchGeneralStores())
  }, [dispatch])
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

      <section className="section">
        <div className="container">
          <SectionHeader
            title="Stores"
            showNavigation={false}
            showButton={false}
            buttonText="See All"
          />
          {error && (
            <div style={{ margin: '16px 0', color: 'red' }}>{error}</div>
          )}
          <div className="stores-grid">
            {(loading && (!generalStores || generalStores.length === 0)) ? (
              productData.map((product, index) => (
                <StoreCard key={`skeleton-${index}`} {...product} />
              ))
            ) : (
              (generalStores || []).map((store, index) => (
                <StoreCard
                  key={store._id || store.id || `store-${index}`}
                  id={store._id || store.id}
                  title={store.name || store.title || 'Store'}
                  category={store.category?.name || store.category || 'General'}
                  rating={store.rating || '4.0'}
                  deliveryTime={store.deliveryTime || '30 Min'}
                  image={store.image || store.logo || '/iphone.jpg'}
                  location={(store.address && store.address.city) || 'Dubai, UAE'}
                  onClick={() => router.push(`/storeDetail?storeId=${store._id || store.id}`)}
                />
              ))
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
