import React, {useEffect, useState} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {format} from "date-fns";
import {useDispatch, useSelector} from 'react-redux';
import {addChatList, addMessage, selectChatMessage} from '../com/evotech/common/redux/chatSlice';
import uuid from "react-native-uuid";
import {UserChat} from "../com/evotech/common/redux/UserChat";
import {closeWebsocket, resetWebsocket} from "../com/evotech/common/websocket/SingletonWebSocketClient";

export default function ChatRoom({route}) {
    const {receiverName, receiverUserCode, orderStatus} = route.params;
    const [chatClient, setChatClient] = useState(null);
    const dispatch = useDispatch();
    const messages = useSelector(selectChatMessage);

    const initChatClient = async () => {
        console.log("initChatClient")
        const socketClient = await UserChat(false);
        setChatClient(socketClient);
        return socketClient;
    }
    useEffect(() => {
        initChatClient().then();
    }, [])

    async function onSend(newMessages = []) {
        try {
            const param = {
                receiverName: receiverName,
                receiverUserCode: receiverUserCode,
                message: newMessages[0].text,
                requestTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            };
            const message = {
                _id: uuid.v4(),
                userCode: receiverUserCode,
                text: newMessages[0].text,
                orderStatus: orderStatus,
                createdAt: param.requestTime,
                user: {
                    _id: 1,
                    name: receiverName,
                },
            };
            const chatList = {
                id: uuid.v4(),
                title: receiverName,
                message: message.text,
                userCode: receiverUserCode,
                time: param.requestTime,
                createdAt: new Date().getTime(), // 获取当前时间，用来判断3天删除本地对话
                unread: '',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWgelHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
            };
            // 连接被异常关闭
            if (!chatClient || !chatClient.client.connected) {
                console.log("websocket not init")
                //重新连接
                resetWebsocket();
              /*  chatClient.publish({destination: '/uniEase/v1/order/chat/ride', body: JSON.stringify(param)});
                dispatch(addMessage(message));
                dispatch(addChatList(chatList));
                return;*/
            }
            chatClient.publish({destination: '/uniEase/v1/order/chat/ride', body: JSON.stringify(param)});
            dispatch(addMessage(message));
            dispatch(addChatList(chatList));
        } catch (e) {
            alert(e.message);
        }
    }

    return (
        <GiftedChat
            messages={messages[receiverUserCode] || []}
            onSend={newMessages => onSend(newMessages)}
            user={{_id: 1}}
        />
    );
}
