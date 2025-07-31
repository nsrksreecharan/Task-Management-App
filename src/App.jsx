import './App.css'
import {
  createHashRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import Profile from './pages/Profile';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import Signup from './pages/Signup';
import Login from './pages/Login';
import MainLayout from './pages/MainLayout';
import { Provider } from 'react-redux';
import store from './redux/store';
import LeaderBoard from './pages/LeaderBoard';


const router=createHashRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Signup/>}/>
      <Route element={<ProtectedRoute/>}>
        <Route element={<MainLayout/>}>
          <Route index element={<Home/>}/>
          <Route path="/leaderboard" element={<LeaderBoard/>}/>
          <Route path="/profile" element={<Profile/>}/>
        </Route>
      </Route>
    </Route>
  )
)
const App=()=>{
  return (
    <Provider store={store}>
      <ToastContainer position="bottom-left" autoClose={3000} />
      <RouterProvider router={router}/>
    </Provider>
  )
}

export default App;
