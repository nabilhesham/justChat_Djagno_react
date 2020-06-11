import React from "react";

import Sidepanel from "./Sidepanel/Sidepanel";

import WebSocketInstance from "../websocket";

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.waitForSocketConnection(() => {
      // add the callbacks to websocket.js
      WebSocketInstance.addCallbacks(
        this.setMessages.bind(this),
        this.newMessage.bind(this)
      );
      // call the fetch messages from websocket.js
      WebSocketInstance.fetchMessages(this.props.currentUser);
    });
  }

  // check the socket connection
  waitForSocketConnection(callback) {
    const component = this;
    setTimeout(function () {
      if (WebSocketInstance.state() === 1) {
        console.log("Connection is Secure");
        callback();
      } else {
        console.log("Waiting For Connection ...");
        component.waitForSocketConnection(callback);
      }
    }, 100);
  }

  // get the old messages from the chat
  setMessages(messages) {
    this.setState({ messages: messages.reverse() });
  }

  // add the new message to the chat
  newMessage(message) {
    this.setState({ messages: [...this.state.messages, message] });
  }

  // submitting the form
  sendMessageHandler = (e) => {
    e.preventDefault();
    const messageObject = {
      from: "nabil",
      content: this.state.message,
    };
    WebSocketInstance.newChatMessage(messageObject);
    this.setState({ message: "" });
  };

  // typing in the input
  messageChangeHandler = (e) => {
    this.setState({ message: e.target.value });
  };

  // Convert The Time
  convertMessageTimestamp(timestamp) {
    let newTimestamp = Math.round(
      (new Date().getTime() - new Date(timestamp).getTime()) / 1000
    );

    // check if a day or hours or Minutes
    if (newTimestamp >= 86400) {
      newTimestamp = Math.round(newTimestamp / 86400) + " Days ";
    } else if (newTimestamp >= 3600) {
      newTimestamp = Math.round(newTimestamp / 3600) + " Hours ";
    } else if (newTimestamp >= 60) {
      newTimestamp = Math.round(newTimestamp / 60) + " Minutes ";
    } else {
      newTimestamp = newTimestamp + " Seconds ";
    }
    return newTimestamp;
  }

  // render the li tag with the messages
  renderMessages(messages) {
    const currentUser = "nabil";
    return messages.map((message) => (
      <li
        key={message.id}
        className={message.author === currentUser ? "sent" : "replies"}
      >
        <img src="http://emilcarlsson.se/assets/mikeross.png" />
        <p>
          {message.content}
          <br />
          <small style={{ fontSize: "8pt", color: "black" }}>
            {this.convertMessageTimestamp(message.timestamp)} ago
          </small>
        </p>
      </li>
    ));
  }

  render() {
    const messages = this.state.messages;
    return (
      <div id="frame">
        <Sidepanel />
        <div className="content">
          <div className="contact-profile">
            <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
            <p>username</p>
            <div className="social-media">
              <i className="fa fa-facebook" aria-hidden="true"></i>
              <i className="fa fa-twitter" aria-hidden="true"></i>
              <i className="fa fa-instagram" aria-hidden="true"></i>
            </div>
          </div>
          <div className="messages">
            <ul id="chat-log">
              {/* <li className="sent">
                            <img src="http://emilcarlsson.se/assets/mikeross.png" alt="" />
                            <p>How the hell am I supposed to get a jury to believe you when I am not even sure that I do?!</p>
                        </li>
                        <li className="replies">
                            <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
                            <p>When you're backed against the wall, break the god damn thing down.</p>
                        </li>  */}
              {messages && this.renderMessages(messages)}
            </ul>
          </div>
          <div className="message-input">
            <form onSubmit={this.sendMessageHandler}>
              <div className="wrap">
                <input
                  id="chat-message-input"
                  type="text"
                  placeholder="Write your message..."
                  onChange={this.messageChangeHandler}
                  value={this.state.message}
                />
                <i
                  className="fa fa-paperclip attachment"
                  aria-hidden="true"
                ></i>
                <button id="chat-message-submit" className="submit">
                  <i className="fa fa-paper-plane" aria-hidden="true"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Chat;
