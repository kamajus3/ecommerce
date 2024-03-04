import Header from '@/app/components/Header'
import { Wrench } from 'lucide-react'

export default function DashBoard() {
  return (
    <section className="bg-white w-screen h-screen">
      <Header.Admin />
      <main className="h-4/5 w-full flex flex-col gap-3 items-center justify-center">
        <Wrench size={40} color="#000" />
        <p className="text-[#979797] text-center font-medium min-w-10">
          Mude a sua localização, não a nada para ser feito aqui.
        </p>
      </main>
    </section>
  )
}
