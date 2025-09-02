'use client'

interface SectionHeaderProps {
  title: string
  showNavigation?: boolean
  showButton?: boolean
  buttonText?: string
  onButtonClick?: () => void
  onPrev?: () => void
  onNext?: () => void
}

export default function SectionHeader({ 
  title, 
  showNavigation = false,
  onPrev,
  onNext, 
  showButton = false, 
  buttonText = "See All",
  onButtonClick 
}: SectionHeaderProps) {
  return (
    <div className="section-header">
      <h2 className="section-title">{title}</h2>
      
      {(showNavigation || showButton) && (
        <div className="section-actions">
          {showButton && (
            <button className="section-button" onClick={onButtonClick}>
              {buttonText}
            </button>
          )}
          
          {showNavigation && (
            <div className="navigation-buttons">
              <button className="nav-btn prev" aria-label="Previous" onClick={onPrev}>
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                    <rect y="44" width="44" height="44" rx="22" transform="rotate(-90 0 44)" fill="#0082FF" fillOpacity="0.24"/>
                    <path d="M32 22L11 22M11 22L18.875 14.125M11 22L18.875 29.875" stroke="#0082FF" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="nav-btn next" aria-label="Next" onClick={onNext}>
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <rect x="44" width="44" height="44" rx="22" transform="rotate(90 44 0)" fill="#0082FF" fillOpacity="0.24"/>
                  <path d="M11 22L32 22M32 22L24.125 29.875M32 22L24.125 14.125" stroke="#0082FF" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .section-header {
          display: flex;
          width: 100%;
          max-width: 1392px;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-right: 24px;
          padding-left: 24px;
        }

        .section-title {
          color: #000;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 40px;
          font-weight: 700;
          line-height: 120%;
          margin: 0;
        }

        .section-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .section-button {
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
        }

        .section-button:hover {
          background: rgba(0, 130, 255, 0.4);
          transform: translateY(-2px);
        }

        .navigation-buttons {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          gap: 16px;
        }

        .nav-btn {
          width: 44px;
          height: 44px;
          border: none;
          background: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-btn:hover {
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .section-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .section-title {
            font-size: 28px;
          }

          .section-button {
            padding: 10px 24px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  )
}
