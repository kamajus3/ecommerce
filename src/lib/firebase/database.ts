import {
  QueryConstraint,
  endAt,
  equalTo,
  limitToLast,
  onValue,
  orderByChild,
  query,
  ref,
  startAt,
} from 'firebase/database'
import { database } from './config'
import { ProductItem, ProductQuery } from './../../@types'

export function getProduct(id: string): Promise<ProductItem> {
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

export function getProducts(
  props: ProductQuery,
): Promise<Record<string, ProductItem>> {
  const reference = ref(database, `products/`)
  const constraints: QueryConstraint[] = []
  let productQuery = query(reference)

  if (props.limit) constraints.push(limitToLast(props.limit))

  if (props.search) {
    constraints.push(
      orderByChild('nameLowerCase'),
      startAt(props.search.toLowerCase()),
      endAt(props.search.toLowerCase() + '\uf8ff'),
    )
  }

  if (props.category) {
    constraints.push(orderByChild('category'), equalTo(props.category))
  }

  if (props.orderBy) {
    if (props.orderBy === 'updatedAt') {
      constraints.push(orderByChild('updatedAt'))
    }
  }

  productQuery = query(reference, ...constraints)

  return new Promise((resolve) => {
    onValue(productQuery, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        resolve(data)
      } else {
        resolve({})
      }
    })
  })
}
