'use client'

import Field from '@/app/components/Field'
import Header from '@/app/components/Header'
import DashBoardCard from '@/app/components/admin/DashBoardCard'
import DashBoardGraphic from '@/app/components/admin/DashBoardGraphic'
import { database } from '@/lib/firebase/config'
import { onValue, ref } from 'firebase/database'
import Script from 'next/script'
import { useEffect, useState } from 'react'

const START_YEAR = 2024
const currentYear = new Date().getFullYear()

const yearOptions: { value: string; label: string }[] = []
for (let year = START_YEAR; year <= currentYear; year++) {
  yearOptions.push({
    value: String(year),
    label: `Vendas de ${year}`,
  })
}

export default function DashBoard() {
  const [activeUsers, setActiveUsers] = useState(0)
  const [activeCampaign, setActiveCampaign] = useState(0)
  const [activeProducts, setActiveProducts] = useState(0)
  const [activeOrders, setActiveOrders] = useState(0)
  const [currenteAndPastMonthRate, setCurrentAndPastMonthRate] = useState(0)
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
        let pastMonthOrdersCount = 0
        let currentMonthOrdersCount = 0

        const monthlySales = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

        snapshot.forEach((data) => {
          if (data.val().state === 'not-sold') {
            ordersCount++

            if (
              new Date(data.val().createdAt).getMonth() ===
              new Date().getMonth() - 1
            ) {
              pastMonthOrdersCount++
            }

            if (
              new Date(data.val().createdAt).getMonth() ===
              new Date().getMonth()
            ) {
              currentMonthOrdersCount++
            }
          }

          const orderYear = new Date(data.val().createdAt).getFullYear()

          if (data.val().state === 'sold' && orderYear === salesOfYear) {
            const month = new Date(data.val().createdAt).getMonth()
            monthlySales[month] = monthlySales[month] + 1
          }
        })

        setActiveOrders(ordersCount)
        setSoldProductsMonthly(monthlySales)

        if (pastMonthOrdersCount > 0) {
          const evolution =
            (pastMonthOrdersCount - currentMonthOrdersCount) /
            pastMonthOrdersCount

          setCurrentAndPastMonthRate(evolution)
        }
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
            title="Pedidos"
            quantity={activeOrders}
            rate={currenteAndPastMonthRate}
            rateMessage={
              activeOrders > 0
                ? currenteAndPastMonthRate > 0
                  ? new Date().getDay() > 20
                    ? `menos que no mês passado`
                    : ''
                  : `mais que no mês passado`
                : ''
            }
          />

          <DashBoardCard
            title="Productos restantes"
            quantity={activeProducts}
          />
          <DashBoardCard title="Campanhas activas" quantity={activeCampaign} />
          <DashBoardCard title="Clientes activos" quantity={activeUsers} />
        </div>
        <article>
          <div className="p-9">
            <h2 className="text-black font-semibold text-3xl">
              Resumo das vendas
            </h2>
            <Field.Select
              style={{
                padding: '13px 18px 13px 18px',
              }}
              disabled={yearOptions.length === 1}
              className="w-auto max-sm:w-full mt-7"
              options={yearOptions}
              defaultValue={yearOptions[yearOptions.length - 1].value}
              onChange={({ target }) => {
                setSalesOfYear(Number(target.value))
              }}
            />
          </div>
          <div className="pr-7">
            <DashBoardGraphic sales={soldProductsMothly} />
          </div>
        </article>
      </article>
    </section>
  )
}
