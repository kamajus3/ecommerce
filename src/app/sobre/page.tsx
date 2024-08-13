import React from 'react'
import { Metadata } from 'next'
import Image from 'next/image'

import AboutHeroe from '@/assets/images/about-us-heroe.png'
import Footer from '@/components/ui/Footer'
import Header from '@/components/ui/Header'
import Advantages from '@/components/ui/Home/Advantages'

export const metadata: Metadata = {
  title: 'Sobre Nós',
  description: `Apresentamos a Poubelle.`,
  openGraph: {
    type: 'website',
    title: 'Sobre Nós',
    description: `Apresentamos a Poubelle.`,
    images: ['https://raciuscare.com/logo.png'],
  },
}

export default function AboutPage() {
  return (
    <section className="bg-white overflow-hidden">
      <Header.Client />
      <main className="max-w-5xl w-full mx-auto my-20 max-sm:w-[80%]">
        <h1 className="text-zinc-800 font-bold text-3xl">Sobre Nós</h1>

        <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="w-full">
            <p className="text-zinc-800 mt-6 leading-normal">
              Apresentamos a Poubelle. Especializada no comércio varejista
              online, destacamo-nos pela oferta de produtos de saúde e higiene
              corporal.
            </p>
          </div>
          <div className="bg-[#EB7EA8]">
            <Image
              src={AboutHeroe}
              alt="Imagem Fundo"
              className="max-w-[705px] h-[609px] w-full object-cover"
            />
          </div>
        </div>
      </main>
      <Advantages />
      <Footer />
    </section>
  )
}
