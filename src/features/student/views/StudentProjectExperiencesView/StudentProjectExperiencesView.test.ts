import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { studentHomeRoute } from '@/features/student/routes'
import { StudentProjectExperiencesContainerStub } from '@/features/student/views/StudentProjectExperiencesView/components/StudentProjectExperiencesContainer/StudentProjectExperiencesContainer.stub'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect } from 'vitest'
import StudentProjectExperiencesView from './StudentProjectExperiencesView.vue'

const stubs = {
  PageTitle: PageTitleStub,
  StudentProjectExperiencesContainer: StudentProjectExperiencesContainerStub
}

BddTest().given('a student project experiences view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentProjectExperiencesView>>

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(StudentProjectExperiencesView, {
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.exists()).toBe(true)
      expect(pageTitle.props('title')).toBe('Mon parcours')

      const breadcrumbLinks = pageTitle.props('breadcrumbLinks')
      expect(breadcrumbLinks).toHaveLength(3)
      expect(breadcrumbLinks[0]).toEqual({
        text: 'Accueil',
        to: studentHomeRoute
      })
      expect(breadcrumbLinks[1]).toEqual({
        text: 'Construire mon projet de vie'
      })
      expect(breadcrumbLinks[2]).toEqual({
        text: 'Mon parcours'
      })
    })

    BddTest().then('it should render StudentProjectExperiencesContainer component', () => {
      const container = wrapper.findComponent({ name: 'StudentProjectExperiencesContainer' })

      expect(container.exists()).toBe(true)
    })
  })
})
