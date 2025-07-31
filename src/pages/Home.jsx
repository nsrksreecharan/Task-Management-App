import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateTask from "../components/CreateTask";
import { useGetAllTasksQuery } from "../redux/apis/tasksApi";
import { setTasks } from "../redux/reducers/taskReducers";
import Table from "../components/Table";
import SelectControl from "../components/SelectControl";
import EditTask from "../components/EditTask";

const Home=()=>{
    const dispatch=useDispatch();
    const user=useSelector((state)=> state.user.userInfo);
    const tasks=useSelector((state)=>state.task.tasks);
    
    const [showCreateTask,setShowCreateTask]=useState(false);
    const {data:allTasks,refetch:refetchAllTasks}=useGetAllTasksQuery({});
    const [checkAll,setCheckAll]=useState(false);
    const [showEdit,setShowEdit]=useState(null);
    const [showView,setShowView]=useState(null);

    useEffect(()=>{
        refetchAllTasks();
    },[user])

    useEffect(()=>{
        if(tasks?.length){
            setCheckAll(tasks?.every((eachTask)=> eachTask?.checked))
        }
    },[tasks]);


    useEffect(()=>{
        if(allTasks?.tasks?.length){
            const formattedTask=allTasks?.tasks?.map((eachTask)=>{
                const formatter={
                    year: "numeric",
                    month: "short",  // or "long" or "2-digit"
                    day: "2-digit",
                };
                
                const today=new Date().toLocaleDateString("en-IN", formatter);
                const yesterday = new Date(Date.now() -  (24 * 60 * 60 * 1000)).toLocaleDateString("en-IN", formatter);
                const tomorrow = new Date(Date.now() +  (24 * 60 * 60 * 1000)).toLocaleDateString("en-IN", formatter);
                
                const createdAt=new Date(eachTask?.createdAt).toLocaleDateString("en-IN", formatter);
                const dueDate = new Date(eachTask?.dueDate).toLocaleDateString("en-IN", formatter);
                const dueDateOriginal = new Date(eachTask?.dueDate).toISOString().split("T")[0];
                const dates={
                    createdAt,
                    dueDate,
                }
                if(createdAt==yesterday){
                    dates.createdAt="Yesterday";
                }else if(createdAt==today){
                    dates.createdAt="Today";
                }else if(createdAt==tomorrow){
                    dates.createdAt="Tomorrow";
                }

                if(dueDate==yesterday){
                    dates.dueDate="Yesterday";
                }else if(dueDate==today){
                    dates.dueDate="Today";
                }else if(dueDate==tomorrow){
                    dates.dueDate="Tomorrow";
                }
                
                return {
                    task:eachTask?.task,
                    createdAt:dates?.createdAt,
                    dueDate:dueDate==today ? "Today" : dueDate,
                    originalDueDate:dueDateOriginal,
                    priority:eachTask?.priority,
                    status:eachTask?.status,
                    checked:eachTask?.checked,
                    description:eachTask?.description,
                    id:eachTask?._id,
                }
            });
            dispatch(setTasks(formattedTask));
            setCheckAll(formattedTask?.every((eachTask)=> eachTask?.checked))
        }
    },[allTasks]);

    
    const selectedTasks=useMemo(()=>tasks?.filter((eachTask)=>eachTask?.checked),[tasks]);
    return (
        <>
            <div>
                <h1 className="title">Task Management</h1>
                <Table
                    setShowCreateTask={setShowCreateTask}
                    selectedTasks={selectedTasks}
                    checkAll={checkAll}
                    setCheckAll={setCheckAll}
                    isEdit={showEdit}
                    isView={showView}
                    setShowView={setShowView}
                    setShowEdit={setShowEdit}
                    refetchAllTasks={refetchAllTasks}
                />
                
            </div>
            <CreateTask
                showCreateTask={showCreateTask}
                setShowCreateTask={setShowCreateTask}
                refetchAllTasks={refetchAllTasks}
            />

            {showEdit||showView ? 
                <EditTask
                    showCreateTask={showEdit || showView}
                    refetchAllTasks={refetchAllTasks}
                    isEdit={showEdit}
                    isView={showView}
                    setShowView={setShowView}
                    setShowEdit={setShowEdit}
                /> 
            : <></>}
            {selectedTasks?.length ?
                <>
                    <SelectControl
                        selectedTasks={selectedTasks}
                        checkAll={checkAll}
                        setCheckAll={setCheckAll}
                        refetchAllTasks={refetchAllTasks}
                    />
                </> : <></>
            }
        </>
    )
}
export default Home;
