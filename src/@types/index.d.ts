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
  orderBy?: 'updatedAt' | 'mostViews' | 'bestSellers'
}
