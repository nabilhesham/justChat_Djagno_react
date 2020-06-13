class WebsocketService {
  // to ensure we have a working connection
  static instance = null;

  callbacks = {};

  //   to ensure w have instance of the class
  static getInstance() {
    if (!WebsocketService.instance) {
      WebsocketService.instance = new WebsocketService();
    }
    return WebsocketService.instance;
  }

  constructor() {
    //   WebSocket property for the actions on websocket
    this.socketRef = null;
  }

  // WebSocket Connection handling
  connect(chatUrl) {
    // create a path for the websocket room
    const path = `ws://127.0.0.1:8000/ws/chat/${chatUrl}/`;
    this.socketRef = new WebSocket(path);

    // websocket actions
    this.socketRef.onopen = () => {
      console.log("websocket open");
    };
    // this.socketNewMessage(
    //   JSON.stringify({
    //     command: "fetch_messages",
    //   })
    // );
    this.socketRef.onmessage = (e) => {
      // sending the message
      this.socketNewMessage(e.data);
    };
    this.socketRef.onerror = (e) => {
      console.log(e.message);
    };
    this.socketRef.onclose = () => {
      console.log("websocket close");
      // reconnect to server
      this.connect();
    };
  }

  // handling the recived data
  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    const command = parsedData.command;

    // checking the commands
    if (Object.keys(this.callbacks).length === 0) {
      return;
    }
    if (command === "messages") {
      this.callbacks[command](parsedData.messages);
    }
    if (command === "new_message") {
      this.callbacks[command](parsedData.message);
    }
  }

  //   fetch messages
  fetchMessages(username, chatId) {
    this.sendMessage({
      command: "fetch_messages",
      username: username,
      chatId: chatId,
    });
  }

  //   new message
  newChatMessage(message) {
    this.sendMessage({
      command: "new_message",
      from: message.from,
      message: message.content,
    });
  }

  // add manual methids to the callbacks
  addCallbacks(messagesCallback, newMessageCallback) {
    (this.callbacks["messages"] = messagesCallback),
      (this.callbacks["new_message"] = newMessageCallback);
  }

  // send the messages ot the new message
  sendMessage(data) {
    try {
      this.socketRef.send(JSON.stringify({ ...data }));
    } catch (error) {
      console.log(error.message);
    }
  }

  //   returning the state of the socket connection
  state() {
    return this.socketRef.readyState;
  }

  // wait for the socket connection and test it
  waitForSocketConnection(callback) {
    const socket = this.socketRef;
    const recursion = this.waitForSocketConnection;
    setTimeout(function () {
      if (socket.readyState === 1) {
        console.log("Connection is Secure");
        if (callback != null) {
          callback();
        }
      } else {
        console.log("Waiting For Connection ...");
        recursion(callback);
      }
    }, 1);
  }
}

// create istance of the Websocket
const WebSocketInstance = WebsocketService.getInstance();

export default WebSocketInstance;
