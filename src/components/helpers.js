import { indexOf } from 'lodash'

export const checkItem = (arr, val) => {
  return indexOf(arr, val) !== -1
}
