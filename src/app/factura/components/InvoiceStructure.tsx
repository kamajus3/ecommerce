import { IOrder, IProductOrder } from '@/@types'
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

const colors = {
  main: '#212121',
  secondary: '#8B6CEF',
}

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
    borderBottom: `2px solid ${colors.main}`,
    paddingBottom: 10,
  },
  logo: { width: 120, height: 75 },
  title: {
    fontFamily: 'Madimi One',
    fontSize: 25,
    color: colors.main,
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
    borderBottom: `1px solid ${colors.secondary}`,
    color: colors.secondary,
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
    borderTop: `2px solid ${colors.secondary}`,
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
  return date.toLocaleDateString('pt-BR')
}

const calculateDiscount = (price: number, promotion?: number | null) =>
  promotion ? price - (price * promotion) / 100 : price

export const InvoiceStructure = ({ orderData }: { orderData: IOrder }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image style={styles.logo} src="/logo.png" />
        <Text style={styles.title}>Factura profomora</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.boldText}>
          Poubelle - COMÉRCIO GERAL E PRESTAÇÃO DE SERVIÇOS
        </Text>
        <Text>NIF: 5001866150</Text>
        <Text>
          Endereço: Rua Amilcar Cabral, Bloco A12, 7°A, P73, Distrito Urbano do
          Kilamba, Belas, Luanda, Angola
        </Text>
        <Text>Tel.: {formatPhoneNumber('935420498')}</Text>
        <Text>Email: geral@raciuscare.com</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.boldText}>Dados do cliente</Text>
        <Text>
          Nome: {orderData.firstName} {orderData.lastName}
        </Text>
        <Text>Telefone: {formatPhoneNumber(orderData.phone)}</Text>
        <Text>Endereço: {orderData.address}</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Produto</Text>
          <Text style={styles.tableHeader}>Quantidade</Text>
          <Text style={styles.tableHeader}>Preço unidade</Text>
          <Text style={styles.tableHeader}>Desconto</Text>
          <Text style={styles.tableHeader}>Preço total</Text>
        </View>
        {orderData.products.map((product, index: number) => (
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
          Referência: {orderData.id}
        </Text>
        <Text style={[styles.tableCell, { flex: 2 }]}>
          Data: {formatISODate(orderData.createdAt)}
        </Text>
        <Text style={[styles.tableCell, { flex: 2 }]}>
          Total a pagar: {formatMoney(calculateTotalPrice(orderData.products))}
        </Text>
      </View>
    </Page>
  </Document>
)
