import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants'
import StudentProjectTrajectoriesView from '@/features/global/views/StudentProjectTrajectoriesView/StudentProjectTrajectoriesView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
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
    { text: 'Accueil', to: ROUTES.STUDENT.HOME },
    { text: 'Construire mon projet de vie' },
    { text: 'Bâtir mon projet' },
    { text: expect.any(String) }
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
