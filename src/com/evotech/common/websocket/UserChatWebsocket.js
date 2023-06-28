import {defaultHeaders} from "../http/HttpUtil";
import {defaultChatClient} from "./WebSocketClient";
import {getUserToken} from "../appUser/UserConstant";

let chatWebsocket = null;

export const userIniWebsocket = async (onConnect, onSubscribe) => {
    if (chatWebsocket && chatWebsocket.client.connected) {
        return chatWebsocket;
    }
    const token = defaultHeaders.getAuthentication(await getUserToken());
    chatWebsocket = defaultChatClient(token);
    chatWebsocket.connect((frame) => {
        onConnect(chatWebsocket, frame)
        chatWebsocket.subscribe('/user/topic/chat', (body) => {
            console.log("body"+body)

            onSubscribe(body)
        });
        const param = {
            ready: true,
        };
        chatWebsocket.publish({destination: '/uniEase/v1/order/chat/retry', body: JSON.stringify(param)});
    }, (onError) => {
        console.error("chat1 websocket error", onError);
        alert("websocket error")
    }, (onClose) => {
        console.log("chat1 websocket closed");
        alert("websocket closed")
    });
    return chatWebsocket;
};
