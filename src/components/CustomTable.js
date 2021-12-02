import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { isObject } from 'lodash'
import { Formik, Form, useField, useFormikContext } from 'formik'
import { Pagination } from 'react-bootstrap'
import Select from 'react-select'
import NumberFormat from 'react-number-format'
import DatePicker from "react-datepicker"
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table'
import { TABLE_ACTIONS, TABLE_STYLE } from './constants'
import { checkItem } from './helpers'
import 'react-datepicker/dist/react-datepicker.css'

import { ReactComponent as Sort } from '../assets/icons/sort.svg'
import { ReactComponent as SortUp } from '../assets/icons/sort_up.svg'
import { ReactComponent as SortDown } from '../assets/icons/sort_down.svg'

const TableWrapper = styled.div`
  ol.table {
    font-family: ${TABLE_STYLE.font};
    margin: 0px;
    padding: 0px;
    border-top: ${TABLE_STYLE.border};
    border-left: ${TABLE_STYLE.border};
  }

  li {
    list-style: none;
    font-size: ${TABLE_STYLE.fontSize};
    position: relative;
  }

  .attribute {
    border-right: ${TABLE_STYLE.border};
    border-bottom: ${TABLE_STYLE.border};
    line-height: 2;
  }

  .item-container,
  form {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: repeat( auto-fit, minmax(50px, 1fr) );
  }

  form {
    width: 100%;
  }

  input {
    border: none;
    background: transparent;
    width: 100%;
    height: 25px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
    font-size: ${TABLE_STYLE.fontSize};
    color: ${TABLE_STYLE.text}

    &:focus {
      border: none;
    }
  
    &:focus-visible {
      outline: none;
    }

    &:disabled {
      color: ${TABLE_STYLE.disabledText};
    }

    &::placeholder {
      color: ${TABLE_STYLE.placeholder};
      opacity: .5;
      font-family: ${TABLE_STYLE.font};
    }
  }

  .active-row {
    .cell-format:hover {
      background: ${TABLE_STYLE.cellHover};
    }
  }

  .active-row-selection {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    border: ${TABLE_STYLE.activeBorder};
  }

  .header-format {
    position: relative;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      display: flex;
    }
  }

  .header-format,
  .cell-format {
    padding: ${TABLE_STYLE.cellSpacing};

    .cell-wrapper {
      position: relative;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .pagination-rows-per-page {
      margin-right: 150px;
      font-size: ${TABLE_STYLE.fontSize};
      opacity: .5;

      select {
        border: none;
      }
    }

    .page-link {
      span {
        color: #6c757d;
        background-color: #fff;
        border-color: #dee2e6;
        cursor: pointer;
        margin: 0 10px;
      }

      .visually-hidden {
        display: none;
      }
    }

    .pagination-count-items {
      font-size: ${TABLE_STYLE.fontSize};
      opacity: .5;
    }
  }

  .buttons {
    button {
      margin-bottom: 20px;
      border: 1px solid gray;
    }
  }
`

const ActionItem = styled.button`
  cursor: pointer;
  background: none;
  border: none;

  &:hover {
    color: ${TABLE_STYLE.hover};
  }

  &:disabled:hover {
    color: ${TABLE_STYLE.disabledText};
    cursor: not-allowed;
  }
`

const pageIntervals = [30]

export const createNewRow = (data, cols) => {
  let newState = [...data]
  const newCount = (newState.length + 1)

  let firstObj = Object.assign({}, newState[0])

  if (Object.keys(firstObj).length < 1) {
    const arr = cols.map(el => el.accessor)
    const emptyArr = Array(cols.length).fill('')
    firstObj = Object.assign(...arr.map((v, i) => ({ [v]: emptyArr[i] })))
  }

  Object.keys(firstObj).forEach((i) => i === 'id' ? firstObj[i] = newCount : firstObj[i] = '')
  const item = { 'newRow': '', ...firstObj }
  newState.push(item)

  return newState
}

export const usePrevious = (value) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const customSelect = {
  container: (provided, state) => ({
    ...provided,
    maxWidth: state.selectProps.maxWidth,
    width: '100%',
    position: 'absolute',
    left: '0',
    right: '0'
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    maxWidth: state.selectProps.maxWidth,
    padding: '0',
    maxHeight: '24px',
  }),
  input: (provided, state) => ({
    ...provided,
    maxWidth: state.selectProps.maxWidth,
    padding: '0',
    maxHeight: '24px',
  }),
  control: (provided, state) => ({
    ...provided,
    border: 0,
    boxShadow: 'none',
    background: 'transparent',
    maxHeight: '24px',
    minHeight: 'auto'
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: TABLE_STYLE.fontSize,
    lineHeight: '24px',
    color: '#515058'
  }),
  singleValue: (provided, state) => ({
    ...provided,
    fontSize: TABLE_STYLE.fontSize,
    color: state.isDisabled ? TABLE_STYLE.disabledText : TABLE_STYLE.text,
  }),
  placeholder: (provided, state) => ({
    ...provided,
    fontSize: TABLE_STYLE.fontSize,
    color: TABLE_STYLE.placeholder,
    opacity: '.5',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontFamily: TABLE_STYLE.font,
  }),
  menu: (provided, state) => ({
    ...provided,
    top: '34px',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: '0 0 8px 8px',
    padding: 0,
    border: 0,
    overflow: 'hidden'
  }),
  menuList: (provided, state) => ({
    ...provided,
    padding: 0
  }),
}

const StyledInput = styled.input``

const Datepicker = (props) => {
  const { setFieldValue } = useFormikContext()
  const [field] = useField(props)
  const { disabled, placeholder } = props

  return (
    <DatePicker
      selected={field.value && new Date(field.value)}
      dateFormat='dd MMMM, yyyy'
      onChange={date => setFieldValue(field.name, date)}
      disabled={disabled}
      placeholderText={placeholder}
    />
  )
}

const CustomSelect = (props) => {
  const { setFieldValue } = useFormikContext()
  const [field] = useField(props)
  const { customOptions, placeholder } = props

  return (
    <Select
      onChange={option => setFieldValue(field.name, option.id)}
      options={customOptions}
      getOptionLabel={e => e.title}
      getOptionValue={e => e.id}
      isMulti={false}
      value={customOptions.filter(option => option.id === field.value)}
      components={{
        IndicatorSeparator: () => null,
        DropdownIndicator: () => null
      }}
      styles={customSelect}
      placeholder={placeholder}
      {...props}
    />
  )
}

const Input = (props) => {
  const { setFieldValue } = useFormikContext()
  const [field] = useField(props)
  const { disabled, placeholder, initialValue, type, valuePrefix } = props
  const { value } = field

  const handleOnKeyDown = (e) => {
    if (e.key === 'Escape') {
      setFieldValue(field.name, initialValue)
    }
  }

  const defaultValues = {
    number: ""
  }

  if (type === 'number') {
    return (
      <NumberFormat
        prefix={valuePrefix}
        placeholder={placeholder}
        thousandSeparator
        value={isObject(value) ? value.formattedValue : value}
        onValueChange={val =>
          setFieldValue(field.name, val.floatValue || defaultValues[field.name])
        }
        onKeyDown={(e) => handleOnKeyDown(e)}
        disabled={disabled}
        {...field}
      />
    )
  }

  return (
    <StyledInput
      onKeyDown={(e) => handleOnKeyDown(e)}
      {...field}
      {...props}
    />
  )
}

// Editable Cell applied on all non-custom table cells and enabled on active
const EditableCell = ({
  value: initialValue,
  ...props
}) => {
  const {
    cell: { column: { component, componentType, componentPrefix, componentPlaceholder, id, } },
    disabled
  } = props

  switch (component) {
    case 'select':
      return (
        <CustomSelect
          name={`data.${[id]}`}
          customOptions={props.cell.column.selectOptions}
          placeholder={componentPlaceholder}
          isDisabled={!disabled}
        />
      )
    case 'input':
      return (
        <Input
          name={`data.${[id]}`}
          type={componentType}
          placeholder={disabled ? componentPlaceholder : ''}
          disabled={!disabled}
          initialValue={initialValue}
          valuePrefix={componentPrefix}
        />
      )
    case 'date':
      return (
        <Datepicker
          name={`data.${[id]}`}
          placeholder={componentPlaceholder}
          disabled={!disabled}
        />
      )
    default:
      return (
        <div>This custom component is not defined</div>
      )
  }
}

const defaultColumn = {
  Cell: EditableCell,
}

export const rowActions = (
  _data,
  show_actions,
  Edit,
  Delete,
  Cancel,
  Submit,
  activeRowId,
  revertRowChanges,
  setActiveRowId,
  deleteRow,
  table_key
) => ([
  {
    Header: 'Action',
    disableSortBy: true,
    disableFilters: true,

    Cell: (tableProps) => {
      const originalId = tableProps.row.index
      const disabled = activeRowId !== null && originalId !== activeRowId

      return (
        <>
          {originalId === activeRowId ? (
            <>
              <ActionItem type="submit">
                {Submit ? <Submit /> : 'submit'}
              </ActionItem>
              <ActionItem
                onMouseDown={() => {
                  revertRowChanges()
                  setActiveRowId(null)
                }}
              >
                {Cancel ? <Cancel /> : 'cancel'}
              </ActionItem>
            </>
          ) : (
            <>
              {checkItem(show_actions, TABLE_ACTIONS.delete) && (
                <ActionItem
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    deleteRow(originalId, table_key)
                  }}
                >
                  {Delete ? <Delete /> : 'delete'}
                </ActionItem>
              )}

              {checkItem(show_actions, TABLE_ACTIONS.edit) && (
                <ActionItem
                  key={activeRowId}
                  disabled={disabled}
                  onClick={() => {
                    setActiveRowId(originalId)
                  }}
                >
                  {Edit ? <Edit /> : 'edit'}
                </ActionItem>
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
  saveRow,
  deleteRow,
  Edit,
  Delete,
  Cancel,
  Submit,
  size,
  table_key,
  updateMyData,
  skipPageReset,
  searchFilter,
  showPagination
}) => {
  const externalNewRow = data.find((obj) => obj.newRow === "")
  //check and if external newRow exists set it active
  const [activeRowId, setActiveRowId] = useState(externalNewRow ? (externalNewRow.id - 1) : null)

  //revert row changes
  const formikRef = useRef()
  const revertRowChanges = useCallback(() => {
    formikRef.current?.resetForm()
  }, [])

  //check for row actions availability and concat them to the available table columns
  const actionsColumn = useMemo(
    () => rowActions(
      data,
      show_actions,
      Edit,
      Delete,
      Cancel,
      Submit,
      activeRowId,
      revertRowChanges,
      setActiveRowId,
      deleteRow,
      table_key
    ),
    [activeRowId, data, show_actions, Edit, Delete, Cancel, Submit, revertRowChanges, deleteRow, table_key]
  )
  const showActions = show_actions && show_actions.length > 0
  const columns = useMemo(() => cols.concat(showActions ? actionsColumn : []), [cols, actionsColumn, showActions])

  //add new table row
  const [tableRows, setTableRows] = useState(data)
  const addRow = (data) => {
    setTableRows(data)
    setActiveRowId(data.length - 1)
  }

  const {
    getTableProps,
    headerGroups,
    rows,
    page,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    prepareRow,
    setGlobalFilter,
  } = useTable({
    columns,
    data: tableRows,
    initialState: {
      pageIndex: 0,
      pageSize: 30,
    },
    defaultColumn,
    autoResetPage: !skipPageReset,
    updateMyData,
  },
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  //pagination logic
  const { pageIndex, pageSize } = state
  let rowsCount = ((pageIndex + 1) * pageSize) - (pageSize - 1) + " - " + (pageIndex + 1) * pageSize
  if (pageCount - 1 === pageIndex) {
    rowsCount = ((pageIndex + 1) * pageSize) - (pageSize - 1) + " - " + rows.length
  }

  //global search filter
  useEffect(() => {
    setGlobalFilter(searchFilter)
  }, [setGlobalFilter, searchFilter])

  // Render the UI for your table
  return (
    <TableWrapper>
      <div className="buttons">
        <ActionItem
          onClick={() => addRow(createNewRow(data, cols))}
          disabled={(usePrevious(data.length) !== usePrevious(tableRows?.length)) || externalNewRow || activeRowId !== null}
        >
          Add new line +
        </ActionItem>
      </div>

      <ol className='table table-container' {...getTableProps()}>
        {headerGroups.map((headerGroup, i) => (
          <li className='item item-container' {...headerGroup.getHeaderGroupProps()} style={size}>
            {headerGroup.headers.map((column, i) => (
              <div key={i} className='attribute header-format' {...column.getHeaderProps(column.getSortByToggleProps())}>
                <span>{column.render('Header')}</span>
                {!column.disableSortBy && (
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? <SortDown />
                        : <SortUp />
                      : <Sort />}
                  </span>
                )}
              </div>
            ))}
          </li>
        ))}

        {page.map(row => {
          prepareRow(row)
          const activeRow = parseInt(row.index) === parseInt(activeRowId)

          return (
            <li
              style={size}
              className={activeRow ? 'active-row' : ''}
              {...row.getRowProps()}
            >
              {activeRow && (
                <div className="active-row-selection"></div>
              )}
              <Formik
                id='custom-table-form'
                innerRef={formikRef}
                initialValues={{
                  data: row.original
                }}
                onSubmit={async (values) => {
                  saveRow(values, table_key)
                }}
              >
                <Form
                  style={size}
                >
                  {row.cells.map(cell => (
                    <div className='attribute cell-format' {...cell.getCellProps()}>
                      <div className="cell-wrapper">
                        {cell.render('Cell', { disabled: activeRow })}
                      </div>
                    </div>
                  ))}
                </Form>
              </Formik>
            </li>
          )
        })}
      </ol>

      {showPagination && (
        <Pagination>
          <li className="pagination-rows-per-page">
            Rows per page
            <select
              value={pageSize}
              onChange={e => setPageSize(Number(e.target.value))}>
              {pageIntervals.map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </li>
          <Pagination.First onClick={() => gotoPage(0)} disabled={!canPreviousPage} />
          <Pagination.Prev onClick={() => previousPage()} disabled={!canPreviousPage} />
          <li className="pagination-count-items">
            {rowsCount} of {rows.length} items
          </li>
          <Pagination.Next onClick={() => nextPage()} disabled={!canNextPage} />
          <Pagination.Last onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} />
        </Pagination>
      )}
    </TableWrapper>
  )
}

export default CustomTable
