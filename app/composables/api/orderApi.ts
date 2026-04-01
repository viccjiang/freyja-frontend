import Http from '~/composables/useHttp'

export interface OrderPayload {
  roomId: string
  checkInDate: string
  checkOutDate: string
  peopleNum: number
  userInfo: {
    name: string
    email: string
    phone: string
    address: {
      zipcode: number
      detail: string
    }
  }
}

const orderAPI = {
  getOrders: (options = {}) => {
    return Http.get('/api/v1/orders/', options)
  },
  getOrder: (id: string, options = {}) => {
    return Http.get(`/api/v1/orders/${id}`, options)
  },
  createOrder: (body: OrderPayload, options = {}) => {
    return Http.post('/api/v1/orders/', body, options)
  },
  deleteOrder: (id: string, options = {}) => {
    return Http.delete(`/api/v1/orders/${id}`, options)
  }
}

export default orderAPI
