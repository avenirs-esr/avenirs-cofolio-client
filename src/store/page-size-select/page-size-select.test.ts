import { PAGE_SIZES } from '@/constants'
import { usePageSizeSelect } from '@/store'
import { createPinia, setActivePinia } from 'pinia'

describe('usePageSizeSelect', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default page size', () => {
    const store = usePageSizeSelect()
    expect(store.pageSizeSelected).toBe(PAGE_SIZES[0])
  })

  it('should update the selected page size', () => {
    const store = usePageSizeSelect()
    const newValue = PAGE_SIZES[1]
    store.pageSizeSelected = newValue
    expect(store.pageSizeSelected).toBe(newValue)
  })
})
