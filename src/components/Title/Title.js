import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Context } from '../..';
import HeaderPublic from '../Header/Public/HeaderPublic';
import './Title.css'

const Title = observer(() => {

  const { user } = useContext(Context)

  return (
    <div className={`Title bg-dark `}>
      {/* <HeaderPublic /> */}
      <h1 className='Title-header'>EVYZ-CHAT</h1>
      <span className='Title-slogan'>Мессенджер</span>
    </div>
  )
})

export default Title;