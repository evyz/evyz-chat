import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import {
  Routes,
  Route,
  useLocation,
  useNavigate
} from "react-router-dom";
import { AUTHORIZATION_ROUTE, PUBLIC_ROUTE } from './utils/routes';
import { observer } from 'mobx-react-lite'
import { Context } from '.';
import HeaderPublic from './components/Header/Public/HeaderPublic';
import { checkApi, meApi } from './http/userApi';
import HeaderAuth from './components/Header/Auth/HeaderAuth';
import { MAIN_ROUTE } from './consts/paths';

const AppRouter = observer(() => {
  const { user } = useContext(Context)

  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [notification, setNotification] = useState({})

  const wsHref = useRef("")

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (user.isAutoDark) {
      if (new Date().getHours() < 6 || new Date().getHours() > 20) {
        user.setIsDark(true)
      }
    }
  }, [])

  useEffect(() => {
    let token = localStorage.getItem('token')
    if (token) {
      checkApi().then(data => {
        localStorage.setItem('token', data.token)
        user.setIsAuth(true)
      }).then(() => {
        meApi().then(data => {
          user.setUser(data)
        })
      })
    } else {
      user.setIsAuth(false)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (user.isWellcome) {
      setTimeout(() => {
        user.setIsAuth(true)
        navigate(MAIN_ROUTE)
      }, 700)
      setTimeout(() => {
        user.setIsWellcome(false)
      }, 3100)
    }
  }, [user.isWellcome])

  useEffect(() => {
    if (user.isAuth) {
      wsHref.current = new WebSocket(`ws://localhost:7070/api/ws?authorization=${localStorage.getItem('token')}`)

      wsHref.current.onopen = () => console.log('Подключён')
      wsHref.current.onclose = () => console.log('Отключён')

      setTimeout(() => {
        wsHref.current.send(JSON.stringify({ type: "get:chats" }))
      }, 1000)

      user.setWs(wsHref)

      gettingData()
    }
  }, [user.isAuth, wsHref])

  const gettingData = useCallback(() => {
    if (!wsHref.current) return;

    wsHref.current.onmessage = e => {
      if (isPaused) return;
      const message = JSON.parse(e.data);
      if (message.type) {
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
    };
  }, [isPaused])

  if (isLoading) {
    return (
      <div >ЗАГРУЗКА</div>
    )
  }

  return (
    <div className={`${user.isAuth && 'AppRouter'} ${user.isDark ? 'bg-dark' : 'bg-ligth'} `}>

      {notification?.message &&
        <div className='App-notification' onClick={() => setNotification({})}>
          {notification?.linkTo === 'chat' && <h2>Новое сообщение из чата!</h2>}
          <span>{notification?.toId}</span>
          <h2>{notification?.message}</h2>

        </div>
      }

      {user.isWellcome &&
        <div className='Wellcome'>
          <h2>С возвращением, {user.getUser.nickname}</h2>
        </div>
      }

      {!user.isAuth ? <HeaderPublic /> : <HeaderAuth />}
      <Routes>
        {user.isAuth ? AUTHORIZATION_ROUTE.map(({ path, component }) =>
          <Route path={path} key={path} element={component} exact />
        ) :
          PUBLIC_ROUTE.map(({ path, component }) =>
            <Route path={path} key={path} element={component} exact />
          )}
      </Routes>
    </div>
  )
})

export default AppRouter