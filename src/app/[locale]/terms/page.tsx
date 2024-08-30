import React from 'react'
import { Metadata } from 'next'

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { env } from '@/env'
import { Link } from '@/navigation'

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Terms and conditions of use for Poubelle',
  openGraph: {
    type: 'website',
    title: 'Terms and Conditions',
    description: 'Terms and conditions of use for Poubelle',
    images: ['https://poubelle-ae830.web.app/logo.png'],
  },
}

export default function TermsAndConditions() {
  return (
    <section className="bg-white overflow-hidden">
      <Header.Client />
      <main className="max-w-5xl w-full mx-auto my-20 max-sm:w-[80%]">
        <h1 className="text-zinc-800 font-bold text-3xl">
          Terms and Conditions
        </h1>
        <p className="font-medium text-base text-zinc-800 mt-4">
          Dear Customer,
        </p>
        <p className="text-zinc-800 text-base mt-6">
          Poubelle is an online store offering health and hygiene products. We
          are dedicated to providing our customers with a secure and pleasant
          shopping experience.
        </p>

        <p className="text-zinc-800 mt-4">
          By using the Poubelle platform or making a purchase, you agree to the
          following Terms and Conditions.
        </p>

        <div className="mt-16">
          <h4 className="text-zinc-800 font-semibold mt-4">
            1. General Conditions
          </h4>
          <p className="text-zinc-800 mt-6 leading-relaxed">
            These Terms govern the use of the Site and the purchase of products
            from the Company. The Company reserves the right to change these
            Terms at any time. Changes will take effect as soon as they are
            published on the Site.
          </p>
          <p className="text-zinc-800 mt-4 leading-relaxed">
            Continued use of the Site after changes to the Terms implies
            acceptance of the changes. If you do not agree with these Terms, do
            not use the Site or make purchases from the Company.
          </p>
        </div>

        <div className="mt-16">
          <h4 className="text-zinc-800 font-semibold">
            2. Products and Prices
          </h4>
          <p className="text-zinc-800 mt-6 leading-relaxed">
            The Company offers a variety of health and hygiene products. The
            prices of the products are indicated on the Site.
          </p>
          <p className="text-zinc-800 mt-4 leading-relaxed">
            The Company reserves the right to change product prices at any time.
            Price changes will take effect as soon as they are published on the
            Site. Product prices do not include taxes or shipping fees.
          </p>
        </div>

        <div className="mt-16">
          <h4 className="text-zinc-800 font-semibold">
            3. Purchases and Payments
          </h4>
          <p className="text-zinc-800 mt-6 leading-relaxed">
            To make a purchase, you need to select the desired products and add
            them to your shopping cart. You must provide valid payment
            information to complete the purchase. The Company accepts the
            following payment methods:
          </p>
          <div className="pl-4">
            <ul className="list-disc ml-8 mt-4">
              <li className="text-zinc-800">Bank slip</li>
              <li className="text-zinc-800">Bank transfer</li>
            </ul>
          </div>
          <p className="text-zinc-800 mt-4 leading-relaxed">
            The Company reserves the right to cancel any purchase for any
            reason. In the event of a purchase cancellation, the Company will
            refund the amount paid by the customer.
          </p>
        </div>

        <div className="mt-16">
          <h4 className="text-zinc-800 font-semibold">
            4. Delivery and Returns
          </h4>
          <p className="text-zinc-800 mt-6 leading-relaxed">
            The Company delivers products nationwide. The delivery time is up to
            10 business days.
          </p>
          <p className="text-zinc-800 mt-4 leading-relaxed">
            The Company is not responsible for delays in delivery caused by
            external factors. You may return any product purchased on the Site
            within 15 days from the date of receipt.
          </p>
          <p className="text-zinc-800 mt-4 leading-relaxed">
            To return a product, you need to contact the Company via email at{' '}
            <Link
              href={`mailto:${env.NEXT_PUBLIC_EMAIL_ADDRESS}`}
              className="hover:underline text-blue-600"
            >
              {env.NEXT_PUBLIC_EMAIL_ADDRESS}
            </Link>{' '}
            The returned product must be in its original packaging and unused.
            The Company will refund the amount paid for the returned product,
            excluding delivery costs.
          </p>
        </div>

        <div className="mt-16">
          <h4 className="text-zinc-800 font-semibold">
            5. Intellectual Property
          </h4>
          <p className="text-zinc-800 mt-6 leading-relaxed">
            All content on the Site, including texts, images, trademarks, and
            logos, is the property of the Company. You may not copy, distribute,
            or reproduce the content of the Site without the Company&apos;s
            authorization.
          </p>
        </div>

        <div className="mt-16">
          <h4 className="text-zinc-800 font-semibold">
            6. Limitation of Liability
          </h4>
          <p className="text-zinc-800 mt-6 leading-relaxed">
            The Company is not responsible for any direct, indirect, incidental,
            or consequential damages arising from the use of the Site or the
            Company&apos;s products. The Company is not liable for any errors or
            omissions in the Site&apos;s content.
          </p>
        </div>

        <div className="mt-16">
          <h4 className="text-zinc-800 font-semibold">7. Contact</h4>
          <p className="text-zinc-800 mt-6 leading-relaxed">
            If you have any questions or complaints about these Terms, you can
            contact the Company via email at{' '}
            <Link
              href={`mailto:${env.NEXT_PUBLIC_EMAIL_ADDRESS}`}
              className="hover:underline text-blue-600"
            >
              {env.NEXT_PUBLIC_EMAIL_ADDRESS}
            </Link>
          </p>
          <p className="text-zinc-800 mt-4 leading-relaxed">
            By using the Site or making a purchase from the Company, you agree
            to these Terms and Conditions.
          </p>
        </div>
      </main>
      <Footer />
    </section>
  )
}
