import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../../..';

const NoneDialog = observer(() => {

  const { user } = useContext(Context)
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (user.users) {
      let arr = []
      if (user.users.length !== 0) {
        user.users.map(user => {
          if (user?.id) {
            let status = false;
            arr.map(userArr => {
              if (userArr.id === user.id) {
                status = true
              }
            })
            if (!status) {
              arr.push(user)
            }
          }
        })
        setUsers(arr)
      }
    }
  }, [user.users])

  return (
    <div className='Dialog bg-dark None-Dialog'>
      <h1>Wellcome!</h1>

      <h2>Онлайн пользователи сейчас:</h2>
      <ul>
        {
          users &&
          users.length > 0 &&
          users.map(user =>
            <li key={user?.id}>{user?.nickname}</li>
          )
        }
      </ul>
    </div>
  )
})

export default NoneDialog;