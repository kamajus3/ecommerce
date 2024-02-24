export interface Product {
  id: string
  name: string
  photo: string
  price: number
  category: string
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
  createdAt: string
  updatedAt: string
}
