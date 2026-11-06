// @vitest-environment jsdom

import type { BaseApiException } from '#shared/exceptions'
import type { MockInstance } from 'vitest'
import type { Ref } from 'vue'
import { BaseApiErrorCode, useBaseApiExceptionToast, useToasterStore } from '#shared/index'
import { mountComposable } from '#shared/test-utils/mount-composable'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { ref } from 'vue'

BddTest().given('a useBaseApiExceptionToast composable', () => {
  let errorRef: Ref<BaseApiException | null>
  let addErrorMessage: MockInstance<ReturnType<typeof useToasterStore>['addErrorMessage']>
  let unmount: (() => void) | undefined

  function mountToast () {
    const mounted = mountComposable(() => {
      const store = useToasterStore()
      addErrorMessage = vi.spyOn(store, 'addErrorMessage')
      useBaseApiExceptionToast(errorRef)
    }, { useI18n: true, usePinia: true })
    unmount = mounted.unmount
  }

  beforeEach(() => {
    vi.useFakeTimers()
    errorRef = ref(null)
  })

  afterEach(() => {
    unmount?.()
    vi.restoreAllMocks()
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  BddTest().when('no message is provided', () => {
    beforeEach(() => {
      errorRef.value = {
        message: '',
        name: 'Error',
        status: 500,
        code: BaseApiErrorCode.UNKNOWN,
      }
      mountToast()
    })

    BddTest().then('it should add translated generic message', () => {
      expect(addErrorMessage).toHaveBeenCalledExactlyOnceWith('Une erreur est survenue. Veuillez réessayer ultérieurement.')
    })
  })

  BddTest().when('an error message is provided', () => {
    beforeEach(() => {
      errorRef.value = {
        message: 'Error',
        name: 'Error',
        status: 400,
        code: BaseApiErrorCode.BAD_REQUEST,
      }
      mountToast()
    })

    BddTest().then('it should add the error message', () => {
      expect(addErrorMessage).toHaveBeenCalledExactlyOnceWith('Requête invalide')
    })

    BddTest().and('the error is cleared', () => {
      beforeEach(async () => {
        errorRef.value = null
        await vi.runAllTimersAsync()
      })

      BddTest().then('it should not add another message', () => {
        expect(addErrorMessage).toHaveBeenCalledTimes(1)
      })
    })
  })

  BddTest().when('error is null', () => {
    beforeEach(() => {
      mountToast()
    })

    BddTest().then('it should not call addErrorMessage', () => {
      expect(addErrorMessage).not.toHaveBeenCalled()
    })

    BddTest().and('an error arrives after mounting', () => {
      beforeEach(() => {
        errorRef.value = {
          message: 'Error',
          name: 'Error',
          status: 400,
          code: BaseApiErrorCode.BAD_REQUEST,
        }
      })

      BddTest().then('it should reactively add the translated error message', async () => {
        await vi.waitFor(() => {
          expect(addErrorMessage).toHaveBeenCalledExactlyOnceWith('Requête invalide')
        })
      })
    })

    BddTest().and('the component is unmounted before an error arrives', () => {
      beforeEach(async () => {
        unmount?.()
        unmount = undefined
        errorRef.value = {
          message: 'Error',
          name: 'Error',
          status: 400,
          code: BaseApiErrorCode.BAD_REQUEST,
        }
        await vi.runAllTimersAsync()
      })

      BddTest().then('it should no longer add error messages', () => {
        expect(addErrorMessage).not.toHaveBeenCalled()
      })
    })
  })
})
