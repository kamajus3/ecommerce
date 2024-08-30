import React from 'react'
import { Metadata } from 'next'
import Image from 'next/image'

import AboutHeroe from '@/assets/images/about-us-heroe.png'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Advantages from '@/components/Home/Advantages'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about Poubelle.',
  openGraph: {
    type: 'website',
    title: 'About Us',
    description: 'Learn more about Poubelle.',
    images: ['https://poubelle-ae830.web.app/logo.png'],
  },
}

export default function AboutPage() {
  return (
    <section className="bg-white overflow-hidden">
      <Header.Client />
      <main className="max-w-5xl w-full mx-auto my-20 max-sm:w-[80%]">
        <h1 className="text-gray-800 font-bold text-3xl">About Us</h1>

        <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="w-full">
            <p className="text-gray-800 mt-6 leading-normal">
              Welcome to Poubelle. Specializing in online retail, we stand out
              for our wide range of health and personal hygiene products.
            </p>
          </div>
          <div className="bg-[#EB7EA8]">
            <Image
              src={AboutHeroe}
              alt="About Us Background Image"
              className="max-w-full h-auto object-cover"
            />
          </div>
        </div>
      </main>
      <Advantages />
      <Footer />
    </section>
  )
}
