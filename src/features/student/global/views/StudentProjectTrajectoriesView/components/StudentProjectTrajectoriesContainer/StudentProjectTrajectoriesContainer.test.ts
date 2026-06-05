import type { SectionNavigationItem } from '@/common/components/SectionNavigationLayout/SectionNavigationLayout.types'
import { SectionNavigationLayoutStub } from '@/common/components/SectionNavigationLayout/SectionNavigationLayout.stub'
import StudentProjectTrajectoriesBuildProjectSection
  from '@/features/student/global/views/StudentProjectTrajectoriesView/components/StudentProjectTrajectoriesBuildProjectSection/StudentProjectTrajectoriesBuildProjectSection.vue'
import StudentProjectTrajectoriesContainer
  from '@/features/student/global/views/StudentProjectTrajectoriesView/components/StudentProjectTrajectoriesContainer/StudentProjectTrajectoriesContainer.vue'
import StudentProjectTrajectoriesExploreFuturesSection
  from '@/features/student/global/views/StudentProjectTrajectoriesView/components/StudentProjectTrajectoriesExploreFuturesSection/StudentProjectTrajectoriesExploreFuturesSection.vue'
import StudentProjectTrajectoriesTrajectoriesSection
  from '@/features/student/global/views/StudentProjectTrajectoriesView/components/StudentProjectTrajectoriesTrajectoriesSection/StudentProjectTrajectoriesTrajectoriesSection.vue'
import { ProjectTrajectoryItems } from '@/features/student/global/views/StudentProjectTrajectoriesView/types'
import { SelfKnowledgeMainSection } from '@/features/student/selfKnowledge'
import { MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const { routeMock, replaceMock } = vi.hoisted(() => ({
  routeMock: {
    name: '',
    fullPath: '',
    query: {},
    matched: [],
  },
  replaceMock: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRoute: () => routeMock,
  useRouter: () => ({
    push: vi.fn(),
    replace: replaceMock,
  }),
}))

BddTest().given('a project trajectories container component', () => {
  let wrapper: VueWrapper

  const stubs = {
    SectionNavigationLayout: SectionNavigationLayoutStub,
    StudentProjectTrajectoriesBuildProjectSection: {
      name: 'StudentProjectTrajectoriesBuildProjectSection',
      template: '<div class="build-project-section-stub">Build Project Section</div>',
    },
    StudentProjectTrajectoriesTrajectoriesSection: {
      name: 'StudentProjectTrajectoriesTrajectoriesSection',
      template: '<div class="trajectories-section-stub">Trajectories Section</div>',
    },
    SelfKnowledgeMainSection: {
      name: 'SelfKnowledgeMainSection',
      template: '<div class="self-knowledge-section-stub">Self Knowledge Section</div>',
    },
    StudentProjectTrajectoriesExploreFuturesSection: {
      name: 'StudentProjectTrajectoriesExploreFuturesSection',
      template: '<div class="explore-futures-section-stub">Explore Futures Section</div>',
    },
  }

  beforeEach(() => {
    vi.unstubAllGlobals()
    routeMock.name = 'student-project-trajectories'
    routeMock.fullPath = '/student/project/trajectories'
    routeMock.query = {}
    replaceMock.mockReset()

    wrapper = mount(StudentProjectTrajectoriesContainer, {
      global: { stubs },
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the main container with correct class', () => {
      expect(wrapper.find('.student-project-trajectories-container').exists()).toBe(true)
    })

    BddTest().then('it should render the section navigation layout', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)

      expect(sectionNavigationLayout.exists()).toBe(true)
    })

    BddTest().then('it should pass the expected side navigation width', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)

      expect(sectionNavigationLayout.props('sideNavigationWidth')).toBe('11rem')
    })

    BddTest().then('it should pass the expected select placeholder', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)

      expect(sectionNavigationLayout.props('selectPlaceholder')).toBe('Accéder à')
    })

    BddTest().then('it should pass the expected select label', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)

      expect(sectionNavigationLayout.props('selectLabel')).toBe('Accéder à')
    })

    BddTest().then('it should pass build project as default section', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)

      expect(sectionNavigationLayout.props('defaultSection')).toBe(ProjectTrajectoryItems.BUILD_PROJECT)
    })

    BddTest().then('it should pass the expected navigation items', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)
      const items = sectionNavigationLayout.props('items') as SectionNavigationItem[]

      expect(items).toEqual([
        {
          id: ProjectTrajectoryItems.BUILD_PROJECT,
          label: 'Bâtir mon projet',
          icon: RI_ICONS.DRAW_LINE,
        },
        {
          id: ProjectTrajectoryItems.SELF_KNOWLEDGE,
          label: 'Me connaître',
          icon: MDI_ICONS.FAMILY,
        },
        {
          id: ProjectTrajectoryItems.EXPLORE_FUTURES,
          label: 'Explorer mes futurs',
          icon: MDI_ICONS.IMAGE_FILTER_CENTER_FOCUS_WEAK,
        },
        {
          id: ProjectTrajectoryItems.TRAJECTORIES,
          label: 'Mes Trajectoires',
          icon: MDI_ICONS.ARROW_DECISION,
        },
      ])
    })

    BddTest().then('it should pass the expected section components map', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)
      const componentBySection = sectionNavigationLayout.props('componentBySection') as Record<string, unknown>

      expect(componentBySection[ProjectTrajectoryItems.BUILD_PROJECT]).toBe(StudentProjectTrajectoriesBuildProjectSection)
      expect(componentBySection[ProjectTrajectoryItems.SELF_KNOWLEDGE]).toBe(SelfKnowledgeMainSection)
      expect(componentBySection[ProjectTrajectoryItems.EXPLORE_FUTURES]).toBe(StudentProjectTrajectoriesExploreFuturesSection)
      expect(componentBySection[ProjectTrajectoryItems.TRAJECTORIES]).toBe(StudentProjectTrajectoriesTrajectoriesSection)
    })

    BddTest().then('it should not pass propsBySection', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)

      expect(sectionNavigationLayout.props('propsBySection')).toBeUndefined()
    })
  })

  BddTest().when('demo mode is enabled', () => {
    beforeEach(() => {
      vi.stubGlobal('__DEMO_MODE__', true)

      wrapper = mount(StudentProjectTrajectoriesContainer, {
        global: { stubs },
      })
    })

    BddTest().then('it should only pass the first two items', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)
      const items = sectionNavigationLayout.props('items') as SectionNavigationItem[]

      expect(items).toEqual([
        {
          id: ProjectTrajectoryItems.BUILD_PROJECT,
          label: 'Bâtir mon projet',
          icon: RI_ICONS.DRAW_LINE,
        },
        {
          id: ProjectTrajectoryItems.SELF_KNOWLEDGE,
          label: 'Me connaître',
          icon: MDI_ICONS.FAMILY,
        },
      ])
    })

    BddTest().then('it should keep build project as default section', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)

      expect(sectionNavigationLayout.props('defaultSection')).toBe(ProjectTrajectoryItems.BUILD_PROJECT)
    })
  })

  BddTest().when('current route is self knowledge', () => {
    beforeEach(() => {
      routeMock.query = { section: ProjectTrajectoryItems.SELF_KNOWLEDGE }

      wrapper = mount(StudentProjectTrajectoriesContainer, {
        global: { stubs },
      })
    })

    BddTest().then('it should use self knowledge as default section', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)

      expect(sectionNavigationLayout.props('defaultSection')).toBe(ProjectTrajectoryItems.SELF_KNOWLEDGE)
    })
  })

  BddTest().when('a section is selected from navigation', () => {
    beforeEach(() => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)
      sectionNavigationLayout.vm.$emit('selectedItem', { itemId: ProjectTrajectoryItems.EXPLORE_FUTURES })
    })

    BddTest().then('it should navigate using the section query param', () => {
      expect(replaceMock).toHaveBeenCalledWith({ query: { section: ProjectTrajectoryItems.EXPLORE_FUTURES } })
    })
  })

  BddTest().when('the section layout emits a selected item label', () => {
    beforeEach(() => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)
      sectionNavigationLayout.vm.$emit('selectedItemLabel', 'Me connaître')
    })

    BddTest().then('it should forward the selected section label', () => {
      expect(wrapper.emitted('selectedSection')?.[0]).toEqual(['Me connaître'])
    })
  })
})
