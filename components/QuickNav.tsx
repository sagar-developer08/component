import Link from 'next/link'

export default function QuickNav() {
  return (
    <div className="quick-nav">
      <div className="container">
        <h3>Quick Navigation</h3>
        <div className="nav-links">
          <Link href="/" className="nav-link">
            🏠 Home
          </Link>
          <Link href="/product/nike-airforce-01" className="nav-link product-link">
            👟 Nike Airforce 01 Product Page
          </Link>
          <Link href="/product/nike-dunk-low" className="nav-link product-link">
            👟 Nike Dunk Low Product Page
          </Link>
          <Link href="/product/nike-air-max" className="nav-link product-link">
            👟 Nike Air Max Product Page
          </Link>
        </div>
        <p className="nav-hint">
          💡 <strong>Tip:</strong> Click on any product card on the home page to view its details!
        </p>
      </div>

      <style jsx>{`
        .quick-nav {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 20px 0;
          margin-bottom: 40px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .quick-nav h3 {
          margin: 0 0 16px 0;
          color: #1e293b;
          font-size: 18px;
          font-weight: 600;
        }

        .nav-links {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 16px;
        }

        .nav-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          color: #475569;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .nav-link:hover {
          border-color: #0082FF;
          color: #0082FF;
          transform: translateY(-1px);
        }

        .product-link {
          background: #f0f8ff;
          border-color: #0082FF;
          color: #0082FF;
        }

        .product-link:hover {
          background: #e0f2ff;
        }

        .nav-hint {
          margin: 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .nav-links {
            flex-direction: column;
          }
          
          .nav-link {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}
