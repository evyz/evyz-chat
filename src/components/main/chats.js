import React, { useEffect, useState } from "react";
import { Cell } from "../../widgets/markup/markup";
import Button from "../../widgets/buttons/button";

const Chats = ({
  selectedChat,
  setSelectedChat,
  setChatsPage,
  chats,
  connections,
}) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setChatsPage(page);
  }, [page]);

  useEffect(() => {
    setData(chats);
  }, [chats]);

  return (
    <Cell size={2}>
      {data && data.length > 0 ? (
        data.map((item) => (
          <Cell size={"100%"} style={{ position: "relative" }}>
            <Button
              customValidationToDisable={
                selectedChat?.id !== item?.id ? true : false
              }
              onClick={() => setSelectedChat && setSelectedChat(item)}
            >
              {item?.name}
            </Button>
            <div className='connections'>
              {connections &&
                connections?.length > 0 &&
                connections
                  .filter((connect) =>
                    connect?.room === item?.id ? true : false
                  )
                  .slice(0, 3)
                  .map((connect) => <span>{connect?.user.slice(0, 1)}</span>)}
            </div>
          </Cell>
        ))
      ) : (
        <h1>Not found chats!</h1>
      )}
    </Cell>
  );
};

export default Chats;
