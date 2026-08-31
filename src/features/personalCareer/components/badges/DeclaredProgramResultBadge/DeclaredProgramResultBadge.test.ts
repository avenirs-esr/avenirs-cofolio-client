import DeclaredProgramResultBadge
  from '@/features/personalCareer/components/badges/DeclaredProgramResultBadge/DeclaredProgramResultBadge.vue'
import { RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

const stubs = {
  AvBadge: AvBadgeStub
}

BddTest().given('a declared program result badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramResultBadge>>

  BddTest().when('mounted with a result', () => {
    beforeEach(() => {
      wrapper = mount(DeclaredProgramResultBadge, {
        props: { result: 'Mention Très Bien' },
        global: { stubs }
      })
    })

    BddTest().then('it should render the badge with the result as label', () => {
      const badge = wrapper.findComponent(AvBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe('Mention Très Bien')
    })

    BddTest().then('it should render the badge with correct props', () => {
      const badge = wrapper.findComponent(AvBadgeStub)
      expect(badge.props('icon')).toBe(RI_ICONS.LAYOUT_6_LINE)
      expect(badge.props('color')).toBe('var(--card2)')
      expect(badge.props('backgroundColor')).toBe('var(--dark-background-primary1)')
      expect(badge.props('ellipsis')).toBe(true)
    })
  })
})
