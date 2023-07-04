import {socketConnect} from "./SingletonWebSocketClient";


export const userInitChatWebsocket = async (onConnect,needRetry) => {
    return socketConnect((client, frame) => {
    }).then(socket => {
        onConnect(socket);
        const param = {
            ready: true,
        };
        if (needRetry) {
            socket.publish({destination: '/uniEase/v1/order/chat/retry', body: JSON.stringify(param)});
        }
        return socket;
    })
};

export const userOrderWebsocket = async (subscribe) => {
    return socketConnect((client, frame) => {
        client.subscribe('/user/topic/orderAccept', (body) => {
            // todo  调用系统通知
            subscribe(body);
            alert("Your order accepted")
        })
        return client;
    });
};

/*export const DriverRefreshOrder = async (onSubscribe) => {
    return socketConnect((client, frame) => {
    }).then(data => {
       return  data.subscribe('/topic/refreshOrder', (body) => {
            onSubscribe(body)
        });
    });
}*/
