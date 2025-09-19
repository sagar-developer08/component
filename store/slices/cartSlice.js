import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    itemsCount: 0,
  },
  reducers: {
    setCartCount: (state, action) => {
      state.itemsCount = Number(action.payload) || 0
    }
  }
})

export const { setCartCount } = cartSlice.actions
export default cartSlice.reducer


