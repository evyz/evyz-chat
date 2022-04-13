import React, { useEffect } from 'react'

const AppWs = ({ message, user, notification, setNotification }) => {
  switch (message.type) {
    case "get:online":
      let arr = []
      user.users.map(user => arr.push(user))
      arr.push(message.user)
      user.setUsers(arr)
      break
    case "disconnect":
      let arr2 = []
      user.users.map(user => {
        if (user.id !== message.user.id) {
          arr2.push(user)
        }
      })
      user.setUsers(arr2)
      break
    case "get:chats":
      let arr3 = []
      user.chats.map(chat => {
        let status = false
        arr3.map(chatArr => {
          if (chat.id === chatArr.id) {
            status = true
          }
        })
        if (!status) {
          arr3.push(chat)
        }
      })
      arr3.push(message)
      user.setChats(arr3)
      break
    case "get:message":
      let arr5 = []
      let status = false
      if (user.currentChat.length > 0) {
        if (user.currentChat[0].id === message.id) {
          if (user.currentChat.length === 0) {
            arr5.push({
              id: message.id,
              message: message.message,
              nickname: message.nickname,
            })
          }
          user.currentChat.map(chat => {
            arr5.push(chat)
            if (chat.id === message.id) {
              status = true
            }
          })
          if (!status) {
            arr5.push({
              id: message.id,
              message: message.message,
              nickname: message.nickname,
              linkTo: "chat"
            })
          }
          if (message.id !== user.currentChat[0].id) {
            setNotification({
              id: message.id,
              message: message.message,
              nickname: message.nickname,
              linkTo: "chat"
            })
          }
        }
      } else {
        setNotification({
          id: message.id,
          message: message.message,
          nickname: message.nickname,
          linkTo: "chat"
        })
      }
      user.setCurrentChat(arr5)
      break
    case "get:chat":
      let arr4 = []
      user.currentChat.map(chat => {
        arr4.push(chat)
      })
      arr4.push({
        id: message.id,
        message: message.message,
        nickname: message.nickname,
      })
      user.setCurrentChat(arr4)
      break
    case "send:writing":
      user.setIsWriting({ userId: message.userId, chatId: message.chatId, date: new Date() })
      break
  }
}

export default AppWs;