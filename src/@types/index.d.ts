export interface IProductCampaign {
  id: string
  title: string
  reduction?: string
  startDate?: string
  finishDate?: string
}

export type IProduct = {
  id: string
  name: string
  quantity: number
  price: number
  category: string
  photo: string
  description: string
  createdAt: string
  updatedAt: string
  campaign?: IProductCampaign
}

export interface IProductCart {
  id: string
  quantity: number
}

export interface IProductInput {
  id: string
  name: string
}

export interface ICampaignBase {
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

export interface ICampaign extends ICampaignBase {
  products?: string[]
}

export type CategoryLabel =
  | 'Bebê'
  | 'Higiene Pessoal'
  | 'Saúde'
  | 'Inseticidas'
  | 'Alimentação'

export interface IProductQuery {
  search?: string
  limit?: number
  category?: CategoryLabel | string
  campaign?: string
  exceptProductId?: string
  exceptOthersProduct?: boolean
  orderBy?: 'updatedAt' | 'mostViews' | 'bestSellers'
}

export interface ICategory {
  label: CategoryLabel
  img: string
}

export interface IProductOrder {
  id: string
  name: string
  quantity: number
  price: number
  promotion?: number | null
}

export interface IOrder {
  id: string
  userId: string
  firstName: string
  lastName: string
  address: string
  phone: string
  createdAt: string
  state: 'not-sold' | 'sold'
  products: IProductOrder[]
}

export type UserRole = 'client' | 'admin'

export interface IUser {
  id: string
  firstName: string
  lastName?: string
  address?: string
  phone?: string
  role: UserRole
}
