import { PAGE_SIZES } from '@/config'
import { createPinia, setActivePinia } from 'pinia'
import { useAmsPaginationSizePicker } from './ams-pagination-size-picker'

describe('useAmsPaginationSizePicker', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default page size', () => {
    const store = useAmsPaginationSizePicker()
    expect(store.pageSizeSelected).toBe(PAGE_SIZES[0])
  })

  it('should update the selected page size', () => {
    const store = useAmsPaginationSizePicker()
    const newValue = PAGE_SIZES[1]
    store.pageSizeSelected = newValue
    expect(store.pageSizeSelected).toBe(newValue)
  })
})
