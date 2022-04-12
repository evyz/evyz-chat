import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '../../..'
import './HeaderPublic.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { AUTH_ROUTE, REGISTRATION_ROUTE } from '../../../consts/paths'

const HeaderPublic = observer(() => {

  const { user } = useContext(Context)
  const navigate = useNavigate()
  const location = useLocation()

  const [isRegisterActive, setIsRegisterActive] = useState(false)

  useEffect(() => {
    if (location.pathname !== '/registration' || location.pathname !== '/') {
      setIsRegisterActive(true)
    }
    if (location.pathname === '/registration') {
      setIsRegisterActive(false)
    }
  }, [location.pathname])

  return (
    <div className={` bg-ligth HeaderPublic`}>
      <div className='InnerHeaderPublic'>
        <div></div>
        <div className='Rigth'>
          <button onClick={() => navigate(REGISTRATION_ROUTE)} className={isRegisterActive && `${!user.isDark ? 'bg-dark tx-dark' : "bg-ligth tx-dark"} Login Register`}>Регистрация</button>
          <button onClick={() => navigate(AUTH_ROUTE)} className={location.pathname !== '/login' && `${!user.isDark ? 'bg-dark tx-dark' : "bg-ligth tx-dark"} Login`}>Авторизация</button>
        </div>
      </div>
    </div>
  )
})

export default HeaderPublic;