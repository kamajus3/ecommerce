import {
  child,
  endAt,
  get,
  limitToLast,
  orderByChild,
  query,
  QueryConstraint,
  startAt,
  update,
} from 'firebase/database'

import { IProduct } from '@/@types'

import { BaseRepository } from './base.repository'

interface IFindByName {
  search: string
  limit?: number
}

export class ProductRepository extends BaseRepository<IProduct> {
  constructor() {
    super('/products/')
  }

  async updateViews(productId: string) {
    const docRef = child(this.getCollectionRef(), productId.toString())

    return get(docRef).then((snapshot) => {
      if (snapshot.exists()) {
        const product = snapshot.val()

        if (product) {
          update(docRef, {
            views: product.views + 1,
          })
        }
      }
    })
  }

  async findByName(params: IFindByName): Promise<IProduct[]> {
    const collectionRef = this.getCollectionRef()
    const constraints: QueryConstraint[] = []

    constraints.push(
      orderByChild('nameLowerCase'),
      startAt(params.search.toLowerCase()),
      endAt(`${params.search.toLowerCase()}\uf8ff`),
    )

    if (params?.limit) {
      constraints.push(limitToLast(params.limit))
    }

    return new Promise((resolve, reject) => {
      get(query(collectionRef, ...constraints))
        .then((snapshot) => {
          const data = snapshot.val()
          if (data) {
            const resultArray: IProduct[] = Object.keys(data).map((key) => ({
              ...data[key],
              id: key,
            }))
            resolve(resultArray)
          } else {
            resolve([])
          }
        })
        .catch(reject)
    })
  }
}
