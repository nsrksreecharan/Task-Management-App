import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";

export const userApiSlice=createApi({
    reducerPath:"authApi",
    baseQuery:fetchBaseQuery({
        baseUrl:"https://task-management-with-auth.vercel.app/",
        prepareHeaders:(headers)=>{
            
            headers.set("Content-Type", "application/json");

            return headers;
        },
    }),
    tagTypes:['Task','User'],
    endpoints:()=>({}),
});
