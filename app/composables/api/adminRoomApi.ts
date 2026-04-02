import Http from '~/composables/useHttp'
import type { ApiResponse, Room, RoomPayload } from '~/types/api'

const adminRoomAPI = {
  getRooms: (options = {}) => {
    return Http.get<ApiResponse<Room[]>>('/api/v1/admin/rooms/', options)
  },
  getRoom: (id: string, options = {}) => {
    return Http.get<ApiResponse<Room>>(`/api/v1/admin/rooms/${id}`, options)
  },
  createRoom: (body: RoomPayload, options = {}) => {
    return Http.post<ApiResponse<Room>>('/api/v1/admin/rooms/', body, options)
  },
  updateRoom: (id: string, body: RoomPayload, options = {}) => {
    return Http.put<ApiResponse<Room>>(`/api/v1/admin/rooms/${id}`, body, options)
  },
  deleteRoom: (id: string, options = {}) => {
    return Http.delete<ApiResponse<null>>(`/api/v1/admin/rooms/${id}`, options)
  }
}

export default adminRoomAPI
