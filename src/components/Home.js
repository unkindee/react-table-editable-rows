import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCountryData, useTableData } from './queryHooks.js'

const Home = () => {
  const [ key, setKey ] = useState()
  const onSuccess = (data) => {
    //console.log('onSuccess', data)
  }

  const onError = (error) => {
    //console.log('onError', error)
  }

  const { isLoading, isFetching, data, isError, error } = useTableData({ onSuccess, onError })

  const { isLoading: loadingDetails, data: details } = useCountryData({ tableId: key})

  if (isLoading || isFetching || loadingDetails) {
    <div>Loading...</div>
  }

  return (
    <>
      <div>
        Navigate:
        <ol>
          {data?.map(item => (
            <li key={item.id}>
              <Link to={`/table/${item.id}`}>{item.country}</Link>
            </li>
          ))}
        </ol>
      </div>
      <div>
        {data?.map(item => (
          <button onClick={() => setKey(item.id)} key={item.id}>{item.country}</button>
        ))}
        <div>
          {details?.id}{details?.email}
        </div>
      </div>
    </>
  )
}

export default Home
