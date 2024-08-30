'use client'

import { useLocale, useTranslations } from 'next-intl'
import { MoveUpRight } from 'lucide-react'

import { env } from '@/env'
import { Link, usePathname, useRouter } from '@/navigation'

import Field from './Field'

export default function Footer() {
  const locale = useLocale()
  const t = useTranslations('structure')

  const router = useRouter()
  const pathname = usePathname()

  function switchLanguage(newLocale: string) {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <footer className="bg-primary footer">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-12 lg:py-14">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Field.Select
              style={{
                padding: '13px 18px 13px 18px',
              }}
              className="bg-white text-black mb-3"
              options={[
                {
                  value: 'en',
                  label: t('footer.languages.english'),
                },
                {
                  value: 'fr',
                  label: t('footer.languages.french'),
                },
              ]}
              defaultValue={locale}
              onChange={(e) => {
                switchLanguage(e.target.value)
              }}
            />
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
