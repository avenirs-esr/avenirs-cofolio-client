import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import StudentBuildProjectView from '@/features/student/global/views/StudentBuildProjectView/StudentBuildProjectView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a student project trajectories view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentBuildProjectView>>

  const stubs = {
    PageTitle: PageTitleStub,
    StudentProjectBuildProjectContainer: {
      name: 'StudentProjectBuildProjectContainer',
      template: '<div class="student-project-trajectories-container-stub">Trajectories Container</div>'
    }
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
