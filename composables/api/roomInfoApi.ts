import Http from '~/composables/Http'

const roomInfoAPI = {
  getRoomsApi: (options = {}) => {
    return Http.get(`/api/v1/rooms/`, options)
  },
  getRoomInfoApi: (id: string, options = {}) => {
    return Http.get(`/api/v1/rooms/${id}`, options)
  }
}

export default roomInfoAPI
