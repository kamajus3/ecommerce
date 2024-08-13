import { IOrder } from '@/@types'

import { BaseRepository } from './base.repository'

export class OrderRepository extends BaseRepository<IOrder> {
  constructor() {
    super('/orders/')
  }
}
