import { Dialog } from "primereact/dialog";
import { Formik } from "formik";
import * as yup from "yup";
import { useCreateTaskMutation } from "../redux/apis/tasksApi";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

const CreateTask=({
    showCreateTask,
    setShowCreateTask=()=>{},
    refetchAllTasks=()=>{}
})=>{
    const [postTask]=useCreateTaskMutation();
    const [maximize,setMaximize]=useState(false);

    const [initialValues,setInitialValues]=useState({
        task:"",
        status:"todo",
        dueDate:new Date().toISOString().split("T")[0],
        priority:"low",
        description:"",
    });

    const formRef=useRef(null);

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(today.getDate()).padStart(2, '0');

    const minDate = `${yyyy}-${mm}-${dd}`;

    const handleCreateTask=async(values)=>{
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
        const task=await postTask(payload);
        if(task?.data){
            toast.success("Task Create Successfully");
            setShowCreateTask(false);
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
                handleCreateTask(values);
            }}
        >
            {({ handleBlur,handleChange,handleSubmit,setFieldValue,errors,values,touched})=>{
                return(
                    <Dialog
                        header={()=>{
                            return(
                                <h1>Add Task</h1>
                            );
                        }}
                        className={`add-task-dlg`}
                        visible={showCreateTask}
                        onHide={(e)=>{
                                setShowCreateTask(false);
                        }}
                        position={"center"}
                        draggable={false}
                        dismissableMask={true}
                        closable={true}
                        maximized={maximize}
                    >
                        <div>
                            <div className="create-task-container">
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

                                    />
                                </div>
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
                                    />
                                </div>
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
                                        >
                                            <option  value="high" className="high-select">
                                                 <i className={`pi pi-flag `}>High</i>
                                                 
                                            </option>
                                            <option value="medium" className="medium-select">
                                                 <i className={`pi pi-flag`}>Medium</i>
                                                 
                                            </option>
                                            <option value="low" className="low-select">
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
                                        />
                                    </div>
                                </div>
                                
                            </div>
                            <div>
                                <div className="d-flex flex-row justify-content-center align-items-center mt-5 ">
                                    <button
                                        id="create"
                                        onClick={(e)=>{
                                            handleSubmit(values);
                                        }}
                                        className="btn btn-primary"
                                    >
                                        Create
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Dialog>
                );
            }}
        </Formik>
    )
}
export default CreateTask;