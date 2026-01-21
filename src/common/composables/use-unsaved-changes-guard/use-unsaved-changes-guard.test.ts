import type { Ref } from 'vue'
import { useUnsavedChangesGuard } from '@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

let registeredRouteLeaveGuard: undefined | (() => boolean | Promise<boolean>)

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    onBeforeRouteLeave: (cb: () => boolean | Promise<boolean>) => {
      registeredRouteLeaveGuard = cb
    }
  }
})

function mountWithGuard (opts: {
  isDirty: Ref<boolean>
  confirmLeave: () => boolean | Promise<boolean>
  withBeforeUnload?: boolean
}) {
  const TestComp = defineComponent({
    name: 'UnsavedChangesGuardTest',
    setup () {
      useUnsavedChangesGuard(opts)
      return () => null
    }
  })

  return mount(TestComp)
}

BddTest().given('a useUnsavedChangesGuard composable', () => {
  let isDirty: Ref<boolean>
  let confirmLeave: ReturnType<typeof vi.fn>

  let addEventListenerSpy: ReturnType<typeof vi.spyOn>
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()
    registeredRouteLeaveGuard = undefined

    isDirty = ref(false)
    confirmLeave = vi.fn()

    addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
  })

  BddTest().when('the composable is initialized with default options', () => {
    beforeEach(() => {
      mountWithGuard({ isDirty, confirmLeave })
    })

    BddTest().then('it should register a route leave guard', () => {
      expect(registeredRouteLeaveGuard).toBeDefined()
      expect(typeof registeredRouteLeaveGuard).toBe('function')
    })

    BddTest().then('it should register beforeunload listener on mount', () => {
      expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function))
    })
  })

  BddTest().when('navigating away and the form is not dirty', () => {
    beforeEach(() => {
      mountWithGuard({ isDirty, confirmLeave })
    })

    BddTest().then('it should allow navigation and not call confirmLeave', async () => {
      const result = await registeredRouteLeaveGuard?.()
      expect(result).toBe(true)
      expect(confirmLeave).not.toHaveBeenCalled()
    })
  })

  BddTest().when('navigating away and the form is dirty with sync confirmLeave returning true', () => {
    beforeEach(() => {
      isDirty.value = true
      confirmLeave.mockReturnValue(true)
      mountWithGuard({ isDirty, confirmLeave })
    })

    BddTest().then('it should call confirmLeave and allow navigation', async () => {
      const result = await registeredRouteLeaveGuard?.()
      expect(confirmLeave).toHaveBeenCalledTimes(1)
      expect(result).toBe(true)
    })
  })

  BddTest().when('navigating away and the form is dirty with sync confirmLeave returning false', () => {
    beforeEach(() => {
      isDirty.value = true
      confirmLeave.mockReturnValue(false)
      mountWithGuard({ isDirty, confirmLeave })
    })

    BddTest().then('it should call confirmLeave and prevent navigation', async () => {
      const result = await registeredRouteLeaveGuard?.()
      expect(confirmLeave).toHaveBeenCalledTimes(1)
      expect(result).toBe(false)
    })
  })

  BddTest().when('navigating away and the form is dirty with async confirmLeave resolving true', () => {
    beforeEach(() => {
      isDirty.value = true
      confirmLeave.mockResolvedValue(true)
      mountWithGuard({ isDirty, confirmLeave })
    })

    BddTest().then('it should await confirmLeave and allow navigation', async () => {
      const resultPromise = registeredRouteLeaveGuard?.()
      await flushPromises()
      const result = await resultPromise
      expect(confirmLeave).toHaveBeenCalledTimes(1)
      expect(result).toBe(true)
    })
  })

  BddTest().when('navigating away and confirmLeave throws', () => {
    beforeEach(() => {
      isDirty.value = true
      confirmLeave.mockImplementation(() => {
        throw new Error('boom')
      })
      mountWithGuard({ isDirty, confirmLeave })
    })

    BddTest().then('it should prevent navigation', async () => {
      const result = await registeredRouteLeaveGuard?.()
      expect(confirmLeave).toHaveBeenCalledTimes(1)
      expect(result).toBe(false)
    })
  })

  BddTest().when('withBeforeUnload is false', () => {
    beforeEach(() => {
      mountWithGuard({ isDirty, confirmLeave, withBeforeUnload: false })
    })

    BddTest().then('it should not register beforeunload listener', () => {
      expect(addEventListenerSpy).not.toHaveBeenCalledWith('beforeunload', expect.any(Function))
    })
  })

  BddTest().when('beforeunload fires and the form is not dirty', () => {
    beforeEach(() => {
      isDirty.value = false
      mountWithGuard({ isDirty, confirmLeave })
    })

    BddTest().then('it should not prevent unload', () => {
      const handler = addEventListenerSpy.mock.calls.find(([type]) => type === 'beforeunload')?.[1] as
        | ((e: BeforeUnloadEvent) => void)
        | undefined

      expect(handler).toBeDefined()

      const e = {
        preventDefault: vi.fn(),
        returnValue: undefined
      } as unknown as BeforeUnloadEvent

      handler?.(e)

      expect(e.preventDefault).not.toHaveBeenCalled()
      expect(e.returnValue).toBeUndefined()
    })
  })

  BddTest().when('beforeunload fires and the form is dirty', () => {
    beforeEach(() => {
      isDirty.value = true
      mountWithGuard({ isDirty, confirmLeave })
    })

    BddTest().then('it should prevent unload and set returnValue', () => {
      const handler = addEventListenerSpy.mock.calls.find(([type]) => type === 'beforeunload')?.[1] as
        | ((e: BeforeUnloadEvent) => void)
        | undefined

      expect(handler).toBeDefined()

      const e = {
        preventDefault: vi.fn(),
        returnValue: undefined
      } as unknown as BeforeUnloadEvent

      handler?.(e)

      expect(e.preventDefault).toHaveBeenCalledTimes(1)
      expect(e.returnValue).toBe('')
    })
  })

  BddTest().when('the component using the guard is unmounted', () => {
    let wrapper: ReturnType<typeof mount>

    beforeEach(() => {
      wrapper = mountWithGuard({ isDirty, confirmLeave })
      wrapper.unmount()
    })

    BddTest().then('it should remove beforeunload listener', () => {
      expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function))
    })
  })
})
