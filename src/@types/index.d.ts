export interface Product {
  id: string
  name: string
  photo: string
  price: number
  category: string
  description: string
}

export interface ProductCart {
  id: string
  quantity: number
}

export type ProductItem = {
  id: string
  name: string
  quantity: number
  price: number
  category: string
  photo: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface ProductQuery {
  search?: string
  limit?: number
  category?: string
  orderBy?: 'updatedAt' | 'mostViews' | 'bestSellers'
}
