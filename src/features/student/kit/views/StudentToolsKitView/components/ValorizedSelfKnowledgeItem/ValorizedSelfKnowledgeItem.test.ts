import type { SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import { ValorizedItemStub } from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedItem/ValorizedItem.stub'
import ValorizedSelfKnowledgeItem
  from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedSelfKnowledgeItem/ValorizedSelfKnowledgeItem.vue'
import { SelfKnowledgeCategoryBadgeStub } from '@/features/student/selfKnowledge/components/badges/SelfKnowledgeCategoryBadge/SelfKnowledgeCategoryBadge.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
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
  let valorizedItem: VueWrapper<InstanceType<typeof ValorizedItemStub>>

  const stubs = {
    ValorizedItem: ValorizedItemStub,
    SelfKnowledgeCategoryBadge: SelfKnowledgeCategoryBadgeStub
  }

  const getValorizedItem = () => wrapper.findComponent(ValorizedItemStub)

  const mountItem = async (showCategoryBadge: boolean) => {
    wrapper = mountComponent(ValorizedSelfKnowledgeItem, {
      props: { element, showCategoryBadge },
      global: { stubs }
    })
    await flushPromises()
    valorizedItem = getValorizedItem()
  }

  BddTest().when('the category badge is displayed', () => {
    beforeEach(async () => {
      await mountItem(true)
    })

    BddTest().then('it should render the element title', () => {
      expect(valorizedItem.props('title')).toContain('Travail d\'équipe')
    })

    BddTest().then('it should render the category badge with the singular category label', () => {
      const badge = wrapper.findComponent(SelfKnowledgeCategoryBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toBe('VALUES')
    })

    BddTest().then('it should link the element to ValorizedItem', () => {
      expect(valorizedItem.props('itemId')).toBe('element-1')
    })
  })

  BddTest().when('the category badge is hidden', () => {
    beforeEach(async () => {
      await mountItem(false)
    })

    BddTest().then('it should render the element title', () => {
      expect(valorizedItem.props('title')).toContain('Travail d\'équipe')
    })

    BddTest().then('it should not render the category badge', () => {
      expect(wrapper.findComponent(SelfKnowledgeCategoryBadgeStub).exists()).toBe(false)
    })
  })
})
