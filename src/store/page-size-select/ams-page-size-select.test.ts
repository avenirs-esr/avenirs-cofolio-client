import { PAGE_SIZES } from '@/config'
import { createPinia, setActivePinia } from 'pinia'
import { useAmsPageSizeSelect } from './ams-page-size-select'

describe('useAmsPageSizeSelect', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default page size', () => {
    const store = useAmsPageSizeSelect()
    expect(store.pageSizeSelected).toBe(PAGE_SIZES[0])
  })

  it('should update the selected page size', () => {
    const store = useAmsPageSizeSelect()
    const newValue = PAGE_SIZES[1]
    store.pageSizeSelected = newValue
    expect(store.pageSizeSelected).toBe(newValue)
  })
})
