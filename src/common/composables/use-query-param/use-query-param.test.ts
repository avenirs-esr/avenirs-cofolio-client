import { useQueryParam, useWatchQueryParam } from '@/common/composables'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'

const query = ref<Record<string, unknown>>({})
const replaceMock = vi.fn()

vi.mock('vue-router', () => ({
  useRoute: () => ({
    get query () {
      return query.value
    },
  }),
  useRouter: () => ({
    replace: replaceMock,
  }),
}))

BddTest().given('a useWatchQueryParam composable', () => {
  const paramName = 'section'

  beforeEach(() => {
    vi.clearAllMocks()
    query.value = {}
  })

  BddTest().when('the composable is mounted and the param does not exist', () => {
    BddTest().then('the handler should be called with null', () => {
      const handlerMock = vi.fn()
      mountComposable(() => useWatchQueryParam(paramName, handlerMock), {})
      expect(handlerMock).toHaveBeenCalledWith(null)
    })
  })

  BddTest().when('the composable is mounted and the param exists', () => {
    const paramValue = 'profile'

    BddTest().then('the handler should be called with the initial value', () => {
      const handlerMock = vi.fn()
      query.value[paramName] = paramValue
      mountComposable(() => useWatchQueryParam(paramName, handlerMock), {})
      expect(handlerMock).toHaveBeenCalledWith(paramValue)
    })
  })

  BddTest().when('the composable is mounted with immediate false', () => {
    BddTest().then('the handler should not be called on initialization', () => {
      const handlerMock = vi.fn()
      query.value[paramName] = 'profile'
      mountComposable(() => useWatchQueryParam(paramName, handlerMock, false), {})
      expect(handlerMock).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the watched query parameter changes', () => {
    const newValue = 'skills'

    BddTest().then('the handler should be called with the new value', async () => {
      const handlerMock = vi.fn()
      mountComposable(() => useWatchQueryParam(paramName, handlerMock), {})
      handlerMock.mockClear()

      query.value = { ...query.value, [paramName]: newValue }
      await nextTick()

      expect(handlerMock).toHaveBeenCalledWith(newValue)
    })
  })

  BddTest().when('a different query parameter changes', () => {
    BddTest().then('the handler should not be called', async () => {
      const handlerMock = vi.fn()
      mountComposable(() => useWatchQueryParam(paramName, handlerMock), {})
      handlerMock.mockClear()

      query.value = { ...query.value, otherParam: 'some-value' }
      await nextTick()

      expect(handlerMock).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the query parameter is removed', () => {
    BddTest().then('the handler should be called with null', async () => {
      const handlerMock = vi.fn()
      query.value[paramName] = 'some-value'
      mountComposable(() => useWatchQueryParam(paramName, handlerMock), {})
      handlerMock.mockClear()

      query.value = {}
      await nextTick()

      expect(handlerMock).toHaveBeenCalledWith(null)
    })
  })

  BddTest().when('the composable is mounted and the param is an array', () => {
    const paramValue = ['profile', 'skills']

    BddTest().then('the handler should be called with the initial array value', () => {
      const handlerMock = vi.fn()
      query.value[paramName] = paramValue
      mountComposable(() => useWatchQueryParam(paramName, handlerMock), {})
      expect(handlerMock).toHaveBeenCalledWith(paramValue)
    })
  })
})

BddTest().given('a useQueryParam composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    query.value = {}
  })

  BddTest().when('setting a query parameter', () => {
    BddTest().then('it should call router.replace with the correct query', () => {
      const { result } = mountComposable(() => useQueryParam(), {})
      const paramName = 'section'
      const paramValue = 'profile'
      result.setQueryParamValue(paramName, paramValue)
      expect(replaceMock).toHaveBeenCalledWith({ query: { [paramName]: paramValue } })
    })
  })

  BddTest().when('setting a query parameter with existing query params', () => {
    BddTest().then('it should call router.replace and preserve existing query params', () => {
      const existingParam = { other: 'value' }
      query.value = existingParam
      const { result } = mountComposable(() => useQueryParam(), {})
      const paramName = 'section'
      const paramValue = 'profile'
      result.setQueryParamValue(paramName, paramValue)
      expect(replaceMock).toHaveBeenCalledWith({ query: { ...existingParam, [paramName]: paramValue } })
    })
  })

  BddTest().when('setting a query parameter to undefined', () => {
    BddTest().then('it should call router.replace without the param', () => {
      const { result } = mountComposable(() => useQueryParam(), {})
      result.setQueryParamValue('section', undefined)
      expect(replaceMock).toHaveBeenCalledWith({ query: {} })
    })
  })

  BddTest().when('setting a query parameter to undefined with existing query params', () => {
    BddTest().then('it should call router.replace preserving other params', () => {
      query.value = { other: 'value', section: 'profile' }
      const { result } = mountComposable(() => useQueryParam(), {})
      result.setQueryParamValue('section', undefined)
      expect(replaceMock).toHaveBeenCalledWith({ query: { other: 'value' } })
    })
  })
})
