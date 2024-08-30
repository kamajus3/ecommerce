'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <html lang="en">
      <body className="w-screen h-screen">
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            <p className="text-base font-semibold text-primary">404</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Page Not Found
            </h1>
            <p className="mt-6 text-base leading-7 text-gray-600">
              Sorry, we couldn Back to Home t find what you Back to Home re
              looking for.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/"
                className="bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
