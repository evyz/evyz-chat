import { observer } from 'mobx-react-lite'
import React, { useContext, useState } from 'react'
import { Context } from '../../..'
import { LOGOUT_ROUTE, MAIN_ROUTE, SETTING_ROUTE } from '../../../consts/paths'

import './HeaderAuth.css'

import Main from '../../../assets/header/Main.svg'
import Setting from '../../../assets/header/Setting.svg'
import Logout from '../../../assets/header/Logout.svg'

import Nigth from '../../../assets/night-mode/nigth.svg'
import Sunday from '../../../assets/night-mode/sun.svg'

import { useLocation, useNavigate } from 'react-router-dom'
import useSound from 'use-sound'

import Bubble from '../../../assets/sounds/bubble.mp3'

const HeaderAuth = observer(() => {

  const location = useLocation()
  const navigate = useNavigate()

  const [isLogout, setIsLogout] = useState(false)

  const icons = [
    { title: "Main", from: Main, path: MAIN_ROUTE },
    { title: "Setting", from: Setting, path: SETTING_ROUTE },
    { title: "Logout", from: Logout, path: LOGOUT_ROUTE },
  ]

  const [playBubble] = useSound(Bubble, { volume: 0.25 })

  const { user } = useContext(Context)

  const redirectMethod = (path) => {
    if (path === LOGOUT_ROUTE) {
      return setIsLogout(true)
    }
    if (location.pathname !== path) {
      playBubble()
      navigate(path)
    }
  }

  const logOut = () => {
    if (isLogout) {
      playBubble()
      navigate(LOGOUT_ROUTE)
    }
  }

  return (
    <div className={`HeaderAuth`} style={{ background: user.isDark ? "#323232" : "#D8D8D8" }}>

      {isLogout &&
        <div onClick={() => setIsLogout(false)} className='Log-alert'>
          <div onClick={e => e.stopPropagation()} className='Inner-Log-alert'>
            <h1 className='Header-title'>Вы уверены, что хотите выйти из аккаунта?</h1>

            <div className='Log-row'>
              <button onClick={() => logOut()} className='Log-back'>Выйти из учётной записи</button>
              <button onClick={() => setIsLogout(false)} className='Log-stay'>Остаться</button>
            </div>
          </div>
        </div>
      }

      <div className='Header-buttons'>
        {icons.map(icon =>
          <button
            onClick={() => redirectMethod(icon.path)}
            key={icon.title}
            className={`Header-button 
           ${location.pathname === icon.path && 'Header-button-active'}
           `}>
            <img src={icon.from} alt={icon.from} />
          </button>
        )}
      </div>
      <div>
        <button className={`${user.isDark ? "Header-ligth" : "Header-dark"} Night-mode`}
          onClick={() => {
            user.setIsDark(!user.isDark)
            playBubble()
          }}>
          <img width={user.isDark ? 50 : 40} src={user.isDark ? Sunday : Nigth} alt={user.isDark ? Sunday : Nigth} />
        </button>
      </div>
    </div >
  )
})

export default HeaderAuth