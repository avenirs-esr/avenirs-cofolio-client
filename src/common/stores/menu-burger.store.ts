import { defineStore } from 'pinia'
import { useDrawer } from '@/common/composables'

export const useMenuBurgerStore = defineStore('menuBurger', () => {
  const {
    showDrawer: showMenuBurgerDrawer,
    displayDrawer: displayMenuBurgerDrawer,
    hideDrawer: hideMenuBurgerDrawer
  } = useDrawer()

  return {
    showMenuBurgerDrawer,
    displayMenuBurgerDrawer,
    hideMenuBurgerDrawer
  }
})
