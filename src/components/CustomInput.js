import React, { useState } from 'react'
import styled from 'styled-components'

export const CustomInput = ({ disabled, value, type }) => {
  const [data, setData] = useState(value)

  return <input
    className={disabled ? 'active' : ''}
    disabled={!disabled}
    type={type}
    value={data}
    onChange={(e) => setData(e.target.value)}
  />
}
