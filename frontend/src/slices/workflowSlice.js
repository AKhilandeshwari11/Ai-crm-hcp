import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: "",
    email: "",
    interaction_type: "",
    date: "",
    time: "",
    attendees: "",
    topics: "",
    samples: "",
    sentiment: "",
    outcomes: "",
    follow_up: "",
    response: null,
    loading: false
};

const workflowSlice = createSlice({
    name: "workflow",
    initialState,
    reducers: {
        updateForm: (state, action) => {
            const p = action.payload;
            if (p.name) state.name = p.name;
            if (p.email) state.email = p.email;
            if (p.interaction_type) state.interaction_type = p.interaction_type;
            if (p.date) state.date = p.date;
            if (p.time) state.time = p.time;
            if (p.attendees) state.attendees = p.attendees;
            if (p.topics) state.topics = p.topics;
            if (p.samples) state.samples = p.samples;
            if (p.sentiment) state.sentiment = p.sentiment;
            if (p.outcomes) state.outcomes = p.outcomes;
            if (p.follow_up) state.follow_up = p.follow_up;
        },
        clearForm: () => initialState,
        setResponse: (state, action) => { state.response = action.payload; },
        setLoading: (state, action) => { state.loading = action.payload; }
    }
});

export const { updateForm, clearForm, setResponse, setLoading } = workflowSlice.actions;
export default workflowSlice.reducer;
