import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faBriefcase, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { Country, State, City } from 'country-state-city'
import { createAddress } from '../../../store/slices/checkoutSlice'
import { fetchProfile } from '../../../store/slices/profileSlice'
import { useToast } from '../../../contexts/ToastContext'
import styles from './newAddress.module.css'

export default function NewAddress({ onCancel, onSave }) {
  const dispatch = useDispatch()
  const { show } = useToast()
  const { user } = useSelector(state => state.profile)
  
  const [addressType, setAddressType] = useState('home')
  const [customLabel, setCustomLabel] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    postalCode: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Populate form with user data from aggregate API
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        phone: user.phone || '',
        email: user.email || ''
      }))
    }
  }, [user])
  
  // Get all countries, filter out unwanted countries, and sort alphabetically
  const countries = Country.getAllCountries()
    .filter(country => {
      // Remove Kosovo, Curacao, and Sint Maarten
      const excludedCountries = ['Kosovo', 'Curacao', 'Sint Maarten']
      return !excludedCountries.includes(country.name)
    })
    .sort((a, b) => a.name.localeCompare(b.name))
  
  // Get states for selected country
  const states = selectedCountry 
    ? State.getStatesOfCountry(selectedCountry)
    : []
  
  // Get cities for selected country and state
  const cities = selectedCountry && selectedState
    ? City.getCitiesOfState(selectedCountry, selectedState)
    : []

  const handleTypeChange = (type) => {
    setAddressType(type)
    setCustomLabel('')
  }

  const handleCustomLabelChange = (e) => {
    const value = e.target.value
    setCustomLabel(value)
    if (value) {
      setAddressType('custom')
    } else {
      // If custom label is cleared, revert to 'home'
      setAddressType('home')
    }
  }

  // Get the display value for the label input
  const getLabelValue = () => {
    if (customLabel) return customLabel
    if (addressType === 'home') return 'Home'
    if (addressType === 'work') return 'Work'
    if (addressType === 'other') return 'Other'
    return ''
  }

  const handleCountryChange = (e) => {
    const countryCode = e.target.value
    setSelectedCountry(countryCode)
    setSelectedState('') // Reset state when country changes
    setSelectedCity('') // Reset city when country changes
  }

  const handleStateChange = (e) => {
    setSelectedState(e.target.value)
    setSelectedCity('') // Reset city when state changes
  }

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Get country and state names from codes
      const countryName = countries.find(c => c.isoCode === selectedCountry)?.name || ''
      const stateName = states.find(s => s.isoCode === selectedState)?.name || ''

      // Prepare address data matching checkout format
      const addressData = {
        type: addressType,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: selectedCity,
        state: stateName,
        postalCode: formData.postalCode,
        country: countryName,
        landmark: formData.landmark,
        instructions: '',
        isDefault: false
      }

      // Get coordinates from address using Google Geocoding API
      const GOOGLE_API_KEY = ''
      try {
        const addressString = [
          addressData.addressLine1,
          addressData.addressLine2,
          addressData.city,
          addressData.state,
          addressData.postalCode,
          addressData.country
        ].filter(Boolean).join(', ')
        
        if (addressString) {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressString)}&key=${GOOGLE_API_KEY}`
          )
          
          const data = await response.json()
          
          if (data.status === 'OK' && data.results && data.results.length > 0) {
            const location = data.results[0].geometry.location
            if (location && location.lat && location.lng) {
              addressData.latitude = location.lat
              addressData.longitude = location.lng
            }
          }
        }
      } catch (error) {
        console.error('Error getting coordinates:', error)
        // Continue without coordinates - address will be saved without lat/long
      }

      const result = await dispatch(createAddress(addressData))
      
      if (createAddress.fulfilled.match(result)) {
        show('Address added successfully')
        // Refresh profile to get updated addresses
        await dispatch(fetchProfile())
        // Call onSave callback if provided
        if (onSave) onSave()
      } else {
        show('Failed to add address', 'error')
      }
    } catch (error) {
      show(error.message || 'Failed to add address', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.newAddressContainer}>
      <h3 className={styles.title}>ADD NEW ADDRESS</h3>
      {/* <p className={styles.subtitle}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero
        et velit interdum, ac aliquet odio mattis.
      </p> */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.labelRow}>
          <button 
            type="button" 
            className={`${styles.iconBtn} ${addressType === 'home' ? styles.active : ''}`}
            onClick={() => handleTypeChange('home')}
            title="Home"
          >
            <FontAwesomeIcon icon={faHome} />
          </button>
          <button 
            type="button" 
            className={`${styles.iconBtn} ${addressType === 'work' ? styles.active : ''}`}
            onClick={() => handleTypeChange('work')}
            title="Work"
          >
            <FontAwesomeIcon icon={faBriefcase} />
          </button>
          <button 
            type="button" 
            className={`${styles.iconBtn} ${addressType === 'other' ? styles.active : ''}`}
            onClick={() => handleTypeChange('other')}
            title="Other"
          >
            <FontAwesomeIcon icon={faMapMarkerAlt} />
          </button>
          <input 
            className={styles.labelInput} 
            placeholder="Custom Label" 
            value={getLabelValue()}
            onChange={handleCustomLabelChange}
          />
        </div>
        <div className={styles.gridRow}>
          <select 
            className={styles.input}
            value={selectedCountry}
            onChange={handleCountryChange}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>
          <select 
            className={styles.input}
            value={selectedState}
            onChange={handleStateChange}
            disabled={!selectedCountry}
          >
            <option value="">Select State/District</option>
            {states.map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.gridRow}>
          <select 
            className={styles.input}
            value={selectedCity}
            onChange={handleCityChange}
            disabled={!selectedState}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
          <input 
            className={styles.input} 
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            placeholder="Pincode" 
            required
          />
        </div>
        <div className={styles.fullRow}>
          <input 
            className={styles.input} 
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleInputChange}
            placeholder="Address Line 1" 
            required
          />
        </div>
        <div className={styles.fullRow}>
          <input 
            className={styles.input} 
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleInputChange}
            placeholder="Address Line 2 (Optional)" 
          />
        </div>
        <div className={styles.gridRow}>
          <input 
            className={styles.input} 
            name="landmark"
            value={formData.landmark}
            onChange={handleInputChange}
            placeholder="Landmark (Optional)" 
          />
          <input 
            className={styles.input} 
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Full Name" 
            required
          />
        </div>
        <div className={styles.gridRow}>
          <input 
            className={styles.input} 
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone" 
            required
          />
          <input 
            className={styles.input} 
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email" 
            required
          />
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className={styles.saveBtn} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}
