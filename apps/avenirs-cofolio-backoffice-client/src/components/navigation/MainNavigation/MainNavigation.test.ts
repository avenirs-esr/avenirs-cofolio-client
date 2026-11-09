import type { VueWrapper } from '@vue/test-utils'
import { MDI_ICONS, registerNavigationLinkKey } from '@avenirs-esr/avenirs-dsav'
import { AvNavigationStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ICONS } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { beforeEach, expect, vi } from 'vitest'
import MainNavigation from '@/components/navigation/MainNavigation/MainNavigation.vue'
import { ROUTES } from '@/constants'
import router from '@/router'

BddTest().given('a main navigation', () => {
  let wrapper: VueWrapper<InstanceType<typeof MainNavigation>>

  const stubs = { AvNavigation: AvNavigationStub }

  const mountDefault = async () => {
    const wrapper = mountComponent(MainNavigation, {
      global: {
        stubs,
        plugins: [router],
        provide: {
          [registerNavigationLinkKey]: vi.fn()
        }
      },
    })

    await wrapper.vm.$nextTick()
    return wrapper
  }

  const getAvNavigation = () => wrapper.findComponent(AvNavigationStub)
  const getNavItems = () => getAvNavigation().props('navItems')

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      wrapper = await mountDefault()
    })

    BddTest().then('it should render AvNavigation component', () => {
      expect(getAvNavigation().exists()).toBe(true)
    })

    BddTest().then('it should include home navigation item with correct properties', () => {
      expect(getNavItems()[0]).toMatchObject({
        text: 'ACCUEIL',
        to: ROUTES.HOME,
        icon: MDI_ICONS.HOME_VARIANT_OUTLINE,
      })
    })

    BddTest().then('it should include national tools navigation item with correct properties', () => {
      expect(getNavItems()[1]).toMatchObject({
        text: 'OUTILS NATIONAUX',
        to: ROUTES.NATIONAL_TOOLS,
        icon: ICONS.TOOLS,
      })
    })

    BddTest().then('it should include terms of service navigation item with correct properties', () => {
      expect(getNavItems()[2]).toMatchObject({
        text: 'CONDITIONS D\'UTILISATION',
        to: ROUTES.TERMS_OF_SERVICE,
        icon: MDI_ICONS.FILE_DOCUMENT_EDIT_OUTLINE,
      })
    })

    BddTest().then('it should include global alert item with correct properties', () => {
      expect(getNavItems()[3]).toMatchObject({
        text: 'ALERTE GLOBALE',
        to: ROUTES.GLOBAL_ALERT,
        icon: MDI_ICONS.ALERT_OUTLINE,
      })
    })
  })
})
