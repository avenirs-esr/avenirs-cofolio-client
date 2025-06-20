import { PageSizes } from '@/config'
import { createPinia, setActivePinia } from 'pinia'
import { useTracesStore } from './traces'

describe('useTracesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default props', () => {
    const store = useTracesStore()
    expect(store.currentPage).toBe(0)
    expect(store.pageSizeSelected).toBe(PageSizes.EIGHT)
  })

  it('should update the props', () => {
    const store = useTracesStore()
    const newCurrentPage = 1
    store.currentPage = newCurrentPage
    const newPageSizeSelected = PageSizes.TWELVE
    store.pageSizeSelected = newPageSizeSelected
    expect(store.pageSizeSelected).toBe(newPageSizeSelected)
  })
})
