'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import QoynsWallet from '@/components/profile/QoynsWallet/QoynsWallet'
import QoynsHistory from '@/components/profile/QoynsHistory/QoynsHistory'
import SendQoyn from '@/components/profile/SendQoyn/SendQoyn'
import styles from './qoyns-wallet.module.css'

export default function QoynsWalletPage() {
  const router = useRouter()
  const [activeView, setActiveView] = useState('wallet') // 'wallet', 'history', or 'send'

  return (
    <div className={styles.qoynsWalletPage}>
      <Navigation />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.textContent}>
            <h1 className={styles.title}>QOYNS WALLET</h1>
            <p className={styles.subtitle}>
              Manage your Qoyns, view transaction history, and send Qoyns to friends.
            </p>
          </div>
          <div className={styles.actionTop}>
            <button 
              className={`${styles.actionBtn} ${activeView === 'history' ? styles.active : ''}`}
              onClick={() => setActiveView('history')}
            >
              History
            </button>
            <button 
              className={`${styles.actionBtn} ${styles.sendBtn} ${activeView === 'send' ? styles.active : ''}`}
              onClick={() => setActiveView('send')}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ verticalAlign: 'middle' }}>
                  <circle cx="9" cy="9" r="9" fill="#fff" />
                  <path d="M9 6v6M6 9h6" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Send Qoyn
              </span>
            </button>
            {(activeView === 'history' || activeView === 'send') && (
              <button 
                className={styles.backBtn}
                onClick={() => setActiveView('wallet')}
              >
                Back to Wallet
              </button>
            )}
          </div>
        </div>
        <div className={styles.content}>
          {activeView === 'wallet' && (
            <div className={styles.sectionContent}>
              <QoynsWallet />
            </div>
          )}
          {activeView === 'history' && (
            <div className={styles.sectionContent}>
              <QoynsHistory />
            </div>
          )}
          {activeView === 'send' && (
            <div className={styles.sectionContent}>
              <SendQoyn />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

