import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { PageTitleStub } from '@/common/components/navigation/PageTitle/PageTitle.stub'
import { PersonalCareerLayoutStub } from '@/features/student/personalCareer/views/PersonalCareerView/layouts/PersonalCareerLayout/PersonalCareerLayout.stub'
import PersonalCareerView from '@/features/student/personalCareer/views/PersonalCareerView/PersonalCareerView.vue'

const stubs = {
  PageTitle: PageTitleStub,
  PersonalCareerLayout: PersonalCareerLayoutStub
}

BddTest().given('a personal career view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof PersonalCareerView>>

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(PersonalCareerView, {
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)

      expect(pageTitle.exists()).toBe(true)
      expect(pageTitle.props('title')).toBe('Mon parcours')
      expect(pageTitle.props('trailingLinks')).toHaveLength(1)
    })

    BddTest().then('it should render PersonalCareerLayout component', () => {
      const container = wrapper.findComponent({ name: 'PersonalCareerLayout' })

      expect(container.exists()).toBe(true)
    })
  })
})
