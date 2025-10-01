/**
 * Examples demonstrating conditional variant display logic
 */

// Example 1: Product with multiple colors and sizes (variants will be shown)
const productWithVariants = {
  colors: ["Black", "White", "Blue", "Silver"],
  sizes: ["64GB", "128GB", "256GB"],
  // Color and Size selection sections will be displayed
}

// Example 2: Product with single color and multiple sizes (only size section shown)
const productWithSizeVariants = {
  colors: ["Black"], // Only one color - color section hidden
  sizes: ["64GB", "128GB", "256GB"], // Multiple sizes - size section shown
}

// Example 3: Product with no variants (both sections hidden)
const productWithoutVariants = {
  colors: [], // No colors - color section hidden
  sizes: [], // No sizes - size section hidden
}

// Example 4: Product with single variant (both sections hidden)
const singleVariantProduct = {
  colors: ["Silver"], // Only one color - color section hidden
  sizes: ["64GB"], // Only one size - size section hidden
}

// Conditional rendering logic in ProductDetails.jsx:
/*
{product.colors && product.colors.length > 1 && (
  <div className="selection-group">
    <label>Color:</label>
    <div className="color-options">
      {product.colors.map((color) => (
        <button key={color} className="color-btn">
          {color}
        </button>
      ))}
    </div>
  </div>
)}

{product.sizes && product.sizes.length > 1 && (
  <div className="selection-group">
    <label>Size:</label>
    <div className="size-options">
      {product.sizes.map((size) => (
        <button key={size} className="size-btn">
          {size}
        </button>
      ))}
    </div>
  </div>
)}
*/

// Data mapping logic in product page:
/*
colors: variantOptions.color && variantOptions.color.length > 1 ? variantOptions.color : 
        (product.variant_attributes?.color ? [product.variant_attributes.color] : []),
sizes: variantOptions.storage && variantOptions.storage.length > 1 ? variantOptions.storage : 
       (product.variant_attributes?.storage ? [product.variant_attributes.storage] : []),
*/

// Redux slice logic:
/*
// Only set variant options if there are multiple options
state.variantOptions = {
  color: colorOptions.size > 1 ? Array.from(colorOptions) : [],
  storage: storageOptions.size > 1 ? Array.from(storageOptions) : []
}
*/

export {
  productWithVariants,
  productWithSizeVariants,
  productWithoutVariants,
  singleVariantProduct
}
