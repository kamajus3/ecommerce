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
  get,
  child,
} from 'firebase/database'
import { database } from './config'
import { ProductItem, ProductQuery } from './../../@types'

export function getProduct(id: string): Promise<ProductItem | undefined> {
  const documentRef = ref(database, `products/${id}`)
  return new Promise((resolve) => {
    onValue(documentRef, (snapshot) => {
      const data = snapshot.val()
      if (data !== null) {
        resolve(data as ProductItem)
      } else {
        resolve(undefined)
      }
    })
  })
}

export async function getProducts(
  props?: ProductQuery,
): Promise<Record<string, ProductItem>> {
  const reference = ref(database, 'products/')
  const constraints: QueryConstraint[] = []
  let productMostVieweds: string[] = []
  let productQuery = query(reference)

  if (props?.search) {
    constraints.push(
      orderByChild('nameLowerCase'),
      startAt(props.search.toLowerCase()),
      endAt(props.search.toLowerCase() + '\uf8ff'),
    )
  }

  if (props?.category) {
    constraints.push(orderByChild('category'), equalTo(props.category))
  }

  if (props?.orderBy) {
    if (props?.orderBy === 'updatedAt') {
      constraints.push(orderByChild('updatedAt'))
    }
  }

  if (props?.promotion) {
    constraints.push(orderByChild('promotion/id'), equalTo(props.promotion))
  }

  if (props?.orderBy === 'mostViews') {
    const dbRef = ref(database)
    let productsViews: Record<
      string,
      {
        view: number
      }
    >

    await get(child(dbRef, 'views'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          productsViews = snapshot.val()
          productMostVieweds = Object.entries(productsViews)
            .sort((a, b) => b[1].view - a[1].view)
            .slice(0, props?.limit || 15)
            .map(([id]) => id)
        }
      })
      .catch(() => {})
  }

  if (props?.limit && props.orderBy !== 'mostViews')
    constraints.push(limitToLast(props.limit))

  if (!props) {
    productQuery = reference
  } else {
    productQuery = query(reference, ...constraints)
  }

  return new Promise((resolve) => {
    onValue(productQuery, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        if (productMostVieweds.length !== 0) {
          const filteredData: Record<string, ProductItem> = {}
          productMostVieweds.forEach((id) => {
            if (data[id]) {
              filteredData[id] = data[id] as ProductItem
            }
          })
          resolve(filteredData)
        }

        resolve(data)
      } else {
        resolve({})
      }
    })
  })
}
