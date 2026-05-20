import { useEnumRouteQuery } from '@/common/composables/use-enum-route-query/use-enum-route-query'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'

enum TestEnum {
  TEST_1 = 'test-1',
  TEST_2 = 'test-2',
  TEST_3 = 'test-3',
}

enum TestNumericEnum {
  FIRST = 0,
  SECOND = 1,
}

const routeQueryValue = ref<string>('TEST_1')

vi.mock('@vueuse/router', () => ({
  useRouteQuery: (_queryName: string, defaultValue: string) => {
    if (routeQueryValue.value === undefined) {
      routeQueryValue.value = defaultValue
    }
    return routeQueryValue
  },
}))

BddTest().given('a useEnumRouteQuery composable', () => {
  let result: ReturnType<typeof useEnumRouteQuery>

  beforeEach(() => {
    vi.clearAllMocks()
    routeQueryValue.value = 'TEST_1'
  })

  BddTest().when('the composable is initialized with the default key', () => {
    beforeEach(() => {
      result = mountComposable(() => useEnumRouteQuery('tab', TestEnum, TestEnum.TEST_1), {}).result
    })

    BddTest().then('it should return the enum value corresponding to the default key', () => {
      expect(result.value).toBe(TestEnum.TEST_1)
    })
  })

  BddTest().when('the query param holds a valid enum key', () => {
    beforeEach(() => {
      routeQueryValue.value = 'TEST_2'
      result = mountComposable(() => useEnumRouteQuery('tab', TestEnum, TestEnum.TEST_1), {}).result
    })

    BddTest().then('it should return the enum value corresponding to that key', () => {
      expect(result.value).toBe(TestEnum.TEST_2)
    })
  })

  BddTest().when('the query param holds an invalid / unknown key', () => {
    beforeEach(() => {
      routeQueryValue.value = 'UNKNOWN'
      result = mountComposable(() => useEnumRouteQuery('tab', TestEnum, TestEnum.TEST_1), {}).result
    })

    BddTest().then('it should fall back to the default enum value', () => {
      expect(result.value).toBe(TestEnum.TEST_1)
    })
  })

  BddTest().when('the query param changes to another valid key', () => {
    beforeEach(async () => {
      result = mountComposable(() => useEnumRouteQuery('tab', TestEnum, TestEnum.TEST_1), {}).result
      expect(result.value).toBe(TestEnum.TEST_1)

      routeQueryValue.value = 'TEST_3'
      await nextTick()
    })

    BddTest().then('the computed value should update reactively', () => {
      expect(result.value).toBe(TestEnum.TEST_3)
    })
  })

  BddTest().when('the query param changes to an invalid key', () => {
    beforeEach(async () => {
      routeQueryValue.value = 'TEST_2'
      result = mountComposable(() => useEnumRouteQuery('tab', TestEnum, TestEnum.TEST_1), {}).result
      expect(result.value).toBe(TestEnum.TEST_2)

      routeQueryValue.value = 'INVALID'
      await nextTick()
    })

    BddTest().then('the computed value should fall back to the default value', () => {
      expect(result.value).toBe(TestEnum.TEST_1)
    })
  })

  BddTest().when('the setter is called with a valid enum value', () => {
    beforeEach(() => {
      result = mountComposable(() => useEnumRouteQuery('tab', TestEnum, TestEnum.TEST_1), {}).result
      result.value = TestEnum.TEST_3
    })

    BddTest().then('it should update the route query to the corresponding key', () => {
      expect(routeQueryValue.value).toBe('TEST_3')
    })
  })

  BddTest().when('the setter is called with the default enum value', () => {
    beforeEach(() => {
      routeQueryValue.value = 'TEST_2'
      result = mountComposable(() => useEnumRouteQuery('tab', TestEnum, TestEnum.TEST_1), {}).result
      result.value = TestEnum.TEST_1
    })

    BddTest().then('it should set the route query to the default key', () => {
      expect(routeQueryValue.value).toBe('TEST_1')
    })
  })

  BddTest().when('the setter is called with a value that has no matching key', () => {
    beforeEach(() => {
      result = mountComposable(() => useEnumRouteQuery('tab', TestEnum, TestEnum.TEST_1), {}).result
      result.value = 'not-a-valid-enum-value' as unknown as TestEnum
    })

    BddTest().then('it should fall back to the default key in the route query', () => {
      expect(routeQueryValue.value).toBe('TEST_1')
    })
  })

  BddTest().when('the composable is used with a numeric enum', () => {
    beforeEach(() => {
      routeQueryValue.value = 'SECOND'
      result = mountComposable(() => useEnumRouteQuery('tab', TestNumericEnum, TestNumericEnum.FIRST), {}).result
    })

    BddTest().then('it should resolve a query key to a numeric enum value', () => {
      expect(result.value).toBe(TestNumericEnum.SECOND)
    })

    BddTest().and('a numeric value is set', () => {
      beforeEach(() => {
        result.value = TestNumericEnum.FIRST
      })

      BddTest().then('it should update the query key', () => {
        expect(routeQueryValue.value).toBe('FIRST')
      })
    })
  })

  BddTest().when('initialized with a defaultValue that does not exist in the enum', () => {
    beforeEach(() => {
      result = mountComposable(() => useEnumRouteQuery('tab', TestEnum, 'invalid-value' as unknown as TestEnum), {}).result
    })

    BddTest().then('it should fall back to the first enum key', () => {
      expect(result.value).toBe(TestEnum.TEST_1)
    })
  })
})
