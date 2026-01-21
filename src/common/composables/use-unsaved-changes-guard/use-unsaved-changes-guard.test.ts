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

type GuardApi = ReturnType<typeof useUnsavedChangesGuard>

function mountWithGuard (opts: {
  isDirty: Ref<boolean>
  openModal: () => void
  closeModal: () => void
  withBeforeUnload?: boolean
}) {
  let guard: GuardApi | null = null

  const TestComp = defineComponent({
    name: 'UnsavedChangesGuardTest',
    setup () {
      guard = useUnsavedChangesGuard(opts)
      return () => null
    }
  })

  const wrapper = mount(TestComp)

  return {
    wrapper,
    getGuard: () => {
      if (!guard) {
        throw new Error('Guard API not initialized')
      }
      return guard
    }
  }
}

BddTest().given('a useUnsavedChangesGuard composable', () => {
  let isDirty: Ref<boolean>
  let openModal: ReturnType<typeof vi.fn>
  let closeModal: ReturnType<typeof vi.fn>

  let addEventListenerSpy: ReturnType<typeof vi.spyOn>
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()
    registeredRouteLeaveGuard = undefined

    isDirty = ref(false)
    openModal = vi.fn()
    closeModal = vi.fn()

    addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
  })

  BddTest().when('the composable is initialized with default options', () => {
    beforeEach(() => {
      mountWithGuard({ isDirty, openModal, closeModal })
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
      mountWithGuard({ isDirty, openModal, closeModal })
    })

    BddTest().then('it should allow navigation and not open modal', async () => {
      const result = await registeredRouteLeaveGuard?.()
      expect(result).toBe(true)
      expect(openModal).not.toHaveBeenCalled()
      expect(closeModal).not.toHaveBeenCalled()
    })
  })

  BddTest().when('navigating away and the form is dirty', () => {
    let guard: GuardApi

    beforeEach(() => {
      isDirty.value = true
      const mounted = mountWithGuard({ isDirty, openModal, closeModal })
      guard = mounted.getGuard()
    })

    BddTest().then('it should open modal and wait for confirmation', async () => {
      const promise = registeredRouteLeaveGuard?.()
      await flushPromises()

      expect(openModal).toHaveBeenCalledTimes(1)

      let resolved = false
      Promise.resolve(promise).then(() => {
        resolved = true
      })
      await flushPromises()

      expect(resolved).toBe(false)
    })

    BddTest().and('user confirms', () => {
      let result: boolean | undefined

      beforeEach(async () => {
        const promise = registeredRouteLeaveGuard?.()
        await flushPromises()

        guard.confirm()
        await flushPromises()

        result = await promise
      })

      BddTest().then('it should allow navigation and close modal', () => {
        expect(result).toBe(true)
        expect(closeModal).toHaveBeenCalledTimes(1)
      })
    })

    BddTest().and('user cancels', () => {
      let result: boolean | undefined

      beforeEach(async () => {
        const promise = registeredRouteLeaveGuard?.()
        await flushPromises()

        guard.cancel()
        await flushPromises()

        result = await promise
      })

      BddTest().then('it should prevent navigation and close modal', () => {
        expect(result).toBe(false)
        expect(closeModal).toHaveBeenCalledTimes(1)
      })
    })
  })

  BddTest().when('using canLeave for internal actions', () => {
    let guard: GuardApi

    beforeEach(() => {
      const mounted = mountWithGuard({ isDirty, openModal, closeModal })
      guard = mounted.getGuard()
    })

    BddTest().then('it should return true immediately when not dirty', async () => {
      isDirty.value = false
      const result = await guard.canLeave()
      expect(result).toBe(true)
      expect(openModal).not.toHaveBeenCalled()
    })

    BddTest().then('it should open modal and wait when dirty', async () => {
      isDirty.value = true
      const promise = guard.canLeave()
      await flushPromises()

      expect(openModal).toHaveBeenCalledTimes(1)

      guard.cancel()
      await flushPromises()

      await expect(promise).resolves.toBe(false)
      expect(closeModal).toHaveBeenCalledTimes(1)
    })
  })

  BddTest().when('withBeforeUnload is false', () => {
    beforeEach(() => {
      mountWithGuard({ isDirty, openModal, closeModal, withBeforeUnload: false })
    })

    BddTest().then('it should not register beforeunload listener', () => {
      expect(addEventListenerSpy).not.toHaveBeenCalledWith('beforeunload', expect.any(Function))
    })
  })

  BddTest().when('beforeunload fires and the form is not dirty', () => {
    beforeEach(() => {
      isDirty.value = false
      mountWithGuard({ isDirty, openModal, closeModal })
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
      mountWithGuard({ isDirty, openModal, closeModal })
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
    beforeEach(() => {
      const mounted = mountWithGuard({ isDirty, openModal, closeModal })
      mounted.wrapper.unmount()
    })

    BddTest().then('it should remove beforeunload listener', () => {
      expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function))
    })
  })
})
