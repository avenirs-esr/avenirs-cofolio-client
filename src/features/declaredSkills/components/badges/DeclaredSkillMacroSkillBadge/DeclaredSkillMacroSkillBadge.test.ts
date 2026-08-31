import DeclaredSkillMacroSkillBadge from '@/features/declaredSkills/components/badges/DeclaredSkillMacroSkillBadge/DeclaredSkillMacroSkillBadge.vue'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

const stubs = {
  AvBadge: AvBadgeStub
}

function createWrapper (pathSegments: string[]) {
  return mount(DeclaredSkillMacroSkillBadge, {
    props: {
      pathSegments
    },
    global: {
      stubs
    }
  })
}

BddTest().given('a declared skill macro skill badge component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredSkillMacroSkillBadge>>

  BddTest().when('mounted with multiple path segments', () => {
    beforeEach(() => {
      wrapper = createWrapper(['Domaine', 'Enjeu', 'Macro-compétence'])
    })

    BddTest().then('it should render the badge with all segments joined', () => {
      const badge = wrapper.findComponent(AvBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe('Domaine > Enjeu > Macro-compétence')
    })

    BddTest().then('it should render the badge with correct props', () => {
      const badge = wrapper.findComponent(AvBadgeStub)
      expect(badge.props('color')).toBe('var(--dark-background-accent)')
      expect(badge.props('backgroundColor')).toBe('var(--light-background-accent)')
      expect(badge.props('small')).toBe(true)
      expect(badge.props('ellipsis')).toBe(true)
    })
  })

  BddTest().when('mounted with a single path segment', () => {
    beforeEach(() => {
      wrapper = createWrapper(['Macro-compétence unique'])
    })

    BddTest().then('it should render the badge with the single segment', () => {
      const badge = wrapper.findComponent(AvBadgeStub)
      expect(badge.props('label')).toBe('Macro-compétence unique')
    })
  })
})
