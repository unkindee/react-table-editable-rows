import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Formik, Form, useField, useFormikContext } from 'formik'
import { useTable } from 'react-table'
import { TABLE_ACTIONS } from './constants'
import { checkItem } from './helpers'

const TableWrapper = styled.div`
  margin: 40px;
  height: 100%;

  ol.table {
    margin: 0px;
    padding: 0px;
  }

  li {
    list-style: none;
    font-size: 12px;
    position: relative;
    border: 1px solid transparent;
  }

  /* Tabular Layout */
  @media screen and (min-width: 737px) {
    /* The maximum column width, that can wrap */
    .item-container, form {
      display: grid;
      grid-template-columns: repeat( auto-fit, minmax(50px, 1fr) );
    }

    .table {
      border-top: 1px solid #F0F2F3;
      border-left: 1px solid #F0F2F3;
    }

    /* In order to maximize row lines, only display one line for a cell */
    .attribute {
      border-right: 1px solid #F0F2F3;
      border-bottom: 1px solid #F0F2F3;
    }

    /* Center header labels */
    .table-container > .item-container:first-child .attribute {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      text-overflow: initial;
      overflow: auto;
      white-space: normal;
    }
  }

  form {
    width: 100%;

    input {
      border: none;
      color: black;
    
      &:focus-visible {
        outline: none;
      }
    }
  }

  .attribute {
    display: flex;
  }

  .active-table-row {
    border: 1px solid #2081FA;

    .cell-format:hover {
      background: lightgray;
    }
  }

  .header-format {
    position: relative;
    font-weight: bold;
  }

  .header-format,
  .cell-format {
    padding: 16px;
  }
`

const ActionItem = styled.div`
  cursor: pointer;

  &:hover {
    color: #2081FA;
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
  show_actions,
  size
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
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  // Render the UI for your table
  return (
    <TableWrapper>
      <ol className="table table-container" {...getTableProps()}>
        {headerGroups.map((headerGroup, i) => (
          <li className="item item-container" {...headerGroup.getHeaderGroupProps()} style={{ gridTemplateColumns: size }}>
            {headerGroup.headers.map((column, i) => (
              <div key={i} className="attribute header-format" {...column.getHeaderProps}>
                {column.render('Header')}
              </div>
            ))}
          </li>
        ))}

        {rows.map(row => {
          prepareRow(row)
          const activeRow = parseInt(row.index) === parseInt(activeRowId)

          return (
            <li
              style={{ gridTemplateColumns: size }}
              className={activeRow ? 'active-table-row' : ''}
              {...row.getRowProps()}
            >
              <Formik
                id="form-table"
                initialValues={{
                  data: row.original
                }}
                onSubmit={async (values) => {
                  console.log(values)
                }}
              >
                <Form
                  style={{ gridTemplateColumns: size }}
                >
                  {row.cells.map(cell => (
                    <div className="attribute cell-format" {...cell.getCellProps()}>{cell.render('Cell', { activeRow: activeRow })}</div>
                  ))}
                </Form>
              </Formik>
            </li>
          )
        })}
      </ol>
    </TableWrapper>
  )
}

export default CustomTable
