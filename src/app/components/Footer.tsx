'use client'

import { ChevronUp, Facebook, Instagram, Linkedin } from 'lucide-react'
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
              <h1 className="text-white font-bold text-2xl">Racius Care</h1>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-white">
                SUPORTE
              </h2>
              <ul className="text-gray-200 font-medium">
                <li className="mb-4">
                  <a
                    href="mailto:suporte@raciuscare.com"
                    className="hover:underline"
                  >
                    suporte@raciuscare.com
                  </a>
                </li>
                <li className="mb-4">
                  <a href="tel:+244926437705" className="hover:underline">
                    +244 926 437 705
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-white">
                ÚTEIS
              </h2>
              <ul className="text-gray-200 font-medium">
                <li className="mb-4">
                  <a href="https://flowbite.com/" className="hover:underline">
                    Quem somos nós?
                  </a>
                </li>
                <li className="mb-4">
                  <a href="/terms-and-conditions" className="hover:underline">
                    Termos e condições
                  </a>
                </li>
                <li className="mb-4">
                  <a href="/politics" className="hover:underline">
                    Política de privacidade
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-white">
                Redes socias
              </h2>
              <ul className="text-gray-200 font-medium">
                <li className="mb-4">
                  <a
                    href="https://github.com/themesberg/flowbite"
                    className="hover:underline"
                  >
                    Facebook
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="https://discord.gg/4eeurUVvTy"
                    className="hover:underline"
                  >
                    Instagram
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="https://discord.gg/4eeurUVvTy"
                    className="hover:underline"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-neutral-200 sm:mx-auto lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-white sm:text-center">
            © 2024{' '}
            <a href="https://flowbite.com/" className="hover:underline">
              Racius Care
            </a>
            . Todos os direitos reservados.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
            <a href="#" className="text-white hover:text-gray-200">
              <Facebook color="#fff" size={20} />
              <span className="sr-only">Facebook page</span>
            </a>
            <a href="#" className="text-white hover:text-gray-200 ms-5">
              <Instagram color="#fff" size={20} />
            </a>
            <a href="#" className="text-white hover:text-gray-200 ms-5">
              <Linkedin color="#fff" size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
