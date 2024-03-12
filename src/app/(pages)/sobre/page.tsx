import React from 'react'

import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
import Image from 'next/image'
import AboutHeroe from '@/assets/images/about-us-heroe.png'
import Advantages from '@/app/components/Home/Advantages'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Nós',
  description: `Apresentamos a Racius Care, fundada em 22 de setembro de 2023 por Edvaldo e Sandra Cassendo. Especializada no comércio a retalho online, destacamo-nos pela oferta de produtos de saúde e higiene corporal.`,
  openGraph: {
    type: 'website',
    title: 'Sobre Nós',
    description: `Apresentamos a Racius Care, fundada em 22 de setembro de 2023 por Edvaldo e Sandra Cassendo. Especializada no comércio a retalho online, destacamo-nos pela oferta de produtos de saúde e higiene corporal.`,
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
              Apresentamos a Racius Care, fundada em 22 de setembro de 2023 por
              Edvaldo e Sandra Cassendo. Especializada no comércio varejista
              online, destacamo-nos pela oferta de produtos de saúde e higiene
              corporal.
            </p>

            <p className="text-zinc-800 mt-8 leading-normal">
              Nossa missão é oferecer aos nossos clientes produtos e serviços
              que contribuam para uma vida mais saudável e feliz. Acreditamos
              que o cuidado com o corpo e a mente é fundamental para o bem-estar
              geral, e por isso, nos dedicamos a fornecer soluções que atendam
              às necessidades de cada cliente.
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
