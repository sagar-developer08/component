'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setDefaultAddress } from '../../../store/slices/profileSlice'
import { useToast } from '../../../contexts/ToastContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faHome, faBriefcase, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import styles from './addresses.module.css'

export default function Addresses({ addresses }) {
  const dispatch = useDispatch()
  const { show } = useToast()
  const { settingDefault, defaultAddressError } = useSelector(state => state.profile)
  const [selectedAddress, setSelectedAddress] = useState(null)

  // Set initial selected address to default address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find(addr => addr.isDefault)
      setSelectedAddress(defaultAddr || addresses[0])
    }
  }, [addresses, selectedAddress])

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
    setSelectedAddress(address)
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
        {addresses.map((address) => (
          <div 
            key={address._id} 
            className={`${styles.addressCard} ${selectedAddress?._id === address._id ? styles.selectedAddress : ''}`}
            onClick={() => handleSelectAddress(address)}
            style={{ cursor: 'pointer' }}
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
              {selectedAddress?._id === address._id && (
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
          </div>
        ))}
      </div>
    </div>
  )
}
