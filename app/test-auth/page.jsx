'use client'

import { useAuth } from '../../contexts/AuthContext'
import ProductCard from '../../components/ProductCard'

export default function TestAuthPage() {
  const { isAuthenticated, user, logout, token } = useAuth()

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Authentication Test Page</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2>Authentication Status</h2>
        <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
        {user && (
          <>
            <p><strong>User:</strong> {user.name} ({user.email})</p>
            <p><strong>Token:</strong> {token ? 'Present' : 'Not present'}</p>
          </>
        )}
        {isAuthenticated && (
          <button onClick={logout} style={{ padding: '8px 16px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Logout
          </button>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Test Product Cards</h2>
        <p>Try clicking the wishlist and cart buttons below. If you're not authenticated, the login modal should open.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <ProductCard
            id="test-product-1"
            title="Test Product 1"
            price="AED 100"
            rating="4.5"
            deliveryTime="2-3 days"
            image="/iphone.jpg"
            badge="Test Badge"
          />
          <ProductCard
            id="test-product-2"
            title="Test Product 2"
            price="AED 200"
            rating="4.8"
            deliveryTime="1-2 days"
            image="/shoes.jpg"
            badge="New"
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Instructions</h2>
        <ol>
          <li>If you're not logged in, try clicking any wishlist or cart button - the login modal should open</li>
          <li>Click "Login" or "Create Account" to authenticate (this is a mock login)</li>
          <li>After logging in, try clicking the buttons again - they should work without opening the modal</li>
          <li>You can logout using the logout button above</li>
        </ol>
      </div>
    </div>
  )
}
