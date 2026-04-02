import Http from '~/composables/useHttp'
import type { ApiResponse, Order, OrderPayload } from '~/types/api'

const orderAPI = {
  getOrders: (options = {}) => {
    return Http.get<ApiResponse<Order[]>>('/api/v1/orders/', options)
  },
  getOrder: (id: string, options = {}) => {
    return Http.get<ApiResponse<Order>>(`/api/v1/orders/${id}`, options)
  },
  createOrder: (body: OrderPayload, options = {}) => {
    return Http.post<ApiResponse<Order>>('/api/v1/orders/', body, options)
  },
  deleteOrder: (id: string, options = {}) => {
    return Http.delete<ApiResponse<null>>(`/api/v1/orders/${id}`, options)
  }
}

export default orderAPI
