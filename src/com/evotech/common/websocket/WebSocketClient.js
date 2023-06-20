import {Client} from "@stomp/stompjs";


const brokerURL = "ws://192.168.49.128:8080/uniEase/ws-sfc";

class WebSocketClient {
    constructor(headers, reconnectDelay, heartbeatIncoming, heartbeatOutgoing) {
        this.client = new Client({
            brokerURL: brokerURL,
            connectHeaders: headers,
            debug: function (params) {
                console.log(params);
            },
            reconnectDelay: reconnectDelay,
            heartbeatIncoming: heartbeatIncoming,
            heartbeatOutgoing: heartbeatOutgoing,
        });
        this.handlers = {};
        this.subscriptions = {};
    }

    connect(onConnect, onError, onClose) {
        if (this.client.connected) {
            return;
        }

        this.client.onConnect = (frame) => {
            Object.keys(this.handlers).forEach(topic => {
                this.subscriptions[topic] = this.client.subscribe(topic, (message) => {
                    this.handlers[topic].forEach((handler) => handler(message.body));
                });
            });
            if (onConnect) {
                onConnect(frame);
            }
        };
        this.client.onWebSocketError = (frame) => {
            if (onError) {
                onError(frame)
            }
        };
        this.client.onWebSocketClose = (frame) => {
            if (onClose) {
                onClose(frame)
            }
        };
        this.client.activate();
    }

    subscribe(topic, handler) {
        // 不存在当前topic的handlers
        if (!this.handlers[topic]) {
            this.handlers[topic] = [];
        }
        // 如果不存在当前的handler 新增
        if (!this.handlers[topic].includes(handler)) {
            this.handlers[topic].push(handler);
        }

        //没有被订阅过
        if (!this.subscriptions[topic]) {
            // 进行订阅
            this.subscriptions[topic] = this.client.subscribe(topic, (message) => {
                this.handlers[topic].forEach((handler) => handler(message.body));
            });
        }

        return () => {
            //取消订阅
            this.subscriptions[topic].unsubscribe();
            // 订阅记录
            delete this.subscriptions[topic];
            //清理handler
            this.handlers[topic] = this.handlers[topic].filter((h) => h !== handler);
        };

    }

    disconnect() {
        Object.values(this.subscriptions).forEach(subscription => {
            subscription.unsubscribe();
        });
        this.client.deactivate().then(r => {
            console.log("close websocket client" + r);
        });
    }
}

export const defaultWebsocketClient = (headers) => {
    return new WebSocketClient(headers, 0, 4000, 4000);
};

export const websocketClient = (headers, reconnectDelay, heartbeatIncoming, heartbeatOutgoing) => {
    return new WebSocketClient(headers, reconnectDelay, heartbeatIncoming, heartbeatOutgoing).client;
};


const defaultClient = (headers) => {
    return defaultWebsocketClient(headers);
}

export default defaultClient;
