import { firebaseDB } from '../../firebaseAdmin'
import ejs from 'ejs'
import { promises as fs } from 'fs'
import { resolve, join } from 'path'
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const ref = firebaseDB.ref(`/orders/${params.id}`)

  try {
    // Fetch order data from Firebase
    const snapshot = await ref.once('value')
    const data = snapshot.val()

    // If order not found, return 404
    if (!data) {
      return new Response('Order not found', { status: 404 })
    }

    // Read template file
    const templateDir = resolve(
      process.cwd(),
      'src',
      'app',
      'api',
      'invoice',
      '[id]',
      'templates',
    )
    const templateFile = join(templateDir, 'template.ejs')
    const source = await fs.readFile(templateFile, 'utf-8')

    // Calculate total price
    const totalPrice = data.products.reduce(
      (
        sum: number,
        product: { price: number; quantity: number; promotion?: number },
      ) => {
        const discount = product.promotion ? product.promotion / 100 : 0
        return sum + product.price * product.quantity * (1 - discount)
      },
      0,
    )

    // Render EJS template
    const htmlContent = ejs.render(source, {
      address: data.address,
      createdAt: data.createdAt,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      products: data.products,
      state: data.state,
      userId: data.userId,
      orderId: params.id,
      totalPrice,
      calculateDiscount: (price: number, promotion: number) =>
        price - price * (promotion / 100),
      formatCurrency: (value: number) =>
        new Intl.NumberFormat('pt-PT', {
          style: 'currency',
          currency: 'AOA',
        }).format(value),
    })

    return new Response(htmlContent)
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
