import {useDispatch} from "react-redux";

import {addChatList, addMessage, initChatList, initMessage, selectChatList} from "./chatSlice";
import uuid from "react-native-uuid";
import {userIniWebsocket} from "../websocket/UserChatWebsocket";
import store from "./store";

import {getChatList, getChatMessages, setChatList, setChatMessages} from "../appUser/UserConstant";

export function UserChat(connect) {
    const dispatch = store.dispatch;
    const onConnect = (chatWebsocket, frame) => {
        connect(chatWebsocket, frame);
    }

    const buildChatMsg = (body) => {
        const receiveMsg = JSON.parse(body);
        const message = {
            _id: uuid.v4(),
            userCode: receiveMsg.senderUserCode,
            text: receiveMsg.message,
            createdAt: receiveMsg.requestTime,
            user: {
                _id: receiveMsg.senderUserCode,
                name: receiveMsg.senderName,
            },
        };

        const chatList = {
            id: uuid.v4(),
            title: receiveMsg.senderName,
            message: receiveMsg.message,
            time: receiveMsg.requestTime,
            userCode: receiveMsg.senderUserCode,
            unread: '',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWgelHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
        }

        // 添加聊天列表
        dispatch(addChatList(chatList));
        // 添加聊天信息
        dispatch(addMessage(message));
    }

    const onSubscribe = (body) => {
        buildChatMsg(body);
    }

    return userIniWebsocket(onConnect, onSubscribe)
        .then(r => {
            return r;
        });
}

export async function initLocalChat() {
    //加载本地聊天信息
    const chatList = await getChatList();

    if (!chatList) {
        return;
    }
    const dispatch = store.dispatch;
    dispatch(initChatList(chatList));

    const chatMessage = await getChatMessages()
    if (!chatMessage) {
        return;
    }
    dispatch(initMessage(chatMessage))
}

export async function saveLocalChat() {
    const chatList = store.getState().chat.chatList;
    if (!chatList) {
        return;
    }
    alert("保存聊天记录列表" + chatList);
    setChatList(chatList).then();
    const chatMessage = store.getState().chat.chatMessage;
    if (!chatMessage) {
        return;
    }
    setChatMessages(chatMessage).then();
}
