export interface Category {
  id: string
  name: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image?: string
  category: Category
  preparationTime: number
  available: boolean;
  ingredients?: string;
  isPopular?: boolean;
  rating?: number;
}

export type PixConfig = {
  key: string
  pixKey: string
  pixType: string
  recipient: string
  active: boolean
}
