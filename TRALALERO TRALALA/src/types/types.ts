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
  date: Date
  price: number
}

export type StockData = {
  symbol: string[]
  data: StockPoint[]
}

export interface Stock {
  ticker: string
  amount: number
  date: string
  bought: boolean
}

export type StocksData = {
  [ticker: string]: {
    'Meta Data': {
      '1. Information': string
      '2. Symbol': string
      '3. Last Refreshed': string
      '4. Output Size': string
      '5. Time Zone': string
    }
    'Time Series (Daily)': {
      [date: string]: {
        '1. open': string
        '2. high': string
        '3. low': string
        '4. close': string
        '5. volume': string
      }
    }
  }
}

export type StockArrayObj = {
  [ticker: string]: {
    StocksData: StockData
  }
}

export interface DailyStockData {
  [timestamp: string]: {
    '1. open': string
    '2. high': string
    '3. low': string
    '4. close': string
    '5. volume': string
  }
}
