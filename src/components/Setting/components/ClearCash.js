import React, { useState } from 'react'
import './ClearCash.css'

const ClearCash = () => {

  const [isConfirm, setIsConfirm] = useState(false)

  const clear = () => {
    localStorage.removeItem('isBetaStatus')
    setIsConfirm(false)
  }

  return (
    <div>
      {
        isConfirm &&
        <div className='ClearCashAlert' onClick={() => setIsConfirm(false)}>
          <div className='ClearCashAlertInner' onClick={e => e.stopPropagation()}>
            <h1>Подтвердите, что вы хотите очистить кеш и локальные данные</h1>
            <span>Под очистку данных входит:</span>
            <li>Удаление локальных файлов</li>
            <li>Удаление кук файлов</li>

            <button onClick={() => clear()}>Очистить</button>
            <button onClick={() => setIsConfirm(false)}>Отменить</button>
          </div>
        </div>
      }

      <button onClick={() => setIsConfirm(true)}>Очистить данные сайта</button>
    </div>
  )
}

export default ClearCash