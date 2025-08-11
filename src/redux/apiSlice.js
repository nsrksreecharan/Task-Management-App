import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://task-management-with-auth.vercel.app/",
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = user?.data?.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithInterceptor = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    console.warn("Unauthorized. Logging out...");
    toast.warn("Unauthorized. Logging out...");
    localStorage.removeItem("user");
    setTimeout(() => {
      window.location.href = "#/login";
    }, 500);
  }

  return result;
};

export const securedApi = createApi({
  reducerPath: "securedApi",
  baseQuery: baseQueryWithInterceptor,
  tagTypes: ["Task"],
  endpoints: () => ({}),
});

export const apiSlice=createApi({
    reducerPath:"api",
    baseQuery:baseQueryWithInterceptor,
    tagTypes:['Task','User'],
    endpoints:()=>({}),
});
