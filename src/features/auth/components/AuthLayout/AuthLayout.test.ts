import type { VueWrapper } from '@vue/test-utils'
import { FooterStub } from '@/common/components/Footer/Footer.stub'
import { ROUTES } from '@/common/constants'
import AuthLayout from '@/features/auth/global/layouts/AuthLayout/AuthLayout.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountWithRouter } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a layout component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AuthLayout>>

  const stubs = {
    Footer: FooterStub,
  }

  beforeEach(async () => {
    wrapper = await mountWithRouter<typeof AuthLayout>(AuthLayout, { global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the Footer component with correct props', () => {
      const footer = wrapper.findComponent(FooterStub)

      expect(footer.exists()).toBe(true)
      expect(footer.props('accessibilityLink')).toBe(ROUTES.AUTH.ACCESSIBILITY)
      expect(footer.props('cookiesLink')).toBe(ROUTES.AUTH.COOKIES)
      expect(footer.props('legalLink')).toBe(ROUTES.AUTH.LEGAL)
      expect(footer.props('personalDataLink')).toBe(ROUTES.AUTH.PERSONAL_DATA)
    })
  })
})
