import { PAGE_SIZES } from '@/config'
import { createPinia, setActivePinia } from 'pinia'
import { useTracePaginationSizePicker } from './trace-pagination-size-picker'

describe('useTracePaginationSizePicker', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default page size', () => {
    const store = useTracePaginationSizePicker()
    expect(store.pageSizeSelected).toBe(PAGE_SIZES[0])
  })

  it('should update the selected page size', () => {
    const store = useTracePaginationSizePicker()
    const newValue = PAGE_SIZES[1]
    store.pageSizeSelected = newValue
    expect(store.pageSizeSelected).toBe(newValue)
  })
})
