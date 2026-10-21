import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { PageTitleStub } from '@/common/components/navigation/PageTitle/PageTitle.stub'
import { StudentProjectBuildProjectContainerStub } from '@/features/student/global/views/StudentBuildProjectView/components/StudentProjectBuildProjectContainer/StudentProjectBuildProjectContainer.stub'
import StudentBuildProjectView from '@/features/student/global/views/StudentBuildProjectView/StudentBuildProjectView.vue'

BddTest().given('a student project build project view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentBuildProjectView>>

  const stubs = {
    PageTitle: PageTitleStub,
    StudentProjectBuildProjectContainer: StudentProjectBuildProjectContainerStub,
  }

  const title = 'Bâtir mon projet'

  beforeEach(() => {
    wrapper = mount(StudentBuildProjectView, { global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)

      expect(pageTitle.props('title')).toBe(title)
      expect(pageTitle.props('trailingLinks')).toHaveLength(1)
    })

    BddTest().then('it should render StudentProjectBuildProjectContainer', () => {
      const container = wrapper.findComponent({ name: 'StudentProjectBuildProjectContainer' })
      expect(container.exists()).toBe(true)
    })
  })
})
