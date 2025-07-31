import { Dialog } from "primereact/dialog";
import { Formik } from "formik";
import * as yup from "yup";
import { useCreateTaskMutation, useUpdateTaskByIdMutation } from "../redux/apis/tasksApi";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const EditTask=({
    showCreateTask,
    setShowCreateTask=()=>{},
    refetchAllTasks=()=>{},
    isEdit=false,
    isView=false,
    setShowView=()=>{},
    setShowEdit=()=>{}
})=>{
    const [updateTask]=useUpdateTaskByIdMutation();
    const [maximize,setMaximize]=useState(false);

    const [initialValues,setInitialValues]=useState({
        id:"",
        task:"",
        status:"",
        dueDate:"",
        priority:"",
        description:"",
    });

    

    const formRef=useRef(null);

    useEffect(()=>{
        if(isEdit?.id){
            formRef?.current?.setValues({
                ...isEdit,
                dueDate:isEdit?.originalDueDate,
            })
        }
        if(isView?.id){
            formRef?.current?.setValues({
                ...isView,
                dueDate:isView?.originalDueDate,
            })
        }
    },[isEdit,isView])

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(today.getDate()).padStart(2, '0');

    const minDate = `${yyyy}-${mm}-${dd}`;

    const handleUpdateTask=async(values)=>{
        // task:{type:String,require:true},
        // status:{},
        // priority:{},
        // dueDate:Date,
        const payload={
            task:values?.task,
            status:(values?.status)?.toLowerCase(),
            priority:(values?.priority)?.toLowerCase(),
            dueDate:new Date(values?.dueDate|| ""),
            description:values?.description,
            checked:values?.checked,
        };
        const task=await updateTask({id:isEdit?.id,task:JSON.stringify(payload)});
        if(task?.data){
            toast.success("Task Edited Successfully");
            setShowEdit(null);
            refetchAllTasks();
        }else if(task?.error?.data){
            toast.error(task?.error?.data?.message);
        }
    }
    return(
        <Formik
            enableReinitialize={true}
            validateOnChange={true}
            initialValues={initialValues}
            innerRef={formRef}
            onSubmit={(values)=>{
                handleUpdateTask(values);
            }}
        >
            {({ handleBlur,handleChange,handleSubmit,setFieldValue,errors,values,touched})=>{
                return(
                    <Dialog
                        header={()=>{
                            return(
                                isView ? <h3>View Task</h3> :
                                <h1>Edit Task</h1>
                            );
                        }}
                        className={`add-task-dlg  max-dlg`}
                        visible={showCreateTask}
                        onHide={(e)=>{
                            if(isView || isEdit){
                                if(isView){
                                    setShowView(null);
                                }
                                if(isEdit){
                                    setShowEdit(null);
                                }
                            }
                            else{
                                setShowCreateTask(false);
                            }
                        }}
                        position={"right"}
                        draggable={false}
                        dismissableMask={true}
                        closable={true}
                        maximized={maximize}
                    >
                        <div>
                            <div className="create-task-container">
                                {isView ?
                                    <div className="task-title-input">
                                        <label className="task-title">Task</label>
                                        <h1>{isView?.task}</h1>
                                    </div>
                                : 
                                    <div className="task-title-input">
                                        {/* <label className="task-title">Task</label> */}
                                        <input 
                                            id="task"
                                            name={"task"}
                                            className="task-input"
                                            placeholder="Task Name"
                                            type="text"
                                            onChange={(e)=>{
                                                setFieldValue("task",e.target.value);
                                            }}
                                            onBlur={handleBlur}
                                            value={values?.task}
                                            disabled={isView}

                                        />
                                    </div>
                                }
                                {isView ?
                                
                                    <div className="mt-3 task-description-input">
                                        <lable>Description</lable>
                                        <p className="description">{values?.description || "--"}</p>
                                    </div> 
                                :
                                    <div className="task-description-input">
                                        {/* <lable>Description</lable> */}
                                        <textarea
                                            id="description"
                                            name={"description"}
                                            className="description"
                                            type="text"
                                            placeholder="Add Description"
                                            onChange={(e)=>{
                                                setFieldValue("description",e.target.value);
                                            }}
                                            rows="5" 
                                            cols="40"
                                            value={values?.description}
                                            disabled={isView}
                                        />
                                    </div> 
                                }
                                <div className="create-task-inputs">
                                    <div className="input-container">
                                        <label>Status</label>
                                        <select
                                            name="status"
                                            className={`select ${(values?.status).toLowerCase()}`}
                                            type="text"
                                            onChange={(e)=>{
                                                setFieldValue("status",e.target.value);
                                            }}
                                            value={values?.status}
                                            disabled={isView}
                                        >
                                            <option value="todo" className="todo-option">Todo</option>
                                            <option value="in-progress" className="in-progress-option">In-Progress</option>
                                            <option value="completed" className="completed-option">Completed</option>
                                        </select>
                                    </div>
                                    <div className="input-container">
                                        <label>Priority <i className={`pi pi-flag `}></i></label>
                                        <select
                                            name="priority"
                                            type="text"
                                            className={`${(values?.priority).toLowerCase()}-select select `}
                                            onChange={(e)=>{
                                                setFieldValue("priority",e.target.value);
                                            }}
                                            value={values?.priority}
                                            disabled={isView}
                                        >
                                            <option  className="high-select">
                                                 <i className={`pi pi-flag `}>High</i>
                                                 
                                            </option>
                                            <option className="medium-select">
                                                 <i className={`pi pi-flag`}>Medium</i>
                                                 
                                            </option>
                                            <option className="low-select">
                                                 <i className={`pi pi-flag`}>Low</i>
                                            </option>
                                        </select>
                                    </div>
                                    <div className="input-container">
                                        <label>Due Date</label>
                                        <input
                                            id="dueDate"
                                            name="dueDate"
                                            type="date"
                                            className="dueDate"
                                            min={minDate}
                                            value={values?.dueDate}
                                            onChange={(e)=>{
                                                setFieldValue("dueDate",e.target.value);
                                            }}
                                            disabled={isView}
                                        />
                                    </div>
                                </div>
                                
                            </div>
                            {!isView ? 
                                <div>
                                    <div className="d-flex flex-row justify-content-center align-items-center mt-5 ">
                                        <button
                                            id="create"
                                            onClick={(e)=>{
                                                handleSubmit(values);
                                            }}
                                            className="btn btn-primary"
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>
                            : <></>}
                            
                        </div>
                    </Dialog>
                );
            }}
        </Formik>
    )
}
export default EditTask;