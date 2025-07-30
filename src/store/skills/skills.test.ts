import { useSkillsStore } from '@/store/skills/skills'
import { PageSizes } from '@/ui/config'
import { createPinia, setActivePinia } from 'pinia'

describe('given a skills store', () => {
  let store: ReturnType<typeof useSkillsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useSkillsStore()
  })

  describe('when the store is initialized', () => {
    it('then it should have the default props', () => {
      expect(store.currentPage).toBe(0)
      expect(store.pageSizeSelected).toBe(PageSizes.FOUR)
    })
  })

  describe('when the props are updated', () => {
    it('then it should have the updated props', () => {
      const newCurrentPage = 1
      store.currentPage = newCurrentPage
      const newPageSizeSelected = PageSizes.TWELVE
      store.pageSizeSelected = newPageSizeSelected
      expect(store.pageSizeSelected).toBe(newPageSizeSelected)
    })
  })
})
