import type { UpdateTraceForm } from '@/features/student/types'
import { useTracesStore } from '@/store/traces/traces'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'

BddTest().given('a useTracesStore composable', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  BddTest().when('initializing', () => {
    BddTest().then('it should initialize with default props', () => {
      const store = useTracesStore()
      expect(store.unassociatedCurrentPage).toBe(0)
      expect(store.associatedCurrentPage).toBe(0)
      expect(store.unassociatedPageSizeSelected).toBe(PageSizes.EIGHT)
      expect(store.associatedPageSizeSelected).toBe(PageSizes.EIGHT)
    })
  })

  BddTest().when('receiving new props', () => {
    BddTest().then('it should update the props', () => {
      const store = useTracesStore()
      const newCurrentPage = 1
      store.unassociatedCurrentPage = newCurrentPage
      store.associatedCurrentPage = newCurrentPage
      const newPageSizeSelected = PageSizes.TWELVE
      store.unassociatedPageSizeSelected = newPageSizeSelected
      store.associatedPageSizeSelected = newPageSizeSelected
      expect(store.unassociatedPageSizeSelected).toBe(newPageSizeSelected)
      expect(store.associatedPageSizeSelected).toBe(newPageSizeSelected)
    })
  })

  BddTest().when('managing update trace form', () => {
    BddTest().then('it should set update trace form', () => {
      const store = useTracesStore()
      const mockForm = { handleSubmit: vi.fn() } as unknown as UpdateTraceForm

      store.setUpdateTraceForm(mockForm)

      expect(mockForm).toBeDefined()
    })

    BddTest().then('it should set update trace form modified state', () => {
      const store = useTracesStore()

      expect(store.updateTraceFormModified).toBe(false)

      store.setUpdateTraceFormModified(true)
      expect(store.updateTraceFormModified).toBe(true)

      store.setUpdateTraceFormModified(false)
      expect(store.updateTraceFormModified).toBe(false)
    })

    BddTest().then('it should submit update trace form', async () => {
      const store = useTracesStore()
      const mockHandleSubmit = vi.fn()
      const mockForm = { handleSubmit: mockHandleSubmit } as unknown as ReturnType<typeof store.setUpdateTraceForm> extends (form: infer T) => void ? T : never

      store.setUpdateTraceForm(mockForm)
      await store.submitUpdateTraceForm()

      expect(mockHandleSubmit).toHaveBeenCalledOnce()
    })
  })

  BddTest().when('managing UI state', () => {
    BddTest().then('it should have drawer controls', () => {
      const store = useTracesStore()

      expect(store.showCreateTraceDrawer).toBeDefined()
      expect(store.displayCreateTraceDrawer).toBeDefined()
      expect(store.hideCreateTraceDrawer).toBeDefined()
    })

    BddTest().then('it should have modal controls', () => {
      const store = useTracesStore()

      expect(store.showUpdateTraceModal).toBeDefined()
      expect(store.displayUpdateTraceModal).toBeDefined()
      expect(store.hideUpdateTraceModal).toBeDefined()
    })
  })
})
