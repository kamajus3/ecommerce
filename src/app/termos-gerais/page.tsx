import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

import Footer from '@/components/ui/Footer'
import Header from '@/components/ui/Header'

export const metadata: Metadata = {
  title: 'Termos e condições',
  description: 'Termos e condições de uso da Racius Care',
  openGraph: {
    type: 'website',
    title: 'Sobre Nós',
    description: 'Termos e condições de uso da Racius Care',
    images: ['https://raciuscare.com/logo.png'],
  },
}

export default function TermsAndContions() {
  return (
    <section className="bg-white overflow-hidden">
      <Header.Client />
      <main className="max-w-5xl w-full mx-auto my-20 max-sm:w-[80%]">
        <h1 className="text-zinc-800 font-bold text-3xl">Termos e condições</h1>
        <p className="font-medium text-base text-zinc-800 mt-4">
          Prezado(a) Cliente,
        </p>
        <p className="text-zinc-800 text-base mt-6">
          A Racius Care é uma loja virtual que oferece produtos de saúde e
          higiene. A Empresa se dedica a fornecer aos seus clientes uma
          experiência de compra segura e agradável.
        </p>

        <p className="text-zinc-800 mt-4">
          Ao utilizar a plataforma da Racius Care ou realizar uma compra, você
          concorda com os seguintes Termos e Condições.
        </p>

        <div className="mt-16">
          <h4 className="text-zinc-800 font-semibold mt-4">
            1. Condições Gerais
          </h4>
          <p className="text-zinc-800 mt-6 leading-relaxed">
            Estes Termos regem o uso do Site e a compra de produtos da Empresa.
            A Empresa reserva-se o direito de alterar estes Termos a qualquer
            momento. As alterações entrarão em vigor no momento da sua
            publicação no Site.
          </p>
          <p className="text-zinc-800 mt-4 leading-relaxed">
            O uso continuado do Site após a publicação de alterações nos Termos
            implica na sua aceitação das alterações. Se você não concordar com
            estes Termos, não utilize o Site ou faça compras na Empresa.
          </p>
        </div>

        <div className="mt-16">
          <h4 className="text-zinc-800 font-semibold">2. Produtos e Preços</h4>
          <p className="text-zinc-800 mt-6 leading-relaxed">
            A Empresa oferece uma variedade de produtos de saúde e higiene. Os
            preços dos produtos são os indicados no Site.
          </p>
          <p className="text-zinc-800 mt-4 leading-relaxed">
            A Empresa reserva-se o direito de alterar os preços dos produtos a
            qualquer momento. As alterações nos preços entrarão em vigor no
            momento da sua publicação no Site. Os preços dos produtos não
            incluem impostos ou taxas de entrega.
          </p>
        </div>

        <div className="mt-16">
          <h4 className="text-zinc-800 font-semibold">
            3. Compras e Pagamentos
          </h4>
          <p className="text-zinc-800 mt-6 leading-relaxed">
            Para realizar uma compra, você precisa selecionar os produtos
            desejados e adicioná-los ao seu carrinho de compras. Você precisa
            fornecer informações de pagamento válidas para concluir a compra. A
            Empresa aceita os seguintes métodos de pagamento:
          </p>
          <div className="pl-4">
            <ul className="list-disc ml-8 mt-4">
              <li className="text-zinc-800">Boleto bancário</li>
              <li className="text-zinc-800">Transferência bancária</li>
            </ul>
          </div>
          <p className="text-zinc-800 mt-4 leading-relaxed">
            A Empresa reserva-se o direito de cancelar qualquer compra por
            qualquer motivo. Em caso de cancelamento da compra, a Empresa
            reembolsará o valor pago pelo cliente.
          </p>
        </div>

        <div className="mt-16">
          <h4 className="text-zinc-800 font-semibold">
            4. Entrega e Devolução
          </h4>
          <p className="text-zinc-800 mt-6 leading-relaxed">
            A Empresa entrega os produtos em todo o território nacional. O prazo
            de entrega é de até 10 dias úteis.
          </p>
          <p className="text-zinc-800 mt-4 leading-relaxed">
            A Empresa não se responsabiliza por atrasos na entrega causados por
            fatores externos. Você pode devolver qualquer produto adquirido no
            Site no prazo de 15 dias a partir da data de recebimento.
          </p>
          <p className="text-zinc-800 mt-4 leading-relaxed">
            Para devolver um produto, você precisa entrar em contato com a
            Empresa pelo e-mail {'  '}
            <Link
              href="mailto:geral@raciuscare.com"
              className="hover:underline text-blue-600"
            >
              geral@raciuscare.com
            </Link>{' '}
            {'  '}O produto devolvido deve estar em sua embalagem original e sem
            uso. A Empresa reembolsará o valor pago pelo produto devolvido,
            excluindo os custos de entrega.
          </p>
        </div>

        <div className="mt-16">
          <h4 className="text-zinc-800 font-semibold">
            5. Propriedade Intelectual
          </h4>
          <p className="text-zinc-800 mt-6 leading-relaxed">
            Todo o conteúdo do Site, incluindo textos, imagens, marcas e
            logotipos, é propriedade da Empresa. Você não pode copiar,
            distribuir ou reproduzir o conteúdo do Site sem a autorização da
            Empresa.
          </p>
        </div>

        <div className="mt-16">
          <h4 className="text-zinc-800 font-semibold">
            6. Limitação de Responsabilidade
          </h4>
          <p className="text-zinc-800 mt-6 leading-relaxed">
            A Empresa não se responsabiliza por danos diretos, indiretos,
            incidentais ou consequenciais causados pelo uso do Site ou dos
            produtos da Empresa. A Empresa não se responsabiliza por erros ou
            omissões no conteúdo do Site.
          </p>
        </div>

        <div className="mt-16">
          <h4 className="text-zinc-800 font-semibold">7. Contato</h4>
          <p className="text-zinc-800 mt-6 leading-relaxed">
            Se você tiver alguma dúvida ou reclamação sobre estes Termos, você
            pode entrar em contato com a Empresa pelo e-mail{'  '}
            <Link
              href="mailto:geral@raciuscare.com"
              className="hover:underline text-blue-600"
            >
              geral@raciuscare.com
            </Link>
          </p>
          <p className="text-zinc-800 mt-4 leading-relaxed">
            Ao utilizar o Site ou realizar uma compra na Empresa, você concorda
            com estes Termos e Condições.
          </p>
        </div>
      </main>
      <Footer />
    </section>
  )
}
