'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronUp, MoveUpRight } from 'lucide-react'

import { env } from '@/env'
import { formatPhoneNumber } from '@/functions/format'

interface IFooter {
  disableBackButton?: boolean
}

export default function Footer({ disableBackButton = false }: IFooter) {
  return (
    <footer className="bg-main relative footer">
      {!disableBackButton && (
        <button
          onClick={() => {
            window.scrollTo(0, 0)
          }}
          className="animate-bounce absolute -top-7 right-8 flex justify-center items-center w-14 h-14 border shadow-sm p-2 rounded-full bg-secondary text-sm font-medium text-gray-700 hover:brightness-75 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
        >
          <ChevronUp color="#fff" size={26} />
        </button>
      )}
      <div className="mx-auto w-full max-w-screen-xl p-4 py-12 lg:py-14">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link href="/">
              <Image
                src="/logo-white.png"
                alt="Logotipo da Racius Care"
                width={140}
                height={140}
                draggable={false}
                className="select-none"
              />
            </Link>
            <p className="text-white text-xs">© 2024 Racius Care.</p>
          </div>
          <div className="grid grid-cols-2 gap-12 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-lg font-semibold text-white">Suporte</h2>
              <ul className="text-gray-200 font-medium">
                <li className="mb-4">
                  <Link href={`mailto:${env.NEXT_PUBLIC_EMAIL_ADDRESS}`}>
                    {env.NEXT_PUBLIC_EMAIL_ADDRESS}
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href="tel:+244926437705">
                    {formatPhoneNumber('935420498')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-lg font-semibold text-white">Úteis</h2>
              <ul className="text-gray-200 font-medium">
                <li className="mb-4">
                  <Link href="/sobre">Quem somos nós?</Link>
                </li>
                <li className="mb-4">
                  <Link href="/termos-gerais">Termos e condições</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-lg font-semibold text-white">
                Redes socias
              </h2>
              <ul className="text-gray-200 font-medium">
                <li className="mb-4">
                  <Link
                    href="https://www.facebook.com/profile.php?id=61556945094289"
                    target="_blank"
                    className="flex items-center gap-2"
                  >
                    Facebook
                    <MoveUpRight size={13} color="#f5f4ef80" />
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="https://wa.me/message/7GFNTDQN5W25O1"
                    target="_blank"
                    className="flex items-center gap-2"
                  >
                    Whatsapp
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
