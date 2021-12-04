import axios from 'axios'
import { useQuery } from 'react-query'

const rootUrl = 'http://localhost:4000'

const fetchData = () => {
  return axios.get(rootUrl + '/data')
}

export const useTableData = (props) => {
  const { onSuccess, onError } = props

  return useQuery('data', fetchData, {
      onSuccess,
      onError,
      staleTime: 5000,
      select: data => data.data
    }
  )
}

const rootActionsUrl = 'http://localhost:4001'

const fetchActionsData = () => {
  return axios.get(rootActionsUrl + '/data')
}

export const useTableActionsData = (props) => {
  const { onSuccess, onError } = props

  return useQuery('actions-data', fetchActionsData, {
      onSuccess,
      onError,
      staleTime: 5000,
      select: data => data.data
    }
  )
}