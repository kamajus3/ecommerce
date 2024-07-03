import {
  child,
  endAt,
  equalTo,
  get,
  limitToLast,
  onValue,
  orderByChild,
  query,
  QueryConstraint,
  ref,
  startAt,
} from 'firebase/database'

import { Order, ProductItem, ProductQuery } from '@/@types'

import { database } from './config'

export function getProduct(id: string): Promise<ProductItem | undefined> {
  const documentRef = ref(database, `products/${id}`)
  return new Promise((resolve) => {
    onValue(documentRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        resolve(data)
      }
      resolve(undefined)
    })
  })
}

export function getOrder(id: string): Promise<Order | undefined> {
  const documentRef = ref(database, `orders/${id}`)
  return new Promise((resolve) => {
    onValue(documentRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        resolve(data)
      }
      resolve(undefined)
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
      endAt(`${props.search.toLowerCase()}\uf8ff`),
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

  if (props?.campaign) {
    constraints.push(orderByChild('campaign/id'), equalTo(props.campaign))
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

  productQuery = props ? query(reference, ...constraints) : reference

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
      }
      resolve({})
    })
  })
}
