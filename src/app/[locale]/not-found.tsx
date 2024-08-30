import { getTranslations } from 'next-intl/server'

import { Link } from '@/navigation'

export default async function NotFound() {
  const t = await getTranslations('404')

  return (
    <section className="w-screen h-screen">
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-primary">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            {t('description')}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/"
              className="bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {t('back-to-home')}
            </Link>
          </div>
        </div>
      </main>
    </section>
  )
}
