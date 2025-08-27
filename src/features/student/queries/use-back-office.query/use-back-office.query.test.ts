import { mountQueryComposable } from '@/ui/tests/utils'
import { flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest'
import { useBackOfficeBuildLifeProjectConfigQuery } from './use-back-office.query'

vi.mock('@/api/avenir-esr', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/api/avenir-esr')>()
  return {
    ...original,
    getBuildLifeProjectConfig: vi.fn()
  }
})

describe('useBackOfficeBuildLifeProjectConfigQuery', () => {
  let getBuildLifeProjectConfigSpy: MockInstance<() => Promise<any>>

  beforeEach(async () => {
    getBuildLifeProjectConfigSpy = vi.spyOn(await import('@/api/avenir-esr'), 'getBuildLifeProjectConfig')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should call the API and return configuration data', async () => {
    const mockData = {
      someProperty: 'value',
      anotherProperty: 42
    }
    getBuildLifeProjectConfigSpy.mockResolvedValue(mockData)

    const queryReturn = mountQueryComposable(() => useBackOfficeBuildLifeProjectConfigQuery())
    await flushPromises()

    expect(getBuildLifeProjectConfigSpy).toHaveBeenCalledTimes(1)
    expect(queryReturn.data.value).toEqual(mockData)
    expect(queryReturn.isSuccess.value).toBe(true)
    expect(queryReturn.isError.value).toBe(false)
  })
})
