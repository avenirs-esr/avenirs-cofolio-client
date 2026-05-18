import { useScrollSpy } from '@/common/composables/use-scroll-spy/use-scroll-spy'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'

BddTest().given('a useScrollSpy composable', () => {
  let result: ReturnType<typeof useScrollSpy>

  beforeEach(() => {
    vi.spyOn(window, 'addEventListener')
    vi.spyOn(window, 'removeEventListener')
  })

  BddTest().when('mounted with element ids', () => {
    beforeEach(() => {
      const el1 = document.createElement('div')
      el1.id = 'TITLE'
      const el2 = document.createElement('div')
      el2.id = 'THEMATIC'
      document.body.appendChild(el1)
      document.body.appendChild(el2)

      const { result: composableResult } = mountComposable(
        () => useScrollSpy(['TITLE', 'THEMATIC']),
        {}
      )
      result = composableResult
    })

    BddTest().then('it should add a scroll listener', () => {
      expect(window.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true })
    })

    BddTest().then('it should initialize activeElementId', () => {
      expect(result.activeElementId.value).toBeDefined()
    })
  })

  BddTest().when('unmounted', () => {
    BddTest().then('it should remove the scroll listener', () => {
      const { unmount } = mountComposable(
        () => useScrollSpy(['TITLE', 'THEMATIC']),
        {}
      )
      unmount()
      expect(window.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function))
    })
  })

  BddTest().when('scrolling to a section', () => {
    BddTest().then('it should update activeElementId to the closest element', async () => {
      const el = document.createElement('div')
      el.id = 'TITLE'
      document.body.appendChild(el)

      vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
        top: 100,
        bottom: 200,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      })

      const { result: composableResult } = mountComposable(
        () => useScrollSpy(['TITLE']),
        {}
      )

      await nextTick()
      expect(composableResult.activeElementId.value).toBe('TITLE')
      document.body.removeChild(el)
    })
  })
})
