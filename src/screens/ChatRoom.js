import React, { useEffect, useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { format } from "date-fns";
import { defaultHeaders } from "../com/evotech/common/http/HttpUtil";
import { getUserToken } from "../com/evotech/common/appUser/UserConstant";
import { defaultChatClient } from "../com/evotech/common/websocket/WebSocketClient";
import uuid from 'react-native-uuid';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, selectMessages } from '../com/evotech/common/redux/chatSlice';  // Make sure to replace with your actual path to chatSlice

export default function ChatRoom({ route }) {
    const { startName, responseUserCode, context } = route.params;
    const [chatClient, setChatClient] = useState(null);
    const dispatch = useDispatch();

    const messages = useSelector(selectMessages);

    const responseMsgHandler = (repBody) => {
        const message = {
            _id: uuid.v4(),
            text: repBody.message,
            createdAt: repBody.requestTime,
            user: {
                _id: uuid.v4(),
                userCode: repBody.requestUserCode,
                name: repBody.startName,
            },
        };
        // dispatch(addMessage(message));
    };
    const message = [{
        _id: uuid.v4(),
        text: '123',
        createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        user: {
            _id: uuid.v4(),
            userCode: '123',
            name: '123',
        },
    }];
    // dispatch(addMessage(message));
   /* useEffect(() => {
        const iniWebsocket = async () => {
            const token = defaultHeaders.getAuthentication(await getUserToken());
            const chatWebsocket = defaultChatClient(token);
            chatWebsocket.connect((frame) => {
                console.log("chat1 websocket connected");
                setChatClient(chatWebsocket);
                chatWebsocket.subscribe('/user/topic/chat', (body) => {
                    responseMsgHandler(JSON.parse(body));
                });
                const param = {
                    ready: true,
                };
                chatWebsocket.publish({ destination: '/uniEase/v1/order/chat/retry', body: JSON.stringify(param) });
            }, (onError) => {
                console.error("chat1 websocket error", onError);
            }, (onClose) => {
                console.log("chat1 websocket closed");
            });
        };
        iniWebsocket().then();
    }, []);*/

    function onSend(newMessages = []) {
        try {
            const param = {
                startName: startName,
                responseUserCode: responseUserCode,
                message: newMessages[0].text,
                requestTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            };
            if (chatClient) {
                console.log(param);
                // chatClient.publish({ destination: '/uniEase/v1/order/chat/ride', body: JSON.stringify(param) });
                // dispatch(addMessage(newMessages[0]));
            } else {
                alert('chat1 websocket connected failed, please try again later!');
            }

            const message = {
                _id: uuid.v4(),
                text: newMessages[0].text,
                createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                user: {
                    _id: uuid.v4(),
                    userCode: '123',
                    name: '123',
                },
            }

            dispatch(addMessage(message));
        } catch (e) {
            alert(e.message);
        }
    }

    return (
        <GiftedChat
            messages={messages}
            onSend={newMessages => onSend(newMessages)}
            // user={{ _id: 1 }}
        />
    );
}
