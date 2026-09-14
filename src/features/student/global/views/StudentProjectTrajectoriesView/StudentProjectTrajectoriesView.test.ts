import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import StudentProjectTrajectoriesView from '@/features/student/global/views/StudentProjectTrajectoriesView/StudentProjectTrajectoriesView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a student project trajectories view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentProjectTrajectoriesView>>

  const stubs = {
    PageTitle: PageTitleStub,
    StudentProjectTrajectoriesContainer: {
      name: 'StudentProjectTrajectoriesContainer',
      template: '<div class="student-project-trajectories-container-stub">Trajectories Container</div>'
    }
  }

  const title = 'Bâtir mon projet'

  beforeEach(() => {
    wrapper = mount(StudentProjectTrajectoriesView, { global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)

      expect(pageTitle.props('title')).toBe(title)
      expect(pageTitle.props('trailingLinks')).toHaveLength(1)
    })

    BddTest().then('it should render StudentProjectTrajectoriesContainer', () => {
      const container = wrapper.findComponent({ name: 'StudentProjectTrajectoriesContainer' })
      expect(container.exists()).toBe(true)
    })
  })
})
