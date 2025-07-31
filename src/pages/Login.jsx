import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../redux/apis/authApi";
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { addUser } from "../redux/reducers/userReducers";
import { clearTasks } from "../redux/reducers/taskReducers";
const Login=()=>{

    const [login]=useLoginMutation();
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const handleSubmit=async()=>{
        if(!email || !password){
            return;
        }
        const payload={
            email,
            password
        };
        const user=await login(payload);
        if(user?.data){
            toast.success("User logged in Successfully");
            localStorage.setItem("user",JSON.stringify(user));
            dispatch(addUser(user?.data?.user));
            dispatch(clearTasks());
            setPassword("");
            setEmail("");
            navigate("/");
        }else if(user?.error?.status==404){
            toast.error(user?.error?.data?.message);
        }
    }
    return(
        <div className="login-container">
            
            <h1 className="title text-white">Login</h1>
            <form
                autoComplete="off"
                onSubmit={(e) => {
                    e.preventDefault(); 
                    handleSubmit();
                }}
                className="login-inputs-container"
            >
                    <div className="login-input-container">
                        <label className="input-label">Email</label>
                        <input
                            name="email"
                            id="email"
                            value={email}
                            type="email"
                            className="login-input"
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="login-input-container">
                        <label className="input-label">Password</label>
                        <input
                            name="password"
                            id="password"
                            value={password}
                            type="password"
                            className="login-input"
                            autoComplete="new-password" // avoid warning
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="login-input-container">
                        <button type="submit" className="btn btn-primary">
                            Login
                        </button>
                    </div>

                    <div>
                        <p>
                            Don't have an account yet? <Link to="/register">Register Now</Link>
                        </p>
                    </div>
            </form>
            
        </div>
    )
}
export default Login;