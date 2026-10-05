import { useMenuBurgerStore } from '@/common/stores/menu-burger.store'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, expect } from 'vitest'

BddTest().given('a menu burger store', () => {
  let store: ReturnType<typeof useMenuBurgerStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useMenuBurgerStore()
  })

  BddTest().when('the store is initialized', () => {
    BddTest().then('it should have drawer state hidden by default', () => {
      expect(store.showMenuBurgerDrawer).toBe(false)
    })
  })

  BddTest().when('displayMenuBurgerDrawer is called', () => {
    beforeEach(() => {
      store.displayMenuBurgerDrawer()
    })

    BddTest().then('it should set showMenuBurgerDrawer to true', () => {
      expect(store.showMenuBurgerDrawer).toBe(true)
    })
  })

  BddTest().when('hideMenuBurgerDrawer is called after display', () => {
    beforeEach(() => {
      store.displayMenuBurgerDrawer()
      store.hideMenuBurgerDrawer()
    })

    BddTest().then('it should set showMenuBurgerDrawer back to false', () => {
      expect(store.showMenuBurgerDrawer).toBe(false)
    })
  })
})
