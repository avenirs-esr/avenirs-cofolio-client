import DeclaredExperienceOrganizationBadge
  from '@/features/student/personalCareer/components/badges/DeclaredExperienceOrganizationBadge/DeclaredExperienceOrganizationBadge.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

const stubs = {
  AvBadge: AvBadgeStub
}

BddTest().given('a declared experience organization badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceOrganizationBadge>>

  BddTest().when('mounted with an organization', () => {
    beforeEach(() => {
      wrapper = mount(DeclaredExperienceOrganizationBadge, {
        props: { organization: 'AVENIR(S)' },
        global: { stubs }
      })
    })

    BddTest().then('it should render the badge with the organization as label', () => {
      const badge = wrapper.findComponent(AvBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe('AVENIR(S)')
    })

    BddTest().then('it should render the badge with correct props', () => {
      const badge = wrapper.findComponent(AvBadgeStub)
      expect(badge.props('icon')).toBe(MDI_ICONS.MAP_MARKER_OUTLINE)
      expect(badge.props('color')).toBe('var(--text2)')
      expect(badge.props('backgroundColor')).toBe('transparent')
      expect(badge.props('ellipsis')).toBe(true)
    })
  })
})
