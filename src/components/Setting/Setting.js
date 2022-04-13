import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import './Setting.css'
import { Context } from '../..'
import ClearCash from './components/ClearCash'

const Setting = observer(() => {
  const { user } = useContext(Context)

  return (
    <div className={`Setting ${user.isDark ? "bg-dark" : "bg-ligth"}`}>
      <h1>Настройки</h1>

      <ClearCash />
    </div>
  )
})

export default Setting