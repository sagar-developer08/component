import { useEffect } from 'react';

export default function FilterDrawer({ open, onClose, inline = false, sticky = false, stickyTop = 112 }) {
  useEffect(() => {
    if (inline) return; // Do not alter body scroll in inline mode
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open, inline]);

  if (!open) return null;

  return (
    <div className={inline ? "filter-drawer-inline-wrapper" : "filter-drawer-overlay"}>
      <div className="filter-drawer">
        <div className="filter-header">
          <span className="filter-title">Filters</span>
          {!inline && (
            <button className="filter-close" onClick={onClose}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="#F5F5F5"/>
              <path d="M11 11L21 21M21 11L11 21" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          )}
        </div>
        <div className="filter-divider"></div>
        <div className="filter-list">
          {["Availability", "Price", "Product Type", "Collections", "Color", "Size", "Strap Material"].map((label, i) => (
            <div className="filter-row" key={label}>
              <span className="filter-label">{label}</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6 8L10 12L14 8" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          ))}
        </div>
        {!inline && (
          <div className="filter-actions">
            <button className="filter-clear">Clear All</button>
            <button className="filter-results">See Results</button>
          </div>
        )}
      </div>
      <style jsx>{`
        .filter-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.08);
          z-index: 9999;
          display: flex;
          justify-content: flex-start;
        }
        .filter-drawer-inline-wrapper {
          display: block;
          background: transparent;
          ${sticky ? `position: sticky; top: ${stickyTop}px;` : ''}
        }
        .filter-drawer {
          background: #fff;
          width: 320px;
          max-width: 100vw;
          height: ${inline ? 'auto' : '100vh'};
          box-shadow: ${inline ? 'none' : '2px 0 16px rgba(0,0,0,0.08)'};
          display: flex;
          flex-direction: column;
          ${inline ? '' : 'animation: slideInLeft 0.25s cubic-bezier(.4,0,.2,1);'}
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .filter-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 24px 16px 24px;
        }
        .filter-title {
          font-size: 24px;
          font-weight: 600;
          color: #000;
        }
        .filter-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .filter-divider {
          height: 1px;
          background: #000;
          margin: 0 24px 0 24px;
        }
        .filter-list {
          flex: 1;
          padding: 24px 24px 0 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .filter-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }
        .filter-label {
          font-size: 18px;
          font-weight: 600;
          color: #111;
        }
        .filter-actions {
          display: flex;
          gap: 18px;
          padding: 0 24px 32px 24px;
        }
        .filter-clear {
          flex: 1;
          background: #fff;
          color: #111;
          border: 1.5px solid #0082FF;
          border-radius: 24px;
          font-size: 18px;
          font-weight: 600;
          padding: 12px 0;
          cursor: pointer;
          transition: background 0.2s;
        }
        .filter-results {
          flex: 1;
          background: #CBE6FF;
          color: #0082FF;
          border: none;
          border-radius: 24px;
          font-size: 18px;
          font-weight: 600;
          padding: 12px 0;
          cursor: pointer;
          transition: background 0.2s;
        }
        .filter-clear:hover {
          background: #f5faff;
        }
        .filter-results:hover {
          background: #b3dbff;
        }
        @media (max-width: 600px) {
          .filter-drawer {
            width: 100vw;
            padding: 0;
          }
          .filter-header, .filter-divider, .filter-list, .filter-actions {
            padding-left: 12px;
            padding-right: 12px;
          }
        }
      `}</style>
    </div>
  );
}
