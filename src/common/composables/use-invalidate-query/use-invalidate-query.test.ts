import { useInvalidateQuery } from '@/common/composables/use-invalidate-query/use-invalidate-query'
import { useQueryClient } from '@tanstack/vue-query'
import { describe, expect, it, type Mock, vi } from 'vitest'

vi.mock('@tanstack/vue-query', () => ({
  useQueryClient: vi.fn()
}))

const mockedUseQueryClient = useQueryClient as unknown as Mock

describe('useInvalidateQuery', () => {
  describe('given a queryKey', () => {
    const queryKey = ['my', 'query', 'key']

    describe('when the invalidate function is called', () => {
      it('then it should call queryClient.invalidateQueries with the queryKey', async () => {
        const invalidateQueriesMock = vi.fn().mockResolvedValue(undefined)
        mockedUseQueryClient.mockReturnValue({ invalidateQueries: invalidateQueriesMock })

        const invalidate = useInvalidateQuery(queryKey)

        await invalidate()

        expect(invalidateQueriesMock).toHaveBeenCalledOnce()
        expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey })
      })
    })
  })
})
