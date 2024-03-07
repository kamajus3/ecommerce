import { Order } from '@/@types'

export function generateInvoice(order: Order) {
  let totalAmount = 0

  let invoiceHTML = `
      <html>
      <head>
          <title>Invoice</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 20px;
                  background-color: #f9f9f9;
              }
              .container {
                  max-width: 800px;
                  margin: 0 auto;
                  background-color: #fff;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  padding: 20px;
              }
              h1 {
                  text-align: center;
                  color: #333;
              }
              p {
                  margin: 0 0 10px;
              }
              table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 20px;
              }
              th, td {
                  border: 1px solid #ddd;
                  padding: 10px;
              }
              th {
                  background-color: #f2f2f2;
                  color: #333;
              }
              td {
                  text-align: center;
              }
              .total {
                  text-align: right;
                  font-weight: bold;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Invoice</h1>
              <p><strong>Customer:</strong> ${order.firstName} ${order.lastName}</p>
              <p><strong>Address:</strong> ${order.address}</p>
              <p><strong>Phone:</strong> ${order.phone}</p>
              <table>
                  <thead>
                      <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Unit Price</th>
                          <th>Total</th>
                      </tr>
                  </thead>
                  <tbody>
  `

  order.products.forEach((product) => {
    let productTotal = product.quantity * product.price
    if (product.promotion !== null && product.promotion !== undefined) {
      productTotal *= 1 - product.promotion / 100
    }
    totalAmount += productTotal
    invoiceHTML += `
          <tr>
              <td>${product.name}</td>
              <td>${product.quantity}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>${productTotal.toFixed(2)}</td>
          </tr>
      `
  })

  invoiceHTML += `
                  </tbody>
              </table>
              <p class="total">Total: ${totalAmount.toFixed(2)}</p>
          </div>
      </body>
      </html>
  `

  return invoiceHTML
}

export function downloadInvoiceHTML(invoiceHTML: string) {
  const blob = new Blob([invoiceHTML], { type: 'text/html' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'invoice.html'
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
}
