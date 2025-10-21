import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { fetchProfile } from '@/store/slices/profileSlice'
import { useAuth } from '../../../contexts/AuthContext'
import { auth, upload } from '@/store/api/endpoints'
import { decryptText } from '@/utils/crypto'
import styles from './personalInfo.module.css'

export default function PersonalInfo({ user }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const { logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  })
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [errors, setErrors] = useState({
    email: '',
    phone: ''
  })
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  })

  // No longer need to fetch profile data here - it's passed as props


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

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (passwordSuccess) {
      const timer = setTimeout(() => {
        setPasswordSuccess(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [passwordSuccess])

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone) => {
    return phone.length === 10
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // For phone field, only allow digits and limit to 10 characters
    if (name === 'phone') {
      const phoneRegex = /^[0-9]*$/
      if (!phoneRegex.test(value)) {
        return // Don't update if invalid characters
      }
      if (value.length > 10) {
        return // Don't update if more than 10 digits
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
      if (value && value.length > 0 && value.length < 10) {
        newErrors.phone = 'Please enter a valid 10-digit phone number'
      } else {
        newErrors.phone = ''
      }
    }
    
    setErrors(newErrors)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    // Validate before saving
    if (errors.email || errors.phone) {
      alert('Please fix validation errors before saving')
      return
    }

    try {
      // Get access token from cookie
      let token = ''
      if (typeof document !== 'undefined') {
        const cookies = document.cookie.split(';').map(c => c.trim())
        const tokenCookie = cookies.find(c => c.startsWith('accessToken='))
        if (tokenCookie) {
          try {
            const enc = decodeURIComponent(tokenCookie.split('=')[1] || '')
            token = await decryptText(enc)
          } catch (err) {
            console.error('Error decrypting token:', err)
          }
        }
      }

      if (!token) {
        throw new Error('Authentication required. Please login again.')
      }

      // Prepare update payload (partial update - only send changed fields)
      const updateData = {}
      
      // Combine first and last name
      const fullName = `${formData.firstName} ${formData.lastName}`.trim()
      if (fullName && fullName !== user.name) {
        updateData.name = fullName
      }
      
      if (formData.phone && formData.phone !== user.phone) {
        updateData.phone = formData.phone
      }

      // Include uploaded image URL if available (including empty string for removal)
      if (uploadedImageUrl !== null) {
        updateData.profileImage = uploadedImageUrl === 'REMOVE' ? '' : uploadedImageUrl
      }

      // Only make API call if there are changes
      if (Object.keys(updateData).length === 0) {
        console.log('No changes to save')
        setIsEditing(false)
        return
      }

      console.log('Updating profile with:', updateData)

      // Call update profile API
      const response = await fetch(auth.updateProfile, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile')
      }

      console.log('✅ Profile updated successfully:', data)
      
      // Show success message
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      
      // Refresh profile data
      dispatch(fetchProfile())
      
      // Exit edit mode
      setIsEditing(false)
      
      // Clear uploaded image state
      setUploadedImageUrl(null)
      setProfileImage(null)
      setImagePreview(null)
    } catch (error) {
      console.error('Save profile error:', error)
      alert(`Failed to save profile: ${error.message}`)
    }
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
    setUploadedImageUrl(null)
    const fileInput = document.getElementById('profile-image-input')
    if (fileInput) {
      fileInput.value = ''
    }
    setIsEditing(false)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)

      // Get access token from cookie
      let token = ''
      if (typeof document !== 'undefined') {
        const cookies = document.cookie.split(';').map(c => c.trim())
        const tokenCookie = cookies.find(c => c.startsWith('accessToken='))
        if (tokenCookie) {
          try {
            const enc = decodeURIComponent(tokenCookie.split('=')[1] || '')
            token = await decryptText(enc)
          } catch (err) {
            console.error('Error decrypting token:', err)
          }
        }
      }

      if (!token) {
        throw new Error('Authentication required. Please login again.')
      }

      setIsUploadingImage(true)

      try {
        // Prepare form data
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'profiles/avatars')
        formData.append('optimize', 'true')
        formData.append('maxWidth', '400')
        formData.append('maxHeight', '400')

        // Upload to media service
        const response = await fetch(upload.image, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to upload image')
        }

        // Store the uploaded image URL (will be saved when user clicks Save)
        setUploadedImageUrl(data.data.url)
        console.log('✅ Image uploaded successfully:', data.data.url)
      } catch (error) {
        console.error('Image upload error:', error)
        alert(`Failed to upload image: ${error.message}`)
        // Reset image on error
        setProfileImage(null)
        setImagePreview(null)
        setUploadedImageUrl(null)
        const fileInput = document.getElementById('profile-image-input')
        if (fileInput) {
          fileInput.value = ''
        }
      } finally {
        setIsUploadingImage(false)
      }
    }
  }

  const handleRemoveImage = () => {
    // Clear local states (will be saved when user clicks Save)
    setProfileImage(null)
    setImagePreview(null)
    setUploadedImageUrl('REMOVE') // Special marker to indicate image should be removed
    
    // Reset file input
    const fileInput = document.getElementById('profile-image-input')
    if (fileInput) {
      fileInput.value = ''
    }
  }

  // Helper function to get initials from name
  const getInitials = (name) => {
    if (!name) return 'U'
    const nameParts = name.trim().split(' ')
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase()
    }
    const firstName = nameParts[0]
    const lastName = nameParts[nameParts.length - 1]
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))

    // Validate passwords
    const newPasswordErrors = { ...passwordErrors }
    
    if (name === 'newPassword') {
      if (value && value.length < 8) {
        newPasswordErrors.newPassword = 'Password must be at least 8 characters'
      } else {
        newPasswordErrors.newPassword = ''
      }
      
      // Check if confirm password matches
      if (passwordData.confirmPassword && value !== passwordData.confirmPassword) {
        newPasswordErrors.confirmPassword = 'Passwords do not match'
      } else if (passwordData.confirmPassword) {
        newPasswordErrors.confirmPassword = ''
      }
    }
    
    if (name === 'confirmPassword') {
      if (value && value !== passwordData.newPassword) {
        newPasswordErrors.confirmPassword = 'Passwords do not match'
      } else {
        newPasswordErrors.confirmPassword = ''
      }
    }
    
    setPasswordErrors(newPasswordErrors)
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleToggleChangePassword = () => {
    setShowChangePassword(!showChangePassword)
    // Reset password data when closing
    if (showChangePassword) {
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setPasswordErrors({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setPasswordSuccess(false)
      setShowPasswords({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false
      })
    }
  }

  const handleSavePassword = async () => {
    // Validate all fields
    const newPasswordErrors = {}
    
    if (!passwordData.oldPassword) {
      newPasswordErrors.oldPassword = 'Please enter your current password'
    }
    
    if (!passwordData.newPassword) {
      newPasswordErrors.newPassword = 'Please enter a new password'
    } else if (passwordData.newPassword.length < 8) {
      newPasswordErrors.newPassword = 'Password must be at least 8 characters'
    }
    
    if (!passwordData.confirmPassword) {
      newPasswordErrors.confirmPassword = 'Please confirm your new password'
    } else if (passwordData.confirmPassword !== passwordData.newPassword) {
      newPasswordErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (Object.keys(newPasswordErrors).length > 0) {
      setPasswordErrors(newPasswordErrors)
      return
    }
    
    try {
      // Get access token and userId from cookies
      let token = ''
      let userId = ''
      
      if (typeof document !== 'undefined') {
        const cookies = document.cookie.split(';').map(c => c.trim())
        
        // Get access token
        const tokenCookie = cookies.find(c => c.startsWith('accessToken='))
        if (tokenCookie) {
          try {
            const enc = decodeURIComponent(tokenCookie.split('=')[1] || '')
            token = await decryptText(enc)
          } catch (err) {
            console.error('Error decrypting token:', err)
          }
        }
        
        // Get userId
        const userIdCookie = cookies.find(c => c.startsWith('userId='))
        if (userIdCookie) {
          try {
            const enc = decodeURIComponent(userIdCookie.split('=')[1] || '')
            userId = await decryptText(enc)
          } catch (err) {
            console.error('Error decrypting userId:', err)
          }
        }
      }

      if (!token) {
        throw new Error('Authentication required. Please login again.')
      }

      const payload = {
        userId: userId || undefined,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      }

      console.log('🔐 Change password payload:', { 
        userId: payload.userId,
        hasOldPassword: !!payload.oldPassword,
        hasNewPassword: !!payload.newPassword
      })

      // Call change password API
      const response = await fetch(auth.changePassword, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password')
      }

      // Show success message
      setPasswordSuccess(true)
      
      // Reset form
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setPasswordErrors({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      // Close password form and show profile after 1.5 seconds
      setTimeout(() => {
        setShowChangePassword(false)
      }, 1500)
      
    } catch (error) {
      console.error('Change password error:', error)
      const errorMessage = error.message || 'Failed to change password'
      
      // Set error to appropriate field
      if (errorMessage.toLowerCase().includes('current') || errorMessage.toLowerCase().includes('old')) {
        setPasswordErrors(prev => ({ ...prev, oldPassword: errorMessage }))
      } else {
        setPasswordErrors(prev => ({ ...prev, newPassword: errorMessage }))
      }
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
  // Loading and error states are now handled in the parent ProfilePage component

  return (
    <form className={styles.profileForm}>
      {/* Success message for profile save */}
      {saveSuccess && !showChangePassword && (
        <div className={styles.successMessage}>
          ✓ Profile updated successfully!
        </div>
      )}

      {/* Only show profile details when NOT in password change mode */}
      {!showChangePassword && (
        <>
          <div className={styles.avatarEditRow}>
            <div className={styles.avatarContainer}>
              {/* Show initials if image is being removed or doesn't exist */}
              {(uploadedImageUrl === 'REMOVE' || (!imagePreview && !user?.profileImage)) ? (
                <div className={styles.initialsAvatar}>
                  {isUploadingImage && (
                    <div className={styles.uploadingOverlay}>
                      <div className={styles.spinner}></div>
                      <span>Uploading...</span>
                    </div>
                  )}
                  <span className={styles.initialsText}>{getInitials(user?.name)}</span>
                </div>
              ) : (
                <div className={styles.avatarWrapper}>
                  {isUploadingImage && (
                    <div className={styles.uploadingOverlay}>
                      <div className={styles.spinner}></div>
                      <span>Uploading...</span>
                    </div>
                  )}
                  <Image
                    src={imagePreview || user?.profileImage || "https://api.builder.io/api/v1/image/assets/TEMP/e6affc0737515f664c7d8288ba0b3068f64a0ade?width=80"}
                    alt="Profile"
                    width={80}
                    height={80}
                    className={styles.avatar}
                  />
                </div>
              )}
              {/* Show buttons ONLY in edit mode */}
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
                  {(user?.profileImage || imagePreview) && uploadedImageUrl !== 'REMOVE' && (
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
        </>
      )}

      {/* Action buttons - Only show when NOT in password change mode */}
      {!showChangePassword && (
        <div className={styles.actionRow}>
          <button 
            type="button" 
            className={styles.changePasswordBtn}
            onClick={handleToggleChangePassword}
          >
            Change Password
          </button>
          <button type="button" className={styles.deleteAccountBtn}>Delete Account</button>
        </div>
      )}

      {/* Password Change Form */}
      {showChangePassword && (
        <div className={styles.passwordChangeSection}>
          <div className={styles.passwordTitle}>Change Password</div>
          
          {/* Success message for password change */}
          {passwordSuccess && (
            <div className={styles.successMessage}>
              ✓ Password changed successfully!
            </div>
          )}

          <div className={styles.passwordGrid}>
            <div className={styles.inputContainer}>
              <div className={styles.passwordInputContainer}>
                <input 
                  className={styles.inputField} 
                  type={showPasswords.oldPassword ? "text" : "password"}
                  name="oldPassword"
                  value={passwordData.oldPassword} 
                  onChange={handlePasswordChange}
                  placeholder="Current Password"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => togglePasswordVisibility('oldPassword')}
                >
                  {showPasswords.oldPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {passwordErrors.oldPassword && <div className={styles.errorMessage}>{passwordErrors.oldPassword}</div>}
            </div>

            <div className={styles.inputContainer}>
              <div className={styles.passwordInputContainer}>
                <input 
                  className={styles.inputField} 
                  type={showPasswords.newPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword} 
                  onChange={handlePasswordChange}
                  placeholder="New Password"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => togglePasswordVisibility('newPassword')}
                >
                  {showPasswords.newPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {passwordErrors.newPassword && <div className={styles.errorMessage}>{passwordErrors.newPassword}</div>}
            </div>

            <div className={styles.inputContainer}>
              <div className={styles.passwordInputContainer}>
                <input 
                  className={styles.inputField} 
                  type={showPasswords.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword} 
                  onChange={handlePasswordChange}
                  placeholder="Confirm New Password"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                >
                  {showPasswords.confirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {passwordErrors.confirmPassword && <div className={styles.errorMessage}>{passwordErrors.confirmPassword}</div>}
            </div>
          </div>

          <div className={styles.passwordActions}>
            <button 
              type="button" 
              className={styles.savePasswordBtn}
              onClick={handleSavePassword}
            >
              Save Password
            </button>
            <button 
              type="button" 
              className={styles.cancelPasswordBtn}
              onClick={handleToggleChangePassword}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
