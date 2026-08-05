import DeclaredProgramOrganizationBadge
  from '@/features/student/personalCareer/components/badges/DeclaredProgramOrganizationBadge/DeclaredProgramOrganizationBadge.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

const stubs = {
  AvBadge: AvBadgeStub
}

BddTest().given('a declared program organization badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramOrganizationBadge>>

  BddTest().when('mounted with only an organization', () => {
    beforeEach(() => {
      wrapper = mount(DeclaredProgramOrganizationBadge, {
        props: { organization: 'Université Paris-Saclay' },
        global: { stubs }
      })
    })

    BddTest().then('it should render the badge with the organization as label', () => {
      const badge = wrapper.findComponent(AvBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe('Université Paris-Saclay')
    })

    BddTest().then('it should render the badge with correct props', () => {
      const badge = wrapper.findComponent(AvBadgeStub)
      expect(badge.props('icon')).toBe(MDI_ICONS.BUILDING)
      expect(badge.props('color')).toBe('var(--text1)')
      expect(badge.props('backgroundColor')).toBe('transparent')
      expect(badge.props('ellipsis')).toBe(true)
    })
  })

  BddTest().when('mounted with an organization and a period', () => {
    beforeEach(() => {
      wrapper = mount(DeclaredProgramOrganizationBadge, {
        props: { organization: 'Université Paris-Saclay', period: '2025 - 2027' },
        global: { stubs }
      })
    })

    BddTest().then('it should render the badge with the organization and period combined as label', () => {
      const badge = wrapper.findComponent(AvBadgeStub)
      expect(badge.props('label')).toBe('Université Paris-Saclay • 2025 - 2027')
    })
  })
})
