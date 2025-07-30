import { studentHomeRoute } from '@/features/student/routes'
import StudentProjectTrajectoriesView from '@/features/student/views/StudentProjectTrajectoriesView/StudentProjectTrajectoriesView.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

const stubs = {
  PageTitle: {
    name: 'PageTitle',
    props: ['title', 'breadcrumbLinks'],
    template: '<div class="page-title-stub" />'
  },
  StudentProjectTrajectoriesContainer: {
    name: 'StudentProjectTrajectoriesContainer',
    template: '<div class="student-project-trajectories-container-stub">Trajectories Container</div>'
  }
}

describe('studentProjectTrajectoriesView', () => {
  describe('given a student project trajectories view component', () => {
    let wrapper: VueWrapper

    const title = 'Bâtir mon projet'
    const breadcrumbLinks = [
      { text: 'Accueil', to: studentHomeRoute },
      { text: 'Construire mon projet de vie' },
      { text: 'Bâtir mon projet' }
    ]

    beforeEach(() => {
      wrapper = mount(StudentProjectTrajectoriesView, { global: { stubs } })
    })

    describe('when the component is mounted', () => {
      it('then it should render PageTitle with correct props', () => {
        const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

        expect(pageTitle.props('title')).toBe(title)
        expect(pageTitle.props('breadcrumbLinks')).toEqual(breadcrumbLinks)
      })

      it('then it should render StudentProjectTrajectoriesContainer', () => {
        const container = wrapper.findComponent({ name: 'StudentProjectTrajectoriesContainer' })
        expect(container.exists()).toBe(true)
      })
    })
  })
})
