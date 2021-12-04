import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import Home from './components/Home'
import Table from './components/Table'
import TableActions from './components/TableActions'

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
        <Route path="table" element={<Table />} />
        <Route path="table-actions" element={<TableActions />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
