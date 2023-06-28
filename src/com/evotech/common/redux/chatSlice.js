import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    chatList: {},
    chatMessage: {}
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage(state, action) {
            const message = action.payload;
            if (state.chatMessage[message.userCode]) {
                state.chatMessage[message.userCode] = [message, ...state.chatMessage[message.userCode]];
            } else {
                state.chatMessage[message.userCode] = [message];
            }
        },
        addChatList(state, action) {
            const chat = action.payload
            state.chatList[chat.userCode] = chat;
        },
        initChatList(state, action) {
            state.chatList = action.payload;
            alert("init list"+ state.chatList)
        },
        initMessage(state, action) {
            state.chatMessage = action.payload;
            alert("init msg"+ state.chatMessage)
        },
        deleteChat(state, action) {
            const userCode = action.payload;
            delete state.chatList[userCode];
            delete state.chatMessage[userCode];
        },
    },
});

export const {addMessage,deleteChat,initMessage, addChatList,initChatList} = chatSlice.actions;

export const selectChatList = state => state.chat.chatList;
export const selectChatMessage = state => state.chat.chatMessage;

export default chatSlice.reducer;
