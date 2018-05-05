const ws = require("ws");
//...

module.exports = {
  initialize: initialize,
  broadcast: broadcast,
  notificationsBroadcast: notificationsBroadcast,
  sendMessage: sendMessage
};

let websocket = null;
const users = {};

function initialize(wss) {
  websocket = wss;
  wss.broadcast = broadcast;
  wss.on("connection", function(ws, req) {
    if (req.headers.cookie) {
      let cookies = req.headers.cookie.split("; ");
      let userId = null;
   
      // ....
      
      users[userId] = ws;
    }
    ws.on("message", function(conversation) {
      //...
    });
    ws.on("error", function(err) {
      console.log("Found error: " + err);
    });
  });
}

function sendMessage(message) {
    //...
    
    let packagedChat = {
      userChat: message.text
    }
    recipient.send(JSON.stringify(packagedChat));
}

function broadcast(data) {
  websocket.clients.forEach(function each(client) {
    if (client.readyState === ws.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

function notificationsBroadcast(notifications) {
  for (let i = 0; i < notifications.length; i++) {
    if (users[notifications[i].userId]) {
      let client = users[notifications[i].userId];
      if (client.readyState === ws.OPEN) {
        let packagedNotification = {
          notification: notifications[i]
        }
        client.send(JSON.stringify(packagedNotification));
      }
    }
  }
}
