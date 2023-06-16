import { Client } from "@stomp/stompjs";
import { defaultHeaders, httpPrefix } from "../http/HttpUtil";
import { getUserToken } from "../appUser/UserConstant";

const brokerURL = httpPrefix(true) + "/ws-sfc";

class WebSocketClient {
  constructor(headers, reconnectDelay, heartbeatIncoming, heartbeatOutgoing) {
    this.client = new Client({
      brokerURL: brokerURL,
      connectHeaders: headers,
      debug: function(params) {
        console.log(params);
      },
      reconnectDelay: reconnectDelay,
      heartbeatIncoming: heartbeatIncoming,
      heartbeatOutgoing: heartbeatOutgoing,
    });
    this.handlers = {};
    this.subscriptions = {};
  }

  connect() {
    if (this.client.connected) {
      return;
    }
    this.client.onConnect = (frame) => {
      console.log(frame);
      Object.keys(this.handlers).forEach(topic => {
        this.subscriptions[topic] = this.client.subscribe(topic, (message) => {
          this.handlers[topic].forEach((handler) => handler(message.body));
        });
      });
    };
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
  return new WebSocketClient(headers, 5000, 4000, 4000).client;
};

export const websocketClient = (headers, reconnectDelay, heartbeatIncoming, heartbeatOutgoing) => {
  return new WebSocketClient(headers, reconnectDelay, heartbeatIncoming, heartbeatOutgoing).client;
};


const token = await getUserToken();
const headers = defaultHeaders.getAuthentication(token);

const defaultClient = defaultWebsocketClient(headers);

export default defaultClient;
