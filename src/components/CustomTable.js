import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { isObject } from 'lodash'
import { Formik, Form, useField, useFormikContext } from 'formik'
import { Pagination } from 'react-bootstrap'
import Select from 'react-select'
import NumberFormat from 'react-number-format'
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table'
import { TABLE_ACTIONS } from './constants'
import { checkItem } from './helpers'

import { ReactComponent as Sort } from '../assets/icons/sort.svg'
import { ReactComponent as SortUp } from '../assets/icons/sort_up.svg'
import { ReactComponent as SortDown } from '../assets/icons/sort_down.svg'

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
  }

  * {
      box-sizing: border-box;
  }

  .attribute {
    line-height: 2;
  }

  /* 2 Column Card Layout */
  @media screen and (max-width: 736px) {

    /* Don't display the first item, since it is used to display the header for tabular layouts*/
    .table-container>li:first-child {
      display: none;
    }

    /* Attribute name for first column, and attribute value for second column. */
    .attribute {
      display: grid;
      grid-template-columns: minmax(9em, 30%) 1fr;
    }
  }

  /* 1 Column Card Layout */
  @media screen and (max-width:580px) {
    .table-container {
      display: grid;
      grid-template-columns: 1fr;
    }
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
    .table-container>.item-container:first-child .attribute {
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-overflow: initial;
        overflow: auto;
        white-space: normal;
    }
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

    &:focus {
      border: none;
    }
  
    &:focus-visible {
      outline: none;
    }

    &::placeholder {
      color: #2081FA;
    }
  }

  .active-row-selection {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    border: 2px solid #2081FA;
  }

  .header-format {
    position: relative;
    font-weight: bold;

    span {
      display: flex;
    }
  }

  .header-format,
  .cell-format {
    padding: 12px;
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .pagination-rows-per-page {
      margin-right: 150px;
      font-size: 12px;
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
      font-size: 12px;
      opacity: .5;
    }
  }
`
const pageIntervals = [5, 10, 20]

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

const ActionItem = styled.button`
  cursor: pointer;

  &:hover {
    color: #2081FA;
  }
`

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
    fontSize: '12px',
    lineHeight: '24px',
    color: '#515058'
  }),
  singleValue: (provided, state) => ({
    ...provided,
    fontSize: '12px',
    color: '#515058',
  }),
  placeholder: (provided, state) => ({
    ...provided,
  }),
  menu: (provided, state) => ({
    ...provided,
    top: '36px',
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

const CustomSelect = (props) => {
  const selectRef = useRef()
  const { setFieldValue } = useFormikContext()
  const { accessor, customOptions, initialValue, placeholder } = props

  const options = customOptions

  const onChange = option => {
    setFieldValue(`data.${accessor}`, option?.id)
    setSelectedOption([option])
  }

  const [selectedOption, setSelectedOption] = useState()

  useEffect(() => {
    const defaultOption = options?.filter(option => option.id === initialValue)
    setSelectedOption(defaultOption)
  }, [options, initialValue])

  return (
    <Select
      ref={selectRef}
      onChange={option => onChange(option)}
      options={options}
      getOptionLabel={e => e.title}
      getOptionValue={e => e.id}
      isMulti={false}
      value={selectedOption}
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
  const { disabled, placeholder, name, initialValue, type, valuePrefix } = props
  const { value } = field

  const handleOnKeyDown = (e) => {
    if (e.key === 'Escape') {
      setFieldValue(name, initialValue)
    }
  }

  const defaultValues = {
    number: ""
  }

  if (type === 'number') {
    return (
      <NumberFormat
        prefix={valuePrefix}
        name={name}
        placeholder={placeholder}
        thousandSeparator
        value={isObject(value) ? value.formattedValue : value}
        onValueChange={val =>
          setFieldValue(name, val.floatValue || defaultValues[name])
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
          name="select"
          accessor={id}
          customOptions={props.cell.column.selectOptions}
          placeholder={componentPlaceholder}
          isDisabled={!disabled}
          initialValue={initialValue}
          key={!disabled}
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
  activeRowId,
  revertRowChanges,
  setActiveRowId,
  table_key
) => ([
  {
    Header: 'Action',
    disableSortBy: true,
    disableFilters: true,

    Cell: (tableProps) => {
      const originalId = tableProps.row.index
      const actionStyle = { opacity: activeRowId !== null && originalId !== activeRowId ? '.5' : '1' }

      return (
        <>
          {originalId === activeRowId ? (
            <>
              <ActionItem type="submit">submit</ActionItem>
              <ActionItem
                onMouseDown={() => {
                  revertRowChanges()
                  setActiveRowId(null)
                }}
              >
                cancel
              </ActionItem>
            </>
          ) : (
            <>
              {checkItem(show_actions, TABLE_ACTIONS.delete) && (
                <ActionItem
                  style={actionStyle}
                  onClick={(e) => {
                    if (activeRowId !== null && originalId !== activeRowId) {
                      //disable delete if another row is active
                      e.preventDefault()
                      return false
                    }
                    console.log(table_key)
                  }}
                >
                  delete
                </ActionItem>
              )}

              {checkItem(show_actions, TABLE_ACTIONS.edit) && (
                <ActionItem
                  key={activeRowId}
                  style={actionStyle}
                  onClick={(e) => {
                    if (activeRowId !== null && originalId !== activeRowId) {
                      //disable edit if another row is active
                      e.preventDefault()
                      return false
                    }
                    setActiveRowId(originalId)
                  }}
                >
                  edit
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
  size,
  table_key,
  updateMyData,
  skipPageReset,
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
      activeRowId,
      revertRowChanges,
      setActiveRowId,
      table_key
    ),
    [activeRowId, data, show_actions, revertRowChanges, table_key]
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
  } = useTable({
    columns,
    data: tableRows,
    initialState: {
      pageIndex: 0,
      pageSize: 5,
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

  // Render the UI for your table
  return (
    <TableWrapper>
      <button
        onClick={() => addRow(createNewRow(data, cols))}
        disabled={(usePrevious(data.length) !== usePrevious(tableRows?.length)) || externalNewRow}
      >
        Add new line
      </button>
      <ol className='table table-container' {...getTableProps()}>
        {headerGroups.map((headerGroup, i) => (
          <li className='item item-container' {...headerGroup.getHeaderGroupProps()} style={{ gridTemplateColumns: size }}>
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
              style={{ gridTemplateColumns: size }}
              className={activeRow ? 'active-table-row' : ''}
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
                  console.log(values, table_key)
                }}
              >
                <Form
                  style={{ gridTemplateColumns: size }}
                >
                  {row.cells.map(cell => (
                    <div className='attribute cell-format' {...cell.getCellProps()}>
                      <div style={{ position: 'relative ' }}>
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
