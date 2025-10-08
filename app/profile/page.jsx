'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Image from 'next/image'
import styles from './profile.module.css'
import PersonalInfo from '../../components/profile/PersonalInfo/PersonalInfo'
import CashWallet from '../../components/profile/CashWallet/CashWallet'
import QoynsWallet from '../../components/profile/QoynsWallet/QoynsWallet'
import Orders from '../../components/profile/Orders/Orders'
import Addresses from '../../components/profile/Addresses/Addresses'
import AddCard from '../../components/profile/AddCard/AddCard'
import QoynsHistory from '../../components/profile/QoynsHistory/QoynsHistory'
import SendQoyn from '../../components/profile/SendQoyn/SendQoyn'
import NewAddress from '../../components/profile/NewAddress/newAddress'

// User data is now fetched from the aggregated API in each component

export default function ProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('personal-info')
  const [isEditing, setIsEditing] = useState(false)

  // Initialize active tab from URL parameter
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab')
    if (tabFromUrl) {
      setActiveTab(tabFromUrl)
    }
  }, [searchParams])

  // Update URL when tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    const url = new URL(window.location)
    url.searchParams.set('tab', tabId)
    router.replace(url.pathname + url.search, { scroll: false })
  }

  // Handle navigation from NewAddress component
  const handleNewAddressCancel = () => {
    handleTabChange('addresses')
  }

  const handleNewAddressSave = () => {
    // TODO: Implement save address functionality
    handleTabChange('addresses')
  }

  const handleNewCardCancel = () => {
    handleTabChange('cash-wallet')
  }

  const handleNewCardSave = () => {
    // TODO: Implement save address functionality
    handleTabChange('cash-wallet')
  }

  const handleSendQoynCancel = () => {
    handleTabChange('qoyns-wallet')
  }

  const handleSendQoynSave = () => {
    // TODO: Implement save address functionality
    handleTabChange('qoyns-wallet')
  }

  const tabs = [
    { id: 'personal-info', label: 'Personal Info' },
    { id: 'cash-wallet', label: 'Cash Wallet' },
    { id: 'qoyns-wallet', label: 'Qoyns Wallet' },
    { id: 'orders', label: 'Orders' },
    { id: 'addresses', label: 'Addresses' },
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
                  onClick={() => handleTabChange(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {activeTab === 'cash-wallet' && (
              <button
                className={styles.addCardBtn}
                onClick={() => handleTabChange('add-card')}
              >
                Add New Card
              </button>
            )}
            {activeTab === 'qoyns-wallet' || activeTab === 'qoyns-history' || activeTab === 'send-qoyn' ? (
              <div className={styles.qoynsActionsRow}>
                <button
                  className={`${styles.addCardBtn} ${activeTab === 'qoyns-history' ? styles.active : ''}`}
                  onClick={() => handleTabChange('qoyns-history')}
                >
                  History
                </button>
                <button
                  className={`${styles.addCardBtn} ${activeTab === 'send-qoyn' ? styles.active : ''}`}
                  onClick={() => handleTabChange('send-qoyn')}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ verticalAlign: 'middle' }}>
                      <circle cx="9" cy="9" r="9" fill="#111" />
                      <path d="M9 6v6M6 9h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Send Qoyn
                  </span>
                </button>
              </div>
            ) : null}
            {activeTab === 'orders' && (
              <div className={styles.qoynsActionsRow}>
                <div className={styles.statusDropdownWrapper}>
                  <select className={styles.statusDropdown}>
                    <option value="all">Status</option>
                    <option value="delivered">Delivered</option>
                    <option value="in-transit">In Transit</option>
                    <option value="processing">Processing</option>
                  </select>
                  <span className={styles.dropdownArrow}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M4 7L9 12L14 7" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            )}
            {activeTab === 'addresses' && (
              <div className={styles.qoynsActionsRow}>
                <button className={styles.addCardBtn}>
                  Use my Current Location
                </button>
                <button
                  className={`${styles.addCardBtn} ${activeTab === 'new-address' ? styles.active : ''}`}
                  onClick={() => handleTabChange('new-address')}
                >
                  Add New Address
                </button>
              </div>
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
            {activeTab === 'add-card' && (
              <div className={styles.sectionContent}>
                <AddCard
                  onCancel={handleNewCardCancel}
                  onSave={handleNewCardSave}
                />
              </div>
            )}
            {activeTab === 'qoyns-wallet' && (
              <div className={styles.sectionContent}>
                <QoynsWallet
                />
              </div>
            )}
            {activeTab === 'qoyns-history' && (
              <div className={styles.sectionContent}>
                <QoynsHistory />
              </div>
            )}
            {activeTab === 'send-qoyn' && (
              <div className={styles.sectionContent}>
                <SendQoyn
                  onCancel={handleSendQoynCancel}
                  onSave={handleSendQoynSave}
                />
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
            {activeTab === 'new-address' && (
              <div className={styles.sectionContent}>
                <NewAddress
                  onCancel={handleNewAddressCancel}
                  onSave={handleNewAddressSave}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}