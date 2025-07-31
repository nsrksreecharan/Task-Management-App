import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";

export const userApiSlice=createApi({
    reducerPath:"authApi",
    baseQuery:fetchBaseQuery({
        baseUrl:"https://task-management-with-auth-bk5rjlm17-nsrksreecharans-projects.vercel.app/",
        prepareHeaders:(headers)=>{
            
            headers.set("Content-Type", "application/json");

            const user=JSON.parse(localStorage.getItem("user")|| "{}");
            
            const token = user?.data?.token;
            if(token){
                headers.set("authorization",`Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes:['Task','User'],
    endpoints:()=>({}),
});
