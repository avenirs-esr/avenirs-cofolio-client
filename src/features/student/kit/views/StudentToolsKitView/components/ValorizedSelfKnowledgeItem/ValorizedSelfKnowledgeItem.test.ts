import type { SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import ValorizedSelfKnowledgeItem
  from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedSelfKnowledgeItem/ValorizedSelfKnowledgeItem.vue'
import { AvBadgeStub, AvButtonStub, AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'

const element: SelfKnowledgeElementViewDTO = {
  id: 'element-1',
  title: 'Travail d\'équipe',
  description: 'Je travaille efficacement avec les autres',
  rating: 4,
  category: { type: ESelfKnowledgeCategory.VALUES, mandatory: true }
}

BddTest().given('a valorized self knowledge item', () => {
  let wrapper: VueWrapper<InstanceType<typeof ValorizedSelfKnowledgeItem>>

  const stubs = {
    AvBadge: AvBadgeStub,
    AvButton: AvButtonStub,
    AvTooltip: AvTooltipStub
  }

  const mountItem = async (showCategoryBadge: boolean) => {
    wrapper = mountComponent(ValorizedSelfKnowledgeItem, {
      props: { element, showCategoryBadge },
      global: { stubs }
    })
    await flushPromises()
  }

  BddTest().when('the category badge is displayed', () => {
    beforeEach(async () => {
      await mountItem(true)
    })

    BddTest().then('it should render the element title', () => {
      expect(wrapper.text()).toContain('Travail d\'équipe')
    })

    BddTest().then('it should render the category badge with the singular category label', () => {
      const badge = wrapper.find('[data-testid="self-knowledge-category-badge"]')
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toBe('# valeur')
    })

    BddTest().then('it should link to the element inside its own category', () => {
      expect(wrapper.findComponent(AvButtonStub).props('to')).toEqual({
        name: ROUTES.STUDENT.SELFKNOWLEDGE_CATEGORY.name,
        params: { id: ESelfKnowledgeCategory.VALUES },
        query: { elementId: 'element-1' }
      })
    })

    BddTest().then('it should not render the element description nor its rating', () => {
      expect(wrapper.text()).not.toContain('Je travaille efficacement avec les autres')
      expect(wrapper.text()).not.toContain('4')
    })
  })

  BddTest().when('the category badge is hidden', () => {
    beforeEach(async () => {
      await mountItem(false)
    })

    BddTest().then('it should render the element title', () => {
      expect(wrapper.text()).toContain('Travail d\'équipe')
    })

    BddTest().then('it should not render the category badge', () => {
      expect(wrapper.find('[data-testid="self-knowledge-category-badge"]').exists()).toBe(false)
    })
  })
})
