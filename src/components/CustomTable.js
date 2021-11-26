import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useTable } from 'react-table'
import { TABLE_ACTIONS } from './constants'
import { checkItem } from './helpers'

const ActionItem = styled.div`
  cursor: pointer;

  &:hover {
    font-weight: bold;
  }
`

export const rowActions = (
  _data,
  show_actions,
  activeRowId,
  setActiveRowId
) => ([
  {
    Header: 'Action',
    disableSortBy: true,
    disableFilters: true,

    Cell: (tableProps) => {
      const originalId = tableProps.row.index

      return (
        <>
          {originalId === activeRowId ? (
            <>
              <ActionItem onClick={() => console.log('submit')}>submit</ActionItem>
              <ActionItem onClick={() => setActiveRowId(null)}>cancel</ActionItem>
            </>
          ) : (
            <>
              {checkItem(show_actions, TABLE_ACTIONS.delete) && (
                <ActionItem onClick={() => console.log('delete', originalId)}>delete</ActionItem>
              )}

              {checkItem(show_actions, TABLE_ACTIONS.edit) && (
                <ActionItem onClick={() => setActiveRowId(originalId)}>edit</ActionItem>
              )}
            </>
          )}
        </>
      )
    },
  },
])

const CustomTable = ({
  cols,
  data,
  show_actions
}) => {
  const [activeRowId, setActiveRowId] = useState()
  //check for row actions availability and concat them to the available table columns
  const actionsColumn = useMemo(
    () => rowActions(
      data,
      show_actions,
      activeRowId,
      setActiveRowId
    ),
    [activeRowId, data, show_actions]
  )
  const showActions = show_actions && show_actions.length > 0
  const columns = useMemo(() => cols.concat(showActions ? actionsColumn : []), [cols, actionsColumn, showActions])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          const activeRow = parseInt(row.index) === parseInt(activeRowId)

          return (
            <tr className={activeRow ? 'active' : ''} {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell', { activeRow: activeRow })}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default CustomTable
