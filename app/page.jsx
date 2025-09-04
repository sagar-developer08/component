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
import StoreCard from '@/components/StoreCard'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation as SwiperNavigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

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
    id: "nike-airforce-01",
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
    name: "Samsung",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/12ba4121022e746495773eb8df2e6b4add90148f?width=412"
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

const storeData = [
  {
    id: "store-1",
    name: "TechHub Electronics",
    category: "Electronics",
    rating: "4.8",
    deliveryTime: "45 Min",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/12ba4121022e746495773eb8df2e6b4add90148f?width=412",
    location: "Dubai Mall",
    isTopStore: true,
    isNewStore: false
  },
  {
    id: "store-2", 
    name: "Fashion Forward",
    category: "Fashion",
    rating: "4.6",
    deliveryTime: "30 Min",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/5944fb96605e58c0b0a225611b6e462119c6f6bd?width=412",
    location: "Marina Walk",
    isTopStore: true,
    isNewStore: false
  },
  {
    id: "store-3",
    name: "Home & Garden Plus",
    category: "Home & Garden",
    rating: "4.7",
    deliveryTime: "60 Min",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/66b97f6957f6e465c502e41a9cda2d8b72cc8817?width=412",
    location: "JBR",
    isTopStore: true,
    isNewStore: false
  },
  {
    id: "store-4",
    name: "Sports Central",
    category: "Sports",
    rating: "4.5",
    deliveryTime: "40 Min",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/31e4e4b864102352c5e9e341e72064d8251f7320?width=412",
    location: "Downtown",
    isTopStore: true,
    isNewStore: false
  },
  {
    id: "store-5",
    name: "Beauty Essentials",
    category: "Beauty",
    rating: "4.9",
    deliveryTime: "25 Min",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/0c4ed4c2cd24b5e148c3022cb0106476b3b63754?width=412",
    location: "City Centre",
    isTopStore: true,
    isNewStore: false
  },
  {
    id: "store-6",
    name: "Gourmet Delights",
    category: "Food",
    rating: "4.4",
    deliveryTime: "35 Min",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/b6331ae52c82eb8a247a99158e1d71d242182070?width=412",
    location: "DIFC",
    isTopStore: true,
    isNewStore: false
  },
  {
    id: "store-7",
    name: "Bookworm Paradise",
    category: "Books",
    rating: "4.3",
    deliveryTime: "50 Min",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/12ba4121022e746495773eb8df2e6b4add90148f?width=412",
    location: "Knowledge Village",
    isTopStore: false,
    isNewStore: true
  },
  {
    id: "store-8",
    name: "Pet Care Plus",
    category: "Pet Supplies",
    rating: "4.6",
    deliveryTime: "45 Min",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/5944fb96605e58c0b0a225611b6e462119c6f6bd?width=412",
    location: "Jumeirah",
    isTopStore: false,
    isNewStore: true
  }
]

export default function Home() {
  const router = useRouter();
  const swiperRef = useRef(null);
  const topStoresSwiperRef = useRef(null);
  const topBrandsSwiperRef = useRef(null);
  const bestsellersSwiperRef = useRef(null);
  const offersSwiperRef = useRef(null);
  const specialDealsSwiperRef = useRef(null);
  const featuredOffersSwiperRef = useRef(null);
  const [activeStoreFilter, setActiveStoreFilter] = useState('all');

  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const handleTopStoresPrev = () => {
    if (topStoresSwiperRef.current && topStoresSwiperRef.current.swiper) {
      topStoresSwiperRef.current.swiper.slidePrev();
    }
  };

  const handleTopStoresNext = () => {
    if (topStoresSwiperRef.current && topStoresSwiperRef.current.swiper) {
      topStoresSwiperRef.current.swiper.slideNext();
    }
  };

  const handleTopBrandsPrev = () => {
    if (topBrandsSwiperRef.current && topBrandsSwiperRef.current.swiper) {
      topBrandsSwiperRef.current.swiper.slidePrev();
    }
  };

  const handleTopBrandsNext = () => {
    if (topBrandsSwiperRef.current && topBrandsSwiperRef.current.swiper) {
      topBrandsSwiperRef.current.swiper.slideNext();
    }
  };

  const handleBestsellersPrev = () => {
    if (bestsellersSwiperRef.current && bestsellersSwiperRef.current.swiper) {
      bestsellersSwiperRef.current.swiper.slidePrev();
    }
  };

  const handleBestsellersNext = () => {
    if (bestsellersSwiperRef.current && bestsellersSwiperRef.current.swiper) {
      bestsellersSwiperRef.current.swiper.slideNext();
    }
  };

  const handleOffersPrev = () => {
    if (offersSwiperRef.current && offersSwiperRef.current.swiper) {
      offersSwiperRef.current.swiper.slidePrev();
    }
  };

  const handleOffersNext = () => {
    if (offersSwiperRef.current && offersSwiperRef.current.swiper) {
      offersSwiperRef.current.swiper.slideNext();
    }
  };

  const handleSpecialDealsPrev = () => {
    if (specialDealsSwiperRef.current && specialDealsSwiperRef.current.swiper) {
      specialDealsSwiperRef.current.swiper.slidePrev();
    }
  };

  const handleSpecialDealsNext = () => {
    if (specialDealsSwiperRef.current && specialDealsSwiperRef.current.swiper) {
      specialDealsSwiperRef.current.swiper.slideNext();
    }
  };

  const handleFeaturedOffersPrev = () => {
    if (featuredOffersSwiperRef.current && featuredOffersSwiperRef.current.swiper) {
      featuredOffersSwiperRef.current.swiper.slidePrev();
    }
  };

  const handleFeaturedOffersNext = () => {
    if (featuredOffersSwiperRef.current && featuredOffersSwiperRef.current.swiper) {
      featuredOffersSwiperRef.current.swiper.slideNext();
    }
  };

  const handleStoreFilter = (filter) => {
    setActiveStoreFilter(filter);
  };

  const handleSeeAllStores = () => {
    router.push('/store');
  };

  const handleSeeAllFeaturedOffers = () => {
    router.push('/ecommerce');
  };

  const getFilteredStores = () => {
    switch (activeStoreFilter) {
      case 'top':
        return storeData.filter(store => store.isTopStore);
      case 'new':
        return storeData.filter(store => store.isNewStore);
      default:
        return storeData;
    }
  };

  return (
    <>
      <Navigation />
      <main className="home-page">
        {/* <QuickNav /> */}

        <Categories />
        <section className="section">
          <div className="container">
            <ImageSlider />
          </div>
        </section>

        {/* Bestsellers Section */}
        <section className="section">
          <div className="container">
            <SectionHeader 
              title="Our Bestsellers" 
              showNavigation={true}
              onPrev={handleBestsellersPrev}
              onNext={handleBestsellersNext}
            />
            <Swiper
              ref={bestsellersSwiperRef}
              modules={[SwiperNavigation]}
              slidesPerView="auto"
              spaceBetween={24}
              grabCursor={true}
              freeMode={true}
              style={{ width: '1360px' }}
            >
              {productData.map((product, index) => (
                <SwiperSlide key={index} style={{ width: 'auto' }}>
                  <ProductCard {...product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Other Categories Section */}
        <section className="section">
          <div className="container">
            <SectionHeader title="Other Categories" showNavigation={true} />
            <div className="categories-grid">
              {categoryData.map((category, index) => (
                <CategoryCard key={index} {...category} />
              ))}
            </div>
          </div>
        </section>

        {/* Banner 1 */}
        <Banner
          title="How To Refer & Earn on QLIQ"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis."
          buttonText="Learn More"
          backgroundImage="https://api.builder.io/api/v1/image/assets/TEMP/df43c644b630e11e75c5cfa0820db4ef46176c34?width=2720"
        />

        {/* Offers Section */}
        <section className="section">
          <div className="container">
            <SectionHeader 
              title="Offers For You" 
              showNavigation={true}
              onPrev={handleOffersPrev}
              onNext={handleOffersNext}
            />
            <Swiper
              ref={offersSwiperRef}
              modules={[SwiperNavigation]}
              slidesPerView="auto"
              spaceBetween={24}
              grabCursor={true}
              freeMode={true}
              style={{ width: '1360px' }}
            >
              {productData.map((product, index) => (
                <SwiperSlide key={index} style={{ width: 'auto' }}>
                  <ProductCard {...product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Special Deals Section */}
        <section className="section">
          <div className="container">
            <SectionHeader
              title="Special Deals For QLIQ+"
              showNavigation={true}
              showButton={true}
              buttonText="Upgrade"
              onPrev={handleSpecialDealsPrev}
              onNext={handleSpecialDealsNext}
            />
            <Swiper
              ref={specialDealsSwiperRef}
              modules={[SwiperNavigation]}
              slidesPerView="auto"
              spaceBetween={24}
              grabCursor={true}
              freeMode={true}
              style={{ width: '1360px' }}
            >
              {productData.map((product, index) => (
                <SwiperSlide key={index} style={{ width: 'auto' }}>
                  <ProductCard {...product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Banner 2 */}
        <Banner
          title="How To Pay Using Qoyns"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis."
          buttonText="Learn More"
          backgroundImage="https://api.builder.io/api/v1/image/assets/TEMP/30138089958b1dd1eb8be111e17374ed71a2b6c7?width=2720"
        />

        {/* Top Brands Section */}
        <section className="section">
          <div className="container">
            <SectionHeader 
              title="Top Brands" 
              showNavigation={true}
              onPrev={handleTopBrandsPrev}
              onNext={handleTopBrandsNext}
            />
            <Swiper
              ref={topBrandsSwiperRef}
              modules={[SwiperNavigation]}
              slidesPerView="auto"
              spaceBetween={24}
              grabCursor={true}
              freeMode={true}
              style={{ width: '1360px' }}
            >
              {brandData.map((brand, index) => (
                <SwiperSlide key={index} style={{ width: 'auto' }}>
                  <CategoryCard {...brand} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Featured Offers Section */}
        <section className="section">
          <div className="container">
            <SectionHeader 
              title="Featured Offers" 
              showNavigation={true}
              showButton={true} 
              buttonText="See All"
              onButtonClick={handleSeeAllFeaturedOffers}
              onPrev={handleFeaturedOffersPrev}
              onNext={handleFeaturedOffersNext}
            />
            <Swiper
              ref={featuredOffersSwiperRef}
              modules={[SwiperNavigation]}
              slidesPerView="auto"
              spaceBetween={24}
              grabCursor={true}
              freeMode={true}
              style={{ width: '1360px' }}
            >
              {productData.map((product, index) => (
                <SwiperSlide key={index} style={{ width: 'auto' }}>
                  <ProductCard {...product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Top Stores Section */}
        <section className="section">
          <div className="container">
            <SectionHeader 
              title="Top Stores" 
              showNavigation={true}
              showButton={true}
              buttonText={"See All"}
              onButtonClick={handleSeeAllStores}
              onPrev={handleTopStoresPrev}
              onNext={handleTopStoresNext}
            />
            <Swiper
              ref={topStoresSwiperRef}
              modules={[SwiperNavigation]}
              slidesPerView="auto"
              spaceBetween={24}
              grabCursor={true}
              freeMode={true}
              style={{ width: '1360px' }}
            >
              {getFilteredStores().map((store, index) => (
                <SwiperSlide key={store.id} style={{ width: 'auto' }}>
                  <CategoryCard name={store.name} image={store.image} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Banner 3 */}
        <Banner
          title="How To Save on QLIQ"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis."
          buttonText="Learn More"
          backgroundImage="https://api.builder.io/api/v1/image/assets/TEMP/5f1b6b2bdfa8e9703d7d31aedb5e297922c9a082?width=2720"
        />

        {/* New Stores Section */}
        <section className="section">
          <div className="container">
            <SectionHeader
              title="New Stores on QLIQ"
              showNavigation={true}
              onPrev={handlePrev}
              onNext={handleNext}
            />
            <Swiper
              ref={swiperRef}
              modules={[SwiperNavigation]}
              slidesPerView="auto"
              spaceBetween={24}
              grabCursor={true}
              freeMode={true}
              style={{ width: '1360px' }}
            >
              {brandData.map((store, index) => (
                <SwiperSlide key={index} style={{ width: 'auto' }}>
                  <CategoryCard {...store} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Banner 4 */}
        <Banner
          title="How To Earn Doing a GIG"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis."
          buttonText="Learn More"
          backgroundImage="https://api.builder.io/api/v1/image/assets/TEMP/f70eb37fe9b38478a141ee9536f057811ff47ace?width=2720"
        />

        {/* FAQ Section */}
        <FAQ />

        {/* Final Banner */}
        <Banner
          title="Become a Vendor"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis."
          buttonText="Learn More"
          backgroundImage="https://api.builder.io/api/v1/image/assets/TEMP/c1726d63175ccf7d26ef79e2d2a0ffde926ef9d0?width=2720"
        />

        <Footer />
      </main>
    </>
  )
}
