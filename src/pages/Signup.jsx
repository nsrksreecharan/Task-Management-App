import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../redux/apis/authApi";
import { toast } from 'react-toastify';

const Signup=()=>{
    const navigate=useNavigate();
    const [register]=useRegisterMutation();
    const [name,setName]=useState();
    const [password,setPassword]=useState();
    const [email,setEmail]=useState();

    const handleRegister=async()=>{
        const payload={
            name,
            password,
            email
        };
        const user=await register(payload);
        if(user.data){
            localStorage.setItem("user",JSON.stringify(user));
            toast.success("User Registered Successfully Login now");
            navigate("/login");
        }else if(user?.error){
            toast.error(user?.error?.data?.message);
        }

    }
    return (
        <div className="login-container">
            <h1 className="title text-white">Signup</h1>
            
            <form autoComplete="off" 
                onSubmit={(e)=>{
                    e.preventDefault();
                    handleRegister(e)
                }} 
                className="login-inputs-container"
            >
                    <div className="login-input-container">
                        <label className="input-label">Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            value={name}
                            className="login-input"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="login-input-container">
                        <label className="input-label">Email</label>
                        <input
                            id="email"
                            name="email"
                            autoComplete="email"
                            type="email"
                            className="login-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="login-input-container">
                        <label className="input-label">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            className="login-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="login-input-container d-flex flex-row align-items-center">
                        <div>
                            <button
                                id="register"
                                className="btn btn-primary"
                                type="submit"
                                disabled={!name || !password || !email}
                            >
                                Register
                            </button>
                        </div>
                    </div>
                    <div>
                        <p>Already have an account? <Link to="/login">Sign in</Link></p>
                    </div>
            </form>
          
        </div>
    )
}
export default Signup;