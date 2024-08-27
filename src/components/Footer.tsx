'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { MoveUpRight } from 'lucide-react'

import { env } from '@/env'
import { Link } from '@/navigation'

export default function Footer() {
  const t = useTranslations('structure')

  return (
    <footer className="bg-primary footer">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-12 lg:py-14">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link href="/">
              <Image
                src="/logo-white.png"
                alt="Poubelle"
                width={140}
                height={140}
                draggable={false}
                className="select-none"
              />
            </Link>
            <p className="text-white text-xs">© 2024 Poubelle</p>
          </div>
          <div className="grid grid-cols-2 gap-12 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-lg font-semibold text-white">
                {t('footer.support.title')}
              </h2>
              <ul className="text-gray-200 font-medium">
                <li className="mb-4">
                  <Link href={`mailto:${env.NEXT_PUBLIC_EMAIL_ADDRESS}`}>
                    {env.NEXT_PUBLIC_EMAIL_ADDRESS}
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href="tel:+3317018XXXX">+33 1 70 18 XX XX</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-lg font-semibold text-white">
                {t('footer.usefulLinks.title')}
              </h2>
              <ul className="text-gray-200 font-medium">
                <li className="mb-4">
                  <Link href="/about">{t('footer.aboutUs.title')}</Link>
                </li>
                <li className="mb-4">
                  <Link href="/terms">{t('footer.usefulLinks.terms')}</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-lg font-semibold text-white">
                {t('footer.usefulLinks.socialMedia')}
              </h2>
              <ul className="text-gray-200 font-medium">
                <li className="mb-4">
                  <Link
                    href="#"
                    target="_blank"
                    className="flex items-center gap-2"
                  >
                    Facebook
                    <MoveUpRight size={13} color="#f5f4ef80" />
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="#"
                    target="_blank"
                    className="flex items-center gap-2"
                  >
                    WhatsApp
                    <MoveUpRight size={13} color="#f5f4ef80" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
