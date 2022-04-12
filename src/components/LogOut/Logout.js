import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Context } from '../..'
import { TITLE_ROUTE } from '../../consts/paths'

const Logout = observer(() => {

  const { user } = useContext(Context)
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.removeItem('token')
    user.setIsAuth(false)
    navigate(TITLE_ROUTE)
  }, [])

  return (
    <div>

    </div>
  )
})
export default Logout