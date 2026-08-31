import type { VueWrapper } from '@vue/test-utils'
import { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import SelfKnowledgeCategoryBadge
  from '@/features/selfKnowledge/components/badges/SelfKnowledgeCategoryBadge/SelfKnowledgeCategoryBadge.vue'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'

BddTest().given('a self knowledge category badge', () => {
  let wrapper: VueWrapper

  const stubs = { AvBadge: AvBadgeStub }

  const mountBadge = (categoryType: ESelfKnowledgeCategory) => {
    wrapper = mount(SelfKnowledgeCategoryBadge, {
      props: { categoryType },
      global: { stubs }
    })
  }

  BddTest().when('the component is mounted with the values category', () => {
    beforeEach(() => {
      mountBadge(ESelfKnowledgeCategory.VALUES)
    })

    BddTest().then('it should display the singular category label prefixed by a hash', () => {
      expect(wrapper.findComponent(AvBadgeStub).props('label')).toBe('# valeur')
    })

    BddTest().then('it should apply the light primary1 background and the dark primary1 text color', () => {
      const badge = wrapper.findComponent(AvBadgeStub)
      expect(badge.props('backgroundColor')).toBe('var(--light-background-primary1)')
      expect(badge.props('color')).toBe('var(--dark-background-primary1)')
    })

    BddTest().then('it should render a small ellipsed badge exposing its test id', () => {
      const badge = wrapper.findComponent(AvBadgeStub)
      expect(badge.props('small')).toBe(true)
      expect(badge.props('ellipsis')).toBe(true)
      expect(wrapper.find('[data-testid="self-knowledge-category-badge"]').exists()).toBe(true)
    })
  })

  BddTest().when('the component is mounted with the strengths category', () => {
    beforeEach(() => {
      mountBadge(ESelfKnowledgeCategory.STRENGTHS)
    })

    BddTest().then('it should display the singular strengths label', () => {
      expect(wrapper.findComponent(AvBadgeStub).props('label')).toBe('# point fort')
    })
  })

  BddTest().when('the component is mounted with the improvement category', () => {
    beforeEach(() => {
      mountBadge(ESelfKnowledgeCategory.IMPROVEMENT)
    })

    BddTest().then('it should display the singular improvement label', () => {
      expect(wrapper.findComponent(AvBadgeStub).props('label')).toBe('# axe d\'amélioration')
    })
  })
})
