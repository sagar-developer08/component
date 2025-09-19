import { decryptText } from './crypto'

export const getUserFromCookies = async () => {
  if (typeof document === 'undefined') return null
  
  try {
    const cookies = document.cookie.split(';').map(c => c.trim())
    const userCookie = cookies.find(c => c.startsWith('userId='))
    if (userCookie) {
      const enc = decodeURIComponent(userCookie.split('=')[1] || '')
      const userId = await decryptText(enc)
      return userId
    }
  } catch (error) {
    console.error('Error getting user from cookies:', error)
  }
  
  return null
}

export const getAuthToken = async () => {
  if (typeof document === 'undefined') return null
  
  try {
    const cookies = document.cookie.split(';').map(c => c.trim())
    const tokenCookie = cookies.find(c => c.startsWith('accessToken='))
    if (tokenCookie) {
      const enc = decodeURIComponent(tokenCookie.split('=')[1] || '')
      const token = await decryptText(enc)
      return token
    }
  } catch (error) {
    console.error('Error getting auth token from cookies:', error)
  }
  
  return null
}
