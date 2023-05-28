import React, { useEffect, useRef, useState } from "react";
import { Cell, Row } from "../../widgets/markup/markup";
import Input from "../../widgets/inputs/input";
import Button from "../../widgets/buttons/button";

const Chat = ({ history, selectedId, messageToPush, setMessageToPush }) => {
  const [data, setData] = useState([]);
  const authorId = useRef(JSON.parse(localStorage.getItem("token")).name);

  const [message, setMessage] = useState("");
  const [chatInfo, setChatInfo] = useState({});

  const chatRef = useRef().current;

  useEffect(() => {
    setChatInfo({ title: selectedId?.name, isOnline: true });

    setData(history);
  }, [selectedId, setData, setChatInfo, history]);

  useEffect(() => {
    if (history && history.length > 0) {
      let arr = history.filter((item) => {
        if (item?.type === "chat_message") {
          if (selectedId.id === item?.chatId) {
            return true;
          }
          return false;
        }
        return false;
      });
      setData(arr);
    }
  }, [history]);

  const sendMessageHandler = () => {
    setMessageToPush({ message: message, to: selectedId?.id });
    setMessage("");
  };
  return (
    <Cell size={7} className={"auth_chat"}>
      <Cell size={"100%"}>
        <Row className={"j-between"}>
          <h1>{chatInfo?.title}</h1>
          <Cell size={4}>
            <Row className={"j-between"}>
              <Cell size={2}></Cell>
              <Button className={"bg-none"}>help</Button>
            </Row>
          </Cell>
        </Row>
      </Cell>
      <hr />
      <Cell
        ref={chatRef}
        refLogic={{ scrollToBottom: true }}
        enableRef={true}
        size={"100%"}
        className={"auth_list"}
      >
        {data && data.length > 0 ? (
          data.map(
            (item) =>
              item?.chatId === selectedId.id && (
                <Cell
                  className={
                    item?.authorId === authorId.current
                      ? "my_message"
                      : "another_message"
                  }
                  widgetId={item?.id}
                  size={6}
                >
                  {item?.message}
                  <span className='date'>
                    {new Date(item?.date).getFullYear()}-
                    {new Date(item?.date).getMonth()}-
                    {new Date(item?.date).getDate()}T
                    {new Date(item?.date).getHours()}:
                    {new Date(item?.date).getMinutes()}:
                    {new Date(item?.date).getSeconds()}
                  </span>
                </Cell>
              )
          )
        ) : (
          <h1>Not found messaged</h1>
        )}
      </Cell>
      <Cell size={"100%"}>
        <Row className={"a-center"}>
          <Cell size={8}>
            <Input value={message} setValue={setMessage} />
          </Cell>
          <Button
            deps={[message]}
            rulesToDeps={{ notNull: true }}
            onClick={sendMessageHandler}
          >
            Отправить
          </Button>
        </Row>
      </Cell>
    </Cell>
  );
};

export default Chat;
