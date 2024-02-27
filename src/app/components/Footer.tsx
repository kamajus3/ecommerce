'use client'

import { ChevronUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-main relative">
      <button
        onClick={() => {
          window.scrollTo(0, 0)
        }}
        className="absolute -top-7 right-8 flex justify-center items-center w-14 h-14 border shadow-sm p-2 rounded-full bg-[#00A4C7] text-sm font-medium text-gray-700 hover:brightness-75 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
      >
        <ChevronUp color="#fff" size={26} />
      </button>
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link href="/">
              <Image
                src="/logo-white.png"
                alt="Logotipo da Racius Care"
                width={140}
                height={140}
              />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-white">
                SUPORTE
              </h2>
              <ul className="text-gray-200 font-medium">
                <li className="mb-4">
                  <Link
                    href="mailto:geral@raciuscare.com"
                    className="hover:underline"
                  >
                    geral@raciuscare.com
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href="tel:+244926437705" className="hover:underline">
                    +244 935 420 498
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-white">
                ÚTEIS
              </h2>
              <ul className="text-gray-200 font-medium">
                <li className="mb-4">
                  <Link href="/about-us" className="hover:underline">
                    Quem somos nós?
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href="/terms" className="hover:underline">
                    Termos e condições
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-white">
                Redes socias
              </h2>
              <ul className="text-gray-200 font-medium">
                <li className="mb-4">
                  <Link
                    href="https://www.facebook.com/profile.php?id=61556945094289"
                    target="_blank"
                    className="hover:underline"
                  >
                    Facebook
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="https://wa.me/message/7GFNTDQN5W25O1"
                    className="hover:underline"
                  >
                    Whatsapp
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-neutral-200 sm:mx-auto lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-white sm:text-center">
            © 2024{' '}
            <Link href="/" className="hover:underline">
              Racius Care
            </Link>
            . Todos os direitos reservados.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
            <Link
              href="https://www.facebook.com/profile.php?id=61556945094289"
              target="_blank"
              className="text-white hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                width="25"
                height="25"
              >
                <rect width="256" height="256" fill="none" />
                <circle
                  cx="128"
                  cy="128"
                  r="96"
                  fill="none"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="16"
                />
                <path
                  d="M168,88H152a24,24,0,0,0-24,24V224"
                  fill="none"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="16"
                />
                <line
                  x1="96"
                  y1="144"
                  x2="160"
                  y2="144"
                  fill="none"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="16"
                />
              </svg>
            </Link>
            <Link
              href="https://wa.me/message/7GFNTDQN5W25O1"
              className="text-white hover:text-gray-200 ms-5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                width="25"
                height="25"
              >
                <rect width="256" height="256" fill="none" />
                <path
                  d="M72,104a32,32,0,0,1,32-32l16,32-12.32,18.47a48.19,48.19,0,0,0,25.85,25.85L152,136l32,16a32,32,0,0,1-32,32A80,80,0,0,1,72,104Z"
                  fill="none"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="16"
                />
                <path
                  d="M79.93,211.11a96,96,0,1,0-35-35h0L32.42,213.46a8,8,0,0,0,10.12,10.12l37.39-12.47Z"
                  fill="none"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="16"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
