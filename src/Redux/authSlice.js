import { createSlice } from '@reduxjs/toolkit'
import authObj from '../Appwrite/auth';

const initialState = {
  status:false,
  userData:null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
   login:(state,action)=>{
    state.status=true,
    state.userData=action.payload;
   },
   logout:(state)=>{
    state.status=false;
    state.userData=null;
}
  },
})


export const checkAuthentication = () => async (dispatch) => {
  try {
    const data = await authObj.getuser();
    if (data) {
      dispatch(login(data));
    } else {
      dispatch(logout());
    }
  } catch (error) {
    console.error(error);
  }
};



export const { login,logout } = authSlice.actions

export default authSlice.reducer