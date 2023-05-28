import { useCallback, useEffect, useRef, useState } from "react";
import Auth from "./pages/Auth";
import "./widgets/index.css";
import Main from "./pages/Main";
import NotFound from "./pages/NotFound";
import FullSizeLoader from "./widgets/loaders/fullSizeLoader";
import uuidv4 from "./utils/uuid";
import { Cell } from "./widgets/markup/markup";
import Button from "./widgets/buttons/button";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState("/");
  const [isAuth, setIsAuth] = useState(false);

  const [isWsLoading, setIsWsLoading] = useState(false);

  const [isPaused, setIsPaused] = useState(false);
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("");
  const ws = useRef(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatsPage, setChatsPage] = useState(1);
  const [chats, setChats] = useState([]);

  const [connections, setConnections] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    let token = localStorage.getItem("token");
    if (page === "/logout") {
      setIsLoading(true);
      setIsAuth(false);
      localStorage.removeItem("token");
      setPage("/auth");
      setIsLoading(false);
    }
    if (page === "/" || page === "/settings") {
      if (!token) {
        setPage("/auth");
      } else {
        setIsAuth(true);
      }
    }
    setIsLoading(false);
  }, [page]);

  useEffect(() => {
    if (isAuth) {
      setIsWsLoading(true);

      setTimeout(() => setIsWsLoading(false), 300);
    }
  }, [isAuth]);

  useEffect(() => {
    let token = JSON.parse(localStorage.getItem("token"));
    if (!isPaused && isAuth && token?.name) {
      ws.current = new WebSocket(
        "ws://localhost:3001" + "?name=" + (token?.name ? token?.name : "test")
      );
      ws.current.onopen = () => {
        setStatus("Соединение открыто");
        setIsWsLoading(false);
      };
      ws.current.onclose = () => {
        setStatus("Соединение закрыто");
        setIsPaused(true);
      };

      gettingData();
    }

    setIsWsLoading(false);
    return () => ws.current?.close();
  }, [ws, isPaused, isAuth]);

  useEffect(() => {
    if (isPaused) {
      setIsWsLoading(true);
      setIsPaused(false);
    }
  }, [isPaused]);

  const gettingData = useCallback(() => {
    if (!ws.current) return;
    ws.current.onmessage = (e) => {
      if (isPaused) return;
      const message = JSON.parse(e.data);
      if (message?.type === "open-chat") {
        if (message?.hasError) {
          alert(message?.message);
          setIsWsLoading(false);
          return;
        }
        setData((prev) => [...prev, ...message?.messages]);
        setIsWsLoading(false);
      }
      if (message?.type === "my-chats") {
        if (!message?.hasError) {
          setChats(message?.myRooms);
          setIsWsLoading(false);
        }
      }
      if (message?.type === "user-connected") {
        // setConnections()
        let arr = connections;

        let index = arr.findIndex(
          (item) => item.subscriberId === message?.subscriberId
        );
        if (index > -1) {
          arr[index] = message;
        } else {
          arr.push(message);
        }
        setConnections(arr);
      }
      setData((prev) => [...prev, message]);
    };
  }, [isPaused]);

  useEffect(() => {
    if (message) {
      ws.current?.send(JSON.stringify(message));
      setMessage(null);
    }
  }, [message]);

  useEffect(() => {
    if (chat?.id && !isPaused) {
      setData([]);
      setIsWsLoading(true);
      setTimeout(() => {
        ws.current?.send(
          JSON.stringify({ type: "open-chat", chatId: chat?.id })
        );
      }, 100);
    }
  }, [chat]);

  useEffect(() => {
    if (data && data.length) {
      let { name } = JSON.parse(localStorage.getItem("token"));
      let message = data[data.length - 1];
      if (
        chat?.id &&
        chat?.id !== message?.chatId &&
        message?.authorId !== name &&
        message?.type === "chat_message"
      ) {
        setNotification({
          type: "NEW_MESSAGE",
          message: message?.message,
          authorId: message?.authorId,
          chatId: message?.chatId,
          date: message?.date,
        });
      }
    }
  }, [data]);

  useEffect(() => {
    if (chatsPage > 0) {
      setIsWsLoading(true);
      setTimeout(() => {
        ws.current?.send(
          JSON.stringify({ type: "my-chats", pagination: chatsPage })
        );
      }, 100);
    }
  }, [chatsPage]);

  if (isLoading) {
    return <div>загрузка...</div>;
  }

  console.log("connections =->", connections);

  return (
    <div>
      {notification !== null && (
        <Cell
          size={3}
          className={`${notification !== null && "message_notification"}`}
          onClick={(e) => {
            setSelectedChat({
              id: notification?.chatId,
              name: "viktor",
              message: notification?.message,
            });
            setNotification(null);
          }}
        >
          <h3>{notification?.message}</h3>
          <span className='date'>
            {new Date(notification?.date).getFullYear()}-
            {new Date(notification?.date).getMonth()}-
            {new Date(notification?.date).getDate()}T
            {new Date(notification?.date).getHours()}:
            {new Date(notification?.date).getMinutes()}:
            {new Date(notification?.date).getSeconds()}
          </span>
          <author>{notification?.authorId}</author>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setNotification(null);
            }}
          >
            Закрыть
          </Button>
        </Cell>
      )}
      <FullSizeLoader
        value={isWsLoading && page !== "/auth"}
        label={"Инициализация сообщений"}
      />
      {page === "/auth" && <Auth setPage={setPage} />}
      {page === "/" && (
        <Main
          connections={connections}
          message={message}
          setMessage={setMessage}
          data={data}
          page={page}
          setPage={setPage}
          setChat={setChat}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          setChatsPage={setChatsPage}
          chats={chats}
        />
      )}
      {page !== "/auth" && page !== "/" && (
        <NotFound page={page} setPage={setPage} />
      )}
    </div>
  );
}

export default App;
