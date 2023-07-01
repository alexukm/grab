import {Client} from "@stomp/stompjs";

export const defaultBrokerURL = "ws://34.143.189.188/uniEase/ws-sfc";

export const chatBrokerURL = "ws://34.143.189.188/uniEase/ws-chat";

class WebSocketClient {
    constructor(brokerURL,headers, reconnectDelay, heartbeatIncoming, heartbeatOutgoing) {
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

            this.subscribe('/user/topic/ping', (body) => {
                console.log(JSON.stringify(body))
            })

            setInterval(() => {
                this.publish({destination: '/uniEase/v1/heart/ping', body: JSON.stringify({message: 'ping'})})
            }, 60000);
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

    publish(params={}) {
        this.client.publish(params);
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
    return new WebSocketClient(defaultBrokerURL,headers, 0, 4000, 4000);
};

export const websocketClient = (brokerURL,headers, reconnectDelay, heartbeatIncoming, heartbeatOutgoing) => {
    return new WebSocketClient(brokerURL,headers, reconnectDelay, heartbeatIncoming, heartbeatOutgoing).client;
};


const defaultClient = (headers) => {
    return defaultWebsocketClient(headers);
}

export const defaultChatClient = (headers) => {
    return new WebSocketClient(chatBrokerURL,headers, 0, 60000, 60000);
}

export default defaultClient;
