import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  useParams
} from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import Home from './components/Home'
import Table from './components/Table'
import TableActions from './components/TableActions'
import { useCountryData } from './components/queryHooks'

const TableId = () => {
  const { tableId } = useParams()
  const { isLoading, isFetching, data, isError, error } = useCountryData({ tableId })

  if (isLoading || isFetching) {
    <div>Loading...</div>
  }

  return (
    <div>{data?.country}</div>
  )
}

const App = () => {

  return (
    <BrowserRouter>
      <div>
        <NavLink to="/">Home</NavLink> |{' '}
        <NavLink to="table">Table</NavLink> |{' '}
        <NavLink to="table-actions">TableActions</NavLink>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/table" element={<Table />} />
        <Route path="/table/:tableId" element={<TableId />} />
        <Route path="/table-actions" element={<TableActions />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
