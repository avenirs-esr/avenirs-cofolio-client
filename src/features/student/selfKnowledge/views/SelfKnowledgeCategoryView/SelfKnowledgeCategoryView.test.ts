import type { ESelfKnowledgeCategoryType } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { ROUTE_NAMES } from '@/common/constants'
import SelfKnowledgeCategoryView
  from '@/features/student/selfKnowledge/views/SelfKnowledgeCategoryView/SelfKnowledgeCategoryView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const PageTitleStubWithBack = {
  name: 'PageTitle',
  template: '<div />',
  props: ['title', 'breadcrumbLinks', 'back']
}

const stubs = {
  PageTitle: PageTitleStubWithBack
}

BddTest().given('a self knowledge category view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeCategoryView>>

  beforeEach(() => {
    vi.clearAllMocks()

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

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.exists()).toBe(true)
      expect(pageTitle.props('back')).toBe(ROUTE_NAMES.STUDENT.HOME)

      const breadcrumbLinks = pageTitle.props('breadcrumbLinks') as Array<{ text: string, to?: string }>

      expect(breadcrumbLinks).toHaveLength(3)
      expect(breadcrumbLinks[0]).toEqual({
        text: 'Accueil',
        to: ROUTE_NAMES.STUDENT.HOME
      })
      expect(breadcrumbLinks[1]).toEqual({
        text: 'Construire mon projet de vie'
      })
      expect(breadcrumbLinks[2]).toEqual({
        text: 'Bâtir mon projet'
      })
    })

    BddTest().then('it should build the title using the translated category type label', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.props('title')).toBe('Détail de mes points forts')
    })
  })
})
