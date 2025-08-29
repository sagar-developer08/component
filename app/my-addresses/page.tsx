'use client'

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import styles from './my-addresses.module.css'

// Sample address data - in a real app, this would come from an API or database
const sampleAddresses = [
  {
    id: 1,
    label: 'Home',
    type: 'home',
    address: '123 Main Street, Downtown Dubai, Dubai, UAE',
    pincode: '12345',
    isDefault: true
  },
  {
    id: 2,
    label: 'Office',
    type: 'work',
    address: '456 Business Bay, Dubai Marina, Dubai, UAE',
    pincode: '67890',
    isDefault: false
  },
//   {
//     id: 3,
//     label: 'Friend\'s Place',
//     type: 'other',
//     address: '789 Jumeirah Beach Road, Jumeirah, Dubai, UAE',
//     pincode: '54321',
//     isDefault: false
//   }
]

export default function MyAddressesPage() {
  const handleEdit = (addressId: number) => {
    console.log('Edit address:', addressId)
    // Navigate to edit address page
  }

  const handleDelete = (addressId: number) => {
    console.log('Delete address:', addressId)
    // Handle address deletion
  }

  const handleSetDefault = (addressId: number) => {
    console.log('Set as default:', addressId)
    // Handle setting address as default
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'home':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case 'work':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 21V5C19 4.46957 18.7893 3.96086 18.4142 3.58579C18.0391 3.21071 17.5304 3 17 3H7C6.46957 3 5.96086 3.21071 5.58579 3.58579C5.21071 3.96086 5 4.46957 5 5V21L12 17L19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 1V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 21V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M4.22 4.22L5.64 5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M18.36 18.36L19.78 19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M1 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M21 12H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M4.22 19.78L5.64 18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
    }
  }

  return (
    <div className={styles.myAddressesPage}>
      <Navigation />
      
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.backButton}>
            <button className={styles.backBtn} onClick={() => window.history.back()}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>
          </div>

          <div className={styles.titleSection}>
            <h1 className={styles.title}>MY ADDRESSES</h1>
            <p className={styles.subtitle}>
              Manage your saved addresses for faster checkout
            </p>
          </div>

          <Link href="/add-address" className={styles.addAddressBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add New Address
          </Link>
        </div>

        <div className={styles.addressesList}>
          {sampleAddresses.map((address) => (
            <div key={address.id} className={`${styles.addressCard} ${address.isDefault ? styles.defaultCard : ''}`}>
              <div className={styles.addressHeader}>
                <div className={styles.addressType}>
                  <div className={styles.typeIcon}>
                    {getTypeIcon(address.type)}
                  </div>
                  <span className={styles.label}>{address.label}</span>
                  {address.isDefault && (
                    <span className={styles.defaultBadge}>Default</span>
                  )}
                </div>
                
                <div className={styles.addressActions}>
                  <button 
                    className={styles.actionBtn}
                    onClick={() => handleEdit(address.id)}
                    title="Edit address"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  
                  <button 
                    className={styles.actionBtn}
                    onClick={() => handleDelete(address.id)}
                    title="Delete address"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className={styles.addressDetails}>
                <p className={styles.addressText}>{address.address}</p>
                <p className={styles.pincode}>Pincode: {address.pincode}</p>
              </div>
              
              {!address.isDefault && (
                <button 
                  className={styles.setDefaultBtn}
                  onClick={() => handleSetDefault(address.id)}
                >
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </div>

        {sampleAddresses.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.3639 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className={styles.emptyTitle}>No addresses saved yet</h3>
            <p className={styles.emptyText}>Add your first address to get started with faster checkout</p>
            <Link href="/add-address" className={styles.emptyAddBtn}>
              Add Your First Address
            </Link>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}