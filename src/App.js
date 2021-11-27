import MOCK_TABLE_DATA from './MOCK_TABLE_DATA.json'
import styled from 'styled-components'
import CustomTable from './components/CustomTable.js'
import { TABLE_ACTIONS } from './components/constants'
import { CustomInput } from './components/CustomInput'

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
    <CustomTable
      cols={TABLE_COLUMNS}
      data={MOCK_TABLE_DATA}
      show_actions={[TABLE_ACTIONS.edit, TABLE_ACTIONS.delete]}
      size='1.5fr 2.5fr 2.5fr 2fr 2fr 2fr 1.5fr'
    />
  )
}

export default App
