import React from 'react'

import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
import Image from 'next/image'
import AboutHeroe from '@/assets/images/about-us-heroe.png'
import Advantages from '@/app/components/Home/Advantages'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Nós',
  description: `Fundada em 2024 em Luanda, Angola, a Racius Care é uma empresa
              dedicada a oferecer produtos de alta qualidade para o seu
              bem-estar. Acreditamos que o cuidado com a saúde e o bem-estar é
              essencial para uma vida plena e feliz. Por isso, nos esforçamos
              para fornecer aos nossos clientes os melhores produtos do mercado,
              com preços acessíveis e um atendimento impecável.`,
  openGraph: {
    type: 'website',
    title: 'Sobre Nós',
    description: `Fundada em 2024 em Luanda, Angola, a Racius Care é uma empresa
              dedicada a oferecer produtos de alta qualidade para o seu
              bem-estar. Acreditamos que o cuidado com a saúde e o bem-estar é
              essencial para uma vida plena e feliz. Por isso, nos esforçamos
              para fornecer aos nossos clientes os melhores produtos do mercado,
              com preços acessíveis e um atendimento impecável.`,
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
            <h2 className="text-5xl">Nossa História</h2>
            <p className="text-zinc-800 mt-6 leading-normal">
              Fundada em 2024 em Luanda, Angola, a Racius Care é uma empresa
              dedicada a oferecer produtos de alta qualidade para o seu
              bem-estar. Acreditamos que o cuidado com a saúde e o bem-estar é
              essencial para uma vida plena e feliz. Por isso, nos esforçamos
              para fornecer aos nossos clientes os melhores produtos do mercado,
              com preços acessíveis e um atendimento impecável.
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
