import React from 'react'

import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
import Image from 'next/image'
import AboutHeroe from '@/assets/images/about-us-heroe.png'
import userPhoto from '@/assets/images/user.png'
import Link from 'next/link'
import Advantages from '@/app/components/Home/Advantages'

export default function pages() {
  const MEMBERS = [
    {
      name: 'Tom Cruise',
      image: userPhoto,
      position: 'CEO',
      socials: {
        facebook: '/',
        linkedln: '/',
      },
    },
    {
      name: 'Emma Watson',
      image: userPhoto,
      position: 'Diretor de Gestão',
      socials: {
        facebook: '',
        linkedln: '',
      },
    },
    {
      name: 'Will Smith',
      image: userPhoto,
      position: 'Design de Produtos',
      socials: {
        facebook: '',
        linkedln: '',
      },
    },
  ]

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

        <div className="grid w-full grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1170px] mt-20 mx-auto">
          {MEMBERS.map((item, index) => (
            <div key={index} className="">
              <div className="bg-zinc-200 flex justify-center items-end pt-8">
                <Image
                  src={item.image}
                  alt="Usuario"
                  className="max-w-[200px] w-full"
                />
              </div>
              <h4 className="text-zinc-900 font-bold text-lg mt-8">
                {item.name}
              </h4>
              <span className="text-zinc-900 font-normal text-base">
                {item.position}
              </span>
              <div className="w-full flex flex-row items-center justify-start gap-4 mt-4">
                {item.socials.facebook && (
                  <Link
                    href={'/'}
                    className="bg-zinc-800 p-2 rounded-full w-10 h-10 text-white border border-zinc-800 hover:bg-transparent transition-all active:scale-95 hover:text-zinc-900 text-base justify-center items-center"
                  >
                    FB
                  </Link>
                )}
                {item.socials.linkedln && (
                  <Link
                    href={'/'}
                    className="bg-zinc-800 p-2 rounded-full w-10 h-10 text-white border border-zinc-800 hover:bg-transparent transition-all active:scale-95 hover:text-zinc-900 text-base justify-center items-center"
                  >
                    LD
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Advantages />
      <Footer />
    </section>
  )
}
