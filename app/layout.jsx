import './globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import { ReduxProvider } from '../store/ReduxProvider'
import { ToastProvider } from '../contexts/ToastContext'
import ClientWrapper from '../components/ClientWrapper'

export const metadata = {
  title: 'IQLIQ - Marketplace',
  description: 'Your one-stop marketplace for everything',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/favicon.png',
    shortcut: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" as="style" onLoad="this.onload=null;this.rel='stylesheet'" />
        <noscript>
          <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet" />
        </noscript>
      </head>
      <body>
        <ReduxProvider>
          <ToastProvider>
            <AuthProvider>
              <ClientWrapper>
                {children}
              </ClientWrapper>
            </AuthProvider>
          </ToastProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
