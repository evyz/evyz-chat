import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '../../../..'

const DialogHeader = observer(({ selected, setSelected }) => {

  const { user } = useContext(Context)

  const [isSettings, setIsSettings] = useState(false)
  const [isInvite, setIsInvite] = useState(false)

  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState({})

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

  const inviteUserToChat = () => {
    console.log(selected, selectedUser.id)

    user.ws.current.send(JSON.stringify({
      type: "connect:chat",
      params: {
        chatId: selected.id,
        userId: selectedUser.id
      }
    }
    ))
    setIsInvite(false)
    alert('Пользователь', selectedUser.nickname, "был приглашён")
  }

  return (
    <div className='Dialog-title'>
      {
        isSettings &&
        <div className='Dialog-settings-alert'>
          <div>
            <p >Настройки чата</p>
            <p onClick={() => setIsInvite(true)}>Пригласить в чат</p>
          </div>
          <button onClick={() => setIsSettings(false)}>Закрыть</button>
        </div>
      }

      {isInvite &&
        <div className='Dialog-settings-window' onClick={() => setIsInvite(false)}>
          <div className='Dialog-settings-inner-window' onClick={e => e.stopPropagation()}>
            <h1>Пригласить пользователя в данный чат</h1>

            <div className='Dialog-settings-search'>
              <input placeholder='Введите никнейм пользователя' />
              <button>Поиск</button>
            </div>

            Результат поиска:
            <ul>
              {users.map(user =>
                <li key={user.id} onClick={() => setSelectedUser(user)}>{user.nickname} {user.id === selectedUser.id && <button onClick={() => inviteUserToChat()}>Пригласить</button>} </li>
              )}
            </ul>
          </div>
        </div>
      }

      <div className='Dialog-name'>
        <div className='Dialog-icon'></div>
        {selected?.name}
      </div>
      <div className='Dialog-settings' onClick={() => setIsSettings(!isSettings)}>
        <div className='Dialog-circle'></div>
        <div className='Dialog-circle'></div>
        <div className='Dialog-circle'></div>
      </div>
    </div>
  )
})

export default DialogHeader;