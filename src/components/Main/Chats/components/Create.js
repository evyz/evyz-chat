import { observer } from 'mobx-react-lite'
import React, { useContext, useState } from 'react'
import { Context } from '../../../..'

const CreateChat = observer(({ isCreate, setIsCreate }) => {

  const { user } = useContext(Context)

  const [title, setTitle] = useState('')

  const create = () => {
    user.ws.current.send(JSON.stringify({
      type: "create:chat",
      params: {
        title: title
      }
    })
    )
    setIsCreate(false)
  }

  if (!isCreate) {
    return null
  }

  return (
    <div>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Название чата' />
      <button onClick={() => create()}>Создать!</button>
    </div>
  )
})

export default CreateChat;