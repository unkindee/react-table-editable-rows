import MOCK_TABLE_DATA from './MOCK_TABLE_DATA.json'
import styled from 'styled-components'
import CustomTable from './components/CustomTable.js'
import { TABLE_ACTIONS } from './components/constants'
import { CustomInput } from './components/CustomInput'

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      &.active {
        background: lightgray;
      }
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

const App = () => {
  const TABLE_COLUMNS = [
    {
      Header: 'id',
      accessor: 'id',
    },
    {
      Header: 'Item description',
      accessor: 'item_description',

      Cell: (tableProps) => {
        const { activeRow, value } = tableProps
        return <CustomInput value={value} disabled={activeRow} type="text" />
      }
    },
    {
      Header: 'Cost Type',
      accessor: 'cost_type',

      Cell: (tableProps) => {
        const { activeRow, value } = tableProps
        return <CustomInput value={value} disabled={activeRow} type="text" />
      }
    },
    {
      Header: 'Value without VAT',
      accessor: 'value_no_vat',

      Cell: (tableProps) => {
        const { activeRow, value } = tableProps
        return <CustomInput value={value} disabled={activeRow} type="text" />
      }
    },
    {
      Header: 'Executed budget',
      accessor: 'executed_amount',

      Cell: (tableProps) => {
        const { activeRow, value } = tableProps
        return <CustomInput value={value} disabled={activeRow} type="text" />
      }
    },
    {
      Header: 'Country',
      accessor: 'country',

      Cell: (tableProps) => {
        const { activeRow, value } = tableProps
        return <CustomInput value={value} disabled={activeRow} type="text" />
      }
    },
  ]
  return (
    <Styles>
      <CustomTable
        cols={TABLE_COLUMNS}
        data={MOCK_TABLE_DATA}
        show_actions={[TABLE_ACTIONS.edit, TABLE_ACTIONS.delete]}
      />
    </Styles>
  )
}

export default App
