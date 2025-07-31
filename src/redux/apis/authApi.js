import { apiSlice } from "../apiSlice";
import { userApiSlice } from "../userApiSlice";

const authApi=userApiSlice.injectEndpoints({
    endpoints:(builder)=>({
        register:builder.mutation({
            query:(userData)=>({
                url:"/user/register",
                method:"POST",
                body:userData,
            })
        }),
        login:builder.mutation({
            query:(userData)=>({
                url:"/user/login",
                method:"POST",
                body:userData,
            })
        }),
        getLeaderBoard:builder.query({
            query:()=>({
                url:"/user/leaderboard",
                method:"GET",
            }),
            validateTags:["Task"],
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useGetLeaderBoardQuery
}=authApi;