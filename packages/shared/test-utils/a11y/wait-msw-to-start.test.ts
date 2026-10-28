import type { Page } from '@playwright/test'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { waitMswToStart } from '@avenirs-esr/shared/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('the shared MSW wait helper', () => {
  BddTest().when('network idle is still pending', () => {
    let pendingBeforeNetworkIdle: boolean
    let completedAfterNetworkIdle: boolean

    beforeEach(async () => {
      let finishNetworkIdle: () => void = () => {}
      const networkIdle = new Promise<void>((resolve) => {
        finishNetworkIdle = resolve
      })
      const waitForLoadState = vi.fn<Page['waitForLoadState']>().mockReturnValue(networkIdle)
      const page = {} as Page
      page.waitForLoadState = waitForLoadState
      let completed = false
      const waiting = waitMswToStart(page).then(() => {
        completed = true
      })
      await Promise.resolve()
      pendingBeforeNetworkIdle = !completed
      finishNetworkIdle()
      await waiting
      completedAfterNetworkIdle = completed
    })

    BddTest().then('it completes only after the page wait resolves', () => {
      expect(pendingBeforeNetworkIdle).toBe(true)
      expect(completedAfterNetworkIdle).toBe(true)
    })
  })

  BddTest().when('the page wait rejects', () => {
    const failure = new Error('Network idle failed')
    let error: unknown

    beforeEach(async () => {
      const waitForLoadState = vi.fn<Page['waitForLoadState']>().mockRejectedValue(failure)
      const page = {} as Page
      page.waitForLoadState = waitForLoadState
      error = await waitMswToStart(page).catch(cause => cause)
    })

    BddTest().then('it propagates the original wait failure', () => {
      expect(error).toBe(failure)
    })
  })

  BddTest().when('the page reaches network idle', () => {
    const waitForLoadState = vi.fn<Page['waitForLoadState']>().mockResolvedValue(undefined)
    const page = {} as Page
    page.waitForLoadState = waitForLoadState

    beforeEach(async () => {
      await waitMswToStart(page)
    })

    BddTest().then('it preserves the existing networkidle-only wait', () => {
      expect(waitForLoadState).toHaveBeenCalledExactlyOnceWith('networkidle')
    })
  })
})
