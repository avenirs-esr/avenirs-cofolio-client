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
      expect(store.additionalCurrentPage).toBe(0)
      expect(store.additionalPageSizeSelected).toBe(PageSizes.FOUR)
    })

    it('then it should have additional skills drawer state', () => {
      expect(store.showCreateAdditionalSkillDrawer).toBe(false)
      expect(typeof store.displayCreateAdditionalSkillDrawer).toBe('function')
      expect(typeof store.hideCreateAdditionalSkillDrawer).toBe('function')
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

  describe('when additional skills drawer is managed', () => {
    it('then it should display drawer when displayCreateAdditionalSkillDrawer is called', () => {
      store.displayCreateAdditionalSkillDrawer()
      expect(store.showCreateAdditionalSkillDrawer).toBe(true)
    })

    it('then it should hide drawer when hideCreateAdditionalSkillDrawer is called', () => {
      store.displayCreateAdditionalSkillDrawer()
      expect(store.showCreateAdditionalSkillDrawer).toBe(true)

      store.hideCreateAdditionalSkillDrawer()
      expect(store.showCreateAdditionalSkillDrawer).toBe(false)
    })
  })
})
