import { randomBytes } from 'crypto'
import {
  child,
  equalTo,
  get,
  limitToLast,
  orderByChild,
  orderByKey,
  query,
  QueryConstraint,
  ref,
  remove,
  set,
  update,
} from 'firebase/database'

import { IQuery } from '@/@types'
import { database } from '@/services/firebase/config'

import { IRepository, Record } from './repository.abstract'

export class BaseRepository<T extends Record> extends IRepository<T> {
  protected collectionName: string

  constructor(collectionName: string) {
    super()
    this.collectionName = collectionName
  }

  private reverseData<T>(arr: T[]): T[] {
    const newArray: T[] = []
    for (let i = arr.length - 1; i >= 0; i--) {
      newArray.push(arr[i])
    }
    return newArray
  }

  getCollectionRef() {
    return ref(database, this.collectionName)
  }

  async findAll(): Promise<T[]> {
    const collectionRef = this.getCollectionRef()
    const constraints: QueryConstraint[] = []

    constraints.push(orderByChild('createdAt'))

    return new Promise((resolve, reject) => {
      get(query(collectionRef, ...constraints))
        .then((snapshot) => {
          const data = snapshot.val()
          if (data) {
            const resultArray: T[] = Object.keys(data).map((key) => ({
              ...data[key],
              id: key,
            }))
            resolve(this.reverseData(resultArray))
          } else {
            resolve([])
          }
        })
        .catch(reject)
    })
  }

  async find(params?: IQuery): Promise<T[]> {
    const collectionRef = this.getCollectionRef()
    const constraints: QueryConstraint[] = []

    if (params?.limit) {
      constraints.push(limitToLast(params.limit))
    }

    if (params?.filterBy) {
      const filterKey = Object.keys(params.filterBy)[0]
      const filterValue = Object.values(params.filterBy)[0]

      constraints.push(orderByChild(filterKey), equalTo(filterValue))
    }

    if (params?.filterById) {
      constraints.push(orderByKey(), equalTo(params.filterById))
    }

    return new Promise((resolve, reject) => {
      get(query(collectionRef, ...constraints))
        .then((snapshot) => {
          const data = snapshot.val()

          if (data) {
            if (params?.exceptionId) {
              delete data[params.exceptionId]
            }

            const resultArray: T[] = Object.keys(data).map((key) => ({
              ...data[key],
              id: key,
            }))

            if (params?.orderBy) {
              const orderByField = params.orderBy as keyof T
              resultArray.sort((a, b) => {
                if (a[orderByField] < b[orderByField]) {
                  return -1
                }
                if (a[orderByField] > b[orderByField]) {
                  return 1
                }
                return 0
              })
            }

            resolve(this.reverseData(resultArray))
          } else {
            resolve([])
          }
        })
        .catch(reject)
    })
  }

  async findById(id: number | string): Promise<T | null> {
    const docRef = child(this.getCollectionRef(), id.toString())

    return new Promise((resolve) => {
      get(docRef)
        .then((snapshot) => {
          const data = snapshot.val()
          if (data) {
            resolve({ ...data, id: id.toString() } as T)
          } else {
            resolve(null)
          }
        })
        .catch(() => {
          resolve(null)
        })
    })
  }

  async create(
    record: Omit<T, 'id' | 'createdAt' | 'updatedAt'>,
    id = randomBytes(20).toString('hex'),
  ): Promise<T> {
    const newDocRef = ref(database, `${this.collectionName}/${id}`)

    const createdAt = new Date().toISOString()
    const updatedAt = new Date().toISOString()

    return new Promise((resolve, reject) => {
      set(
        newDocRef,
        this.replaceUndefinedWithNull({ ...record, createdAt, updatedAt }),
      )
        .then(() => {
          resolve({ ...record, id, createdAt, updatedAt } as T)
        })
        .catch(reject)
    })
  }

  async update(updates: Partial<T>, id: number | string): Promise<T | null> {
    const docRef = child(this.getCollectionRef(), id.toString())
    const updatedAt = new Date().toISOString()

    return new Promise((resolve, reject) => {
      update(docRef, this.replaceUndefinedWithNull({ ...updates, updatedAt }))
        .then(() => get(docRef))
        .then((snapshot) => {
          const data = snapshot.val()

          if (data) {
            resolve({ ...data, id: id.toString(), updatedAt } as T)
          } else {
            resolve(null)
          }
        })
        .catch(reject)
    })
  }

  async deleteById(id: number | string): Promise<void> {
    const docRef = child(this.getCollectionRef(), id.toString())

    return new Promise((resolve, reject) => {
      remove(docRef).then(resolve).catch(reject)
    })
  }
}
