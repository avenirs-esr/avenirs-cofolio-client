import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, expect } from 'vitest'
import { useStaffAdminUsersStore } from '@/features/staff/admin/stores/users.store'

BddTest().given('a staff admin users store', () => {
  let store: ReturnType<typeof useStaffAdminUsersStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useStaffAdminUsersStore()
  })

  BddTest().when('the store is initialized', () => {
    BddTest().then('it should provide users pagination state', () => {
      expect(store.usersCurrentPage).toBeDefined()
      expect(store.usersPageSizeSelected).toBeDefined()
    })

    BddTest().then('it should have default users pagination values', () => {
      expect(store.usersCurrentPage).toBe(0)
      expect(store.usersPageSizeSelected).toBe(PageSizes.TWELVE)
    })

    BddTest().and('updating users pagination', () => {
      BddTest().then('it should allow updating users current page', () => {
        store.usersCurrentPage = 2

        expect(store.usersCurrentPage).toBe(2)
      })

      BddTest().then('it should allow updating users page size', () => {
        store.usersPageSizeSelected = PageSizes.FOUR

        expect(store.usersPageSizeSelected).toBe(PageSizes.FOUR)
      })
    })
  })
})
