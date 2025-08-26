'use client'

import Navigation from '@/components/Navigation'
import Categories from '@/components/Categories'
import ImageSlider from '@/components/ImageSlider'
import ProductCard from '@/components/ProductCard'
import SectionHeader from '@/components/SectionHeader'
import Banner from '@/components/Banner'
import CategoryCard from '@/components/CategoryCard'
import InfluencerCard from '@/components/InfluencerCard'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import QuickNav from '@/components/QuickNav'
import Image from 'next/image'

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

const categoryData = [
  {
    name: "Pet Supplies",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/b96c7d3062a93a3b6d8e9a2a4bd11acfa542dced?width=412"
  },
  {
    name: "Health n Beauty",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/81e3ee1beeaa2c8941600c27d3ec9733bac0869c?width=412"
  },
  {
    name: "Books",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/5839901b9e3641626fef47388dc1036c852a0aa5?width=412"
  },
  {
    name: "Computers",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/4a25e8a2b689f4d8cf2f809de9e46f2c26c36d46?width=412"
  },
  {
    name: "Electronics",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/bb3de20fdb53760293d946ca033adbf4489bed56?width=412"
  },
  {
    name: "Home Appliances",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/f291940d1feaf8e5cb0a7335f629e12091d26a73?width=412"
  }
]

const brandData = [
  {
    name: "Samsung",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/12ba4121022e746495773eb8df2e6b4add90148f?width=412"
  },
  {
    name: "Nike",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/5944fb96605e58c0b0a225611b6e462119c6f6bd?width=412"
  },
  {
    name: "Apple",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/66b97f6957f6e465c502e41a9cda2d8b72cc8817?width=412"
  },
  {
    name: "Sony",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/31e4e4b864102352c5e9e341e72064d8251f7320?width=412"
  },
  {
    name: "Nothing",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/0c4ed4c2cd24b5e148c3022cb0106476b3b63754?width=412"
  },
  {
    name: "OnePlus",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/b6331ae52c82eb8a247a99158e1d71d242182070?width=412"
  }
]

const influencerData = [
  {
    name: "Ama Cruize",
    backgroundImage: "https://api.builder.io/api/v1/image/assets/TEMP/7f8ab7b79b01d0251928e6b4cffc6477e9d6a199?width=696",
    earned: "$1M",
    potential: "$2.9M",
    saved: "$2M",
    description: "I am a Social Media Influencer based in Austria, I am passionate about beauty products!",
    tags: ["Bronze Member", "QLIQR Since 2025", "50K Followers"],
    memberType: "Bronze Member",
    followerCount: "50K",
    yearJoined: "2025"
  },
  {
    name: "Ama Cruize",
    backgroundImage: "https://api.builder.io/api/v1/image/assets/TEMP/8169ee624ec53e032e826b932e875eb9b273e280?width=696",
    earned: "$1M",
    potential: "$2.9M",
    saved: "$2M",
    description: "I am a Social Media Influencer based in Austria, I am passionate about beauty products!",
    tags: ["Bronze Member", "QLIQR Since 2025", "50K Followers"],
    memberType: "Bronze Member",
    followerCount: "50K",
    yearJoined: "2025"
  },
  {
    name: "Ama Cruize",
    backgroundImage: "https://api.builder.io/api/v1/image/assets/TEMP/d0bf09fbeeb59ddd30e520331d8ff0d09fc9f388?width=696",
    earned: "$1M",
    potential: "$2.9M",
    saved: "$2M",
    description: "I am a Social Media Influencer based in Austria, I am passionate about beauty products!",
    tags: ["Bronze Member", "QLIQR Since 2025", "50K Followers"],
    memberType: "Bronze Member",
    followerCount: "50K",
    yearJoined: "2025"
  },
  {
    name: "Ama Cruize",
    backgroundImage: "https://api.builder.io/api/v1/image/assets/TEMP/7f8ab7b79b01d0251928e6b4cffc6477e9d6a199?width=696",
    earned: "$1M",
    potential: "$2.9M",
    saved: "$2M",
    description: "I am a Social Media Influencer based in Austria, I am passionate about beauty products!",
    tags: ["Bronze Member", "QLIQR Since 2025", "50K Followers"],
    memberType: "Bronze Member",
    followerCount: "50K",
    yearJoined: "2025"
  }
]

export default function Home() {
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
          />
          <div className="products-grid">
            {productData.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
          <div className="products-grid">
            {productData.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </div>
      </section>


      <Footer />
    </main>
  )
}
