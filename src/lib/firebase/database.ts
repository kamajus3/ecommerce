import { onValue, ref } from 'firebase/database'
import { database } from './config'
import { ProductItem } from './../../@types'

export default function getProduct(id: string): Promise<ProductItem> {
  const documentRef = ref(database, `products/${id}`)
  return new Promise((resolve, reject) => {
    onValue(documentRef, (snapshot) => {
      const data = snapshot.val()
      if (data !== null) {
        resolve(data as ProductItem)
      } else {
        reject(new Error('Ocorreu algum erro'))
      }
    })
  })
}
