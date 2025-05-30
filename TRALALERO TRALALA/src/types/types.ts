export interface AppUser {
  id: string
  email: string
  balance: number
  stocks: Stock[]
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  user: AppUser
  token: string
}

export type StockPoint = {
  time: Date
  price: number
}

export type StockData = {
  symbol: string
  data: StockPoint[]
}

export interface Stock {
  id: string
  ticker: string
  share_amount: number
  date_bought: string
  date_sold: string | null
}
