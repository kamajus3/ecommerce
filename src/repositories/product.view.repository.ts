import { IProductView } from '@/@types'

import { BaseRepository } from './base.repository'

export class ProductViewRepository extends BaseRepository<IProductView> {
  constructor() {
    super('/product_views/')
  }
}
