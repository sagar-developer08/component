'use client'

import Navigation from '@/components/Navigation'
import Categories from '@/components/Categories'
import ImageSlider from '@/components/ImageSlider'
import ProductCard from '@/components/ProductCard'
import StoreCard from '@/components/StoreCard'
import SectionHeader from '@/components/SectionHeader'
import Footer from '@/components/Footer'
import Image from 'next/image'
import FilterDrawer from '@/components/FilterDrawer'
import { useState } from 'react'

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
            title="Stores"
            showNavigation={false}
            showButton={true}
            buttonText="Filter"
            onButtonClick={() => setFilterOpen(true)}
          />
          <div className="products-grid">
            {productData.map((product, index) => (
              <StoreCard key={index} {...product} />
            ))}
          </div>
          <div className="products-grid">
            {productData.map((product, index) => (
              <StoreCard key={index} {...product} />
            ))}
          </div>
        </div>
      </section>

      <FilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} />

      <Footer />
    </main>
  )
}
