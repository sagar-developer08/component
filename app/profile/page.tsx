'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Image from 'next/image'
import styles from './profile.module.css'
import PersonalInfo from '../../components/profile/PersonalInfo/PersonalInfo'
import CashWallet from '../../components/profile/CashWallet/CashWallet'
import QoynsWallet from '../../components/profile/QoynsWallet/QoynsWallet'
import Orders from '../../components/profile/Orders/Orders'
import Addresses from '../../components/profile/Addresses/Addresses'

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
    { id: 'personal-info', label: 'Personal Info' },
    { id: 'cash-wallet', label: 'Cash Wallet' },
    { id: 'qoyns-wallet', label: 'Qoyns Wallet' },
    { id: 'orders', label: 'Orders' },
    { id: 'addresses', label: 'Addresses' }
  ]

  return (
    <div className={styles.profilePage}>
      <Navigation />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.textContent}>
            <h1 className={styles.title}>MY PROFILE</h1>
            <p className={styles.subtitle}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
            </p>
          </div>
          <div className={styles.actionTop}>
            <button className={styles.goLiveBtn}>Go to QLIQ Live</button>
            <button className={styles.upgradeBtn}>Upgrade to QLIQ Plus</button>
          </div>
        </div>
        <div className={styles.profileContent}>
          <div className={styles.tabsRow}>
            <div className={styles.tabsContainer}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {activeTab === 'cash-wallet' && (
              <button className={styles.addCardBtn}>
                Add New Card
              </button>
            )}
          </div>
          <div className={styles.mainContent}>
            {activeTab === 'personal-info' && (
              <div className={styles.sectionContent}>
                <PersonalInfo />
              </div>
            )}
            {activeTab === 'cash-wallet' && (
              <div className={styles.sectionContent}>
                <CashWallet />
              </div>
            )}
            {activeTab === 'qoyns-wallet' && (
              <div className={styles.sectionContent}>
                <QoynsWallet />
              </div>
            )}
            {activeTab === 'orders' && (
              <div className={styles.sectionContent}>
                <Orders />
              </div>
            )}
            {activeTab === 'addresses' && (
              <div className={styles.sectionContent}>
                <Addresses />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}