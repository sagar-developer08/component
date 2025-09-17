import './globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import { ReduxProvider } from '../store/ReduxProvider'

export const metadata = {
  title: 'QLIQ - Marketplace',
  description: 'Your one-stop marketplace for everything',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ReduxProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
