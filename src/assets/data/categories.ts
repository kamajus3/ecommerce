import { ICategory } from '@/@types'

const CATEGORY_IMAGES = {
  hygiene: '/categories/hygiene.jpg',
  baby: '/categories/baby.jpg',
  health: '/categories/health.jpg',
  insecticide: '/categories/insecticide.jpg',
  food: '/categories/food.jpg',
}

const CATEGORIES: ICategory[] = [
  {
    label: 'hygiene',
    img: CATEGORY_IMAGES.hygiene,
  },
  {
    label: 'baby',
    img: CATEGORY_IMAGES.baby,
  },
  {
    label: 'health',
    img: CATEGORY_IMAGES.health,
  },
  {
    label: 'insecticides',
    img: CATEGORY_IMAGES.insecticide,
  },
  {
    label: 'food',
    img: CATEGORY_IMAGES.food,
  },
]

export default CATEGORIES
