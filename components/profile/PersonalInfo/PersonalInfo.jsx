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
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({
    email: '',
    phone: ''
  })

  useEffect(() => {
    dispatch(fetchProfile())
  }, [dispatch])


  useEffect(() => {
    if (user) {
      // Only update form data if we're not currently editing
      // This prevents form data from being reset when switching tabs
      if (!isEditing) {
        // Split the name into first and last name
        const nameParts = (user.name || '').split(' ')
        setFormData({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          phone: user.phone || '',
          email: user.email || ''
        })
      }
    }
  }, [user, isEditing])

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone) => {
    return phone.length === 8
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // For phone field, only allow digits and limit to 8 characters
    if (name === 'phone') {
      const phoneRegex = /^[0-9]*$/
      if (!phoneRegex.test(value)) {
        return // Don't update if invalid characters
      }
      if (value.length > 8) {
        return // Don't update if more than 8 digits
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Validate and set errors
    const newErrors = { ...errors }
    
    if (name === 'email') {
      if (value && !validateEmail(value)) {
        newErrors.email = 'Please enter a valid email address'
      } else {
        newErrors.email = ''
      }
    }
    
    if (name === 'phone') {
      if (value && value.length > 0 && value.length < 8) {
        newErrors.phone = 'Please enter a valid 8-digit phone number'
      } else {
        newErrors.phone = ''
      }
    }
    
    setErrors(newErrors)
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
    // Clear any validation errors
    setErrors({
      email: '',
      phone: ''
    })
    // Clear image changes
    setProfileImage(null)
    setImagePreview(null)
    const fileInput = document.getElementById('profile-image-input')
    if (fileInput) {
      fileInput.value = ''
    }
    setIsEditing(false)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setProfileImage(null)
    setImagePreview(null)
    // Reset file input
    const fileInput = document.getElementById('profile-image-input')
    if (fileInput) {
      fileInput.value = ''
    }
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
        <div className={styles.avatarContainer}>
          <Image
            src={imagePreview || "https://api.builder.io/api/v1/image/assets/TEMP/e6affc0737515f664c7d8288ba0b3068f64a0ade?width=80"}
            alt="Profile"
            width={80}
            height={80}
            className={styles.avatar}
          />
          {isEditing && (
            <div className={styles.avatarActions}>
              <label htmlFor="profile-image-input" className={styles.uploadBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.5 4H20.5C21.6 4 22.5 4.9 22.5 6V20C22.5 21.1 21.6 22 20.5 22H3.5C2.4 22 1.5 21.1 1.5 20V6C1.5 4.9 2.4 4 3.5 4H9.5L11.5 2H16.5L14.5 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Upload
              </label>
              <input
                id="profile-image-input"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              {(profileImage || imagePreview) && (
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={handleRemoveImage}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Remove
                </button>
              )}
            </div>
          )}
        </div>
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
      <div className={styles.inputsGrid}>
        <div className={styles.inputContainer}>
          <input 
            className={styles.inputField} 
            type="text" 
            name="firstName"
            value={formData.firstName} 
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="First Name"
          />
        </div>
        <div className={styles.inputContainer}>
          <input 
            className={styles.inputField} 
            type="text" 
            name="lastName"
            value={formData.lastName} 
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Last Name"
          />
        </div>
        <div className={styles.inputContainer}>
          <input 
            className={styles.inputField} 
            type="email" 
            name="email"
            value={formData.email} 
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Email Address"
          />
          {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
        </div>
        <div className={styles.inputContainer}>
          <input 
            className={styles.inputField} 
            type="tel" 
            name="phone"
            value={formData.phone} 
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Phone Number"
          />
          {errors.phone && <div className={styles.errorMessage}>{errors.phone}</div>}
        </div>
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
