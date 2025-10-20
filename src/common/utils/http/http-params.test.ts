import { SortDirection } from '@/common/types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { expect } from 'vitest'
import { formatSortParam } from './http-params'

BddTest().given('a sort param formatter with a field and direction', () => {
  BddTest().when('formatSortParam is called with string field and ASC direction', () => {
    BddTest().then('it should return formatted sort parameter', () => {
      const result = formatSortParam('name', SortDirection.ASC)
      expect(result).toBe('name,asc')
    })
  })

  BddTest().when('formatSortParam is called with string field and DESC direction', () => {
    BddTest().then('it should return formatted sort parameter', () => {
      const result = formatSortParam('createdAt', SortDirection.DESC)
      expect(result).toBe('createdAt,desc')
    })
  })

  BddTest().when('formatSortParam is called with number field', () => {
    BddTest().then('it should convert number to string and format correctly', () => {
      const result = formatSortParam(123, SortDirection.ASC)
      expect(result).toBe('123,asc')
    })
  })
})
