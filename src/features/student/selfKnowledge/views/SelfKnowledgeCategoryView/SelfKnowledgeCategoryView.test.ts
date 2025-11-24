import type { ESelfKnowledgeCategoryType } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTE_NAMES } from '@/common/constants'
import SelfKnowledgeCategoryView
  from '@/features/student/selfKnowledge/views/SelfKnowledgeCategoryView/SelfKnowledgeCategoryView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'
import { nextTick } from 'vue'

const SelfKnowledgeElementsSideMenuStub = defineComponent({
  name: 'SelfKnowledgeElementsSideMenu',
  props: {
    elements: {
      type: Array,
      required: true
    },
    categoryType: {
      type: String,
      required: true
    },
    selectedElementId: {
      type: String,
      required: true
    }
  },
  emits: ['selectElement'],
  template: '<div class="self-knowledge-elements-side-menu-stub" />'
})

const stubs = {
  PageTitle: PageTitleStub,
  SelfKnowledgeElementsSideMenu: SelfKnowledgeElementsSideMenuStub
}

BddTest().given('a self knowledge category view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeCategoryView>>

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountComponent(SelfKnowledgeCategoryView, {
        props: {
          categoryId: '123',
          categoryType: 'STRENGTHS' as ESelfKnowledgeCategoryType
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.exists()).toBe(true)

      const breadcrumbLinks = pageTitle.props('breadcrumbLinks') as Array<{ text: string, to?: string }>

      expect(breadcrumbLinks).toHaveLength(4)
      expect(breadcrumbLinks[0]).toEqual({
        text: 'Accueil',
        to: ROUTE_NAMES.STUDENT.HOME
      })
      expect(breadcrumbLinks[1]).toEqual({
        text: 'Construire mon projet de vie'
      })
      expect(breadcrumbLinks[2]).toEqual({
        text: 'Bâtir mon projet',
        to: ROUTE_NAMES.STUDENT.PROJECT_TRAJECTORIES
      })
      expect(breadcrumbLinks[3]).toEqual({
        text: 'Me connaître'
      })
    })

    BddTest().then('it should build the title using the translated category type label', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.props('title')).toBe('Détail de mes points forts')
    })

    BddTest().then('it should render the side menu with correct props', () => {
      const sideMenu = wrapper.findComponent({ name: 'SelfKnowledgeElementsSideMenu' })

      expect(sideMenu.exists()).toBe(true)

      const elements = sideMenu.props('elements') as Array<any>
      const categoryType = sideMenu.props('categoryType') as string
      const selectedElementId = sideMenu.props('selectedElementId') as string

      expect(elements).toHaveLength(3)
      expect(elements[0].id).toBe('1')
      expect(elements[1].id).toBe('2')
      expect(elements[2].id).toBe('3')

      expect(categoryType).toBe('STRENGTHS')

      expect(selectedElementId).toBe('1')
    })

    BddTest().then('it should update selectedElementId when an element is selected from the side menu', async () => {
      const sideMenu = wrapper.findComponent({ name: 'SelfKnowledgeElementsSideMenu' })

      await sideMenu.vm.$emit('selectElement', '2')
      await nextTick()

      expect(sideMenu.props('selectedElementId')).toBe('2')
    })
  })
})
