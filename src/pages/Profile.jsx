import { useEffect, useState } from "react";
import { useGetUserInfoQuery, useGetUserStatsQuery } from "../redux/apis/tasksApi";
import { Chart } from 'primereact/chart';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "../redux/reducers/userReducers";
import { clearTasks, deleteTask } from "../redux/reducers/taskReducers";

const Profile=()=>{
    const navigate = useNavigate();
    const dispatch=useDispatch();
    const {data:stats,refetch:reftechUserData}=useGetUserStatsQuery();
    const {data:userInfo,refetch:refetchUserInfo}=useGetUserInfoQuery();
    const user=useSelector((state)=> state.user.userInfo);
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const theme=useSelector((state)=>state.user.userInfo.theme);
    const isDark=theme=="dark";

    useEffect(() => {
        if(stats?.stats?.length){
             const colorCode={
                todo: isDark ?  'rgba(233, 236, 227, 0.64)':'rgba(212, 219, 201, 0.2)',
                "in-progress": isDark ? 'rgba(0, 170, 255, 0.57)' :  'rgba(0, 170, 255, 0.2)',
                completed: isDark ? 'rgba(34, 253, 0, 0.53)' : 'rgba(34, 253, 0, 0.2)',
            };
            const borderCode={
                todo: isDark ? 'rgba(214, 212, 212, 0.97)': 'rgba(154, 154, 154, 0.84)',
                "in-progress":isDark ? 'rgba(87, 180, 226, 0.89)' : 'rgba(0, 78, 117, 0.75)',
                completed: isDark ?  'rgba(127, 255, 108, 0.84)' : 'rgba(18, 137, 0, 0.86)',
            }
            const data = {
                labels: [...stats.stats.map(eachStat => eachStat.status.toUpperCase()),"",""],
                datasets: [{
                    label: 'Tasks',
                    data: stats.stats.map(eachStat => eachStat.count),
                    backgroundColor: stats.stats.map(eachStat => colorCode[eachStat.status]),
                    borderColor: stats.stats.map(eachStat => borderCode[eachStat.status]),
                    borderWidth: isDark ? 2 : 1,
                }]
            };
            const options = {
                scales: {
                    y: {
                        beginAtZero: true,
                         max: 10, 
                         ticks: {
                            stepSize: 1,
                            color: isDark ? '#444' : '#ccc', 
                        },
                        grid: {
                            display: true, 
                            color: isDark ? '#444' : '#ccc',
                        },
                    },
                    
                    x: {
                        min: 0,
                        max: 10,
                        ticks: {
                            autoSkip: false,         
                            maxRotation: 0,          
                            minRotation: 0,
                            color: isDark ? '#ffffff' : '#000000', 
                        },
                        grid: {
                            // display: true, 
                            color: isDark ? '#444' : '#ccc', 
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false ,
                    }
                },
                backgroundColor: isDark ? '#000' : '#fff',
            };

            setChartData(data);
            setChartOptions(options);
        }
    }, [stats,isDark]);

    useEffect(()=>{
        reftechUserData();
        refetchUserInfo();
    },[]);
    return(
        <div className="profile-container">
            <h1 className="title">Profile</h1>
            <div class="userinfo-container">
                <div className="user-info-cell">
                    <label className="user-head">Username</label>
                    <p>{user?.username || userInfo?.userInfo?.[0]?.username}</p>
                </div>
                <div className="user-info-cell">
                    <label className="user-head">Email</label>
                    <p>{user?.email ||userInfo?.userInfo?.[0]?.email}</p>
                </div>
                <div className="user-info-cell">   
                    <label className="user-head">Tasks</label>
                    <p>{userInfo?.userInfo?.[0]?.totalTasks || 0}</p>
                </div>
                <div className="user-info-cell">
                    <button 
                        className="btn btn-danger text-white"
                        onClick={(e)=>{
                            localStorage.removeItem("user");
                            dispatch(deleteUser());
                            dispatch(clearTasks());
                            window.location.href="#/login";
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
            <div className="graph-container">
                <p className="text-center fw-bold">All Tasks Summary</p>
                <Chart className="graph" type="bar" data={chartData} options={chartOptions} />
            </div>
        </div>
    )
}
export default Profile;