import {createSlice } from '@reduxjs/toolkit';

const initialState={
    currentUser:null,
    error:null,
    loading:false,
};

const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.loading=true;
        },
        signInSuccess:(state,action)=>{
            state.currentUser=action.payload;
            state.loading=false;
            state.error=null;
        },
        signInFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            // state.error=null;
        },
        updateUserStart:(state)=>{
            // state.currentUser=action.payload;
            state.loading=true;
            // state.error=null;
        },
        updateUserSuccess:(state,action)=>{
            state.currentUser=action.payload;
            state.loading=false;
            state.error=null;
        },
        updateUserFailure:(state,action)=>{
            // state.currentUser=action.payload;
            state.error=action.payload;
            state.loading=false;
        },
        deleteUserStart:(state)=>{
            // state.currentUser=action.payload;
            state.loading=true;
            // state.error=null;
        },
        deleteUserSuccess:(state)=>{
            state.currentUser=null;
            state.loading=false;
            state.error=null;
        },
        deleteUserFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },
        signOutUserStart:(state)=>{
            // state.currentUser=action.payload;
            state.loading=true;
            // state.error=null;
        },
        signOutUserSuccess:(state)=>{
            state.currentUser=null;
            state.loading=false;
            state.error=null;
        },
        signOutUserFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },
    }
});

export const {signInStart,signInSuccess,signInFailure,
    updateUserFailure,
    updateUserSuccess,
    updateUserStart,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutUserFailure,
    signOutUserStart,
    signOutUserSuccess,
}=userSlice.actions;
 
export default userSlice.reducer;