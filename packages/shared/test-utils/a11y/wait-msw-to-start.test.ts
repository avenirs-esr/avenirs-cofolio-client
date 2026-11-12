import type { Page } from '@playwright/test'
import { waitMswToStart } from '#shared/test-utils/a11y/index'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('the shared MSW wait helper', () => {
  BddTest().when('network idle is still pending', () => {
    let pendingBeforeNetworkIdle: boolean
    let completedAfterNetworkIdle: boolean

    beforeEach(async () => {
      let finishDomLoaded: () => void = () => {}
      let finishNetworkIdle: () => void = () => {}
      const domLoaded = new Promise<void>((resolve) => {
        finishDomLoaded = resolve
      })
      const networkIdle = new Promise<void>((resolve) => {
        finishNetworkIdle = resolve
      })
      const waitForLoadState = vi.fn<Page['waitForLoadState']>()
      waitForLoadState.mockImplementation((state: string | undefined) => {
        if (state === 'domcontentloaded')
          return domLoaded
        if (state === 'networkidle')
          return networkIdle
        return Promise.resolve()
      })
      const waitForTimeout = vi.fn<Page['waitForTimeout']>()
      waitForTimeout.mockResolvedValue(undefined)
      const page = {
        waitForLoadState,
        waitForTimeout,
      } as unknown as Page
      let completed = false
      const waiting = waitMswToStart(page).then(() => {
        completed = true
      })
      await Promise.resolve()
      finishDomLoaded()
      await Promise.resolve()
      pendingBeforeNetworkIdle = !completed
      finishNetworkIdle()
      await waiting
      completedAfterNetworkIdle = completed
    })

    BddTest().then('it completes only after both DOM and network waits resolve', () => {
      expect(pendingBeforeNetworkIdle).toBe(true)
      expect(completedAfterNetworkIdle).toBe(true)
    })
  })

  BddTest().when('network idle times out', () => {
    let completed = false
    let error: unknown

    beforeEach(async () => {
      let finishDomLoaded: () => void = () => {}
      const domLoaded = new Promise<void>((resolve) => {
        finishDomLoaded = resolve
      })
      const networkIdleTimeout = new Promise<void>((_, reject) => {
        setTimeout(() => reject(new Error('networkidle timeout')), 50)
      })
      const waitForLoadState = vi.fn<Page['waitForLoadState']>()
      waitForLoadState.mockImplementation((state: string | undefined) => {
        if (state === 'domcontentloaded')
          return domLoaded
        if (state === 'networkidle')
          return networkIdleTimeout
        return Promise.resolve()
      })
      const waitForTimeout = vi.fn<Page['waitForTimeout']>()
      waitForTimeout.mockResolvedValue(undefined)
      const page = {
        waitForLoadState,
        waitForTimeout,
      } as unknown as Page
      const waiting = waitMswToStart(page).then(() => {
        completed = true
      }).catch((cause) => {
        error = cause
      })
      finishDomLoaded()
      await waiting
    })

    BddTest().then('it recovers from network idle timeout and completes', () => {
      expect(completed).toBe(true)
      expect(error).toBeUndefined()
    })
  })

  BddTest().when('DOM load fails', () => {
    const failure = new Error('DOM load failed')
    let error: unknown

    beforeEach(async () => {
      const waitForLoadState = vi.fn<Page['waitForLoadState']>()
      waitForLoadState.mockImplementation((state: string | undefined) => {
        if (state === 'domcontentloaded')
          return Promise.reject(failure)
        return Promise.resolve()
      })
      const waitForTimeout = vi.fn<Page['waitForTimeout']>()
      waitForTimeout.mockResolvedValue(undefined)
      const page = {
        waitForLoadState,
        waitForTimeout,
      } as unknown as Page
      error = await waitMswToStart(page).catch(cause => cause)
    })

    BddTest().then('it propagates the DOM load failure', () => {
      expect(error).toBeInstanceOf(Error)
      expect((error as Error).message).toContain('Failed to wait for MSW to start')
    })
  })

  BddTest().when('the page reaches network idle normally', () => {
    let callCount = 0

    beforeEach(async () => {
      const waitForLoadState = vi.fn<Page['waitForLoadState']>()
      waitForLoadState.mockImplementation(() => Promise.resolve())
      const waitForTimeout = vi.fn<Page['waitForTimeout']>()
      waitForTimeout.mockResolvedValue(undefined)
      const page = {
        waitForLoadState,
        waitForTimeout,
      } as unknown as Page
      await waitMswToStart(page)
      callCount = waitForLoadState.mock.calls.length
    })

    BddTest().then('it calls waitForLoadState for both domcontentloaded and networkidle', () => {
      expect(callCount).toBeGreaterThanOrEqual(2)
    })
  })
})
