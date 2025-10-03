'use client'
import { useState, useEffect } from 'react'

export default function LocationModal({ open, onClose }) {
  const [currentLocation, setCurrentLocation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (open) {
      loadGoogleMaps()
    }
  }, [open])

  useEffect(() => {
    if (mapLoaded && open) {
      getCurrentLocation()
    }
  }, [mapLoaded, open])

  const loadGoogleMaps = () => {
    if (window.google && window.google.maps) {
      setMapLoaded(true)
      return
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      console.error('Google Maps API key is missing. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your env.')
      setCurrentLocation('Google Maps API key missing')
      return
    }

    const script = document.createElement('script')
    // Use async-friendly loader flags and v=beta for advanced markers
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&v=beta&loading=async`
    script.async = true
    script.defer = true
    script.onload = () => setMapLoaded(true)
    document.head.appendChild(script)
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setCurrentLocation('Location not supported')
      return
    }

    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        
        // Initialize map with current location
        if (window.google && window.google.maps) {
          const mapElement = document.getElementById('map')
          if (mapElement) {
            const map = new window.google.maps.Map(mapElement, {
              center: { lat: latitude, lng: longitude },
              zoom: 15,
              mapTypeId: window.google.maps.MapTypeId.ROADMAP
            })

            // Add marker for current location using AdvancedMarkerElement when available
            try {
              const hasAdvancedMarker = Boolean(window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement)
              if (hasAdvancedMarker) {
                // eslint-disable-next-line no-new
                new window.google.maps.marker.AdvancedMarkerElement({
                  map,
                  position: { lat: latitude, lng: longitude },
                  title: 'Your Current Location'
                })
              } else {
                // eslint-disable-next-line no-new
                new window.google.maps.Marker({
                  position: { lat: latitude, lng: longitude },
                  map,
                  title: 'Your Current Location',
                  animation: window.google.maps.Animation?.DROP
                })
              }
            } catch (e) {
              // Fallback to basic Marker if advanced marker fails
              // eslint-disable-next-line no-new
              new window.google.maps.Marker({
                position: { lat: latitude, lng: longitude },
                map,
                title: 'Your Current Location',
                animation: window.google.maps.Animation?.DROP
              })
            }

            // Reverse geocoding to get address
            const geocoder = new window.google.maps.Geocoder()
            const latlng = new window.google.maps.LatLng(latitude, longitude)
            
            geocoder.geocode({ location: latlng }, (results, status) => {
              if (status === 'OK' && results[0]) {
                setCurrentLocation(results[0].formatted_address)
              } else {
                setCurrentLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
              }
              setIsLoading(false)
            })
          }
        } else {
          setCurrentLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
          setIsLoading(false)
        }
      },
      (error) => {
        console.error('Error getting location:', error)
        setCurrentLocation('Unable to get location')
        setIsLoading(false)
      }
    )
  }

  if (!open) return null

  return (
    <div className="location-modal-overlay">
      <div className="location-modal">
        <button className="location-modal-close" onClick={onClose}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="14" fill="#F5F5F5" />
            <path d="M9 9L19 19M19 9L9 19" stroke="#000" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        
        <div className="location-modal-content">
          <div className="location-header">
            <h2 className="location-title">Select Your Location</h2>
            <div className="current-location">
              {isLoading ? (
                <div className="loading-location">
                  <div className="loading-spinner"></div>
                  <span>Getting your location...</span>
                </div>
              ) : (
                <div className="location-info">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 0C5.243 0 3 2.243 3 5C3 8.5 8 16 8 16S13 8.5 13 5C13 2.243 10.757 0 8 0ZM8 6.5C7.172 6.5 6.5 5.828 6.5 5S7.172 3.5 8 3.5S9.5 4.172 9.5 5S8.828 6.5 8 6.5Z" fill="#0082FF"/>
                  </svg>
                  <span className="location-text">{currentLocation || 'Location not available'}</span>
                </div>
              )}
            </div>
          </div>

          <div className="map-container">
            {mapLoaded ? (
              <div 
                id="map" 
                style={{ 
                  width: '100%', 
                  height: '100%',
                  borderRadius: '12px',
                  border: '1px solid #E5E5E5'
                }}
              />
            ) : (
              <div className="map-loading">
                <div className="loading-spinner"></div>
                <span>Loading Google Maps...</span>
              </div>
            )}
          </div>

          <div className="location-actions">
            <button className="location-btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="location-btn primary" onClick={() => {
              // Save location and close modal
              // You can add logic here to save the location to your app state
              onClose()
            }}>
              Use This Location
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .location-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.18);
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .location-modal {
          background: #fff;
          border-radius: 32px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          max-width: 900px;
          width: 100%;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 1000000;
        }
        
        .location-modal-close {
          position: absolute;
          top: 24px;
          right: 24px;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 2;
        }
        
        .location-modal-content {
          padding: 48px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          height: 700px;
        }
        
        .location-header {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .location-title {
          font-size: 24px;
          font-weight: 600;
          color: #000;
          margin: 0;
        }
        
        .current-location {
          padding: 12px 16px;
          background: #F8F9FA;
          border-radius: 12px;
          border: 1px solid #E5E5E5;
        }
        
        .loading-location {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
          font-size: 14px;
        }
        
        .location-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .location-text {
          font-size: 14px;
          color: #333;
          font-weight: 500;
        }
        
        .map-container {
          width: 100%;
          min-height: 0;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .map-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          color: #666;
          font-size: 14px;
        }
        
        .location-actions {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
          margin-top: auto;
        }
        
        .location-btn {
          padding: 12px 24px;
          border-radius: 100px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }
        
        .location-btn.secondary {
          background: #fff;
          border: 1px solid #0082FF;
          color: #0082FF;
        }
        
        .location-btn.secondary:hover {
          background: #F0F9FF;
        }
        
        .location-btn.primary {
          background: #0082FF;
          color: white;
        }
        
        .location-btn.primary:hover {
          background: #0066CC;
        }
        
        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #E5E5E5;
          border-top: 2px solid #0082FF;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 900px) {
          .location-modal {
            max-width: 900px;
            width: 100%;
          }
          .location-modal-content {
            height: auto;
          }
          .map-container {
            min-height: 300px;
          }
        }
        
        @media (max-width: 600px) {
          .location-modal {
            border-radius: 16px;
            margin: 16px;
            width: calc(100% - 32px);
          }
          
          .location-modal-content {
            padding: 24px;
            height: auto;
          }
          
          .location-actions {
            flex-direction: column;
          }
          
          .location-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
