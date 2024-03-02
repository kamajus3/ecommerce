import React from 'react'

import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
import Image from 'next/image'
import AboutHeroe from '@/assets/images/about-us-heroe.png'
import Advantages from '@/app/components/Home/Advantages'

export default function pages() {
  return (
    <section className="bg-white overflow-hidden">
      <Header.Client />
      <main className="max-w-5xl w-full mx-auto my-20 max-sm:w-[80%]">
        <h1 className="text-zinc-800 font-bold text-3xl">Sobre Nós</h1>

        <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="w-full">
            <h2 className="text-5xl">Nossa História</h2>
            <p className="text-zinc-800 mt-6 leading-normal">
              Launced in 2015, Exclusive is South Asia’s premier online shopping
              makterplace with an active presense in Bangladesh. Supported by
              wide range of tailored marketing, data and service solutions,
              Exclusive has 10,500 sallers and 300 brands and serves 3 millioons
              customers across the region.
            </p>

            <p className="text-zinc-800 mt-8 leading-normal">
              Exclusive has more than 1 Million products to offer, growing at a
              very fast. Exclusive offers a diverse assotment in categories
              ranging from consumer.
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
