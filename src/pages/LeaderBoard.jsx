import { useEffect, useState } from "react";
import { useGetLeaderBoardQuery } from "../redux/apis/authApi";
import { useSelector } from "react-redux";

const LeaderBoard=()=>{

    const {data:stats,refetch:refetchLeaderBoard}=useGetLeaderBoardQuery();
    const [users,setUsers]=useState(stats?.leaderBoard);
    const user=useSelector((state)=>state.user.userInfo);

    useEffect(()=>{
        refetchLeaderBoard();
    },[])
    return(
        <>
            <div className="leaderboard">
                <h1 className="titleleaderboard">Leader Board</h1>
                <div className="leaderboard-container">
                    <table className="leaderboard-table">
                        <thead className="leaderboardHeading">
                            <th className="headth">S.No</th>
                            <th className="headth">Username</th>
                            <th className="headth">Total tasks Completed</th>
                        </thead>
                        <tbody className="leaderboardHeading">
                            {stats?.leaderBoard?.length ?
                                <>
                                    {stats?.leaderBoard?.map((eachUser,index)=>(<>
                                        <tr className="leaderboardRow" key={index}>
                                            <td className="leaderboardCell"> 
                                                {index+1}
                                                 {
                                                    index<3 ? <span className="badge"><i className="pi pi-star-fill text-warning"></i></span> :
                                                    ""
                                                } 
                                            </td>
                                            <td  className="leaderboardCell">
                                                {
                                                    index<3 ? <span className="winner"> {eachUser?.username}{eachUser?.username==user?.name ? "(You)" : ""}</span> :
                                                     <span className={`${eachUser?.username==user?.username ? "you" : ""}`}>{eachUser?.username}{eachUser?.username==user?.username ? "(You)" : ""}</span>
                                                }</td>
                                            <td  className="leaderboardCell">
                                                {
                                                    index<3 ? <span className="winner"> {eachUser?.completedTasks}</span> :
                                                     <span>{eachUser?.completedTasks}</span>
                                                }</td>
                                        </tr>
                                    </>))}
                                </>
                            :
                                <></>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
export default LeaderBoard;