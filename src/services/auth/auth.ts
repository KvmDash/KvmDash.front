import { LoginResponse } from '../../types/auth'

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: email, password }),
  })
  
  if (!response.ok) {
    throw new Error('Login fehlgeschlagen')
  }
  
  return response.json()
}