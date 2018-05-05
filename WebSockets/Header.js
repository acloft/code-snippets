import React from "react";
import NotificationsCenter from "./NotificationsCenter";
import { withRouter } from "react-router";
import UserChat from "./UserChatDropdown";
//...

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //...
      notifications: [],
      latestMessage: null
    };

    //...
    this.ws = new WebSocket("ws://localhost:7070");
    this.logNotification = this.logNotification.bind(this);
    this.dismissNotification = this.dismissNotification.bind(this);
    //...
    this.logUserChat = this.logUserChat.bind(this);
  }

  //...

  componentDidMount() {
    let that = this;
    //...

    var ws = this.ws;
    ws.onmessage = function(e) {
      let parsedMessage = JSON.parse(e.data);
      if (parsedMessage.notification) {
        that.logNotification(parsedMessage.notification);
      } else if (parsedMessage.userChat) {
        that.logUserChat(parsedMessage.userChat);
      }
    };
  }

  logNotification(notification) {
    if (!notification.createDate) {
      notification.createDate = new Date();
    }
    this.setState(prevState => {
      let notifications = [...prevState.notifications, notification];
      return { notifications };
    });
    //...
  }

  logUserChat(message) {
    this.setState({ latestMessage: message });
  }

  //...

  render() {
    //...

    return (
      <React.Fragment>
        {/* ... */}
        <NotificationsCenter
          onClick={this.markRead}
          onDismiss={this.dismissNotification}
          notifications={this.state.notifications}
          dismissAll={this.dismissAll}
        />

        <UserChat latestMessage={this.state.latestMessage} />
        {/* ... */}
      </React.Fragment>
    );
  }
}

export default withRouter(Header);
