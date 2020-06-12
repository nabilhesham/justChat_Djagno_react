import React from "react";
import { connect } from "react-redux";

// import Sidepanel from "./Sidepanel/Sidepanel";

import Hoc from "../hoc/hoc";

import WebSocketInstance from "../websocket";

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { message: "" };

    this.waitForSocketConnection(() => {
      // add the callbacks to websocket.js
      WebSocketInstance.addCallbacks(
        this.setMessages.bind(this),
        this.addMessage.bind(this)
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
  addMessage(message) {
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
  renderTimestamp = (timestamp) => {
    let prefix = "";
    const timeDiff = Math.round(
      (new Date().getTime() - new Date(timestamp).getTime()) / 60000
    );
    if (timeDiff < 1) {
      // less than one minute ago
      prefix = "just now...";
    } else if (timeDiff < 60 && timeDiff > 1) {
      // less than sixty minutes ago
      prefix = `${timeDiff} minutes ago`;
    } else if (timeDiff < 24 * 60 && timeDiff > 60) {
      // less than 24 hours ago
      prefix = `${Math.round(timeDiff / 60)} hours ago`;
    } else if (timeDiff < 31 * 24 * 60 && timeDiff > 24 * 60) {
      // less than 7 days ago
      prefix = `${Math.round(timeDiff / (60 * 24))} days ago`;
    } else {
      prefix = `${new Date(timestamp)}`;
    }
    return prefix;
  };

  // render the li tag with the messages
  renderMessages(messages) {
    const currentUser = this.props.username;
    return messages.map((message, i, arr) => (
      <li
        key={message.id}
        style={{ marginBottom: arr.length - 1 === i ? "300px" : "15px" }}
        className={message.author === currentUser ? "sent" : "replies"}
      >
        <img src="http://emilcarlsson.se/assets/mikeross.png" />
        <p>
          {message.content}
          <br />
          <small style={{ fontSize: "8pt", color: "black" }}>
            {this.renderTimestamp(message.timestamp)}
          </small>
        </p>
      </li>
    ));
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    const messages = this.state.messages;
    return (
      <Hoc>
        <div className="messages">
          <ul id="chat-log">
            {messages && this.renderMessages(messages)}
            {/* Auto Scrolling */}
            <div
              style={{ float: "left", clear: "both" }}
              ref={(el) => {
                this.messagesEnd = el;
              }}
            ></div>
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
              <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
              <button id="chat-message-submit" className="submit">
                <i className="fa fa-paper-plane" aria-hidden="true"></i>
              </button>
            </div>
          </form>
        </div>
      </Hoc>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.username,
  };
};

export default connect(mapStateToProps)(Chat);
