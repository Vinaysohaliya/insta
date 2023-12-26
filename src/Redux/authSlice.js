import { createSlice } from '@reduxjs/toolkit'
import authObj from '../Appwrite/auth';
import userService  from '../Appwrite/user';
import service from '../Appwrite/post';

const initialState = {
  status:false,
  userData:null,
  userImg:null,
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
    const user= await userService.getUser(data.$id);
    const profileImg=await service.getFilePreview(user.documents);
    console.log(profileImg.href);
    data.profileImgHref = profileImg.href;
    
    if (data && profileImg) {
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