import Http from '~/composables/useHttp'
import type { ApiResponse, Room } from '~/types/api'

const roomInfoAPI = {
  getRoomsApi: (options = {}) => {
    return Http.get<ApiResponse<Room[]>>('/api/v1/rooms/', options)
  },
  getRoomInfoApi: (id: string, options = {}) => {
    return Http.get<ApiResponse<Room>>(`/api/v1/rooms/${id}`, options)
  }
}

export default roomInfoAPI
