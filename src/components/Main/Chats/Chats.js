import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../../..'

const Chats = observer(({ selectedChat, setSelectedChat }) => {

  const { user } = useContext(Context)

  const [chats, setChats] = useState([])

  useEffect(() => {
    if (user.chats) {
      if (user.chats.length > 0) {
        let arr = []
        user.chats.map(chat => {
          let status = false
          arr.map(chatArr => {
            if (chat === chatArr) {
              status = true
            }
          })
          if (!status) {
            arr.push(chat)
          }
        })
        setChats(arr)
      }
    }
  }, [user.chats])

  return (
    <div className='Chats'>
      {chats.map(chat =>
        <div className={`Chat ${selectedChat.id === chat.id && 'Active-Chat'}`} key={chat.id} onClick={() => setSelectedChat(chat)}>
          <div className='Chat-icon'></div>
          <h2 className='Chat-title'>{chat.title}</h2>
        </div>
      )}
    </div>
  )
})

export default Chats