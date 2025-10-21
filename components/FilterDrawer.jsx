import { useEffect, useState, useCallback } from 'react';

export default function FilterDrawer({ open, onClose, inline = false, sticky = false, stickyTop = 112, facets = [], selected = {}, onChange, onClear }) {
  // Initialize with all facets expanded by default
  const [expandedFacets, setExpandedFacets] = useState(() => {
    return new Set(facets.map(facet => facet.key));
  });

  // Local state for price range to avoid constant API calls
  const [localPriceRange, setLocalPriceRange] = useState({});
  const [priceDebounceTimer, setPriceDebounceTimer] = useState(null);

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

  // Debounced price range handler
  const debouncedPriceChange = useCallback((facetKey, newRange) => {
    if (priceDebounceTimer) {
      clearTimeout(priceDebounceTimer);
    }
    
    const timer = setTimeout(() => {
      if (onChange) {
        onChange(facetKey, newRange);
      }
    }, 500); // 500ms delay
    
    setPriceDebounceTimer(timer);
  }, [onChange, priceDebounceTimer]);

  const handleRangeChange = (facetKey, field, value) => {
    if (!onChange) return
    
    // Get current values
    const currentRange = localPriceRange[facetKey] || selected[facetKey] || {};
    const facetMin = 0; // Default min
    const facetMax = 1000; // Default max
    
    // Parse the new value
    const numValue = parseInt(value) || 0;
    
    // Create new range object
    const newRange = { ...currentRange };
    
    if (field === 'min') {
      // Ensure min doesn't exceed max
      const currentMax = newRange.max ?? facetMax;
      newRange.min = Math.min(numValue, currentMax);
      console.log('Min slider changed:', { value, numValue, currentMax, newMin: newRange.min });
    } else if (field === 'max') {
      // Ensure max doesn't go below min
      const currentMin = newRange.min ?? facetMin;
      newRange.max = Math.max(numValue, currentMin);
      console.log('Max slider changed:', { value, numValue, currentMin, newMax: newRange.max });
    }
    
    // Update local state immediately for smooth UI
    setLocalPriceRange(prev => ({
      ...prev,
      [facetKey]: newRange
    }));
    
    // Debounce the actual API call
    debouncedPriceChange(facetKey, newRange);
  }

  // Sync local price range with selected filters when they change externally
  useEffect(() => {
    setLocalPriceRange(prev => {
      const newLocal = { ...prev };
      Object.keys(selected).forEach(key => {
        if (selected[key] && typeof selected[key] === 'object' && (selected[key].min !== undefined || selected[key].max !== undefined)) {
          newLocal[key] = selected[key];
        }
      });
      return newLocal;
    });
  }, [selected]);

  const handleMinSelect = (facetKey, value) => {
    if (!onChange) return
    onChange(facetKey, typeof value === 'number' ? value : undefined)
  }

  // Check if any filters are applied
  const hasAppliedFilters = () => {
    return Object.keys(selected).some(key => {
      const value = selected[key];
      if (value instanceof Set) {
        return value.size > 0;
      }
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === 'object' && value !== null) {
        return value.min !== undefined || value.max !== undefined;
      }
      if (typeof value === 'number') {
        return value > 0;
      }
      return Boolean(value);
    });
  }

  // Reset all filters
  const handleReset = () => {
    if (onClear) {
      onClear();
    }
    // Also clear local price range
    setLocalPriceRange({});
  }

  return (
    <div className={inline ? "filter-drawer-inline-wrapper" : "filter-drawer-overlay"}>
      <div className="filter-drawer">
        <div className="filter-header">
          <span className="filter-title">Filters</span>
          <div className="filter-header-actions">
            {hasAppliedFilters() && (
              <button className="filter-reset" onClick={handleReset}>
                {/* <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3V1M8 3H6M8 3H10M8 3V5M3 8H1M3 8V6M3 8V10M3 8H5M8 13V15M8 13H6M8 13H10M8 13V11M13 8H15M13 8V6M13 8V10M13 8H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg> */}
                Reset
              </button>
            )}
            {!inline && (
              <button className="filter-close" onClick={onClose}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="16" fill="#F5F5F5"/>
                <path d="M11 11L21 21M21 11L11 21" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            )}
          </div>
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
                    <div className="range-slider-container">
                      <div className="range-values">
                        <span className="range-min">AED {localPriceRange[facet.key]?.min ?? selected[facet.key]?.min ?? facet.min ?? 0}</span>
                        <span className="range-max">AED {localPriceRange[facet.key]?.max ?? selected[facet.key]?.max ?? facet.max ?? 1000}</span>
                      </div>
                      <div className="range-slider-wrapper">
                        <div className="range-track">
                          <div 
                            className="range-progress" 
                            style={{
                              left: `${((localPriceRange[facet.key]?.min ?? selected[facet.key]?.min ?? facet.min ?? 0) - (facet.min ?? 0)) / ((facet.max ?? 1000) - (facet.min ?? 0)) * 100}%`,
                              width: `${((localPriceRange[facet.key]?.max ?? selected[facet.key]?.max ?? facet.max ?? 1000) - (localPriceRange[facet.key]?.min ?? selected[facet.key]?.min ?? facet.min ?? 0)) / ((facet.max ?? 1000) - (facet.min ?? 0)) * 100}%`
                            }}
                          ></div>
                        </div>
                        <input
                          type="range"
                          min={facet.min ?? 0}
                          max={facet.max ?? 1000}
                          step="1"
                          value={localPriceRange[facet.key]?.min ?? selected[facet.key]?.min ?? facet.min ?? 0}
                          onChange={(e) => handleRangeChange(facet.key, 'min', e.target.value)}
                          className="range-slider min-slider"
                        />
                        <input
                          type="range"
                          min={facet.min ?? 0}
                          max={facet.max ?? 1000}
                          step="1"
                          value={localPriceRange[facet.key]?.max ?? selected[facet.key]?.max ?? facet.max ?? 1000}
                          onChange={(e) => handleRangeChange(facet.key, 'max', e.target.value)}
                          className="range-slider max-slider"
                        />
                      </div>
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
        .filter-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .filter-reset {
          display: flex;
          align-items: center;
          gap: 6px;
          background:rgb(0, 130, 255, 0.2);
          color: #0082FF;
          border: none;
          border-radius: 32px;
          padding: 8px 16px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
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
        .range-slider-container { display: flex; flex-direction: column; gap: 12px; }
        .range-values { display: flex; justify-content: space-between; font-size: 14px; color: #666; }
        .range-slider-wrapper { position: relative; height: 20px; }
        .range-track {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 6px;
          background: #e0e0e0;
          border-radius: 3px;
          transform: translateY(-50%);
        }
        .range-progress {
          position: absolute;
          top: 0;
          height: 100%;
          background: #0082FF;
          border-radius: 3px;
          transition: all 0.1s ease;
        }
        .range-slider { 
          position: absolute; 
          width: 100%; 
          height: 20px; 
          background: transparent; 
          outline: none; 
          -webkit-appearance: none; 
          appearance: none;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
        }
        .range-slider::-webkit-slider-track { 
          height: 6px; 
          background: transparent; 
          border-radius: 3px; 
        }
        .range-slider::-webkit-slider-thumb { 
          -webkit-appearance: none; 
          appearance: none; 
          height: 18px; 
          width: 18px; 
          background: #0082FF; 
          border-radius: 50%; 
          cursor: pointer; 
          border: 2px solid #fff; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          transition: transform 0.1s ease;
        }
        .range-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        .range-slider::-moz-range-track { 
          height: 6px; 
          background: transparent; 
          border-radius: 3px; 
          border: none; 
        }
        .range-slider::-moz-range-thumb { 
          height: 18px; 
          width: 18px; 
          background: #0082FF; 
          border-radius: 50%; 
          cursor: pointer; 
          border: 2px solid #fff; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          transition: transform 0.1s ease;
        }
        .range-slider::-moz-range-thumb:hover {
          transform: scale(1.1);
        }
        .min-slider { 
          z-index: 3; 
          pointer-events: auto;
        }
        .max-slider { 
          z-index: 4; 
          pointer-events: auto;
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
