import React, { useEffect, useState } from "react";
import Wrapper from "../widgets/wrapper/wrapper";
import { Cell, Row } from "../widgets/markup/markup";
import Button from "../widgets/buttons/button";
import Chats from "../components/main/chats";
import Chat from "../components/main/chat";

const Main = ({
  page,
  setPage,
  data,
  message,
  setMessage,
  setChat,
  selectedChat,
  setSelectedChat,
  setChatsPage,
  chats,
  connections,
}) => {
  const buttons = [
    { id: 1, name: "Ч", route: "/", ico: null },
    { id: 2, name: "Н", route: "/settings", ico: null },
    { id: 3, name: "В", route: "/logout", ico: null },
  ];

  useEffect(() => {
    if (selectedChat) {
      setChat(selectedChat);
    }
  }, [selectedChat, setChat]);

  return (
    <Wrapper>
      <Row>
        <Cell size={1}>
          {buttons &&
            buttons.map((item) => (
              <Button
                onClick={() => setPage(item.route)}
                customValidationToDisable={page !== item.route ? true : false}
              >
                {item?.name}
              </Button>
            ))}
        </Cell>
        <Chats
          connections={connections}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          setChatsPage={setChatsPage}
          chats={chats}
        />
        {selectedChat && (
          <Chat
            connections={connections}
            messageToPush={message}
            setMessageToPush={setMessage}
            history={data}
            selectedId={selectedChat}
          />
        )}
      </Row>
    </Wrapper>
  );
};

export default Main;
