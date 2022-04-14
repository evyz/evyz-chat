import React, { useContext, useEffect, useRef, useState } from 'react'

import { observer } from 'mobx-react-lite'
import { Context } from '../../..';
import DialogHeader from './components/Header';

import dayjs from 'dayjs'
import 'dayjs/locale/ru'
dayjs.locale('ru')


const Dialog = observer(({ selectedChat, setSelectedChat }) => {

  const { user } = useContext(Context)

  const h2ref = useRef(null)

  const [data, setData] = useState([])
  const [myMessage, setMyMessage] = useState("")
  const [isWriting, setIsWriting] = useState({})

  const send = () => {
    if (myMessage.length > 0 && myMessage !== ' ') {
      user.ws.current.send(JSON.stringify({
        type: "send:message",
        params: {
          chatId: selectedChat.id,
          content: myMessage
        }
      }
      ))
      setMyMessage("")
    }
  }

  useEffect(() => {
    let arr = []
    user.currentChat.map(message => {
      arr.push(message)
    })
    setData(arr)
    h2ref.current.scrollTop = h2ref.current.scrollHeight
  }, [user.currentChat])

  useEffect(() => {
    if (user.isWriting.chatId === selectedChat) {
      setIsWriting(user.isWriting)
    }
  }, [user.isWriting])

  return (
    <div className='Dialog' onKeyDown={event => event.keyCode === 13 && send()} >
      <DialogHeader selected={selectedChat} setSelected={setSelectedChat} />

      <div id="Dialog-scroll" ref={h2ref} className='Dialog-scroll'>
        {data.map(msg =>
          <div key={msg.id} className={`Message ${msg.userId === user.getUser.id && "My-message"}`} >
            <div className='Message-row'>
              <h2>{msg.nickname}</h2>
            </div>
            <span>{msg.message}</span>
          </div>
        )}
      </div>

      <div className='Dialog-message'>
        {/* {<span>{isWriting.userId} печатает</span>} */}
        <input className='Dialog-my-message' placeholder='Сообщение' value={myMessage} onChange={e => setMyMessage(e.target.value)} />
        <button className='Dialog-send-message' onClick={() => send()}>send</button>
      </div>
    </div >
  )
})

export default Dialog;