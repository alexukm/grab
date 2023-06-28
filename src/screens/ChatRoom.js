import React, {useEffect, useState} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {format} from "date-fns";
import {useDispatch, useSelector} from 'react-redux';
import {addChatList, addMessage, selectChatMessage} from '../com/evotech/common/redux/chatSlice';
import uuid from "react-native-uuid";
import {UserChat} from "../com/evotech/common/redux/UserChat";

export default function ChatRoom({route}) {
    const {receiverName, receiverUserCode} = route.params;
    const [chatClient, setChatClient] = useState(null);
    const dispatch = useDispatch();
    const messages = useSelector(selectChatMessage);

    useEffect(() => {
        async function initChatClient() {
            const socketClient = await UserChat((chatWebsocket, frame)=>{
                console.log("chat room init websocket successfully")
            });
            setChatClient(socketClient);
        }

        console.log("receiverUserCode:"+receiverUserCode)
        initChatClient().then();
    }, [])

    function onSend(newMessages = []) {
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
                unread: '',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWgelHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
            };
            if (chatClient) {
                chatClient.publish({destination: '/uniEase/v1/order/chat/ride', body: JSON.stringify(param)});
                dispatch(addMessage(message));
                dispatch(addChatList(chatList));
            } else {
                alert('chat1 websocket connected failed, please try again later!');
            }
        } catch (e) {
            alert(e.message);
        }
    }

    return (
        <GiftedChat
            messages={messages[receiverUserCode] || []}
            onSend={newMessages=> onSend(newMessages)}
            user={{_id: 1}}
        />
    );
}
