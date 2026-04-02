import Http from '~/composables/useHttp'
import type { LoginRequest, SignupRequest, AuthResponse, ApiResponse, UserProfile } from '~/types/api'

const userAPI = {
  login: (body: LoginRequest, options = {}) => {
    return Http.post<AuthResponse>('/api/v1/user/login', body, options)
  },
  signup: (body: SignupRequest, options = {}) => {
    return Http.post<AuthResponse>('/api/v1/user/signup', body, options)
  },
  getUser: (options = {}) => {
    return Http.get<ApiResponse<UserProfile>>('/api/v1/user/', options)
  }
}

export default userAPI
