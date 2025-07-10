import { studentHomeRoute } from '@/features/student/routes'
import StudentProjectSkillsView from '@/features/student/views/StudentProjectSkillsView/StudentProjectSkillsView.vue'
import { mount, type VueWrapper } from '@vue/test-utils'

const stubs = {
  PageTitle: {
    name: 'PageTitle',
    props: ['title', 'breadcrumbLinks'],
    template: '<div class="page-title-stub" />'
  },
}

describe('studentProjectSkillsView', () => {
  describe('given a student project skills view component', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      vi.clearAllMocks()

      wrapper = mount(StudentProjectSkillsView, {
        global: {
          stubs
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render PageTitle with correct props', () => {
        const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

        expect(pageTitle.exists()).toBe(true)
        expect(pageTitle.props('title')).toBe('Toutes mes compétences')

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
          text: 'Toutes mes compétences'
        })
      })
    })
  })
})
