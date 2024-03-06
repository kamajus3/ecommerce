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

export interface ProductPromotionObject {
  id: string
  title: string
  reduction: number
  startDate: string
  finishDate: string
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
  promotion?: ProductPromotionObject
}

export interface ProductInputProps {
  id: string
  name: string
}

export interface PromotionItemBase {
  id: string
  title: string
  reduction: number
  startDate: string
  finishDate: string
  description: string
  photo: string
}

export interface PromotionItemEdit extends PromotionItemBase {
  products: string[]
}

export interface PromotionItemNew extends PromotionItemBase {
  products: ProductInputProps[]
}

export interface ProductQuery {
  search?: string
  limit?: number
  category?: string
  promotion?: string
  except?: string
  exceptOthersProduct?: boolean
  orderBy?: 'updatedAt' | 'mostViews' | 'bestSellers'
}

export interface Category {
  label: string
  img: string
}

export interface ProductOrder {
  id: string
  name: string
  quantity: number
  price: number
  promotion?: number | null
}

export interface Order {
  id: string
  firstName: string
  lastName: string
  address: string
  phone: string
  products: ProductOrder[]
}
