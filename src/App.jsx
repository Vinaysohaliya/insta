import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import { login } from './Redux/authSlice';
import authObj from './Appwrite/auth';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import AddPost from './pages/AddPost';


  
function App() {
  const dispatch = useDispatch();

  useEffect(() => {

    authObj.getuser().then((data) => {
      if (data) {
        console.log(data);
        dispatch(login(data ))
      } else {
        dispatch(logout())
      }
    })
  }, []);


  return (
    <>
      <Routes>
      <Route path="/" element={<Home />} ></Route>
      <Route path="/signup" element={<Signup />} ></Route>
      <Route path="/login" element={<Login />} ></Route>
      <Route path="/addpost" element={<AddPost />} ></Route>
        
      </Routes>
    </>
  );
}

export default App;
