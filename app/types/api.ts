// ========== 通用 ==========

export interface ApiResponse<T = unknown> {
  status: boolean
  result: T
  token?: string
  message?: string
}

export interface Address {
  zipcode: number
  detail: string
}

export interface InfoItem {
  title: string
  isProvide: boolean
}

// ========== User ==========

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  name: string
  email: string
  password: string
  phone: string
  birthday: string
  address: Address
}

export interface AuthResponse {
  status: boolean
  token: string
  result: UserProfile
}

export interface UserProfile {
  _id: string
  name: string
  email: string
  phone: string
  birthday: string
  address: Address
  createdAt: string
  updatedAt: string
}

// ========== Room ==========

export interface Room {
  _id: string
  name: string
  description: string
  imageUrl: string
  imageUrlList: string[]
  areaInfo: string
  bedInfo: string
  maxPeople: number
  price: number
  layoutInfo: InfoItem[]
  facilityInfo: InfoItem[]
  amenityInfo: InfoItem[]
  createdAt: string
  updatedAt: string
}

export interface RoomPayload {
  name: string
  description: string
  imageUrl: string
  imageUrlList: string[]
  areaInfo: string
  bedInfo: string
  maxPeople: number
  price: number
  layoutInfo: InfoItem[]
  facilityInfo: InfoItem[]
  amenityInfo: InfoItem[]
}

// ========== Order ==========

export interface OrderPayload {
  roomId: string
  checkInDate: string
  checkOutDate: string
  peopleNum: number
  userInfo: {
    name: string
    email: string
    phone: string
    address: Address
  }
}

export interface Order {
  _id: string
  roomId: Room
  checkInDate: string
  checkOutDate: string
  peopleNum: number
  userInfo: {
    name: string
    email: string
    phone: string
    address: Address
  }
  status: number
  createdAt: string
  updatedAt: string
}
