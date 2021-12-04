import React from 'react'
import { Link } from 'react-router-dom'
import { useCountryData, useTableData } from './queryHooks.js'

const Home = () => {
  const onSuccess = (data) => {
    //console.log('onSuccess', data)
  }

  const onError = (error) => {
    //console.log('onError', error)
  }

  const { isLoading, isFetching, data, isError, error } = useTableData({ onSuccess, onError })

  const { isLoading: loadingDetails, data: details, refetch } = useCountryData({ tableId: 1 })
  console.log('details: ', details);

  if (isLoading || isFetching) {
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
          <button onClick={() => refetch(item.id)} key={item.id}>{item.country}</button>
        ))}
      </div>
      <div>
        {details?.id}
        {details?.email}
      </div>
    </>
  )
}

export default Home
