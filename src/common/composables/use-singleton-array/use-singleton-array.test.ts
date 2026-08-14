import { useSingletonArray } from '@/common/composables/use-singleton-array/use-single-array'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { nextTick, type Ref } from 'vue'

BddTest().given('a useSingletonArray composable', () => {
  let modelRef = ref<string | null>(null)
  let result: ReturnType<typeof useSingletonArray<string>>

  beforeEach(() => {
    vi.clearAllMocks()
    modelRef = ref<string | null>(null)
    result = mountComposable(() => useSingletonArray(modelRef), {}).result
  })

  BddTest().when('the model ref is null', () => {
    beforeEach(() => {
      modelRef.value = null
    })

    BddTest().then('it should return an empty array', () => {
      expect(result.value).toEqual([])
    })
  })

  BddTest().when('the model ref has a value', () => {
    beforeEach(() => {
      modelRef.value = 'test-value'
    })

    BddTest().then('it should return an array with that value', () => {
      expect(result.value).toEqual(['test-value'])
    })
  })

  BddTest().when('the model ref changes from null to a value', () => {
    beforeEach(async () => {
      modelRef.value = null
      expect(result.value).toEqual([])

      modelRef.value = 'new-value'
      await nextTick()
    })

    BddTest().then('the computed value should update reactively', () => {
      expect(result.value).toEqual(['new-value'])
    })
  })

  BddTest().when('the model ref changes from a value to null', () => {
    beforeEach(async () => {
      modelRef.value = 'old-value'
      expect(result.value).toEqual(['old-value'])

      modelRef.value = null
      await nextTick()
    })

    BddTest().then('the computed value should update reactively to empty array', () => {
      expect(result.value).toEqual([])
    })
  })

  BddTest().when('the setter is called with a non-empty array', () => {
    beforeEach(() => {
      modelRef.value = 'old-value'
      ;(result as { value: string[] }).value = ['new-value']
    })

    BddTest().then('it should update the model ref to the first element', () => {
      expect(modelRef.value).toBe('new-value')
    })
  })

  BddTest().when('the setter is called with an empty array', () => {
    beforeEach(() => {
      modelRef.value = 'old-value'
      ;(result as { value: string[] }).value = []
    })

    BddTest().then('it should update the model ref to null', () => {
      expect(modelRef.value).toBeNull()
    })
  })

  BddTest().when('the setter is called with an array with multiple elements', () => {
    beforeEach(() => {
      modelRef.value = 'old-value'
      ;(result as { value: string[] }).value = ['first', 'second', 'third']
    })

    BddTest().then('it should update the model ref to the first element only', () => {
      expect(modelRef.value).toBe('first')
    })
  })

  BddTest().when('used with a generic type', () => {
    interface TestObject {
      id: number
      name: string
    }

    let objectModelRef: Ref<TestObject | null>
    let objectResult: ReturnType<typeof useSingletonArray<TestObject>>

    beforeEach(() => {
      objectModelRef = ref<TestObject | null>({ id: 1, name: 'test' })
      objectResult = mountComposable(() => useSingletonArray(objectModelRef), {}).result
    })

    BddTest().then('it should return an array with the object', () => {
      expect(objectResult.value).toEqual([{ id: 1, name: 'test' }])
    })

    BddTest().and('the setter is called with a new object', () => {
      beforeEach(() => {
        objectModelRef.value = { id: 2, name: 'updated' }
      })

      BddTest().then('it should update the model ref to the new object', () => {
        expect(objectResult.value).toEqual([{ id: 2, name: 'updated' }])
      })
    })
  })
})
