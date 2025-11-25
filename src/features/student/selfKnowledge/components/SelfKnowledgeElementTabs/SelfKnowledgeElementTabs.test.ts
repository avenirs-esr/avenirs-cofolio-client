import type { ESelfKnowledgeCategoryType, SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import SelfKnowledgeElementTabs
  from '@/features/student/selfKnowledge/components/SelfKnowledgeElementTabs/SelfKnowledgeElementTabs.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const stubs = {
  AvTabs: {
    name: 'AvTabs',
    props: {
      modelValue: {
        type: Number,
        required: false
      }
    },
    template: '<div class="av-tabs-stub"><slot /></div>'
  },
  AvTab: {
    name: 'AvTab',
    props: ['title', 'icon'],
    template: '<div class="av-tab-stub"><slot /></div>'
  },
  SelfKnowledgeCategoryTab: {
    name: 'SelfKnowledgeCategoryTab',
    template: '<div class="self-knowledge-category-tab-stub" />'
  },
  SelfKnowledgeElementAssociationsTab: {
    name: 'SelfKnowledgeElementAssociationsTab',
    template: '<div class="self-knowledge-element-associations-tab-stub" />'
  }
}

const dummySelfKnowledgeElement: SelfKnowledgeElementViewDTO = {
  id: '1',
  title: 'Intitulé de test',
  description: 'Description de test',
  rating: 3
}

BddTest().given('a self knowledge tabs component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeElementTabs>>

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountComponent(SelfKnowledgeElementTabs, {
        props: {
          selfKnowledgeElement: dummySelfKnowledgeElement,
          categoryType: 'STRENGTHS' as ESelfKnowledgeCategoryType
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render AvTabs with initial active tab set to 0', () => {
      const tabs = wrapper.findComponent({ name: 'AvTabs' })

      expect(tabs.exists()).toBe(true)
      expect(tabs.props('modelValue')).toBe(0)
    })

    BddTest().then('it should render two AvTab components', () => {
      const tabComponents = wrapper.findAllComponents({ name: 'AvTab' })

      expect(tabComponents).toHaveLength(2)
    })

    BddTest().then('it should render the category tab with correct title and icon', () => {
      const tabComponents = wrapper.findAllComponents({ name: 'AvTab' })
      const categoryTab = tabComponents[0]

      expect(categoryTab.exists()).toBe(true)
      expect(categoryTab.props('title')).toBe('Mon point fort')
      expect(categoryTab.props('icon')).toBe(MDI_ICONS.INFORMATION_OUTLINE)
    })

    BddTest().then('it should render the associations tab with correct title and icon', () => {
      const tabComponents = wrapper.findAllComponents({ name: 'AvTab' })
      const associationsTab = tabComponents[1]

      expect(associationsTab.exists()).toBe(true)
      expect(associationsTab.props('title')).toBe('Mes associations (0)')
      expect(associationsTab.props('icon')).toBe(MDI_ICONS.LINK)
    })

    BddTest().then('it should render the category and associations tab content components', () => {
      const categoryTabContent = wrapper.findComponent({ name: 'SelfKnowledgeCategoryTab' })
      const associationsTabContent = wrapper.findComponent({ name: 'SelfKnowledgeElementAssociationsTab' })

      expect(categoryTabContent.exists()).toBe(true)
      expect(associationsTabContent.exists()).toBe(true)
    })
  })
})
