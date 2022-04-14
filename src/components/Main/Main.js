import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../..'
import Chats from './Chats/Chats'
import Dialog from './Dialog/Dialog'
import NoneDialog from './Dialog/NoneDialog'
import './Main.css'

const Main = observer(() => {

  const { user } = useContext(Context)

  const [selectedChat, setSelectedChat] = useState({})

  useEffect(() => {

    if (selectedChat !== null) {
      if (selectedChat?.id > 0) {
        user.ws.current.send(
          JSON.stringify({
            type: "get:chat",
            params: {
              chatId: selectedChat.id,
              page: 1
            }
          })
        )
      }

      let arr = []
      user.currentChat.map(chat => {
        if (chat?.id === selectedChat.id) {
          arr.push(chat)
        }
      })
      user.setCurrentChat(arr)
    }

    user.setChat(selectedChat)
  }, [selectedChat, user.ws])

  useEffect(() => {
    if (selectedChat) {
      if (selectedChat?.id !== user.chat?.id) {
        setSelectedChat(user.chat)
      }
    } else {
      setSelectedChat(null)
    }
  }, [user.chat])

  return (
    <div className='Main' onKeyDown={e => e.keyCode === 27 && setSelectedChat(null)} tabIndex="0">
      <Chats selectedChat={selectedChat} setSelectedChat={setSelectedChat} />

      {selectedChat !== null
        ?
        <Dialog selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
        :
        <NoneDialog />
      }
    </div>
  )
})

export default Main