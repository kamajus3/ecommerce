'use client'

import { useEffect, useMemo, useState } from 'react'
import Script from 'next/script'
import { useTranslations } from 'next-intl'

import Admin from '@/components/Admin'
import Field from '@/components/Field'
import Header from '@/components/Header'
import { campaignValidator } from '@/functions'
import { CampaignRepository } from '@/repositories/campaign.repository'
import { OrderRepository } from '@/repositories/order.repository'
import { ProductRepository } from '@/repositories/product.repository'
import { UserRepository } from '@/repositories/user.repository'

const START_YEAR = 2024
const currentYear = new Date().getFullYear()

const yearOptions: { value: string; label: string }[] = []

export default function DashBoard() {
  const [activeUsers, setActiveUsers] = useState(0)
  const [activeCampaign, setActiveCampaign] = useState(0)
  const [activeProducts, setActiveProducts] = useState(0)
  const [activeOrders, setActiveOrders] = useState(0)
  const [currentAndPastMonthRate, setCurrentAndPastMonthRate] = useState(0)
  const [soldProductsMonthly, setSoldProductsMonthly] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ])
  const [salesOfYear, setSalesOfYear] = useState(new Date().getFullYear())

  const userRepository = useMemo(() => new UserRepository(), [])
  const campaignRepository = useMemo(() => new CampaignRepository(), [])
  const productRepository = useMemo(() => new ProductRepository(), [])
  const orderRepository = useMemo(() => new OrderRepository(), [])

  const t = useTranslations('admin.dashboard')

  useEffect(() => {
    for (let year = START_YEAR; year <= currentYear; year++) {
      const option = {
        value: String(year),
        label: `${t('salesLabel')} ${year}`,
      }

      if (!yearOptions.find((o) => o.value === option.value)) {
        yearOptions.push(option)
      }
    }
  }, [t])

  useEffect(() => {
    async function fetchData() {
      const activeUsersCount = await userRepository.find({
        filterBy: {
          role: 'client',
        },
      })
      setActiveUsers(activeUsersCount.length)

      const activeCampaignsCount = (await campaignRepository.findAll()).filter(
        (c) => campaignValidator(c),
      )
      setActiveCampaign(activeCampaignsCount.length)

      const activeProductsCount = (await productRepository.findAll()).filter(
        (p) => p.quantity > 0,
      )
      setActiveProducts(activeProductsCount.length)

      const orders = await orderRepository.findAll()

      let ordersCount = 0
      let pastMonthOrdersCount = 0
      let currentMonthOrdersCount = 0

      const monthlySales = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

      orders.forEach((data) => {
        if (data.state === 'not-sold') {
          ordersCount++

          if (
            new Date(data.createdAt).getMonth() ===
            new Date().getMonth() - 1
          ) {
            pastMonthOrdersCount++
          }

          if (new Date(data.createdAt).getMonth() === new Date().getMonth()) {
            currentMonthOrdersCount++
          }
        }

        const orderYear = new Date(data.createdAt).getFullYear()

        if (data.state === 'sold' && orderYear === salesOfYear) {
          const month = new Date(data.createdAt).getMonth()
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
    }

    fetchData()
  }, [
    campaignRepository,
    orderRepository,
    productRepository,
    salesOfYear,
    userRepository,
  ])

  return (
    <section className="bg-white min-h-screen overflow-hidden">
      <Script src="https://unpkg.com/react/umd/react.production.min.js"></Script>
      <Script src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"></Script>
      <Script src="https://unpkg.com/prop-types/prop-types.min.js"></Script>
      <Script src="https://unpkg.com/recharts/umd/Recharts.js"></Script>

      <Header.Admin />
      <article>
        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <Admin.Card
            title={t('cards.activeOrders.title')}
            quantity={activeOrders}
            rate={currentAndPastMonthRate}
            rateMessage={
              activeOrders > 0
                ? currentAndPastMonthRate > 0
                  ? new Date().getDay() > 20
                    ? t('cards.activeOrders.lessThanLastMonth')
                    : ''
                  : t('cards.activeOrders.moreThanLastMonth')
                : ''
            }
          />

          <Admin.Card
            title={t('cards.remainingProducts')}
            quantity={activeProducts}
          />
          <Admin.Card
            title={t('cards.activeCampaigns')}
            quantity={activeCampaign}
          />
          <Admin.Card
            title={t('cards.activeCustomers')}
            quantity={activeUsers}
          />
        </div>
        <article>
          <div className="p-9">
            <h2 className="text-black font-semibold text-3xl">
              {t('salesSummary')}
            </h2>
            <Field.Select
              style={{
                padding: '13px 18px 13px 18px',
              }}
              disabled={yearOptions.length === 1}
              className="w-auto max-sm:w-full mt-7"
              options={yearOptions}
              defaultValue={`${t('salesLabel')} ${currentYear}`}
              onChange={({ target }) => {
                setSalesOfYear(Number(target.value))
              }}
            />
          </div>
          <div className="pr-7">
            <Admin.Graphic sales={soldProductsMonthly} />
          </div>
        </article>
      </article>
    </section>
  )
}
