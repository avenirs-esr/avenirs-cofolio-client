import { PAGE_SIZE } from '@/config'
import { createPinia, setActivePinia } from 'pinia'
import { useTracePageSizePicker } from './trace-page-size-picker'

describe('useTracePageSizePicker', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default page size', () => {
    const store = useTracePageSizePicker()
    expect(store.pageSize).toBe(PAGE_SIZE[0])
  })

  it('should update the selected page size', () => {
    const store = useTracePageSizePicker()
    const newValue = PAGE_SIZE[1]
    store.pageSize = newValue
    expect(store.pageSize).toBe(newValue)
  })
})
