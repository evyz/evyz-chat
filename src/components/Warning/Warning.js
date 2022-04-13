import React, { useEffect, useState } from 'react'

const Warning = () => {

  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const status = localStorage.getItem('isBetaStatus')
    if (status === null || status === false) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
    if (!isOpen) {
      localStorage.setItem('isBetaStatus', true)
    }
  }, [isOpen])

  if (!isOpen) {
    return (
      <></>
    )
  }

  return (
    <div className={isOpen ? 'Warning' : 'Warning Warning-close'}>
      <div className='Inner-Warning'>
        <span className='Warning-title'>Проект находится на стадии Преальфа-разработки. В случаи обнаружении багов, пишите в тех. поддержку бла-бла-бла</span>
        <button onClick={() => setIsOpen(false)} className='Warning-button'>Ок!</button>
      </div>
    </div>
  )
}

export default Warning