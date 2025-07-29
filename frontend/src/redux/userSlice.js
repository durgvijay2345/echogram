// // redux/userSlice.js
// import { createSlice } from "@reduxjs/toolkit";
// const userSlice = createSlice({
//   name: "user",
//   initialState: {
//     userData: null,
//     suggestedUsers: null,
//     profileData: null,
//     following: [],
//     searchData: null,
//     notificationData: [],
//     loading: true,
    
//   },
//   reducers: {
//     setUserData: (state, action) => {
//       state.userData = action.payload;
//       state.loading = false;
//     },
//     clearUserData: (state) => {
//       state.userData = null;
//       state.loading = false;
//     },
//     setSuggestedUsers: (state, action) => {
//       state.suggestedUsers = action.payload;
//     },
//     setProfileData: (state, action) => {
//       state.profileData = action.payload;
//     },
//     setSearchData: (state, action) => {
//       state.searchData = action.payload;
//     },
//     setNotificationData: (state, action) => {
//       state.notificationData = action.payload;
//     },
//     setFollowing: (state, action) => {
//       state.following = action.payload;
//     },
//     toggleFollow: (state, action) => {
//       const targetUserId = action.payload;
//       if (state.following.includes(targetUserId)) {
//         state.following = state.following.filter(id => id !== targetUserId);
//       } else {
//         state.following.push(targetUserId);
//       }
//     },
  
//   }
// });

// export const {
//   setUserData,
//   clearUserData,
//   setSuggestedUsers,
//   setProfileData,
//   toggleFollow,
//   setFollowing,
//   setSearchData,
//   setNotificationData,
 
// } = userSlice.actions;

// export default userSlice.reducer;


import { createSlice } from "@reduxjs/toolkit"
const userSlice=createSlice({
    name:"user",
    initialState: {
    userData: null,
    suggestedUsers: null,
    profileData: null,
    following: null,  
    searchData: null,
    notificationData: []
},

    reducers:{
       setUserData:(state,action)=>{
        state.userData=action.payload
       } ,
       setSuggestedUsers:(state,action)=>{
        state.suggestedUsers=action.payload
       } ,
       setProfileData:(state,action)=>{
        state.profileData=action.payload
       } ,
       setSearchData:(state,action)=>{
        state.searchData=action.payload
       },
        setNotificationData:(state,action)=>{
        state.notificationData=action.payload
       },
       setFollowing:(state,action)=>{
        state.following=action.payload
       },
       toggleFollow:(state,action)=>{
        const targetUserId=action.payload
if(state.following.includes(targetUserId)){
    state.following=state.following.filter(id=>id!=targetUserId)
}else{
    state.following.push(targetUserId)
}
       }
    }

})

export const {setUserData,setSuggestedUsers,setProfileData,toggleFollow,setFollowing,setSearchData,setNotificationData}=userSlice.actions
export default userSlice.reducer
