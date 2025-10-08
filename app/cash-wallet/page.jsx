'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import CashWallet from '@/components/profile/CashWallet/CashWallet'
import AddCard from '@/components/profile/AddCard/AddCard'
import styles from './cash-wallet.module.css'

export default function CashWalletPage() {
  const router = useRouter()
  const [activeView, setActiveView] = useState('wallet') // 'wallet' or 'add-card'

  return (
    <div className={styles.cashWalletPage}>
      <Navigation />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.textContent}>
            <h1 className={styles.title}>CASH WALLET</h1>
            <p className={styles.subtitle}>
              Manage your cash wallet, view transactions, and add new payment cards.
            </p>
          </div>
          <div className={styles.actionTop}>
            {activeView === 'wallet' && (
              <button 
                className={styles.addCardBtn}
                onClick={() => setActiveView('add-card')}
              >
                Add New Card
              </button>
            )}
            {activeView === 'add-card' && (
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
              <CashWallet />
            </div>
          )}
          {activeView === 'add-card' && (
            <div className={styles.sectionContent}>
              <AddCard />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

