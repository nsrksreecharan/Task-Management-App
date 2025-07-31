import { createSlice } from "@reduxjs/toolkit";
const taskReducers=createSlice({
    name:"task",
    initialState:{
        task:"",
        tasks:[],
    },
    reducers:{
        setTasks:(state,action)=>{
            state.tasks=action.payload;
        },
        addTask:(state,action)=>{
            state.tasks.push(action.payload);
        },
        deleteTask:(state,action)=>{
            const tasks=state.tasks;
            state.tasks=tasks.filter((eachTask)=>eachTask?.id!==action.payload);
        },
        clearTasks:(state,action)=>{
            state.tasks=[];
        },
        editTask:(state,action)=>{
            const tasks=state.tasks;
            state.tasks=tasks.map((eachTask)=>{
                if(eachTask?.id==action.payload.id){
                    return action.payload;
                }
                return eachTask;
            });
        },
    }
});
export const {addTask,deleteTask,editTask,setTasks,clearTasks}=taskReducers.actions;
export default taskReducers.reducer;