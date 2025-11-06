'use client'

import { useState, useRef, useEffect } from 'react'

export default function SortDropdown({ 
  currentSort, 
  onSortChange, 
  className = '' 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'name_asc', label: 'A to Z' },
    { value: 'name_desc', label: 'Z to A' },
    { value: 'price_asc', label: 'Low to High' },
    { value: 'price_desc', label: 'High to Low' },
    { value: 'bestseller', label: 'Best Seller' },
    { value: 'newest', label: 'New Arrivals' }
  ]

  const currentOption = sortOptions.find(option => option.value === currentSort) || sortOptions[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSortSelect = (sortValue) => {
    onSortChange(sortValue)
    setIsOpen(false)
  }

  return (
    <div className={`sort-dropdown ${className}`} ref={dropdownRef}>
      <button 
        className="sort-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>Sort By: {currentOption.label}</span>
        <svg 
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
          width="12" 
          height="8" 
          viewBox="0 0 12 8" 
          fill="none"
        >
          <path 
            d="M1 1.5L6 6.5L11 1.5" 
            stroke="#0082FF" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="sort-dropdown-menu">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              className={`sort-option ${currentSort === option.value ? 'active' : ''}`}
              onClick={() => handleSortSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .sort-dropdown {
          position: relative;
          display: inline-block;
        }

        .sort-button {
          display: flex;
          padding: 12px 40px;
          justify-content: center;
          align-items: center;
          gap: 10px;
          border-radius: 100px;
          background: rgba(0, 130, 255, 0.24);
          border: none;
          cursor: pointer;
          color: #0082FF;
          text-align: center;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 14px;
          font-weight: 700;
          line-height: 150%;
          transition: all 0.2s ease;
          min-width: 180px;
        }

        .sort-button:hover {
          background: rgba(0, 130, 255, 0.4);
          transform: translateY(-2px);
        }

        .dropdown-arrow {
          transition: transform 0.2s ease;
        }

        .dropdown-arrow.open {
          transform: rotate(180deg);
        }

        .sort-dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          min-width: 200px;
          margin-top: 8px;
          overflow: hidden;
        }

        .sort-option {
          display: block;
          width: 100%;
          padding: 12px 16px;
          border: none;
          background: white;
          color: #333;
          text-align: left;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 14px;
          font-weight: 500;
          line-height: 150%;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .sort-option:hover {
          background: #f8f9fa;
        }

        .sort-option.active {
          background: rgba(0, 130, 255, 0.1);
          color: #0082FF;
          font-weight: 700;
        }

        .sort-option:not(:last-child) {
          border-bottom: 1px solid #f0f0f0;
        }

        @media (max-width: 768px) {
          .sort-button {
            padding: 8px 16px;
            font-size: 14px;
            min-width: 120px;
            height: 40px;
            border-radius: 8px;
          }

          .sort-dropdown-menu {
            min-width: 180px;
          }

          .sort-option {
            padding: 10px 14px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  )
}
