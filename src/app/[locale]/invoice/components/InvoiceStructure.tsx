/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Formats,
  MarkupTranslationValues,
  RichTranslationValues,
  TranslationValues,
} from 'next-intl'

import { IOrder, IProductOrder } from '@/@types'
import constants from '@/constants'
import { env } from '@/env'
import { calculateDiscountedPrice } from '@/functions'
import { formatMoney, formatPhoneNumber } from '@/functions/format'
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'

Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf' },
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' },
  ],
})

Font.register({ family: 'Madimi One', src: '/fonts/MadimiOne-Regular.ttf' })

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    padding: 30,
    fontFamily: 'Roboto',
    fontSize: 11,
    color: '#14213d',
    lineHeight: 1.6,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottom: `2px solid ${constants.colors.primary}`,
    paddingBottom: 10,
  },
  logo: { width: 150, height: 75 },
  title: {
    fontFamily: 'Madimi One',
    fontSize: 25,
    color: constants.colors.primary,
  },
  infoBlock: { marginBottom: 20 },
  boldText: { fontWeight: 'bold' },
  table: {
    width: '100%',
    marginBottom: 30,
    border: '1px solid #e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  tableRow: { flexDirection: 'row', backgroundColor: '#f4f4f4' },
  tableHeader: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    textTransform: 'uppercase',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 'bold',
    flex: 1,
    borderBottom: `1px solid ${constants.colors.secondary}`,
    color: constants.colors.secondary,
  },
  tableCell: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    textAlign: 'center',
    borderBottom: '1px solid #e0e0e0',
    fontSize: 10,
    flex: 1,
  },
  totalTable: {
    borderTop: `2px solid ${constants.colors.secondary}`,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
  },
})

const calculateTotalPrice = (products: IProductOrder[]) => {
  let totalPrice = 0
  products.forEach((product) => {
    const discountedPrice = calculateDiscount(product.price, product.promotion)
    totalPrice += discountedPrice * product.quantity
  })
  return totalPrice
}

const formatISODate = (isoDate: string) => {
  const date = new Date(isoDate)
  return date.toLocaleDateString('en-GB')
}

const calculateDiscount = (price: number, promotion?: number | null) =>
  promotion ? price - (price * promotion) / 100 : price

interface IStructure {
  order: IOrder
  t: {
    <TargetKey extends any>(
      key: TargetKey,
      values?: TranslationValues,
      formats?: Partial<Formats>,
    ): string
    rich<TargetKey extends any>(
      key: TargetKey,
      values?: RichTranslationValues,
      formats?: Partial<Formats>,
    ): string | React.ReactElement | React.ReactNodeArray
    markup<TargetKey extends any>(
      key: TargetKey,
      values?: MarkupTranslationValues,
      formats?: Partial<Formats>,
    ): string
    raw<TargetKey extends any>(key: TargetKey): any
  }
}

export const InvoiceStructure = ({ order, t }: IStructure) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image style={styles.logo} src="/logo.png" />
        <Text style={styles.title}>{t('title')}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text>
          {t('table.header.phone')}: {formatPhoneNumber('+3317018XXXX')}
        </Text>
        <Text>
          {t('table.header.email')}: {env.NEXT_PUBLIC_EMAIL_ADDRESS}
        </Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.boldText}>{t('customerDetails')}</Text>
        <Text>
          {t('table.header.name')}: {order.firstName} {order.lastName}
        </Text>
        <Text>
          {t('table.header.phone')}:{' '}
          {formatPhoneNumber(`+${order.phone.ddd}${order.phone.number}`)}
        </Text>
        <Text>
          {t('table.header.address')}: {order.address}
        </Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>{t('table.header.product')}</Text>
          <Text style={styles.tableHeader}>{t('table.header.quantity')}</Text>
          <Text style={styles.tableHeader}>{t('table.header.unitPrice')}</Text>
          <Text style={styles.tableHeader}>{t('table.header.discount')}</Text>
          <Text style={styles.tableHeader}>{t('table.header.totalPrice')}</Text>
        </View>
        {order.products.map((product, index: number) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{product.name}</Text>
            <Text style={styles.tableCell}>{product.quantity}</Text>
            <Text style={styles.tableCell}>{formatMoney(product.price)}</Text>
            <Text style={styles.tableCell}>
              {product.promotion ? `${product.promotion}%` : '-'}
            </Text>
            <Text style={styles.tableCell}>
              {formatMoney(
                calculateDiscountedPrice(
                  product.price,
                  product.quantity,
                  product.promotion,
                ),
              )}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.totalTable}>
        <Text style={[styles.tableCell, { flex: 2 }]}>
          {t('table.header.reference')}: {order.id}
        </Text>
        <Text style={[styles.tableCell, { flex: 2 }]}>
          {t('table.header.date')}: {formatISODate(order.createdAt)}
        </Text>
        <Text style={[styles.tableCell, { flex: 2 }]}>
          {t('table.header.totalAmountDue', {
            price: formatMoney(calculateTotalPrice(order.products)),
          })}
        </Text>
      </View>
    </Page>
  </Document>
)
