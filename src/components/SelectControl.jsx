import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTasks } from "../redux/reducers/taskReducers";
import { toast } from "react-toastify";
import { useDeleteTasksManyMutation, useUpdateTaskManyMutation } from "../redux/apis/tasksApi";

export const formatDate=(newDate)=>{
    const yyyy = newDate.getFullYear();
    const mm = String(newDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(newDate.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
}
const SelectControl=({
    selectedTasks,
    checkAll,
    setCheckAll,
    refetchAllTasks
})=>{
    
    const [updateManyTasks]=useUpdateTaskManyMutation();
    const [deleteManyTasks]=useDeleteTasksManyMutation();

    const tasks=useSelector((state)=>state.task.tasks);
    const dispatch=useDispatch();
    const [status,setStatus]=useState("todo");
    const [priority,setPriority]=useState("low");
    useEffect(()=>{
        if(selectedTasks?.length){
            setStatus(selectedTasks?.[0]?.status);
            setPriority(selectedTasks[0]?.priority);
        }
    },[selectedTasks])
    
    const [date,setDate]=useState(formatDate(new Date(selectedTasks?.[0]?.dueDate) || new Date()));
    const today = new Date();

    const minDate = formatDate(new Date());

    const handleFieldChange=async(e,field,check)=>{
        try{
            const taskIds=selectedTasks?.map((eachTask)=>eachTask?.id);
            const updatedTasks=await updateManyTasks(JSON.stringify({
                taskIds,
                field
            }));
            refetchAllTasks();
            if(!check){
                toast.success(`All Selected Tasks ${field?.name} updated to ${field?.value}`);  
            }
        }catch(e){      
            toast.error("Error while Updating tasks");
        }
    }
    const handleDelete=async()=>{
        try{
            const taskIds=selectedTasks?.map((eachTask)=>eachTask?.id);
            await deleteManyTasks(JSON.stringify({taskIds}));
            refetchAllTasks();
            toast.success("Deleted Selected Tasks Successfully");
        }catch(e){
            toast.error("Something went wrong while deleting selected tasks. Try Again!");
        }
    }

    return (
        <div className="select-controller">
            <div >
                <button 
                    className="btn cancel"
                    onClick={(e)=>{
                        setCheckAll(false);
                        dispatch(setTasks(tasks?.map((eachTask)=>({...eachTask,checked:false}))));
                        handleFieldChange(e,{name:"checked",value:false},true);
                    }}
                >
                    <i class="pi pi-times"></i>
                </button>
            </div>
            <div  className="control">
                <label>No of Tasks :</label>
                <label>{selectedTasks?.length}</label>
                <label></label>
            </div>
            <div  className="control">
                <label>Status:</label>
                <select
                    value={status}
                    name="status"
                    className={`ms-2 select ${(status).toLowerCase()}`}
                    type="text"
                    onChange={(e)=>{
                        setStatus(e.target.value);
                        handleFieldChange(e,{name:"status",value:e.target.value});
                    }}
                    onBlur={(e)=>{}}
                >
                    <option 
                        value="todo" 
                        className="todo-option"
                    >
                        Todo
                    </option>
                    <option 
                        value="in-progress"
                        className="in-progress-option"
                    >
                        In-Progress
                    </option>
                    <option 
                        value="completed"
                        className="completed-option"
                    >
                        Completed
                    </option>
                </select>
            </div>
            
            <div  className="control">
                
                <label> Priority <i className={`pi pi-flag`}></i></label>
                <select
                    name="priority"
                    type="text"
                    className={`ms-2 ${(priority).toLowerCase()}-select select `}
                    onChange={(e)=>{
                        setPriority(e.target.value);
                        handleFieldChange(e,{name:"priority",value:e.target.value});
                    }}
                    value={priority}
                    onBlur={(e)=>{}}
                >
                    <option  
                        value="high"
                        className="high-select"
                    >
                            <i className={`pi pi-flag `}>High</i>
                            
                    </option>
                    <option    
                        value="medium"
                        className="medium-select"
                    >
                            <i className={`pi pi-flag`}>Medium</i>
                            
                    </option>
                    <option 
                        value="low"
                        className="low-select"
                    >
                            <i className={`pi pi-flag`}>Low</i>
                    </option>
                </select>
            </div>
            
            <div  className="control">
                <label>Due Date:</label>
                <input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    className="ms-2 dueDate"
                    min={minDate}
                    onChange={(e)=>{
                        setDate(e.target.value);
                        handleFieldChange(e,{name:"dueDate",value:e.target.value});
                    
                    }}
                    onBlur={(e)=>{}}
                    value={date}
                />
            </div>
            
            
            <div  className="control">
                <button 
                    title="delete" 
                    className="ms-5 btn btn-danger"
                    onClick={(e)=>{
                        handleDelete()
                    }}
                >
                    <i className="pi pi-trash"></i>
                </button>
            </div>
        </div>
    )
}
export default SelectControl;