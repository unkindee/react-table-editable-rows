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
      Header: 'Item description',
      accessor: 'item_description',
      component: 'input',
      componentType: 'text',
      componentPlaceholder: 'Click to edit this line'
    },
    {
      Header: 'Cost Type',
      accessor: 'cost_type',
      component: 'select',
      componentPlaceholder: 'No selection',
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

  const [ data, setTableData ] = useState(null)

  return (
    <>
      <button
        onClick={() => setTableData(createNewRow(MOCK_TABLE_DATA, TABLE_COLUMNS))}
        disabled={usePrevious(MOCK_TABLE_DATA.length) !== usePrevious(data?.length)}
      >
        Add row external
      </button>
      <CustomTable
        table_key="my_table"
        cols={TABLE_COLUMNS}
        data={data || MOCK_TABLE_DATA}
        show_actions={[TABLE_ACTIONS.edit, TABLE_ACTIONS.delete]}
        size='1.5fr 2.5fr 2.5fr 2fr 2fr 2fr 1.5fr'
        key={data}
      />
    </>
  )
}

export default App
