import { SortDirection } from '@/common/types'
import { describe, expect, it } from 'vitest'
import { formatSortParam } from './http-params'

describe('http-params', () => {
  describe('formatSortParam', () => {
    describe('given a field and direction', () => {
      describe('when formatSortParam is called with string field and ASC direction', () => {
        it('then it should return formatted sort parameter', () => {
          const result = formatSortParam('name', SortDirection.ASC)
          expect(result).toBe('name,asc')
        })
      })

      describe('when formatSortParam is called with string field and DESC direction', () => {
        it('then it should return formatted sort parameter', () => {
          const result = formatSortParam('createdAt', SortDirection.DESC)
          expect(result).toBe('createdAt,desc')
        })
      })

      describe('when formatSortParam is called with number field', () => {
        it('then it should convert number to string and format correctly', () => {
          const result = formatSortParam(123, SortDirection.ASC)
          expect(result).toBe('123,asc')
        })
      })
    })
  })
})
