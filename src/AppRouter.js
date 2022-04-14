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
import AppWs from './ws/AppWs';
import Warning from './components/Warning/Warning';

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
        wsHref.current.send(JSON.stringify({ type: "get:chats", params: { page: 1 } }))
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
        AppWs({ message, user, notification, setNotification })
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
      <Warning />
      {notification?.message &&
        <div
          className='App-notification'
          onClick={() => {
            if (notification?.linkTo === 'chat') {
              user.setChat({ id: notification.chatId })
              setTimeout(() => {
                setNotification({})
              }, 300)
            } else {
              setNotification({})
            }
          }}
        >
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