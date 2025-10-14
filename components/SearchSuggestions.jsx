'use client'

import { useEffect, useRef, useState, memo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSearchSuggestions, clearSuggestions } from '@/store/slices/productsSlice'
import { generateProductUrl, getPrimaryImage, formatPrice } from '@/utils/productUtils'

const SearchSuggestions = memo(function SearchSuggestions({ 
  query, 
  isVisible, 
  onClose, 
  onSelect,
  inputRef 
}) {
  const router = useRouter()
  const dispatch = useDispatch()
  const suggestionsRef = useRef(null)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  
  const { 
    searchSuggestions, 
    suggestionsLoading, 
    suggestionsError 
  } = useSelector(state => state.products)

  // Fetch suggestions when query changes
  useEffect(() => {
    if (query && query.trim().length >= 2 && isVisible) {
      dispatch(fetchSearchSuggestions(query.trim()))
    } else {
      dispatch(clearSuggestions())
    }
  }, [query, isVisible, dispatch])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isVisible || !searchSuggestions.length) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev < searchSuggestions.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && selectedIndex < searchSuggestions.length) {
            handleSuggestionClick(searchSuggestions[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isVisible, searchSuggestions, selectedIndex, onClose])

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1)
  }, [searchSuggestions])

  const handleSuggestionClick = (suggestion) => {
    // Since we're now using the same endpoint as search results, 
    // suggestions are actual product objects
    if (suggestion.slug || suggestion._id) {
      // Navigate to product detail page
      const slug = suggestion.slug || suggestion._id
      const id = suggestion._id || suggestion.id
      const url = id ? generateProductUrl(id, slug) : `/product/${slug}`
      router.push(url)
    } else {
      // Fallback to search results page
      router.push(`/search?q=${encodeURIComponent(suggestion.title || suggestion.name || query)}`)
    }
    onSelect()
  }

  const handleMouseEnter = (index) => {
    setSelectedIndex(index)
  }

  if (!isVisible || (!suggestionsLoading && !searchSuggestions.length)) {
    return null
  }

  return (
    <div 
      ref={suggestionsRef}
      className="search-suggestions"
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        border: '1px solid #E5E7EB',
        borderTop: 'none',
        borderRadius: '0 0 12px 12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        maxHeight: '300px',
        overflowY: 'auto'
      }}
    >
      {suggestionsLoading ? (
        <div className="suggestion-loading">
          <div className="loading-spinner"></div>
          <span>Searching...</span>
        </div>
      ) : suggestionsError ? (
        <div className="suggestion-error">
          <span>Failed to load suggestions</span>
        </div>
      ) : (
        <div className="suggestions-list">
          {searchSuggestions.map((suggestion, index) => (
            <div
              key={`product-${suggestion._id || suggestion.id || index}`}
              className={`suggestion-item ${selectedIndex === index ? 'selected' : ''}`}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => handleMouseEnter(index)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                borderBottom: index < searchSuggestions.length - 1 ? '1px solid #F3F4F6' : 'none',
                backgroundColor: selectedIndex === index ? '#F0F9FF' : 'transparent',
                transition: 'background-color 0.2s ease'
              }}
            >
              <div className="suggestion-row">
                <div className="thumb">
                  <Image
                    src={getPrimaryImage(suggestion.images)}
                    alt={suggestion.title || suggestion.name || 'Product image'}
                    width={48}
                    height={48}
                    style={{ objectFit: 'cover', borderRadius: 8 }}
                  />
                </div>
                <div className="suggestion-content">
                  <div className="suggestion-header">
                    <span className="suggestion-title">
                      {suggestion.title || suggestion.name}
                    </span>
                    <span className="suggestion-type">Product</span>
                  </div>
                  <div className="meta">
                    {typeof (suggestion.discount_price || suggestion.price) !== 'undefined' && (
                      <span className="suggestion-price">
                        {formatPrice(Number(suggestion.discount_price || suggestion.price))}
                      </span>
                    )}
                    {suggestion.brand_id?.name && (
                      <span className="brand">{suggestion.brand_id.name}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .suggestion-loading {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px;
          color: #6B7280;
          font-size: 14px;
        }

        .suggestion-error {
          padding: 16px;
          color: #EF4444;
          font-size: 14px;
        }

        .suggestion-item:hover {
          background-color: #F0F9FF !important;
        }

        .suggestion-row { display: flex; align-items: center; gap: 12px; }
        .thumb { flex: 0 0 48px; height: 48px; border-radius: 8px; overflow: hidden; background: #fff; }
        .suggestion-content { display: flex; flex-direction: column; gap: 4px; }

        .suggestion-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .suggestion-title {
          font-weight: 500;
          color: #111827;
          font-size: 14px;
        }

        .suggestion-type {
          font-size: 12px;
          color: #6B7280;
          background: #F3F4F6;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .meta { display: flex; gap: 8px; align-items: center; }

        .suggestion-price {
          font-size: 12px;
          color: #059669;
          font-weight: 500;
        }
        .brand { font-size: 12px; color: #6B7280; }

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
  )
})

export default SearchSuggestions
