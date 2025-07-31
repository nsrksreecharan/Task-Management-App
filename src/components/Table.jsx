import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask, editTask, setTasks } from "../redux/reducers/taskReducers";
import { useDeleteTaskByIdMutation, useUpdateTaskManyMutation } from "../redux/apis/tasksApi";
import { toast } from "react-toastify";

const Table=({
    setShowCreateTask,
    setSelectedTasks,
    setCheckAll,
    checkAll=false,
    isEdit,
    isView,
    setShowView,
    setShowEdit,
    refetchAllTasks
})=>{

    const dispatch=useDispatch();
    const tasks=useSelector((state)=>state.task.tasks);

    const [updateManyTasks]=useUpdateTaskManyMutation();
    const [deleteTaskById]=useDeleteTaskByIdMutation();
 
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 5;

    
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = [...tasks]?.slice(indexOfFirstTask, indexOfLastTask);

    const totalPages = Math.ceil((tasks?.length || 0) / tasksPerPage);
    const pages=[...Array(totalPages)];

    const handleDelete=async(e,eachTask)=>{
        try{
            const deletedStatus=await deleteTaskById(eachTask?.id);
            if(deletedStatus?.data?.message){
                dispatch(deleteTask(eachTask?.id));
                toast.success("Task Deleted Successfully");
            }
        }catch(e){ 
            toast.error("Error while Deleting Task.Try Again!");
        }
    };

    const handleCheckAll=async(e)=>{
        try{
            const taskIds=tasks?.map((eachTask)=>eachTask.id);
            const updatedTasks=await updateManyTasks({taskIds,field:{name:"checked",value:e.target.checked}});
            refetchAllTasks();
        }catch(e){
            console.error(e,"Error in check all");
        }
    }
     const handleCheck=async(e,eachTask)=>{
        try{
            const taskIds=[eachTask.id];
            const updatedTasks=await updateManyTasks({taskIds,field:{name:"checked",value:e.target.checked}});
            refetchAllTasks();
        }catch(e){
            console.error(e,"Error in check all");
        }
    }
    
    return (
        <>
            <div className="table-container">
                <table  className="">
                    <thead className="table-head">
                        <td  className="">
                            <input 
                                id="all-select"
                                name="all-select"
                                type="checkbox" 
                                checked={checkAll}
                                onChange={(e)=>{
                                    setCheckAll(e.target.checked);
                                    dispatch(setTasks(tasks?.map((eachTask)=>({...eachTask,checked:e.target.checked}))));
                                    handleCheckAll(e);
                                }}
                            />
                        </td >
                        <td  className="">Task</td>
                        <td  className="">Status</td>
                        <td  className="">Priority</td>
                        <td  className="">Created at</td>
                        <td  className="">Due date</td>
                        <td  className="m-0">Edit</td>
                        <td  className="m-0 p-0">View</td>
                        <td  className="m-0 p-0">Delete</td>
                    </thead>
                    <tbody>
                        { currentTasks?.length ? currentTasks?.map((eachTask,index)=>(
                            <tr key={`task-${index}`}>
                                <td className="">
                                    <input 
                                        id="checked"
                                        name="checked"
                                        type="checkbox"
                                        onChange={(e)=>{
                                            dispatch(editTask({...eachTask,checked:e.target.checked}));
                                            handleCheck(e,eachTask);
                                        }}
                                        checked={eachTask?.checked}
                                    />
                                </td>
                                <td  className="">
                                    <p title={eachTask?.task} className="task">{eachTask?.task}</p>
                                </td>
                                <td>
                                    <span className={`status-box ${eachTask?.status}`}>{eachTask?.status}</span>
                                </td>
                                <td  className="">
                                    <span title={eachTask?.priority}>
                                        <i className={`pi pi-flag ${eachTask?.priority}`}></i>    
                                    </span>
                                </td>
                                <td  className="">{eachTask?.createdAt}</td>
                                
                                <td  className="">{eachTask?.dueDate}</td>
                                
                                <td  className="">
                                    <button 
                                        className="btn text-primary"
                                        onClick={(e)=>{
                                            setShowEdit(eachTask)
                                        }}
                                    >
                                        <i className="pi pi-pencil"></i>
                                    </button>
                                </td>
                                <td  className="">
                                    <button 
                                        className="m-0 p-0 btn text-secondary"
                                        onClick={(e)=>{
                                            setShowView(eachTask)
                                        }}
                                    >
                                        <i className="pi pi-eye"></i>
                                    </button>
                                </td>
                                <td className="">
                                    <button 
                                        className="btn text-danger"
                                        onClick={(e)=>{
                                            handleDelete(e,eachTask);
                                        }}
                                    >
                                        <i className="pi pi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        )) :
                        <tr>
                            <td colSpan={9} className="text-center">No Data Found</td>
                        </tr>}
                    </tbody>
                </table>
            </div>
            <div className="create-button-container">
                <button
                    className="btn btn-primary"
                    onClick={(e)=>{
                        setShowCreateTask(true);
                    }}
                >
                    <i className="pi pi-plus pe-2"></i>
                    Create Task
                </button>
            </div>
            {pages?.length>1 ? 
                <div className="pagination">
                    <button
                        className="btn btn-secondary rounded-pill "
                        disabled={currentPage==1}
                        onClick={(e)=>{
                            setCurrentPage((prev)=> prev-1)
                        }}
                    >
                        <i className="pi pi-chevron-left"></i>
                    </button>
                    {pages?.map((_,index)=>{
                        return (
                            <button
                                className="btn pagenumber"
                                onClick={(e)=>{
                                    setCurrentPage(index+1)
                                }}
                            >
                                <span className={`${currentPage==index+1 ? "bold" : ""}`}>{index+1 }</span>
                            </button>
                        )
                    })}
                    <button
                        className="btn btn-secondary rounded-pill"
                        disabled={currentPage==totalPages}
                        onClick={(e)=>{
                            setCurrentPage((prev)=> prev+1)
                        }}
                    >
                        <i className="pi pi-chevron-right"></i>
                    </button>
                </div>
            :
                <></>
            }
            
        </>
        
    )
}
export default Table;