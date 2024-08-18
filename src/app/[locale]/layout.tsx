import { Dosis } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import {
  getMessages,
  unstable_setRequestLocale as unstableSetRequestLocale,
} from 'next-intl/server'
import { Bounce, ToastContainer } from 'react-toastify'

import AuthProvider from '@/contexts/AuthContext'
import CampaignProvider from '@/contexts/CampaignContext'

import './globals.css'
import 'react-toastify/dist/ReactToastify.css'

const dosis = Dosis({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '700'],
})

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode
  params: { locale: string }
}>) {
  // Enable static rendering
  unstableSetRequestLocale(locale)

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={`${dosis.className}`}>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <CampaignProvider>{children}</CampaignProvider>
          </AuthProvider>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover={false}
            theme="light"
            transition={Bounce}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
