import { createPinia, setActivePinia } from 'pinia'
import { useTracePagination } from './trace-pagination'

describe('useTracePagination', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default page size', () => {
    const store = useTracePagination()
    expect(store.currentPage).toBe(0)
  })

  it('should update the selected page size', () => {
    const store = useTracePagination()
    const newValue = 1
    store.currentPage = newValue
    expect(store.currentPage).toBe(newValue)
  })
})
