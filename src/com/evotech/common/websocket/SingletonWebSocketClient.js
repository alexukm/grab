import {defaultHeaders} from "../http/HttpUtil";
import {getUserToken} from "../appUser/UserConstant";
import defaultClient from "./WebSocketClient";

let socketClient;

export const defaultSocketClient = async (whenExist) => {
    if (!socketClient) {
        const token = defaultHeaders.getAuthentication(await getUserToken());
        socketClient = defaultClient(token)
        whenExist(socketClient);
    }
    return socketClient;
};


const buildDefaultSocketClient = async (whenExist) => {
    if (!socketClient) {
        const token = defaultHeaders.getAuthentication(await getUserToken());
        socketClient = defaultClient(token)
        whenExist(socketClient);
    }
    return socketClient;
};

export const socketConnect = async (onConnect) => {
    return defaultSocketClient(client => {
        client.connect((frame) => {
            onConnect(client, frame)
        }, (onError) => {
            console.error("chat websocket error", onError);
        }, (onClose) => {
            console.log("chat websocket closed", onClose);
            client.client.forceDisconnect();
        });
    })
}

export const closeWebsocket = () => {
    if (socketClient) {
        socketClient.disconnect();
    }
}
export const resetWebsocket = () => {
    if (!socketClient.client.connected && !this.shouldClosed) {
        //重新创建连接
        socketClient.connect();
    }
}
