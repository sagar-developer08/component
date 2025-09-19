import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { fetchProfile } from '@/store/slices/profileSlice'
import { useAuth } from '../../../contexts/AuthContext'
import styles from './personalInfo.module.css'

export default function PersonalInfo() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { logout } = useAuth()
  const { user, loading, error } = useSelector(state => state.profile)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  })

  useEffect(() => {
    dispatch(fetchProfile())
  }, [dispatch])


  useEffect(() => {
    if (user) {
      // Split the name into first and last name
      const nameParts = (user.name || '').split(' ')
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        phone: user.phone || '',
        email: user.email || ''
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false)
  }

  const handleCancel = () => {
    if (user) {
      // Split the name into first and last name
      const nameParts = (user.name || '').split(' ')
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        phone: user.phone || '',
        email: user.email || ''
      })
    }
    setIsEditing(false)
  }

  const handleLogout = () => {
    // Clear all cookies
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';')
      cookies.forEach(cookie => {
        const eqPos = cookie.indexOf('=')
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`
      })
    }
    
    // Call logout from auth context
    logout()
    
    // Redirect to home page
    router.push('/')
  }
  if (loading) {
    return (
      <div className={styles.profileForm}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Loading profile data...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.profileForm}>
        <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
          Error loading profile: {error}
        </div>
      </div>
    )
  }

  return (
    <form className={styles.profileForm}>
      <div className={styles.avatarEditRow}>
        <Image
          src="https://api.builder.io/api/v1/image/assets/TEMP/e6affc0737515f664c7d8288ba0b3068f64a0ade?width=80"
          alt="Profile"
          width={80}
          height={80}
          className={styles.avatar}
        />
        <div className={styles.profileActions}>
          <button 
            type="button" 
            className={styles.updateProfileBtn}
            onClick={isEditing ? handleSave : handleEdit}
          >
            {isEditing ? 'Save' : 'Update Profile'}
          </button>
          {isEditing && (
            <button 
              type="button" 
              className={styles.logoutBtn}
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
          {!isEditing && (
            <button type="button" className={styles.logoutBtn} onClick={handleLogout}>Log Out</button>
          )}
        </div>
      </div>
      <div className={styles.editLabel}>
        {isEditing ? 'Save Changes' : 'Edit'}
      </div>
      <div className={styles.inputsGrid}>
        <input 
          className={styles.inputField} 
          type="text" 
          name="firstName"
          value={formData.firstName} 
          onChange={handleInputChange}
          disabled={!isEditing}
          placeholder="First Name"
        />
        <input 
          className={styles.inputField} 
          type="text" 
          name="lastName"
          value={formData.lastName} 
          onChange={handleInputChange}
          disabled={!isEditing}
          placeholder="Last Name"
        />
        <input 
          className={styles.inputField} 
          type="email" 
          name="email"
          value={formData.email} 
          onChange={handleInputChange}
          disabled={!isEditing}
          placeholder="Email Address"
        />
        <input 
          className={styles.inputField} 
          type="tel" 
          name="phone"
          value={formData.phone} 
          onChange={handleInputChange}
          disabled={!isEditing}
          placeholder="Phone Number"
        />
      </div>
      {/* <div className={styles.loginSection}>
        <div className={styles.loginTitle}>Login & Security</div>
        <div className={styles.loginGrid}>
          <input className={styles.inputField} type="text" placeholder="Username" />
          <input className={styles.inputField} type="password" placeholder="Password" />
        </div>
      </div> */}
      <div className={styles.actionRow}>
        <button type="button" className={styles.changePasswordBtn}>Change Password</button>
        <button type="button" className={styles.deleteAccountBtn}>Delete Account</button>
      </div>
    </form>
  )
}
