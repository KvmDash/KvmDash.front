export interface LoginResponse {
    token?: string
    user?: string
    roles?: string[]
    message?: string
    code?: number
  }