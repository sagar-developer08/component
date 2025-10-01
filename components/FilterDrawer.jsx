import { useEffect, useState } from 'react';

export default function FilterDrawer({ open, onClose, inline = false, sticky = false, stickyTop = 112, facets = [], selected = {}, onChange, onClear }) {
  // Initialize with all facets expanded by default
  const [expandedFacets, setExpandedFacets] = useState(() => {
    return new Set(facets.map(facet => facet.key));
  });

  useEffect(() => {
    if (inline) return; // Do not alter body scroll in inline mode
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open, inline]);

  // Update expanded facets when facets change (new filter data loaded)
  useEffect(() => {
    if (facets.length > 0) {
      setExpandedFacets(new Set(facets.map(facet => facet.key)));
    }
  }, [facets]);

  const toggleFacetExpansion = (facetKey) => {
    setExpandedFacets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(facetKey)) {
        newSet.delete(facetKey);
      } else {
        newSet.add(facetKey);
      }
      return newSet;
    });
  };

  if (!open) return null;

  const handleCheckboxToggle = (facetKey, value) => {
    if (!onChange) return
    const current = selected[facetKey] instanceof Set
      ? new Set(Array.from(selected[facetKey]))
      : new Set(Array.isArray(selected[facetKey]) ? selected[facetKey] : [])
    if (current.has(value)) current.delete(value)
    else current.add(value)
    onChange(facetKey, current)
  }

  const handleRangeChange = (facetKey, field, value) => {
    if (!onChange) return
    const next = { ...(selected[facetKey] || {}) }
    const num = value === '' ? undefined : Number(value)
    next[field] = isNaN(num) ? undefined : num
    onChange(facetKey, next)
  }

  const handleMinSelect = (facetKey, value) => {
    if (!onChange) return
    onChange(facetKey, typeof value === 'number' ? value : undefined)
  }

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
          {Array.isArray(facets) && facets.length > 0 ? (
            facets.map((facet) => (
              <div className="filter-section" key={facet.key}>
                <div className="filter-row" style={{ cursor: 'pointer' }} onClick={() => toggleFacetExpansion(facet.key)}>
                  <span className="filter-label">{facet.label}</span>
                  <svg 
                    className={`filter-chevron ${expandedFacets.has(facet.key) ? 'expanded' : ''}`}
                    width="16" 
                    height="16" 
                    viewBox="0 0 16 16" 
                    fill="none"
                  >
                    <path d="M4 6L8 10L12 6" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {expandedFacets.has(facet.key) && (
                  <>
                    {facet.type === 'checkbox' && (
                  <div className="filter-options">
                    {(facet.options || []).map(opt => {
                      const checked = selected[facet.key] instanceof Set
                        ? selected[facet.key].has(opt.value)
                        : Array.isArray(selected[facet.key])
                          ? selected[facet.key].includes(opt.value)
                          : false
                      return (
                        <label className="filter-option" key={`${facet.key}:${opt.value}`}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleCheckboxToggle(facet.key, opt.value)}
                          />
                          <span className="option-text">{opt.label}</span>
                          {typeof opt.count === 'number' && <span className="option-count">{opt.count}</span>}
                        </label>
                      )
                    })}
                  </div>
                )}
                {facet.type === 'range' && (
                  <div className="filter-range">
                    <div className="range-inputs">
                      <input
                        type="number"
                        placeholder={facet.min !== undefined ? String(facet.min) : 'Min'}
                        value={selected[facet.key]?.min ?? ''}
                        min={facet.min}
                        max={facet.max}
                        onChange={(e) => handleRangeChange(facet.key, 'min', e.target.value)}
                      />
                      <span className="range-sep">—</span>
                      <input
                        type="number"
                        placeholder={facet.max !== undefined ? String(facet.max) : 'Max'}
                        value={selected[facet.key]?.max ?? ''}
                        min={facet.min}
                        max={facet.max}
                        onChange={(e) => handleRangeChange(facet.key, 'max', e.target.value)}
                      />
                    </div>
                  </div>
                )}
                {facet.type === 'min' && (
                  <div className="filter-options">
                    {(facet.options || []).map(opt => (
                      <label className="filter-option" key={`${facet.key}:${opt.value}`}>
                        <input
                          type="radio"
                          name={`min-${facet.key}`}
                          checked={Number(selected[facet.key] || 0) === Number(opt.value)}
                          onChange={() => handleMinSelect(facet.key, opt.value)}
                        />
                        <span className="option-text">{opt.label}</span>
                        {typeof opt.count === 'number' && <span className="option-count">{opt.count}</span>}
                      </label>
                    ))}
                  </div>
                )}
                  </>
                )}
              </div>
            ))
          ) : (
            ["Availability", "Price", "Product Type", "Collections", "Color", "Size", "Strap Material"].map((label) => (
              <div className="filter-row" key={label}>
                <span className="filter-label">{label}</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6 8L10 12L14 8" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            ))
          )}
        </div>
        {!inline && (
          <div className="filter-actions">
            <button className="filter-clear" onClick={onClear}>Clear All</button>
            <button className="filter-results" onClick={onClose}>See Results</button>
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
          width: 100%;
          ${sticky ? `position: sticky; top: ${stickyTop}px;` : ''}
        }
        .filter-drawer {
          background: #fff;
          width: 320px;
          max-width: 100vw;
          height: ${inline ? 'auto' : '100vh'};
          box-shadow: ${inline ? '0 2px 8px rgba(0,0,0,0.1)' : '2px 0 16px rgba(0,0,0,0.08)'};
          display: flex;
          flex-direction: column;
          border-radius: ${inline ? '12px' : '0'};
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
        .filter-section { padding-bottom: 8px; border-bottom: 1px solid #eee; }
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
        .filter-chevron {
          transition: transform 0.2s ease;
        }
        .filter-chevron.expanded {
          transform: rotate(180deg);
        }
        .filter-options { display: flex; flex-direction: column; gap: 10px; padding: 8px 0 0 0; }
        .filter-option { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #222; }
        .option-text { flex: 1; }
        .option-count { color: #666; font-size: 12px; }
        .filter-range { padding-top: 8px; }
        .range-inputs { display: flex; align-items: center; gap: 8px; }
        .range-inputs input { width: 120px; padding: 8px 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; }
        .range-sep { color: #999; }
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
