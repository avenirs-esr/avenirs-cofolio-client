import { PAGE_SIZE } from '@/config'
import { createPinia, setActivePinia } from 'pinia'
import { useAmsPageSizePicker } from './ams-page-size-picker'

describe('useAmsPageSizePicker', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default page size', () => {
    const store = useAmsPageSizePicker()
    expect(store.pageSize).toBe(PAGE_SIZE[0])
  })

  it('should update the selected page size', () => {
    const store = useAmsPageSizePicker()
    const newValue = PAGE_SIZE[1]
    store.pageSize = newValue
    expect(store.pageSize).toBe(newValue)
  })
})
