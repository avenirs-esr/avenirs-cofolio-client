import type { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { ICONS } from '@/common/constants'
import SelfKnowledgeElementTabs
  from '@/features/selfKnowledge/components/tabs/SelfKnowledgeElementTabs/SelfKnowledgeElementTabs.vue'
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
    emits: ['update:modelValue'],
    template: '<div class="av-tabs-stub"><slot /></div>'
  },
  AvTab: {
    name: 'AvTab',
    props: ['title', 'icon'],
    template: '<div class="av-tab-stub"><slot /></div>'
  }
}

BddTest().given('a self knowledge tabs component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeElementTabs>>

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountComponent(SelfKnowledgeElementTabs, {
        props: {
          categoryType: 'STRENGTHS' as ESelfKnowledgeCategory
        },
        slots: {
          element: '<div class="element-slot-content">Element content</div>',
          associations: '<div class="associations-slot-content">Associations content</div>'
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
      expect(associationsTab.props('icon')).toBe(ICONS.ASSOCIATIONS)
    })

    BddTest().then('it should render the element slot content', () => {
      const elementSlotContent = wrapper.find('.element-slot-content')

      expect(elementSlotContent.exists()).toBe(true)
      expect(elementSlotContent.text()).toBe('Element content')
    })

    BddTest().then('it should render the associations slot content', () => {
      const associationsSlotContent = wrapper.find('.associations-slot-content')

      expect(associationsSlotContent.exists()).toBe(true)
      expect(associationsSlotContent.text()).toBe('Associations content')
    })
  })
})
