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

export interface CampaignProduct {
  id: string
  title: string
  reduction?: string
  startDate?: string
  finishDate?: string
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
  campaign?: CampaignProduct
}

export interface ProductInputProps {
  id: string
  name: string
}

export interface CampaignBase {
  id: string
  title: string
  description: string
  default: boolean
  fixed: boolean
  reduction?: string
  startDate?: string
  finishDate?: string
  photo: string
  createdAt: string
  updatedAt: string
}

export interface CampaignEdit extends CampaignBase {
  products?: string[]
}

export interface NewCampaign extends CampaignBase {
  products: ProductInputProps[]
}

export type CategoryLabel =
  | 'Bebê'
  | 'Higiene Pessoal'
  | 'Saúde'
  | 'Inseticidas'
  | 'Alimentação'

export interface ProductQuery {
  search?: string
  limit?: number
  category?: CategoryLabel | string
  campaign?: string
  except?: string
  exceptOthersProduct?: boolean
  orderBy?: 'updatedAt' | 'mostViews' | 'bestSellers'
}

export interface Category {
  label: CategoryLabel
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
  userId: string
  firstName: string
  lastName: string
  address: string
  phone: string
  createdAt: string
  state: 'not-sold' | 'sold'
  products: ProductOrder[]
}

export type UserRole = 'client' | 'admin'

export interface UserDatabase {
  id: string
  firstName: string
  lastName?: string
  address?: string
  phone?: string
  role: UserRole
}
