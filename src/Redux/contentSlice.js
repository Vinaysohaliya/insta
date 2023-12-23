import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  AllPosts:[],
}

export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setPost:(state,action)=>{
        state.AllPosts=action.payload;
    }
  },
})

export const { setPost } = contentSlice.actions

export default contentSlice.reducer