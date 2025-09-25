'use client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProfile } from '../../../store/slices/profileSlice'
import styles from './addresses.module.css'

export default function Addresses() {
  const dispatch = useDispatch()
  const { addresses, loading, error } = useSelector(state => state.profile)

  useEffect(() => {
    dispatch(fetchProfile())
  }, [dispatch])

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

  if (loading) {
    return (
      <div className={styles.walletHeader}>
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading addresses...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.walletHeader}>
        <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
          Error loading addresses: {error}
        </div>
      </div>
    )
  }

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
    <div className={styles.addressesGrid}>
      {addresses.map((address) => (
        <div key={address._id} className={styles.QoynsCard}>
          <div className={styles.balanceRow}>
            <h3 className={styles.AddressTitle}>
              {address.type === 'home' ? 'Home' : address.type === 'work' ? 'Office' : address.type}
              {address.isDefault && <span style={{ fontSize: '12px', color: '#0082FF', marginLeft: '8px' }}>(Default)</span>}
            </h3>
            {address.isDefault && (
              <svg width="40" height="40" fill="none">
                <circle cx="12" cy="12" r="10" fill="#0082FF" />
                <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <div className={styles.AddressContent}>
            {formatAddress(address)}
            {address.landmark && (
              <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
                <strong>Landmark:</strong> {address.landmark}
              </div>
            )}
            {address.instructions && (
              <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
                <strong>Instructions:</strong> {address.instructions}
              </div>
            )}
          </div>
          <div className={styles.CardDetails}>
            <span className={styles.addressNumber}>{address.phone}</span>
          </div>
          <div className={styles.CardDetails}>
            <span className={styles.addressEmail}>{address.email}</span>
          </div>
          <div className={styles.CardDetails}>
            <span style={{ fontSize: '14px', color: '#666' }}>
              <strong>Contact:</strong> {address.fullName}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
