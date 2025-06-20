import { PageSizes } from '@/config'
import { createPinia, setActivePinia } from 'pinia'
import { useAmsStore } from './ams'

describe('useAmsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default props', () => {
    const store = useAmsStore()
    expect(store.currentPage).toBe(0)
    expect(store.pageSizeSelected).toBe(PageSizes.FOUR)
  })

  it('should update the props', () => {
    const store = useAmsStore()
    const newCurrentPage = 1
    store.currentPage = newCurrentPage
    const newPageSizeSelected = PageSizes.TWELVE
    store.pageSizeSelected = newPageSizeSelected
    expect(store.pageSizeSelected).toBe(newPageSizeSelected)
  })
})
