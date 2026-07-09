import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    response: "",
    loading: false,
};


const workflowSlice = createSlice({

    name: "workflow",

    initialState,

    reducers: {

        setResponse: (state, action) => {
            state.response = action.payload;
        },


        setLoading: (state, action) => {
            state.loading = action.payload;
        }

    }

});


export const {setResponse, setLoading} = workflowSlice.actions;


export default workflowSlice.reducer;