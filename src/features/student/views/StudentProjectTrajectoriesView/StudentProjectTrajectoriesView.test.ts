import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { studentHomeRoute } from '@/features/student/routes'
import StudentProjectTrajectoriesView from '@/features/student/views/StudentProjectTrajectoriesView/StudentProjectTrajectoriesView.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a student project trajectories view component', () => {
  let wrapper: VueWrapper

  const stubs = {
    PageTitle: PageTitleStub,
    StudentProjectTrajectoriesContainer: {
      name: 'StudentProjectTrajectoriesContainer',
      template: '<div class="student-project-trajectories-container-stub">Trajectories Container</div>'
    }
  }

  const title = 'Bâtir mon projet'
  const breadcrumbLinks = [
    { text: 'Accueil', to: studentHomeRoute },
    { text: 'Construire mon projet de vie' },
    { text: 'Bâtir mon projet' }
  ]

  beforeEach(() => {
    wrapper = mount(StudentProjectTrajectoriesView, { global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.props('title')).toBe(title)
      expect(pageTitle.props('breadcrumbLinks')).toEqual(breadcrumbLinks)
    })

    BddTest().then('it should render StudentProjectTrajectoriesContainer', () => {
      const container = wrapper.findComponent({ name: 'StudentProjectTrajectoriesContainer' })
      expect(container.exists()).toBe(true)
    })
  })
})
