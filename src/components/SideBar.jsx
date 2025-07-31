import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toggleTheme } from "../redux/reducers/userReducers";

const SideBar=()=>{
    const [collapse,setCollapse]=useState(true);
    const theme=useSelector((state)=>state.user.userInfo.theme);
    const dark=theme=="dark";
    const dispatch=useDispatch();
    return(
        <div className={`sidebar sidebar-${!collapse? "expanded" : "collapsed"} ${dark ? "dark" : ""}`}>
            <div>
                <button
                
                    className="btn menu"
                    onClick={(e)=>{
                        setCollapse(!collapse);
                    }}
                >
                    <i className={`pi pi-chevron-${!collapse ? "left":"right"}`}></i>
                </button>
            </div>
            <div>
                 <Link to="/"  className="link-btn">
                    <button
                        className={`btn menu ${!collapse ?"expanded-btn":""}`}
                        onClick={(e)=>{}}
                    >
                            <i className={`pi pi-home`}></i>
                            {!collapse ? <span className="menu-option">Home</span> : "" }
                    </button>
                 </Link>
                
            </div>
            <div>
                <Link to="/leaderboard" className="link-btn">
                    <button
                        className={`btn menu ${!collapse ?"expanded-btn":""}`}
                        onClick={(e)=>{}}
                    >
                        
                    
                            <i className={`pi pi-chart-line`}></i>
                            {!collapse ? <span className="menu-option">Leaderboard</span> : "" }
                            
                        
                    </button>
                </Link>
            </div>
            <div>
                <Link to="/profile"  className="link-btn">
                    <button
                        className={`btn menu ${!collapse ?"expanded-btn":""}`}
                        onClick={(e)=>{}}
                    >
                        
                    
                            <i className={`pi pi-cog`}></i>
                            {!collapse ? <span className="menu-option">Profile</span> : "" }
                            
                        
                    </button>
                </Link>
            </div>
            <div>
                <button
                    className={`btn menu ${!collapse ?"expanded-btn":""}`}
                    onClick={(e)=>{
                        dispatch(toggleTheme({theme:theme=="dark" ? "light" : "dark"}));
                        document.body.classList.toggle("dark");
                    }}
                >
                    
                    <i className={`pi ${theme=="dark" ? "pi-sun" : "pi-moon"}`}></i>
                    {!collapse ? <span className="menu-option">{theme=="dark" ? "Light" : "Dark"}</span> : "" }
                    
                </button>
            </div>
        </div>
    )
}
export default SideBar;