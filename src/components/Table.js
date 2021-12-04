import React, { useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import CustomTable from './CustomTable.js'
import { useTableData } from './queryHooks.js'

const Wrapper = styled.div`
  margin: 40px;
`
const Table = () => {
  const onSuccess = (data) => {
    //console.log('onSuccess', data)
  }

  const onError = (error) => {
    //console.log('onError', error)
  }

  const { isLoading, isFetching, data, isError, error } = useTableData({ onSuccess, onError })

  const TABLE_COLUMNS = [
    {
      Header: 'No.',
      accessor: 'id',

      Cell: tableProps => {
        const index = Number(tableProps.row.id) + 1
        return <span>{index}</span>
      }
    },
    {
      Header: 'Date',
      accessor: 'date',
      component: 'date',
      componentPlaceholder: 'No date selected'
    },
    {
      Header: 'Cost Type',
      accessor: 'cost_type',
      component: 'select',
      componentPlaceholder: 'No cost selected',
      selectOptions: [
        { id: 'soft', title: 'Soft Cost' },
        { id: 'land', title: 'Land Cost' },
        { id: 'hard', title: "Hard Cost" },
      ],
    },
    {
      Header: 'Value without VAT',
      accessor: 'value_no_vat',
      component: 'input',
      componentType: 'number',
      componentPrefix: '$ ',
      componentPlaceholder: 'Click to edit this line'
    },
    {
      Header: 'Email',
      accessor: 'email',
      component: 'input',
      componentType: 'email',
      componentPlaceholder: 'Email address'
    },
    {
      Header: 'Country',
      accessor: 'country',
      component: 'input',
      componentType: 'text',
      componentPlaceholder: 'Click to edit this line'
    },
  ]

  const saveRow = (data, key) => {
    console.log(`save row`, data, key)
  }

  const deleteRow = (id, key) => {
    console.log(`delete`, id, key)
  }

  //user for external add new row
  const [newData, setTableData] = useState(null)

  //used for external search filter
  const [searchFilter, setSearchFilter] = useState('')

  if (isError) {
    return <h2>{error.message}</h2>
  }

  return (
    <Wrapper>
      {isLoading || isFetching ? (
        <div>loading</div>
      ) : (
        <>
          <ol>
            {data.map(item => (
              <li key={item.id}>
                <Link to={`/table/${item.id}`}>{item.country}</Link>
              </li>
            ))}
          </ol>

          <input
            type='text'
            id='title'
            required
            placeholder='Search'
            value={searchFilter || ''}
            onChange={e => {
              setSearchFilter(e.target.value)
            }}
          />
          <CustomTable
            key={newData}
            table_key='my_table'
            cols={TABLE_COLUMNS}
            data={newData || data}
            show_actions={[]}
            saveRow={saveRow}
            deleteRow={deleteRow}
            Edit={() => <div>Edit</div>}
            Delete={() => <div>Delete</div>}
            Cancel={() => 'Cancel'}
            Submit={() => <div>Save</div>}
            size={{ gridTemplateColumns: 'minmax(60px, .8fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(80px, 1fr)' }}
            searchFilter={searchFilter}
            showPagination
          />
        </>
      )}
    </Wrapper>
  )
}

export default Table
