import { studentHomeRoute } from '@/features/student/routes'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import StudentProjectExperiencesView from './StudentProjectExperiencesView.vue'

const stubs = {
  PageTitle: {
    name: 'PageTitle',
    props: ['title', 'breadcrumbLinks'],
    template: '<div class="page-title-stub" />'
  },
  StudentProjectExperiencesContainer: {
    name: 'StudentProjectExperiencesContainer',
    template: '<div class="container-stub">Container Component</div>'
  }
}

describe('studentProjectExperiencesView', () => {
  describe('given a student project experiences view component', () => {
    let wrapper: VueWrapper<InstanceType<typeof StudentProjectExperiencesView>>

    beforeEach(() => {
      vi.clearAllMocks()

      wrapper = mount(StudentProjectExperiencesView, {
        global: {
          stubs
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render PageTitle with correct props', () => {
        const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

        expect(pageTitle.exists()).toBe(true)
        expect(pageTitle.props('title')).toBe('(placeholder) Toutes mes expériences')

        const breadcrumbLinks = pageTitle.props('breadcrumbLinks')
        expect(breadcrumbLinks).toHaveLength(2)
        expect(breadcrumbLinks[0]).toEqual({
          text: 'Accueil',
          to: studentHomeRoute
        })
        expect(breadcrumbLinks[1]).toEqual({
          text: 'Mon parcours'
        })
      })

      it('then it should render StudentProjectExperiencesContainer component', () => {
        const container = wrapper.findComponent({ name: 'StudentProjectExperiencesContainer' })

        expect(container.exists()).toBe(true)
      })
    })
  })
})
