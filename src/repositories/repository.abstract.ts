/* eslint-disable @typescript-eslint/no-explicit-any */
import { IQuery } from '@/@types'

export interface Record {
  id?: number | string
  createdAt?: string
  updatedAt?: string
  [key: string]: unknown
}

export abstract class IRepository<T extends Record> {
  protected abstract collectionName: string

  abstract findAll(): Promise<T[]>

  abstract find(params?: IQuery): Promise<T[]>

  abstract findById(id: number | string): Promise<T | null>

  abstract create(
    record: Omit<T, 'id' | 'createdAt' | 'updatedAt'>,
    id: string,
  ): Promise<T>

  replaceUndefinedWithNull(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.replaceUndefinedWithNull(item))
    }

    const result: { [key: string]: any } = {}
    for (const key of Object.keys(obj)) {
      result[key] =
        obj[key] === undefined ? null : this.replaceUndefinedWithNull(obj[key])
    }

    return result
  }

  abstract update(updates: Partial<T>, id: number | string): Promise<T | null>

  abstract deleteById(id: number | string): Promise<void>
}
