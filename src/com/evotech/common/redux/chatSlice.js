import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    messages: [],
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage(state, action) {
            console.log("action: " + JSON.stringify(action.payload));
            state.messages.push(action.payload);
            console.log("state message:"+JSON.stringify(state.messages));
        },
    },
});

export const {addMessage} = chatSlice.actions;

export const selectMessages = state => state.chat.messages;

export default chatSlice.reducer;
