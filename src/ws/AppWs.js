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
          if (chat === chatArr) {
            status = true
          }
        })
        if (!status) {
          arr3.push(chat)
        }
      })
      arr3.push(message.id)
      user.setChats(arr3)
      break
    case "get:message":
      let arr5 = []
      let status = false
      if (user.currentChat.length > 0) {
        if (user.currentChat[0].chatId === message.chatId) {
          if (user.currentChat.length === 0) {
            arr5.push({
              id: message.id,
              message: message.message,
              date: message.date,
              userId: message.userId,
              chatId: message.chatId,
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
              date: message.date,
              userId: message.userId,
              chatId: message.chatId,
              linkTo: "chat"
            })
          }
          if (message.chatId !== user.currentChat[0].chatId) {
            setNotification({
              id: message.id,
              message: message.message,
              date: message.date,
              toId: message.chatId,
              linkTo: "chat"
            })
          }
        }
      } else {
        setNotification({
          id: message.id,
          message: message.message,
          date: message.date,
          toId: message.chatId,
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
        date: message.date,
        userId: message.userId,
        chatId: message.chatId,
      })
      user.setCurrentChat(arr4)
      break
    case "send:writing":
      user.setIsWriting({ userId: message.userId, chatId: message.chatId, date: new Date() })
      break
  }
}

export default AppWs;