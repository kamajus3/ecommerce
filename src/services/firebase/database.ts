/* eslint-disable prefer-promise-reject-errors */
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

import { ICampaign, IOrder, IProduct, IProductQuery } from '@/@types'
import { campaignValidator } from '@/functions'

import { database } from './config'

export function getProduct(id: string): Promise<IProduct | undefined> {
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

export function getOrder(id: string): Promise<IOrder | undefined> {
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

export function getCampaign(id: string): Promise<ICampaign> {
  return new Promise((resolve, reject) => {
    get(child(ref(database), `campaigns/${id}`)).then((snapshot) => {
      let data = snapshot.val()
      if (snapshot.exists() && data) {
        data = { ...snapshot.val(), id }

        if (!campaignValidator(data)) {
          reject('Campanha não encontrada')
        }

        resolve(data)
      } else {
        reject('Campanha não encontrada')
      }
    })
  })
}

export async function getProducts(
  props?: IProductQuery,
): Promise<Record<string, IProduct>> {
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
        if (props?.exceptProductId) {
          delete data[props.exceptProductId]
          productMostVieweds = productMostVieweds.filter(
            (id) => id !== props.exceptProductId,
          )
        }

        if (productMostVieweds.length !== 0) {
          const filteredData: Record<string, IProduct> = {}
          productMostVieweds.forEach((id) => {
            if (data[id]) {
              filteredData[id] = data[id] as IProduct
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
