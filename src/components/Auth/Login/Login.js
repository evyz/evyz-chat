import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../../..'
import './Login.css'

import useSound from 'use-sound'
import bubbleBoom from '../../../assets/sounds/bubble.mp3'

import Test from '../../../assets/content/test.png'
import Visible from '../../../assets/visible.svg'
import Unvisible from '../../../assets/unvisible.svg'

import { Carousel } from 'react-responsive-carousel'
import { useLocation, useNavigate } from 'react-router-dom'
import { MAIN_ROUTE, PRIVACY_ROUTE } from '../../../consts/paths'
import { loginApi, meApi, registerApi } from '../../../http/userApi'

const Login = observer(() => {

  const { user } = useContext(Context)

  const [play] = useSound(bubbleBoom, { volume: 0.1 })

  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [isSecurityPassword, setIsSecurityPassword] = useState(true)

  const [isAgree, setIsAgree] = useState(false)
  const [isLogin, setIsLogin] = useState(true)


  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname === '/registration') {
      setIsLogin(false)
    }
    if (location.pathname === '/login') {
      setIsLogin(true)
    }
  }, [location.pathname])

  useEffect(() => {
    play()
  }, [isSecurityPassword])


  const connect = async () => {
    if (isLogin) {
      try {
        await loginApi(nickname, password).then(data => {
          localStorage.setItem('token', data.token)
        }).then(async () => {
          await meApi().then(data => {
            user.setUser(data)
            user.setIsWellcome(true)
          })
        })
      } catch (e) {
        alert(e.response.data.message)
      }
    } else {
      try {
        await registerApi(nickname, password).then(async data => {
          await loginApi(nickname, password).then(data => {
            localStorage.setItem('token', data.token)
          }).then(async () => {
            await meApi().then(data => {
              user.setUser(data)
              user.setIsWellcome(true)
            })
          })
        })
      }
      catch (e) {
        alert(e.response.data.message)
      }
    }
  }

  return (
    <div className={`Auth bg-dark`}>
      <div className={`${!isLogin ? "Auth-block-reverse" : "Auth-block"} bg-ligth ${isLogin ? "Bounce-anim" : "Bounce-anim-rev"} `}>
        <div className={` ${!isLogin ? "Auth-content-reverse" : 'Auth-content'}`}>
          <img src={Test} alt={Test} />
        </div>
        <div className='Auth-form'>
          <h1 className='Auth-title'>{isLogin ? "Авторизация" : "Регистрация"}</h1>

          <div className={`Auth-input ${nickname.length >= 1 && 'Auth-input-active'}`}>
            <span className={nickname.length >= 1 ? 'Auth-label' : 'Auth-off-label'}>Nickname</span>
            <input placeholder='Укажите никнейм' value={nickname} onChange={e => setNickname(e.target.value)} />
          </div>
          <div className={`Auth-input ${password.length >= 1 && 'Auth-input-active'}`}>
            <span className={password.length >= 1 ? 'Auth-label' : 'Auth-off-label'}>Password</span>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type={isSecurityPassword ? "password" : 'text'}
              placeholder='Укажите пароль'
            />
            <button className='Auth-security' onClick={() => setIsSecurityPassword(!isSecurityPassword)}>
              <img src={isSecurityPassword ? Unvisible : Visible} alt={isSecurityPassword ? Unvisible : Visible} />
            </button>
          </div>

          {!isLogin &&
            <div className='Auth-privacy'>
              <input checked={isAgree} onChange={() => setIsAgree(!isAgree)} className='Auth-input-privacy' type="checkbox" />
              <span>Ознакомлен с <a onClick={() => localStorage.setItem('last_path', location.pathname)} href={PRIVACY_ROUTE}> политикой конфиденциальности</a></span>
            </div>
          }

          <button onClick={connect} className='Auth-button'>{isLogin ? "ВОЙТИ" : "ЗАРЕГИСТРИРОВАТЬСЯ"}</button>
        </div>
      </div>
    </div >
  )
})

export default Login