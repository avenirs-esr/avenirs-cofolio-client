import type { VueWrapper } from '@vue/test-utils'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { EAuthorization } from '@/api/avenir-esr'
import AuthorizationTypeBadge from '@/features/staff/admin/views/InstitutionUserDetailedView/components/badges/AuthorizationTypeBadge/AuthorizationTypeBadge.vue'

BddTest().given('an authorization type badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof AuthorizationTypeBadge>>

  const mountWith = (type: EAuthorization) => {
    wrapper = mount(AuthorizationTypeBadge, {
      props: { type },
      global: { stubs: { AvBadge: AvBadgeStub } },
    })
  }

  const getBadge = () => wrapper.findComponent(AvBadgeStub)

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      mountWith(EAuthorization.EDIT)
    })

    BddTest().then('it should display the configured label', () => {
      expect(getBadge().props('label')).toBeDefined()
    })

    BddTest().then('it should display the configured icon', () => {
      expect(getBadge().props('icon')).toBeDefined()
    })

    BddTest().then('it should apply the neutral colors', () => {
      expect(getBadge().props('backgroundColor')).toBe('var(--light-background-neutral)')
      expect(getBadge().props('color')).toBe('var(--light-foreground-neutral)')
    })

    BddTest().then('it should enable ellipsis', () => {
      expect(getBadge().props('ellipsis')).toBe(true)
    })

    BddTest().then('it should expose the authorization type badge test identifier', () => {
      expect(wrapper.find('[data-testid="authorization-type-badge"]').exists()).toBe(true)
    })
  })
})
