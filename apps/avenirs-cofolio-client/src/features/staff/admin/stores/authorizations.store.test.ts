import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, expect } from 'vitest'
import { useStaffAdminAuthorizationsStore } from '@/features/staff/admin/stores/authorizations.store'

BddTest().given('a staff admin authorizations store', () => {
  let store: ReturnType<typeof useStaffAdminAuthorizationsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useStaffAdminAuthorizationsStore()
  })

  BddTest().when('the store is initialized', () => {
    BddTest().then('it should provide authorizations pagination state', () => {
      expect(store.authorizationsCurrentPage).toBeDefined()
      expect(store.authorizationsPageSizeSelected).toBeDefined()
    })

    BddTest().then('it should have default authorizations pagination values', () => {
      expect(store.authorizationsCurrentPage).toBe(0)
      expect(store.authorizationsPageSizeSelected).toBe(PageSizes.TWELVE)
    })

    BddTest().and('updating authorizations pagination', () => {
      BddTest().then('it should allow updating authorizations current page', () => {
        store.authorizationsCurrentPage = 2

        expect(store.authorizationsCurrentPage).toBe(2)
      })

      BddTest().then('it should allow updating authorizations page size', () => {
        store.authorizationsPageSizeSelected = PageSizes.FOUR

        expect(store.authorizationsPageSizeSelected).toBe(PageSizes.FOUR)
      })
    })
  })
})
