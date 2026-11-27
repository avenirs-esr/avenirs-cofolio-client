import { useDrawer } from '@avenirs-esr/shared'
import { defineStore } from 'pinia'

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
