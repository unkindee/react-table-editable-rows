import React, { useState } from 'react'
import styled from 'styled-components'

const StyledInput = styled.input`
  border: none;
  color: black;

  &.active {
    color: blue;
    font-wieght: bold;
  }
`

export const CustomInput = ({ disabled, value, type }) => {
  const [data, setData] = useState(value)

  return <StyledInput
    className={disabled ? 'active' : ''}
    disabled={!disabled}
    type={type}
    value={data}
    onChange={(e) => setData(e.target.value)}
  />
}
