'use client'
import { useEffect, useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faHome, faBriefcase, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import styles from './addresses.module.css'

export default function Addresses({ addresses }) {
  // Store the selected address ID in state so it persists
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const initialized = useRef(false)

  // Set initial selected address to default address only once when addresses are first loaded
  useEffect(() => {
    if (addresses.length > 0) {
      if (!initialized.current) {
        // First load: set to default address or first address
        const defaultAddr = addresses.find(addr => addr.isDefault)
        const initialId = defaultAddr ? (defaultAddr._id || defaultAddr.id) : (addresses[0]?._id || addresses[0]?.id)
        if (initialId) {
          setSelectedAddressId(initialId)
        }
        initialized.current = true
      } else {
        // After initialization: maintain selection, but verify it still exists
        // Use a callback to access current selectedAddressId without adding it to dependencies
        setSelectedAddressId(currentId => {
          if (currentId) {
            const stillExists = addresses.some(addr => {
              const addrId = addr._id || addr.id
              return addrId === currentId
            })
            // If selected address no longer exists, reset to default or first
            if (!stillExists) {
              const defaultAddr = addresses.find(addr => addr.isDefault)
              const newId = defaultAddr ? (defaultAddr._id || defaultAddr.id) : (addresses[0]?._id || addresses[0]?.id)
              return newId || currentId
            }
          }
          return currentId
        })
      }
    }
  }, [addresses])

  // Sync with addresses array - find the address object based on stored ID
  const selectedAddress = addresses.find(addr => {
    const addrId = addr._id || addr.id
    return addrId === selectedAddressId
  }) || null

  const formatAddress = (address) => {
    const parts = [
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.state,
      address.postalCode,
      address.country
    ].filter(Boolean)
    
    return parts.join(', ')
  }

  const handleSelectAddress = (address) => {
    const addressId = address._id || address.id
    if (!addressId) return

    // Just update UI state - store the ID in state (no API call)
    setSelectedAddressId(addressId)
  }

  // Loading and error states are now handled in the parent ProfilePage component

  if (!addresses || addresses.length === 0) {
    return (
      <div className={styles.walletHeader}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          No addresses found. Add your first address to get started.
        </div>
      </div>
    )
  }

  return (
    <div className={styles.addressesContainer}>
      <div className={styles.addressesGrid}>
        {addresses.map((address) => {
          const addressId = address._id || address.id
          // Icon shows only on the selected address - check if this address ID matches the stored selected ID
          const isSelected = selectedAddressId === addressId
          
          return (
          <button
            key={addressId} 
            className={`${styles.addressCard} ${isSelected ? styles.selectedAddress : ''}`}
            onClick={() => handleSelectAddress(address)}
            type="button"
          >
            <div className={styles.addressType}>
              <div className={styles.addressTypeInfo}>
                <FontAwesomeIcon 
                  icon={
                    address.type === 'home' ? faHome : 
                    address.type === 'work' ? faBriefcase : 
                    faMapMarkerAlt
                  } 
                  className={styles.addressTypeIcon}
                />
                <span className={styles.addressLabel}>
                  {address.type === 'home' ? 'Home' : address.type === 'work' ? 'Office' : address.type}
                </span>
                {/* {address.isDefault && (
                  <span className={styles.defaultBadge}>Default</span>
                )} */}
              </div>
              {isSelected && (
                <div className={styles.selectedIndicator}>
                  <FontAwesomeIcon icon={faCheck} className={styles.checkIcon} />
                </div>
              )}
            </div>
            <div className={styles.addressDetails}>
              <div className={styles.addressText}>
                {address.addressLine1}
                {address.addressLine2 && `, ${address.addressLine2}`}
              </div>
              <div className={styles.addressLocation}>
                {address.city}, {address.state} {address.postalCode}
              </div>
              {address.landmark && (
                <div className={styles.addressLandmark}>
                  Landmark: {address.landmark}
                </div>
              )}
              <div className={styles.addressContact}>{address.phone}</div>
              <div className={styles.addressContact}>{address.email}</div>
              <div className={styles.addressContact}>Contact: {address.fullName}</div>
            </div>
          </button>
        )})}
      </div>
    </div>
  )
}
