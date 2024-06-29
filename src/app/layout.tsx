import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Bounce, ToastContainer } from 'react-toastify'

import AuthProvider from '@/contexts/AuthContext'
import InformationProvider from '@/contexts/InformationContext'
import PromotionProvider from '@/contexts/PromotionContext'

import './globals.css'
import 'react-toastify/dist/ReactToastify.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '700'],
})

export const viewport: Viewport = {
  themeColor: '#000000',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://raciuscare.com'),
  title: {
    template: '%s | Racius Care',
    default: 'Racius Care',
  },
  description:
    'Bem-vindo à Racius Care - sua loja online para cuidados pessoais, saúde, e produtos para casa em Angola. Encontre tudo o que você precisa para cuidar de si mesmo, sua família e sua casa, com apenas alguns cliques.',
  generator: 'Next.js',
  applicationName: 'Racius Care',
  referrer: 'origin-when-cross-origin',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  authors: [{ name: 'Racius Care', url: 'https://raciuscare.com' }],
  colorScheme: 'light',
  creator: 'Racius Care Developers',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: 'https://raciuscare.com',
    languages: {
      'pt-PT': '/pt-PT',
      'pt-BR': '/pt-BR',
    },
  },
  openGraph: {
    title: 'Racius Care',
    description:
      'Bem-vindo à Racius Care - sua loja online para cuidados pessoais, saúde, e produtos para casa em Angola. Encontre tudo o que você precisa para cuidar de si mesmo, sua família e sua casa, com apenas alguns cliques.',
    images: ['https://raciuscare.com/logo.png'],
  },
  twitter: {
    title: 'Racius Care',
    description:
      'Bem-vindo à Racius Care - sua loja online para cuidados pessoais, saúde, e produtos para casa em Angola. Encontre tudo o que você precisa para cuidar de si mesmo, sua família e sua casa, com apenas alguns cliques.',
    images: ['https://raciuscare.com/logo.png'],
  },
  icons: {
    icon: ['/favicon.ico?v=4'],
    apple: ['apple-touch-icon.png?v=4'],
    shortcut: ['apple-touch-icon.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt">
      <body className={`${inter.className}`}>
        <AuthProvider>
          <PromotionProvider>
            <InformationProvider>{children}</InformationProvider>
          </PromotionProvider>
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
      </body>
    </html>
  )
}
