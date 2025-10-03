// Add client directive to allow hooks
'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, usePathname } from 'next/navigation'
import CartDrawer from './CartDrawer'
import WishlistDrawer from './WishlistDrawer'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import LocationModal from './LocationModal'
import SearchSuggestions from './SearchSuggestions'
import { useAuth } from '../contexts/AuthContext'
import { fetchCart } from '@/store/slices/cartSlice'
import { fetchWishlist } from '@/store/slices/wishlistSlice'
import { getUserFromCookies } from '@/utils/userUtils'

const Navigation = memo(function Navigation() {
  // Measure navbar height so we can add a spacer that preserves layout
  const navRef = useRef(null)
  const searchInputRef = useRef(null)
  const dispatch = useDispatch()
  const [navHeight, setNavHeight] = useState(0)
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isDebouncing, setIsDebouncing] = useState(false)
  
  // This effect has been removed as we no longer need to open the cart drawer automatically
  
  const router = useRouter()
  const pathname = usePathname()
  const { requireAuth, loginModalOpen, closeLoginModal, isAuthenticated } = useAuth()
  const [registerModalOpen, setRegisterModalOpen] = useState(false)
  const [locationModalOpen, setLocationModalOpen] = useState(false)
  const [currentLocation, setCurrentLocation] = useState('')
  
  // Determine active nav based on current path
  const getActiveNav = () => {
    if (pathname === '/') return 'Discovery'
    if (pathname === '/hypermarket') return 'Hypermarket'
    if (pathname === '/eshop') return 'E-Shop'
    if (pathname === '/supermarket') return 'Supermarket'
    if (pathname === '/stores') return 'Stores'
    // For any other route (including details, profile, checkout, etc.), do not highlight
    return ''
  }
  const activeNav = getActiveNav()
  const wishlistCount = useSelector(state => state.wishlist.items?.length || 0)
  const cartCount = useSelector(state => state.cart.itemsCount || 0)
  const displayCartCount = isAuthenticated ? cartCount : 0
  const displayWishlistCount = isAuthenticated ? wishlistCount : 0

  const handleSearchClick = () => {
    setSearchOpen(!searchOpen)
    if (!searchOpen) {
      // Focus the input when opening
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus()
        }
      }, 100)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results or perform search
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
      setDebouncedQuery('')
    }
  }

  const handleSearchClose = () => {
    setSearchOpen(false)
    setSearchQuery('')
    setDebouncedQuery('')
    setIsDebouncing(false)
  }

  const handleSuggestionSelect = () => {
    setSearchOpen(false)
    setSearchQuery('')
    setDebouncedQuery('')
    setIsDebouncing(false)
  }

  useEffect(() => {
    const updateHeight = () => {
      if (navRef.current) {
        setNavHeight(navRef.current.offsetHeight)
      }
    }
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  // Reset local badge counts when logged out (defensive; actual state remains in Redux)
  useEffect(() => {
    const handleLogout = () => {
      // No-op: counts derive from Redux but we keep this if we need side effects
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('app:logout', handleLogout)
      return () => window.removeEventListener('app:logout', handleLogout)
    }
  }, [])

  // When authenticated, fetch cart and wishlist to populate counts
  useEffect(() => {
    if (!isAuthenticated) return
    (async () => {
      try {
        const userId = await getUserFromCookies()
        if (userId) {
          dispatch(fetchCart(userId))
        }
      } catch (e) {
        console.error('Nav: failed to fetch cart after login', e)
      }
      dispatch(fetchWishlist())
    })()
  }, [isAuthenticated, dispatch])

  // Debounce search query
  useEffect(() => {
    if (searchQuery) {
      setIsDebouncing(true)
    }
    
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
      setIsDebouncing(false)
    }, 500) // 500ms delay

    return () => {
      clearTimeout(timer)
      setIsDebouncing(false)
    }
  }, [searchQuery])

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchOpen && !event.target.closest('.search-input-wrapper') && !event.target.closest('.action-btn')) {
        setSearchOpen(false)
        setSearchQuery('')
        setDebouncedQuery('')
        setIsDebouncing(false)
      }
    }

    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchOpen])

  const navItems = [
    {
      key: 'Discovery', 
      path: '/',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10.3333 1C14.9358 1 18.6667 4.73083 18.6667 9.33333C18.6667 13.9358 14.9358 17.6667 10.3333 17.6667C5.73083 17.6667 2 13.9358 2 9.33333C2 4.73083 5.73083 1 10.3333 1ZM13.8692 5.7975C13.5742 5.50333 9.74417 6.38667 8.56583 7.56583C7.3875 8.74417 6.50333 12.5742 6.7975 12.8692C7.0925 13.1633 10.9225 12.28 12.1008 11.1008C13.28 9.9225 14.1633 6.0925 13.8692 5.7975ZM10.3333 8.5C10.5543 8.5 10.7663 8.5878 10.9226 8.74408C11.0789 8.90036 11.1667 9.11232 11.1667 9.33333C11.1667 9.55435 11.0789 9.76631 10.9226 9.92259C10.7663 10.0789 10.5543 10.1667 10.3333 10.1667C10.1123 10.1667 9.90036 10.0789 9.74408 9.92259C9.5878 9.76631 9.5 9.55435 9.5 9.33333C9.5 9.11232 9.5878 8.90036 9.74408 8.74408C9.90036 8.5878 10.1123 8.5 10.3333 8.5Z"
            fill={activeNav === 'Discovery' ? 'white' : '#000'}
          />
        </svg>
      ), label: 'Discovery'
    },
    {
      key: 'Hypermarket', 
      path: '/hypermarket',
      icon: (
        <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20">
          <path
            d="M1.3335 15L1.75016 13.3333H6.3335L5.91683 15H1.3335ZM3.00016 11.6667L3.41683 10H8.8335L8.41683 11.6667H3.00016ZM15.9793 16.6667L16.396 13.3333L17.0002 8.33333L17.2085 6.6875L15.9793 16.6667ZM5.50016 18.3333C5.04183 18.3333 4.64961 18.1703 4.3235 17.8442C3.99738 17.5181 3.83405 17.1256 3.8335 16.6667H15.9793L17.2085 6.6875H14.9168L14.6877 8.45833C14.6599 8.69444 14.5557 8.87861 14.3752 9.01083C14.1946 9.14306 13.9863 9.195 13.7502 9.16667C13.5141 9.13833 13.3302 9.0375 13.1985 8.86417C13.0668 8.69083 13.0146 8.48611 13.0418 8.25L13.2293 6.6875H9.91683L9.68766 8.4375C9.65988 8.67361 9.55572 8.86111 9.37516 9C9.19461 9.13889 8.98627 9.19444 8.75016 9.16667C8.51405 9.13889 8.32655 9.03472 8.18766 8.85417C8.04877 8.67361 7.99322 8.46528 8.021 8.22917L8.2085 6.6875H5.0835C5.13905 6.21528 5.31961 5.81611 5.62516 5.49C5.93072 5.16389 6.30572 5.00056 6.75016 5H8.41683C8.52794 3.95833 8.88572 3.1425 9.49016 2.5525C10.0946 1.9625 10.9174 1.66722 11.9585 1.66667C12.8474 1.66667 13.5871 1.99667 14.1777 2.65667C14.7682 3.31667 15.0563 4.09778 15.0418 5H17.1668C17.6668 5.01389 18.0835 5.20833 18.4168 5.58333C18.7502 5.95833 18.8821 6.39583 18.8127 6.89583L17.5627 16.8958C17.5071 17.3125 17.3229 17.6564 17.0102 17.9275C16.6974 18.1986 16.3329 18.3339 15.9168 18.3333H5.50016ZM10.0835 5H13.396C13.4099 4.54167 13.2538 4.14944 12.9277 3.82333C12.6016 3.49722 12.2091 3.33389 11.7502 3.33333C11.2641 3.33333 10.8785 3.48278 10.5935 3.78167C10.3085 4.08056 10.1385 4.48667 10.0835 5Z"
            fill={activeNav === 'Hypermarket' ? 'white' : '#000'}
          />
        </svg>
      ), label: 'Hypermarket'
    },
    {
      key: 'Stores', 
      path: '/stores',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M16.6636 8.85083V15.8333C16.6636 16.2754 16.488 16.6993 16.1755 17.0118C15.8629 17.3244 15.439 17.5 14.9969 17.5H5.00361C4.56173 17.4998 4.13802 17.3241 3.82564 17.0115C3.51326 16.699 3.33778 16.2752 3.33778 15.8333V8.85083M6.25194 7.29167L6.66861 2.5M6.25194 7.29167C6.25194 9.71 10.0003 9.71 10.0003 7.29167M6.25194 7.29167C6.25194 9.93833 1.95611 9.39167 2.55778 7.085L3.42861 3.74583C3.52168 3.38919 3.73034 3.07346 4.02196 2.84804C4.31358 2.62262 4.67169 2.50022 5.04028 2.5H14.9603C15.3289 2.50022 15.687 2.62262 15.9786 2.84804C16.2702 3.07346 16.4789 3.38919 16.5719 3.74583L17.4428 7.085C18.0444 9.3925 13.7486 9.93833 13.7486 7.29167M10.0003 7.29167V2.5M10.0003 7.29167C10.0003 9.71 13.7486 9.71 13.7486 7.29167M13.7486 7.29167L13.3319 2.5"
            stroke={activeNav === 'Stores' ? 'white' : '#000'}
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ), label: 'Stores'
    },
    {
      key: 'E-Shop', 
      path: '/eshop',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M3 3H8.25V8.25H3V3ZM11.75 3H17V8.25H11.75V3ZM3 11.75H8.25V17H3V11.75ZM11.75 14.375C11.75 15.0712 12.0266 15.7389 12.5188 16.2312C13.0111 16.7234 13.6788 17 14.375 17C15.0712 17 15.7389 16.7234 16.2312 16.2312C16.7234 15.7389 17 15.0712 17 14.375C17 13.6788 16.7234 13.0111 16.2312 12.5188C15.7389 12.0266 15.0712 11.75 14.375 11.75C13.6788 11.75 13.0111 12.0266 12.5188 12.5188C12.0266 13.0111 11.75 13.6788 11.75 14.375Z"
            stroke={activeNav === 'E-Shop' ? 'white' : '#000'}
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ), label: 'E-Shop'
    },
    {
      key: 'Supermarket', 
      path: '/supermarket',
      icon: (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path
            d="M2.64293 12.1429V18.5714C2.64293 18.7609 2.71818 18.9426 2.85214 19.0765C2.98609 19.2105 3.16777 19.2857 3.35721 19.2857H17.6429C17.8324 19.2857 18.014 19.2105 18.148 19.0765C18.282 18.9426 18.3572 18.7609 18.3572 18.5714V12.1429M1.21436 5V7.85714C1.21436 8.04658 1.28961 8.22826 1.42356 8.36222C1.55752 8.49617 1.7392 8.57143 1.92864 8.57143H19.0715C19.2609 8.57143 19.4426 8.49617 19.5766 8.36222C19.7105 8.22826 19.7858 8.04658 19.7858 7.85714V5M1.21436 5L2.95721 1.5C3.07702 1.26223 3.26088 1.06268 3.48806 0.923848C3.71524 0.785016 3.97669 0.712433 4.24293 0.714285H16.7572C17.0234 0.712433 17.2849 0.785016 17.5121 0.923848C17.7393 1.06268 17.9231 1.26223 18.0429 1.5L19.7858 5M1.21436 5H19.7858M11.9286 12.1429V19.2857M2.64293 14.2857H11.9286"
            stroke={activeNav === 'Supermarket' ? 'white' : '#000'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ), label: 'Supermarket'
    }
  ]

  return (
    <>
      <div>
        <div className="navbar" ref={navRef}>
          <div className="container">
            <div className="navbar-content">
              <div className="logo">
                <Image
                  src="/logo.png"
                  alt="QLIQ Logo"
                  width={100}
                  height={44}
                  style={{ aspectRatio: '49/22' }}
                />
              </div>

              {/* nav-menu */}
              <div className="nav-menu">
                {!searchOpen && navItems.map(item => (
                  <div
                    key={item.key}
                    className={`nav-item${activeNav === item.key ? ' active' : ''}`}
                    onClick={() => router.push(item.path)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                ))}
                {searchOpen && (
                  <form onSubmit={handleSearchSubmit} className="search-form">
                    <div className="search-input-wrapper">
                      {isDebouncing ? (
                        <div className="search-loading">
                          <div className="loading-spinner"></div>
                        </div>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="search-icon">
                          <circle cx="9" cy="9" r="8" stroke="#666" strokeWidth="1.5" />
                          <path d="m21 21-4.35-4.35" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      )}
                      <input
                        ref={searchInputRef}
                        id="search-input"
                        type="text"
                        placeholder="Search for products, stores, categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                        style={{ 
                          background: isDebouncing ? '#F0F9FF' : '#F9FAFB',
                          borderColor: isDebouncing ? '#0082FF' : '#E5E7EB'
                        }}
                      />
                      <button type="button" onClick={handleSearchClose} className="search-close">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M15 5L5 15M5 5L15 15" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                      <SearchSuggestions
                        query={debouncedQuery}
                        isVisible={searchOpen && debouncedQuery.length >= 2}
                        onClose={handleSearchClose}
                        onSelect={handleSuggestionSelect}
                        inputRef={searchInputRef}
                      />
                    </div>
                  </form>
                )}
              </div>
              {/* nav-actions */}
              <div className="nav-actions">
                <div className="action-btn" onClick={() => setLocationModalOpen(true)}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="#0082FF" />
                    <path d="M20 12.6213C18.3498 12.6213 16.7671 13.2189 15.6002 14.2826C14.4333 15.3463 13.7778 16.7889 13.7778 18.2932C13.7778 20.6122 15.3618 22.8493 17.1004 24.5824C17.9895 25.4653 18.9595 26.2775 20 27.01C20.1553 26.9014 20.3375 26.7691 20.5467 26.613C21.382 25.9877 22.1683 25.3097 22.8996 24.5841C24.6382 22.8493 26.2222 20.613 26.2222 18.2932C26.2222 16.7889 25.5667 15.3463 24.3998 14.2826C23.2329 13.2189 21.6502 12.6213 20 12.6213ZM20 29L19.496 28.684L19.4933 28.6824L19.488 28.6783L19.4702 28.667L19.4036 28.624L19.1636 28.4644C17.9474 27.6313 16.8177 26.6983 15.7884 25.6771C13.9716 23.8637 12 21.2393 12 18.2924C12 16.3583 12.8429 14.5035 14.3431 13.1359C15.8434 11.7683 17.8783 11 20 11C22.1217 11 24.1566 11.7683 25.6569 13.1359C27.1571 14.5035 28 16.3583 28 18.2924C28 21.2393 26.0284 23.8646 24.2116 25.6755C23.1826 26.6966 22.0531 27.6296 20.8373 28.4628C20.736 28.5318 20.6338 28.5996 20.5307 28.6662L20.512 28.6775L20.5067 28.6816L20.5049 28.6824L20 29ZM20 16.6727C19.5285 16.6727 19.0763 16.8434 18.7429 17.1473C18.4095 17.4512 18.2222 17.8634 18.2222 18.2932C18.2222 18.723 18.4095 19.1352 18.7429 19.4391C19.0763 19.743 19.5285 19.9137 20 19.9137C20.4715 19.9137 20.9237 19.743 21.2571 19.4391C21.5905 19.1352 21.7778 18.723 21.7778 18.2932C21.7778 17.8634 21.5905 17.4512 21.2571 17.1473C20.9237 16.8434 20.4715 16.6727 20 16.6727ZM16.4444 18.2932C16.4444 17.4336 16.819 16.6092 17.4858 16.0014C18.1526 15.3936 19.057 15.0521 20 15.0521C20.943 15.0521 21.8474 15.3936 22.5142 16.0014C23.181 16.6092 23.5556 17.4336 23.5556 18.2932C23.5556 19.1528 23.181 19.9771 22.5142 20.585C21.8474 21.1928 20.943 21.5342 20 21.5342C19.057 21.5342 18.1526 21.1928 17.4858 20.585C16.819 19.9771 16.4444 19.1528 16.4444 18.2932Z" fill="black" />
                  </svg>
                </div>
                <div className="action-btn" onClick={handleSearchClick}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="#0082FF" />
                    <circle cx="20" cy="20" r="7.5" stroke="black" strokeWidth="1.66667" />
                    <path d="M25 25L30 30" stroke="black" strokeWidth="1.66667" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="action-btn" onClick={() => requireAuth(() => setCartOpen(true))}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="#0082FF" />
                    <path d="M16.1818 15.1538C16.1818 15.1538 16.1818 11 20 11C23.8182 11 23.8182 15.1538 23.8182 15.1538M13 15.1538V29H27V15.1538H13Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {displayCartCount > 0 && <span className="badge-count">{displayCartCount}</span>}
                </div>
                <div className="action-btn" onClick={() => requireAuth(() => setWishlistOpen(true))}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="#0082FF" />
                    <path d="M20.09 25.5586L20 25.6458L19.901 25.5586C15.626 21.8005 12.8 19.3155 12.8 16.7956C12.8 15.0518 14.15 13.7439 15.95 13.7439C17.336 13.7439 18.686 14.6158 19.163 15.8016H20.837C21.314 14.6158 22.664 13.7439 24.05 13.7439C25.85 13.7439 27.2 15.0518 27.2 16.7956C27.2 19.3155 24.374 21.8005 20.09 25.5586ZM24.05 12C22.484 12 20.981 12.7063 20 13.8136C19.019 12.7063 17.516 12 15.95 12C13.178 12 11 14.1014 11 16.7956C11 20.0828 14.06 22.7771 18.695 26.849L20 28L21.305 26.849C25.94 22.7771 29 20.0828 29 16.7956C29 14.1014 26.822 12 24.05 12Z" fill="black" />
                  </svg>
                  {displayWishlistCount > 0 && <span className="badge-count">{displayWishlistCount}</span>}
                </div>

                <div className="profile-btn" onClick={() => requireAuth(() => router.push('/profile'))}>
                  <Image
                    src="https://api.builder.io/api/v1/image/assets/TEMP/e6affc0737515f664c7d8288ba0b3068f64a0ade?width=80"
                    alt="Profile"
                    width={40}
                    height={40}
                    style={{ borderRadius: '50%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Search Input moved inline into nav-menu when open */}

          <style jsx>{`
        .navbar {
          position: fixed; /* changed from sticky to fixed */
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          display: flex;
          width: 100%;
          padding: 24px 0;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid rgba(0, 130, 255, 0.24);
          background: #FFF;
        }

        .navbar-content {
          display: flex;
          width: 100%;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          width: 100px;
          padding: 0 1px;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          flex-shrink: 0;
        }

        .nav-menu {
          display: flex;
          width: 800px;
          justify-content: flex-end;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .nav-item {
          display: flex;
          padding: 8px 16px;
          justify-content: center;
          align-items: center;
          gap: 8px;
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-item.active {
          background: #0082FF;
          color: #FFF;
        }

        .nav-item.active span {
          color: #FFF;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 14px;
          font-weight: 700;
          line-height: 150%;
        }

        .nav-item span {
          color: #000;
          text-align: center;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 14px;
          font-weight: 700;
          line-height: 150%;
        }

        .nav-actions {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
        }
        .badge-count {
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(40%, -40%);
          background: #FF3B30;
          color: #fff;
          border-radius: 10px;
          padding: 0 6px;
          height: 18px;
          min-width: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          line-height: 18px;
        }

        .location-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .location-text {
          font-size: 12px;
          color: #666;
          font-weight: 500;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .action-btn {
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 40px;
          height: 40px;
          position: relative;
        }

        .action-btn:hover {
          transform: scale(1.05);
        }

        .profile-btn {
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .profile-btn:hover {
          transform: scale(1.05);
        }

        .search-container {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background: #FFF;
          border-bottom: 1px solid rgba(0, 130, 255, 0.24);
          padding: 16px 0;
          z-index: 999;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .search-form {
          width: 100%;
          max-width: 1392px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 1392px;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          z-index: 1;
        }

        .search-input {
          width: 100%;
          height: 48px;
          padding: 12px 16px 12px 48px;
          border: 2px solid #E5E7EB;
          border-radius: 24px;
          font-size: 16px;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          outline: none;
          transition: all 0.2s ease;
          background: #F9FAFB;
          box-sizing: border-box;
        }

        .search-input:focus {
          border-color: #0082FF;
          background: #FFF;
          box-shadow: 0 0 0 3px rgba(0, 130, 255, 0.1);
        }

        .search-input::placeholder {
          color: #9CA3AF;
        }

        .search-close {
          position: absolute;
          right: 16px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .search-close:hover {
          background: #F3F4F6;
        }

        .search-loading {
          position: absolute;
          left: 16px;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #E5E7EB;
          border-top: 2px solid #0082FF;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>

        {/* Spacer to prevent content from jumping under the fixed navbar */}
        <div style={{ height: navHeight }} aria-hidden />
      </div>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <WishlistDrawer open={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      <LoginModal 
        open={loginModalOpen} 
        onClose={closeLoginModal}
        onOpenRegister={() => {
          setRegisterModalOpen(true)
          closeLoginModal()
        }}
      />
      <RegisterModal 
        open={registerModalOpen} 
        onClose={() => setRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setRegisterModalOpen(false)
          // Login modal will be opened by AuthContext when needed
        }}
      />
      <LocationModal 
        open={locationModalOpen} 
        onClose={() => setLocationModalOpen(false)}
      />
    </>
  )
})

export default Navigation
