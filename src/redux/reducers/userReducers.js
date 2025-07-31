import { createSlice } from "@reduxjs/toolkit";

const initialUser={
    username:"",
    profileUrl:"",
    createdAt:"",
    theme:"light",
}
const userReducers=createSlice({
    name:"user",
    initialState:{
        userInfo:initialUser,
    },
    reducers:{
        addUser:(state,action)=>{
            const {name="",profileUrl="",email}=action.payload;
            state.userInfo={
                ...initialUser,
                username:name,
                profileUrl,
                email,
            };
        },
        toggleTheme:(state,action)=>{
            const {theme="dark"}=action.payload;
            state.userInfo.theme=theme;
        },
        deleteUser:(state,action)=>{
            state.userInfo=initialUser;
        }
    }
});

export const {addUser,deleteUser,toggleTheme}=userReducers.actions;
export default userReducers.reducer;