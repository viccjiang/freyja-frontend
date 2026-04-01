import Http from '~/composables/useHttp'

const userAPI = {
  login: (body: { email: string; password: string }, options = {}) => {
    return Http.post('/api/v1/user/login', body, options)
  },
  signup: (body: any, options = {}) => {
    return Http.post('/api/v1/user/signup', body, options)
  },
  getUser: (options = {}) => {
    return Http.get('/api/v1/user/', options)
  }
}

export default userAPI
