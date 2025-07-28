import { createSlice } from "@reduxjs/toolkit"
const storySlice=createSlice({
    name:"story",
    initialState:{
        storyData:[],
        storyList:[],
        currentUserStory:null,
        storyArrayData: [],

    },
    reducers:{
       setStoryData:(state,action)=>{
        state.storyData=action.payload
       } ,
         setStoryList:(state,action)=>{
        state.storyList=action.payload
       } 
       ,
        setCurrentUserStory:(state,action)=>{
        state.currentUserStory=action.payload
       } ,
       setStoryArrayData: (state, action) => {
    state.storyArrayData = action.payload;
},

    }

})

export const {setStoryData,setStoryList,setCurrentUserStory,setStoryArrayData}=storySlice.actions
export default storySlice.reducer
