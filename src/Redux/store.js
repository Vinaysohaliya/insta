import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import contentSlice from './contentSlice'


export const store = configureStore({
  reducer: {
    auth:authSlice,
    content:contentSlice,
  },
})