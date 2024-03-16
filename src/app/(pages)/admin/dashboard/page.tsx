'use client'

import Field from '@/app/components/Field'
import Header from '@/app/components/Header'
import DashBoardCard from '@/app/components/admin/DashBoardCard'
import DashBoardGraphic from '@/app/components/admin/DashBoardGraphic'
import { database } from '@/lib/firebase/config'
import { onValue, ref } from 'firebase/database'
import Script from 'next/script'
import { useEffect, useState } from 'react'

export default function DashBoard() {
  const [activeUsers, setActiveUsers] = useState(0)
  const [activeCampaign, setActiveCampaign] = useState(0)
  const [activeProducts, setActiveProducts] = useState(0)
  const [activeOrders, setActiveOrders] = useState(0)
  const [soldProductsMothly, setSoldProductsMonthly] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ])
  const [salesOfYear, setSalesOfYear] = useState(new Date().getFullYear())

  useEffect(() => {
    function unsubscrib() {
      onValue(ref(database, '/users'), (snapshot) => {
        let usersCount = 0

        snapshot.forEach((data) => {
          if (data.val().privileges.includes('client')) {
            usersCount++
          }
        })

        setActiveUsers(usersCount)
      })

      onValue(ref(database, '/promotions'), (snapshot) => {
        let campaignCount = 0

        snapshot.forEach((data) => {
          if (new Date(data.val().finishDate) > new Date()) {
            campaignCount++
          }
        })

        setActiveCampaign(campaignCount)
      })

      onValue(ref(database, '/products'), (snapshot) => {
        let productsCount = 0

        snapshot.forEach((data) => {
          if (data.val().quantity > 0) {
            productsCount++
          }
        })

        setActiveProducts(productsCount)
      })

      onValue(ref(database, '/orders'), (snapshot) => {
        let ordersCount = 0
        const monthlySales = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

        snapshot.forEach((data) => {
          if (data.val().state === 'not-sold') {
            ordersCount++
          }

          const orderYear = new Date(data.val().createdAt).getFullYear()

          if (data.val().state === 'sold' && orderYear === salesOfYear) {
            const month = new Date(data.val().createdAt).getMonth()
            monthlySales[month] = monthlySales[month] + 1
          }
        })

        setActiveOrders(ordersCount)
        setSoldProductsMonthly(monthlySales)
      })
    }

    unsubscrib()
  }, [salesOfYear])

  return (
    <section className="bg-white min-h-screen overflow-hidden">
      <Script src="https://unpkg.com/react/umd/react.production.min.js"></Script>
      <Script src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"></Script>
      <Script src="https://unpkg.com/prop-types/prop-types.min.js"></Script>
      <Script src="https://unpkg.com/recharts/umd/Recharts.js"></Script>

      <Header.Admin />
      <article>
        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <DashBoardCard
            title="Pedidos activos"
            quantity={activeOrders}
            warn="20% mais que do mais passado"
          />

          <DashBoardCard
            title="Productos restantes"
            quantity={activeProducts}
            warn="20% mais que do mês passado"
          />

          <DashBoardCard
            title="Campanhas activas"
            quantity={activeCampaign}
            warn="20% mais que do mês passado"
          />

          <DashBoardCard title="Clientes activos" quantity={activeUsers} />
        </div>
        <article>
          <div className="p-9">
            <h2 className="text-black font-semibold text-3xl">
              Resumo das vendas 📈
            </h2>
            <Field.Select
              style={{
                padding: '13px 18px 13px 18px',
              }}
              disabled
              className="w-auto max-sm:w-full mt-7"
              options={[
                {
                  value: '2024',
                  label: 'Vendas de 2024',
                },
              ]}
              onChange={({ target }) => {
                setSalesOfYear(Number(target.value))
              }}
            />
          </div>
          <DashBoardGraphic sales={soldProductsMothly} />
        </article>
      </article>
    </section>
  )
}
