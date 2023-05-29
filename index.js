const express = require("express"),
  app = express(),
  expressWsInstance = require("express-ws")(app),
  uuid = require("uuid");
PORT = process.env.PORT || 3001;

app.use(express.json());

let subscribers = [],
  rooms = [
    { id: 1, name: "first", messages: [] },
    { id: 2, name: "second", messages: [] },
  ],
  users = [
    { name: "evyz", roomsIds: [1, 2] },
    { name: "viktor", roomsIds: [1, 2] },
  ],
  connections = [];

function generateMessage(obj) {
  if (typeof obj === "string") {
    obj = { message: obj };
  }
  return JSON.stringify({ ...obj });
}

function addNewSub(ws, req) {
  subscribers.push({
    subscriberId: ws.subscriberId,
    client: ws,
    name: req.query.name,
  });
}

app.ws("/", (ws, req) => {
  ws.subscriberId = uuid.v4();
  addNewSub(ws, req);
  ws.send(
    generateMessage({ message: "connected", subscriberId: ws.subscriberId })
  );
  ws.on("message", (msg) => {
    try {
      JSON.parse(msg);
    } catch (err) {
      return ws.send(generateMessage(err));
    }
    let { message, to, type, chatId, pagination } = JSON.parse(msg);
    type = type || "message";

    if (type === "my-chats") {
      let user = users.find((user) => user.name === req.query.name);
      if (!user) {
        return ws.send(
          generateMessage({ type, hasError: true, message: "USER_NOT_FOUND" })
        );
      }

      let limit = 40,
        page = pagination || 0,
        offset = limit * (page - 1);

      let ids = user.roomsIds.slice(offset, limit);

      let myRooms = [];

      for (let id of ids) {
        myRooms.push(rooms.find((room) => room.id === id));
      }

      return ws.send(generateMessage({ type, myRooms }));
    }
    if (type === "open-chat") {
      let room = rooms.find((room) => room.id === chatId);
      if (!room) {
        return ws.send(
          generateMessage({
            type: "open-chat",
            hasError: true,
            message: "NOT_FOUND_ROOM",
          })
        );
      }

      let connection = connections.findIndex(
        (check) => check.subscriberId === ws.subscriberId
      );
      if (connection === -1) {
        let obj = {
          subscriberId: ws.subscriberId,
          room: chatId,
          user: req.query.name,
        };
        connections.push(obj);
        let clientsFromRoom = connections.filter((connect) =>
          connect.room === chatId ? true : false
        );
        for (let client of clientsFromRoom) {
          let sub = subscribers.find(
            (sub) => sub.subscriberId === client.subscriberId
          );
          if (sub) {
            sub.client.send(
              generateMessage({
                type: "user-connected",
                user: req.query.name,
                subscriberId: ws.subscriberId,
                room: chatId,
              })
            );
          }
        }
      } else {
        let clientsFromRoom = connections.filter((connect) =>
          connect.room === connections[connection].room ? true : false
        );
        for (let client of clientsFromRoom) {
          let sub = subscribers.find(
            (sub) => sub.subscriberId === client.subscriberId
          );

          if (sub) {
            sub.client.send(
              generateMessage({
                type: "user-disconnected",
                user: connections[connection].user,
                subscriberId: connections[connection].subscriberId,
                room: connections[connection].room,
              })
            );
          }
        }
        let clientsFromNewRoom = connections.filter((connect) =>
          connect.room === chatId ? true : false
        );
        for (let client of clientsFromNewRoom) {
          let sub = subscribers.find(
            (sub) => sub.subscriberId === client.subscriberId
          );

          if (sub) {
            sub.client.send(
              generateMessage({
                type: "user-connected",
                user: connections[connection].user,
                subscriberId: connections[connection].subscriberId,
                room: chatId,
              })
            );
          }
        }
        connections[connection].room = chatId;
      }

      return ws.send(
        generateMessage({
          type,
          name: room.name,
          messages: room.messages.slice(0, 40),
        })
      );
    }
    if (type === "message") {
      let chat = rooms.find((room) => room.id === Number(to));
      let chatIndex = rooms.findIndex((room) => room.id === Number(to));
      let user = users.find((user) => user.name === req.query.name);

      let isHasChat = user.roomsIds.find((check) => check === chat.id);
      if (isHasChat) {
        let clients = [];
        for (let user of users) {
          let userRooms = user.roomsIds;
          if (userRooms.find((id) => id === Number(to))) {
            clients.push(user);
          }
        }
        rooms[chatIndex].messages.push({
          message,
          chatId: to,
          authorId: user.name,
          type: "chat_message",
          date: new Date(),
        });
        for (let client of clients) {
          subscribers.forEach((sub) => {
            if (sub.name === client.name) {
              return sub.client.send(
                generateMessage({
                  message,
                  chatId: to,
                  subscriberId: sub.id,
                  authorId: user.name,
                  type: "chat_message",
                  date: new Date(),
                })
              );
            }
          });
        }
      }
    }
  });
  ws.on("close", () => {});
});

app.post("/login", (req, res) => {
  const { name } = req.body;

  let index = users.find((user) => user.name === name);
  if (index > -1) {
    return res.json("wellcome!");
  }
  return res.status(403).json("Not found user");
});

const runServer = async () => {
  app.listen(PORT, () => {
    console.log("server started on " + PORT);
  });
};

runServer();
