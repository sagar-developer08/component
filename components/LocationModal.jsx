'use client'
import { useState, useEffect } from 'react'

export default function LocationModal({ open, onClose, onLocationSelect }) {
  const [currentLocation, setCurrentLocation] = useState('')
  const [cityName, setCityName] = useState('')
  const [countryName, setCountryName] = useState('')
  const [coordinates, setCoordinates] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [permissionRequested, setPermissionRequested] = useState(false)

  useEffect(() => {
    if (open) {
      loadMap()
    }
  }, [open])

  useEffect(() => {
    if (mapLoaded && open && permissionGranted) {
      getCurrentLocation()
    }
  }, [mapLoaded, open, permissionGranted])

  const loadMap = () => {
    // No need to load external scripts for OpenStreetMap
    setMapLoaded(true)
  }

  const requestLocationPermission = () => {
    if (!navigator.geolocation) {
      setCurrentLocation('Location not supported')
      return
    }

    setPermissionRequested(true)
    setIsLoading(true)
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setPermissionGranted(true)
        const { latitude, longitude } = position.coords
        setCoordinates({ lat: latitude, lng: longitude })
        
        // Get location name first
        await getLocationName(latitude, longitude)
        
        // Then initialize map
        setTimeout(() => {
          initializeMap(latitude, longitude)
        }, 100)
      },
      (error) => {
        console.error('Error getting location:', error)
        setCurrentLocation('Unable to get location')
        setCityName('Location Denied')
        setIsLoading(false)
        setPermissionGranted(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  const initializeMap = (latitude, longitude) => {
    const mapElement = document.getElementById('map')
    if (mapElement) {
      // Create OpenStreetMap iframe
      const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`
      
      mapElement.innerHTML = `
        <iframe 
          src="${mapUrl}" 
          width="100%" 
          height="100%" 
          style="border: none; border-radius: 12px;"
          title="Location Map"
        ></iframe>
      `
    }
  }

  const getLocationName = async (latitude, longitude) => {
    try {
      // Use a free reverse geocoding service instead of Google
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
      const data = await response.json()
      
      if (data.city || data.locality || data.principalSubdivision) {
        const cityName = data.city || data.locality || data.principalSubdivision
        const countryName = data.countryName || ''
        const fullLocation = countryName ? `${cityName}, ${countryName}` : cityName
        
        setCityName(cityName)
        setCurrentLocation(fullLocation)
        
        // Store country name for passing to parent component
        setCountryName(countryName)
      } else {
        // Fallback: try to get any location info
        const locationParts = []
        if (data.localityInfo?.administrative?.[0]?.name) {
          locationParts.push(data.localityInfo.administrative[0].name)
        }
        if (data.countryName) {
          locationParts.push(data.countryName)
        }
        
        if (locationParts.length > 0) {
          const locationName = locationParts.join(', ')
          setCityName(locationParts[0])
          setCurrentLocation(locationName)
          setCountryName(data.countryName || '')
        } else {
          // Last resort: show coordinates
          setCityName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
          setCurrentLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
          setCountryName('')
        }
      }
    } catch (error) {
      console.error('Error getting location name:', error)
      // Fallback to coordinates if API fails
      setCityName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
      setCurrentLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
      setCountryName('')
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if (!permissionGranted) {
      requestLocationPermission()
      return
    }
    
    // If permission already granted, just get location
    requestLocationPermission()
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
            {!permissionRequested ? (
              <div className="permission-request">
                <div className="permission-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="24" fill="#F0F9FF"/>
                    <path d="M24 8C18.48 8 14 12.48 14 18C14 25 24 40 24 40S34 25 34 18C34 12.48 29.52 8 24 8ZM24 22C21.79 22 20 20.21 20 18C20 15.79 21.79 14 24 14C26.21 14 28 15.79 28 18C28 20.21 26.21 22 24 22Z" fill="#0082FF"/>
                  </svg>
                </div>
                <h3 className="permission-title">Allow Location Access</h3>
                <p className="permission-description">
                  We need your location to show you nearby stores and provide accurate delivery estimates.
                </p>
                <button className="permission-btn" onClick={getCurrentLocation}>
                  Allow Location Access
                </button>
              </div>
            ) : (
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
            )}
          </div>

          {permissionRequested && (
            <div className="map-container">
              {mapLoaded && coordinates ? (
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
                <div className="map-fallback">
                  <div className="map-placeholder">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <path d="M24 4C16.268 4 10 10.268 10 18C10 28 24 44 24 44S38 28 38 18C38 10.268 31.732 4 24 4ZM24 22C21.79 22 20 20.21 20 18C20 15.79 21.79 14 24 14C26.21 14 28 15.79 28 18C28 20.21 26.21 22 24 22Z" fill="#0082FF"/>
                    </svg>
                    <p>Loading map...</p>
                    <p className="coordinates-display">
                      {coordinates ? `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}` : 'Getting location...'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {permissionRequested && (
            <div className="location-actions">
              <button className="location-btn secondary" onClick={onClose}>
                Cancel
              </button>
              <button 
                className="location-btn primary" 
                onClick={() => {
                  if (onLocationSelect && cityName) {
                    onLocationSelect({
                      cityName,
                      countryName,
                      coordinates,
                      address: currentLocation
                    })
                  }
                  onClose()
                }}
                disabled={!cityName}
              >
                Use This Location
              </button>
            </div>
          )}
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
        
        .permission-request {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
          padding: 24px;
          background: #F8F9FA;
          border-radius: 16px;
          border: 1px solid #E5E5E5;
        }
        
        .permission-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .permission-title {
          font-size: 20px;
          font-weight: 600;
          color: #000;
          margin: 0;
        }
        
        .permission-description {
          font-size: 14px;
          color: #666;
          margin: 0;
          line-height: 1.5;
          max-width: 300px;
        }
        
        .permission-btn {
          padding: 12px 24px;
          background: #0082FF;
          color: white;
          border: none;
          border-radius: 100px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .permission-btn:hover {
          background: #0066CC;
          transform: translateY(-1px);
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
        
        .map-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F8F9FA;
          border-radius: 12px;
        }
        
        .map-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
          color: #666;
        }
        
        .map-placeholder p {
          margin: 0;
          font-size: 14px;
        }
        
        .coordinates-display {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: #0082FF;
          background: #F0F9FF;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #E0F2FE;
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
