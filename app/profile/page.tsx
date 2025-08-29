'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Image from 'next/image'
import styles from './profile.module.css'

// Sample user data - in a real app, this would come from an API
const userData = {
  name: 'AMA CRUIZE',
  email: 'example@gmail.com',
  phone: '+971 555 4444',
  avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/e6affc0737515f664c7d8288ba0b3068f64a0ade?width=80'
}

const sampleOrders = [
  {
    id: 'ORD001',
    date: '2024-01-15',
    status: 'Delivered',
    total: 'AED 245.50',
    items: 3
  },
  {
    id: 'ORD002',
    date: '2024-01-10',
    status: 'In Transit',
    total: 'AED 189.00',
    items: 2
  },
  {
    id: 'ORD003',
    date: '2024-01-05',
    status: 'Processing',
    total: 'AED 320.75',
    items: 5
  }
]

const sampleTransactions = [
  {
    id: 'TXN001',
    type: 'credit',
    amount: 'AED 100.00',
    description: 'Wallet Top-up',
    date: '2024-01-15'
  },
  {
    id: 'TXN002',
    type: 'debit',
    amount: 'AED 45.50',
    description: 'Order Payment',
    date: '2024-01-14'
  },
  {
    id: 'TXN003',
    type: 'credit',
    amount: 'AED 25.00',
    description: 'Cashback Reward',
    date: '2024-01-12'
  }
]

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
  }
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal-info')
  const [isEditing, setIsEditing] = useState(false)

  const tabs = [
    { id: 'personal-info', label: 'Personal Info', icon: '👤' },
    { id: 'cash-wallet', label: 'Cash Wallet', icon: '💳' },
    { id: 'qoyns-wallet', label: 'Qoyns Wallet', icon: '🪙' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'addresses', label: 'My Addresses', icon: '📍' }
  ]

  const renderPersonalInfo = () => (
    <div className={styles.sectionContent}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarSection}>
          <Image
            src={userData.avatar}
            alt="Profile"
            width={80}
            height={80}
            className={styles.avatar}
          />
          <div className={styles.userInfo}>
            <h2 className={styles.userName}>{userData.name}</h2>
            <p className={styles.userType}>User</p>
          </div>
        </div>
        <div className={styles.actionButtons}>
          <button 
            className={styles.editBtn}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
          {isEditing && (
            <button 
              className={styles.cancelBtn}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <label className={styles.infoLabel}>Email:</label>
          {isEditing ? (
            <input 
              type="email" 
              defaultValue={userData.email}
              className={styles.infoInput}
            />
          ) : (
            <span className={styles.infoValue}>{userData.email}</span>
          )}
        </div>
        
        <div className={styles.infoItem}>
          <label className={styles.infoLabel}>Phone:</label>
          {isEditing ? (
            <input 
              type="tel" 
              defaultValue={userData.phone}
              className={styles.infoInput}
            />
          ) : (
            <span className={styles.infoValue}>{userData.phone}</span>
          )}
        </div>
      </div>
    </div>
  )

  const renderCashWallet = () => (
    <div className={styles.sectionContent}>
      <div className={styles.walletHeader}>
        <div className={styles.balanceCard}>
          <h3 className={styles.balanceTitle}>Available Balance</h3>
          <div className={styles.balanceAmount}>AED 1,250.75</div>
          <button className={styles.topUpBtn}>Top Up Wallet</button>
        </div>
      </div>
      
      <div className={styles.transactionSection}>
        <h4 className={styles.sectionTitle}>Recent Transactions</h4>
        <div className={styles.transactionList}>
          {sampleTransactions.map((transaction) => (
            <div key={transaction.id} className={styles.transactionItem}>
              <div className={styles.transactionInfo}>
                <div className={`${styles.transactionIcon} ${styles[transaction.type]}`}>
                  {transaction.type === 'credit' ? '↗' : '↙'}
                </div>
                <div className={styles.transactionDetails}>
                  <span className={styles.transactionDesc}>{transaction.description}</span>
                  <span className={styles.transactionDate}>{transaction.date}</span>
                </div>
              </div>
              <span className={`${styles.transactionAmount} ${styles[transaction.type]}`}>
                {transaction.type === 'credit' ? '+' : '-'}{transaction.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderQoynsWallet = () => (
    <div className={styles.sectionContent}>
      <div className={styles.walletHeader}>
        <div className={styles.balanceCard}>
          <h3 className={styles.balanceTitle}>Qoyns Balance</h3>
          <div className={styles.balanceAmount}>2,450 Qoyns</div>
          <p className={styles.balanceSubtext}>≈ AED 24.50 value</p>
        </div>
      </div>
      
      <div className={styles.rewardsSection}>
        <h4 className={styles.sectionTitle}>Earn More Qoyns</h4>
        <div className={styles.rewardsList}>
          <div className={styles.rewardItem}>
            <div className={styles.rewardIcon}>🛒</div>
            <div className={styles.rewardInfo}>
              <span className={styles.rewardTitle}>Shop & Earn</span>
              <span className={styles.rewardDesc}>Get 1 Qoyn for every AED 10 spent</span>
            </div>
          </div>
          <div className={styles.rewardItem}>
            <div className={styles.rewardIcon}>⭐</div>
            <div className={styles.rewardInfo}>
              <span className={styles.rewardTitle}>Write Reviews</span>
              <span className={styles.rewardDesc}>Earn 50 Qoyns for each review</span>
            </div>
          </div>
          <div className={styles.rewardItem}>
            <div className={styles.rewardIcon}>👥</div>
            <div className={styles.rewardInfo}>
              <span className={styles.rewardTitle}>Refer Friends</span>
              <span className={styles.rewardDesc}>Get 500 Qoyns for each referral</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderOrders = () => (
    <div className={styles.sectionContent}>
      <div className={styles.ordersHeader}>
        <h3 className={styles.sectionTitle}>My Orders</h3>
        <div className={styles.orderFilters}>
          <button className={styles.filterBtn}>All</button>
          <button className={styles.filterBtn}>Processing</button>
          <button className={styles.filterBtn}>Delivered</button>
        </div>
      </div>
      
      <div className={styles.ordersList}>
        {sampleOrders.map((order) => (
          <div key={order.id} className={styles.orderItem}>
            <div className={styles.orderHeader}>
              <div className={styles.orderInfo}>
                <span className={styles.orderId}>Order #{order.id}</span>
                <span className={styles.orderDate}>{order.date}</span>
              </div>
              <span className={`${styles.orderStatus} ${styles[order.status.toLowerCase().replace(' ', '')]}`}>
                {order.status}
              </span>
            </div>
            <div className={styles.orderDetails}>
              <span className={styles.orderItems}>{order.items} items</span>
              <span className={styles.orderTotal}>{order.total}</span>
            </div>
            <div className={styles.orderActions}>
              <button className={styles.viewOrderBtn}>View Details</button>
              {order.status === 'Delivered' && (
                <button className={styles.reorderBtn}>Reorder</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderAddresses = () => (
    <div className={styles.sectionContent}>
      <div className={styles.addressesHeader}>
        <h3 className={styles.sectionTitle}>My Addresses</h3>
        <button className={styles.addAddressBtn}>Add New Address</button>
      </div>
      
      <div className={styles.addressesList}>
        {sampleAddresses.map((address) => (
          <div key={address.id} className={`${styles.addressCard} ${address.isDefault ? styles.defaultCard : ''}`}>
            <div className={styles.addressHeader}>
              <div className={styles.addressType}>
                <div className={styles.typeIcon}>
                  {address.type === 'home' ? '🏠' : '🏢'}
                </div>
                <span className={styles.addressLabel}>{address.label}</span>
                {address.isDefault && (
                  <span className={styles.defaultBadge}>Default</span>
                )}
              </div>
              <div className={styles.addressActions}>
                <button className={styles.editAddressBtn}>Edit</button>
                <button className={styles.deleteAddressBtn}>Delete</button>
              </div>
            </div>
            <div className={styles.addressDetails}>
              <p className={styles.addressText}>{address.address}</p>
              <p className={styles.pincode}>Pincode: {address.pincode}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'personal-info':
        return renderPersonalInfo()
      case 'cash-wallet':
        return renderCashWallet()
      case 'qoyns-wallet':
        return renderQoynsWallet()
      case 'orders':
        return renderOrders()
      case 'addresses':
        return renderAddresses()
      default:
        return renderPersonalInfo()
    }
  }

  return (
    <div className={styles.profilePage}>
      <Navigation />
      
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>MY PROFILE</h1>
          <p className={styles.subtitle}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero
            et velit interdum, ac aliquet odio mattis.
          </p>
          <button className={styles.upgradeBtn}>Upgrade to QLIQ Plus</button>
        </div>

        <div className={styles.profileContent}>
          <div className={styles.sidebar}>
            <div className={styles.tabsList}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className={styles.tabIcon}>{tab.icon}</span>
                  <span className={styles.tabLabel}>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.mainContent}>
            {renderContent()}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}