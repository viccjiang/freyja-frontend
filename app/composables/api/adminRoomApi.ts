import Http from '~/composables/useHttp'

const adminRoomAPI = {
  getRooms: (options = {}) => {
    return Http.get('/api/v1/admin/rooms/', options)
  },
  getRoom: (id: string, options = {}) => {
    return Http.get(`/api/v1/admin/rooms/${id}`, options)
  },
  createRoom: (body: any, options = {}) => {
    return Http.post('/api/v1/admin/rooms/', body, options)
  },
  updateRoom: (id: string, body: any, options = {}) => {
    return Http.put(`/api/v1/admin/rooms/${id}`, body, options)
  },
  deleteRoom: (id: string, options = {}) => {
    return Http.delete(`/api/v1/admin/rooms/${id}`, options)
  }
}

export default adminRoomAPI
