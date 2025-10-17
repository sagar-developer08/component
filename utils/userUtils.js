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

export const getCognitoUserIdFromToken = async () => {
  if (typeof document === 'undefined') return null
  
  try {
    const token = await getAuthToken()
    if (!token) return null
    
    // Decode JWT token to get Cognito user ID
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.sub || null
  } catch (error) {
    console.error('Error getting Cognito user ID from token:', error)
  }
  
  return null
}

export const getUserIds = async () => {
  try {
    const [mongoUserId, cognitoUserId] = await Promise.all([
      getUserFromCookies(),
      getCognitoUserIdFromToken()
    ])
    
    return {
      mongoUserId,
      cognitoUserId
    }
  } catch (error) {
    console.error('Error getting user IDs:', error)
    return {
      mongoUserId: null,
      cognitoUserId: null
    }
  }
}
