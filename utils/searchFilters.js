// Utility to convert search filter API response to facets format for FilterDrawer

export function buildFacetsFromSearchFilters(filterData) {
  if (!filterData) return []

  const facets = []

  // Availability
  if (filterData.availability) {
    facets.push({
      key: 'availability',
      label: 'Availability',
      type: 'checkbox',
      options: [
        { value: 'in', label: 'In Stock', count: filterData.availability.inStock || 0 },
        { value: 'out', label: 'Out of Stock', count: filterData.availability.outOfStock || 0 },
      ]
    })
  }

  // Price
  if (filterData.price) {
    facets.push({
      key: 'price',
      label: 'Price',
      type: 'range',
      min: Math.floor(filterData.price.min || 0),
      max: Math.ceil(filterData.price.max || 0),
    })
  }

  // Brands
  if (filterData.brands && Array.isArray(filterData.brands) && filterData.brands.length > 0) {
    facets.push({
      key: 'brand',
      label: 'Brand',
      type: 'checkbox',
      options: filterData.brands.map(brand => ({
        value: brand._id,
        label: brand.name,
        count: brand.count || 0
      }))
    })
  }

  // Stores
  if (filterData.stores && Array.isArray(filterData.stores) && filterData.stores.length > 0) {
    facets.push({
      key: 'store',
      label: 'Store',
      type: 'checkbox',
      options: filterData.stores.map(store => ({
        value: store._id,
        label: store.name,
        count: store.count || 0
      }))
    })
  }

  // Ratings
  if (filterData.ratings && Array.isArray(filterData.ratings) && filterData.ratings.length > 0) {
    facets.push({
      key: 'rating',
      label: 'Rating',
      type: 'min',
      options: filterData.ratings.map(rating => ({
        value: rating._id,
        label: `${rating._id} Stars & Up`,
        count: rating.count || 0
      }))
    })
  }

  // Dynamic attributes
  if (filterData.attributes) {
    Object.entries(filterData.attributes).forEach(([attrKey, values]) => {
      if (Array.isArray(values) && values.length > 0) {
        facets.push({
          key: `attr.${attrKey}`,
          label: attrKey.charAt(0).toUpperCase() + attrKey.slice(1).replace(/_/g, ' '),
          type: 'checkbox',
          options: values.map(value => ({
            value: value.value,
            label: value.value,
            count: value.count || 0
          }))
        })
      }
    })
  }

  // Dynamic specifications
  if (filterData.specifications) {
    Object.entries(filterData.specifications).forEach(([specKey, values]) => {
      if (Array.isArray(values) && values.length > 0) {
        facets.push({
          key: `spec.${specKey}`,
          label: specKey.charAt(0).toUpperCase() + specKey.slice(1).replace(/_/g, ' '),
          type: 'checkbox',
          options: values.map(value => ({
            value: value.value,
            label: value.value,
            count: value.count || 0
          }))
        })
      }
    })
  }

  return facets
}
