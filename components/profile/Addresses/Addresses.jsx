'use client'
import { useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faHome, faBriefcase, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { setDefaultAddress } from '@/store/slices/profileSlice'
import { useToast } from '@/contexts/ToastContext'
import styles from './addresses.module.css'

export default function Addresses({ addresses }) {
  const dispatch = useDispatch()
  const { show: showToast } = useToast()
  // Store the selected address ID in state so it persists
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const initialized = useRef(false)

  // Set initial selected address to default address only once when addresses are first loaded
  // Also sync when default address changes
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
        // After initialization: sync with default address if it changed
        const defaultAddr = addresses.find(addr => addr.isDefault)
        const defaultId = defaultAddr ? (defaultAddr._id || defaultAddr.id) : null
        
        setSelectedAddressId(currentId => {
          // If there's a default address and it's different from current selection, update it
          if (defaultId && currentId !== defaultId) {
            return defaultId
          }
          
          // If current selection doesn't exist, reset to default or first
          if (currentId) {
            const stillExists = addresses.some(addr => {
              const addrId = addr._id || addr.id
              return addrId === currentId
            })
            if (!stillExists) {
              return defaultId || (addresses[0]?._id || addresses[0]?.id) || currentId
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

  const handleSelectAddress = async (address) => {
    const addressId = address._id || address.id
    if (!addressId) return

    // Don't make API call if this address is already selected
    if (selectedAddressId === addressId) {
      return
    }

    // Update UI state immediately for better UX
    setSelectedAddressId(addressId)

    try {
      // Call API to set as default address
      const result = await dispatch(setDefaultAddress(addressId))
      
      if (setDefaultAddress.fulfilled.match(result)) {
        showToast('Default address updated successfully', 'success')
      } else if (setDefaultAddress.rejected.match(result)) {
        // Revert UI state on error
        const previousDefault = addresses.find(addr => addr.isDefault)
        if (previousDefault) {
          setSelectedAddressId(previousDefault._id || previousDefault.id)
        }
        showToast(result.payload || 'Failed to update default address', 'error')
      }
    } catch (error) {
      // Revert UI state on error
      const previousDefault = addresses.find(addr => addr.isDefault)
      if (previousDefault) {
        setSelectedAddressId(previousDefault._id || previousDefault.id)
      }
      showToast('Failed to update default address', 'error')
    }
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
