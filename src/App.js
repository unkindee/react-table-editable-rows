import React, { useState } from 'react'
import MOCK_TABLE_DATA from './MOCK_TABLE_DATA.json'
import styled from 'styled-components'
import CustomTable, { createNewRow, usePrevious } from './components/CustomTable.js'
import { TABLE_ACTIONS } from './components/constants'

const App = () => {
  const TABLE_COLUMNS = [
    {
      Header: 'id',
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

  //user for external add new row
  const [ newData, setTableData ] = useState(null)

  //used for external search filter
  const [searchFilter, setSearchFilter] = useState('')

  return (
    <>
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
        data={newData || MOCK_TABLE_DATA}
        show_actions={[TABLE_ACTIONS.edit, TABLE_ACTIONS.delete]}
        Edit={() => <div>Edit</div>}
        Delete={() => <div>Delete</div>}
        Cancel={() => 'Cancel'}
        Submit={() => <div>Save</div>}
        size={{ gridTemplateColumns: 'minmax(60px, .8fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(80px, 1fr)' }}
        searchFilter={searchFilter}
        showPagination
      />
    </>
  )
}

export default App
