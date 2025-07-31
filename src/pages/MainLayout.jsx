import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";

const MainLayout=()=>{
    return (
        <div className="d-flex flex-row main-layout">
            <div className="d-flex flex-column justify-content-space-between">
                <SideBar/>
            </div>
            <div className="outlet">
                <Outlet/>
            </div>
        </div>
    )
}
export default MainLayout;