import StudentProjectTrajectoriesContainer from '@/features/student/global/views/StudentProjectTrajectoriesView/components/StudentProjectTrajectoriesContainer/StudentProjectTrajectoriesContainer.vue'
import { ProjectTrajectoryItems } from '@/features/student/global/views/StudentProjectTrajectoriesView/types'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'

const mockRoute = ref({ query: {} })
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn()
}

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute.value,
  useRouter: () => mockRouter
}))

BddTest().given('a project trajectories container component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentProjectTrajectoriesContainer>>

  const stubs = {
    AvSideNavigation: {
      name: 'AvSideNavigation',
      props: {
        items: Array,
        selectedItem: String,
        isSideMenuCollapsed: Boolean,
        collapsedWidth: String
      },
      emits: ['update:selectedItem', 'update:isSideMenuCollapsed'],
      template: '<div class="av-side-navigation-stub" @click="$emit(\'update:isSideMenuCollapsed\', !isSideMenuCollapsed)" />'
    },
    StudentProjectTrajectoriesBuildProjectSection: {
      name: 'StudentProjectTrajectoriesBuildProjectSection',
      template: '<div class="build-project-section-stub">Build Project Section</div>'
    },
    StudentProjectTrajectoriesTrajectoriesSection: {
      name: 'StudentProjectTrajectoriesTrajectoriesSection',
      template: '<div class="trajectories-section-stub">Trajectories Section</div>'
    },
    SelfKnowledgeMainSection: {
      name: 'SelfKnowledgeMainSection',
      template: '<div class="self-knowledge-section-stub">Self Knowledge Section</div>'
    },
    StudentProjectTrajectoriesExploreFuturesSection: {
      name: 'StudentProjectTrajectoriesExploreFuturesSection',
      template: '<div class="explore-futures-section-stub">Explore Futures Section</div>'
    },
    StudentProjectTrajectoriesActivitiesSection: {
      name: 'StudentProjectTrajectoriesActivitiesSection',
      template: '<div class="activities-section-stub">Activities Section</div>'
    }
  }

  beforeEach(() => {
    wrapper = mount(StudentProjectTrajectoriesContainer, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the main container with correct class', () => {
      expect(wrapper.find('.student-project-trajectories-container').exists()).toBe(true)
    })

    BddTest().then('it should render an AvSideNavigation component', () => {
      const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
      expect(sideNavigation.exists()).toBe(true)
      expect(sideNavigation.props('isSideMenuCollapsed')).toBe(false)
      expect(sideNavigation.props('selectedItem')).toBe(ProjectTrajectoryItems.BUILD_PROJECT)
      expect(sideNavigation.props('items')).toHaveLength(5)
    })

    BddTest().then('it should have navigation items with correct properties', () => {
      const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
      const items = sideNavigation.props('items')
      expect(items).toEqual([
        { id: ProjectTrajectoryItems.BUILD_PROJECT, label: 'Bâtir mon projet', icon: MDI_ICONS.BRIEFCASE_VARIANT_OUTLINE },
        { id: ProjectTrajectoryItems.SELF_KNOWLEDGE, label: 'Me connaître', icon: MDI_ICONS.FAMILY },
        { id: ProjectTrajectoryItems.EXPLORE_FUTURES, label: 'Explorer mes futurs', icon: MDI_ICONS.IMAGE_FILTER_CENTER_FOCUS_WEAK },
        { id: ProjectTrajectoryItems.TRAJECTORIES, label: 'Mes Trajectoires', icon: MDI_ICONS.ARROW_DECISION },
        { id: ProjectTrajectoryItems.ACTIVITIES, label: 'Mes activités', icon: MDI_ICONS.TARGET_ARROW }
      ])
    })

    BddTest().then('it should render the content area', () => {
      const contentArea = wrapper.find('.student-project-trajectories-container__content')
      expect(contentArea.exists()).toBe(true)
    })

    BddTest().then('it should display the build project section by default', () => {
      const buildProjectSection = wrapper.findComponent({ name: 'StudentProjectTrajectoriesBuildProjectSection' })
      expect(buildProjectSection.exists()).toBe(true)
    })
  })

  BddTest().when('the side menu is collapsed', () => {
    beforeEach(async () => {
      const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
      await sideNavigation.trigger('click')
    })

    BddTest().then('the side navigation should be collapsed', () => {
      const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
      expect(sideNavigation.props('isSideMenuCollapsed')).toBe(true)
    })
  })

  BddTest().when('different menu items are selected', () => {
    BddTest().then('it should display trajectories section when TRAJECTORIES is selected', async () => {
      const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
      await sideNavigation.vm.$emit('update:selectedItem', ProjectTrajectoryItems.TRAJECTORIES)

      const trajectoriesSection = wrapper.findComponent({ name: 'StudentProjectTrajectoriesTrajectoriesSection' })
      expect(trajectoriesSection.exists()).toBe(true)
    })

    BddTest().then('it should display self knowledge section when SELF_KNOWLEDGE is selected', async () => {
      const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
      await sideNavigation.vm.$emit('update:selectedItem', ProjectTrajectoryItems.SELF_KNOWLEDGE)

      const selfKnowledgeSection = wrapper.findComponent({ name: 'SelfKnowledgeMainSection' })
      expect(selfKnowledgeSection.exists()).toBe(true)
    })

    BddTest().then('it should display explore futures section when EXPLORE_FUTURES is selected', async () => {
      const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
      await sideNavigation.vm.$emit('update:selectedItem', ProjectTrajectoryItems.EXPLORE_FUTURES)

      const exploreFuturesSection = wrapper.findComponent({ name: 'StudentProjectTrajectoriesExploreFuturesSection' })
      expect(exploreFuturesSection.exists()).toBe(true)
    })

    BddTest().then('it should display activities section when ACTIVITIES is selected', async () => {
      const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
      await sideNavigation.vm.$emit('update:selectedItem', ProjectTrajectoryItems.ACTIVITIES)

      const activitiesSection = wrapper.findComponent({ name: 'StudentProjectTrajectoriesActivitiesSection' })
      expect(activitiesSection.exists()).toBe(true)
    })

    BddTest().then('it should display build project section when BUILD_PROJECT is selected', async () => {
      const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
      await sideNavigation.vm.$emit('update:selectedItem', ProjectTrajectoryItems.BUILD_PROJECT)

      const buildProjectSection = wrapper.findComponent({ name: 'StudentProjectTrajectoriesBuildProjectSection' })
      expect(buildProjectSection.exists()).toBe(true)
    })
  })

  BddTest().when('the displayed section changes', () => {
    BddTest().then('only one section should be displayed at a time', async () => {
      expect(wrapper.findComponent({ name: 'StudentProjectTrajectoriesBuildProjectSection' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'StudentProjectTrajectoriesTrajectoriesSection' }).exists()).toBe(false)

      const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
      await sideNavigation.vm.$emit('update:selectedItem', ProjectTrajectoryItems.TRAJECTORIES)

      expect(wrapper.findComponent({ name: 'StudentProjectTrajectoriesBuildProjectSection' }).exists()).toBe(false)
      expect(wrapper.findComponent({ name: 'StudentProjectTrajectoriesTrajectoriesSection' }).exists()).toBe(true)
    })
  })

  BddTest().when('component is mounted with route query section parameter', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    BddTest().and('section query param is SELF_KNOWLEDGE', () => {
      beforeEach(async () => {
        mockRoute.value = { query: { section: ProjectTrajectoryItems.SELF_KNOWLEDGE } }
        wrapper = mount(StudentProjectTrajectoriesContainer, {
          global: { stubs }
        })
        await nextTick()
      })

      BddTest().then('it should display self knowledge section', () => {
        const selfKnowledgeSection = wrapper.findComponent({ name: 'SelfKnowledgeMainSection' })
        expect(selfKnowledgeSection.exists()).toBe(true)
      })

      BddTest().then('it should set selectedItem to SELF_KNOWLEDGE', () => {
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        expect(sideNavigation.props('selectedItem')).toBe(ProjectTrajectoryItems.SELF_KNOWLEDGE)
      })
    })

    BddTest().and('section query param is TRAJECTORIES', () => {
      beforeEach(async () => {
        mockRoute.value = { query: { section: ProjectTrajectoryItems.TRAJECTORIES } }
        wrapper = mount(StudentProjectTrajectoriesContainer, {
          global: { stubs }
        })
        await nextTick()
      })

      BddTest().then('it should display trajectories section', () => {
        const trajectoriesSection = wrapper.findComponent({ name: 'StudentProjectTrajectoriesTrajectoriesSection' })
        expect(trajectoriesSection.exists()).toBe(true)
      })

      BddTest().then('it should set selectedItem to TRAJECTORIES', () => {
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        expect(sideNavigation.props('selectedItem')).toBe(ProjectTrajectoryItems.TRAJECTORIES)
      })
    })

    BddTest().and('section query param is EXPLORE_FUTURES', () => {
      beforeEach(async () => {
        mockRoute.value = { query: { section: ProjectTrajectoryItems.EXPLORE_FUTURES } }
        wrapper = mount(StudentProjectTrajectoriesContainer, {
          global: { stubs }
        })
        await nextTick()
      })

      BddTest().then('it should display explore futures section', () => {
        const exploreFuturesSection = wrapper.findComponent({ name: 'StudentProjectTrajectoriesExploreFuturesSection' })
        expect(exploreFuturesSection.exists()).toBe(true)
      })

      BddTest().then('it should set selectedItem to EXPLORE_FUTURES', () => {
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        expect(sideNavigation.props('selectedItem')).toBe(ProjectTrajectoryItems.EXPLORE_FUTURES)
      })
    })

    BddTest().and('section query param is invalid', () => {
      beforeEach(async () => {
        mockRoute.value = { query: { section: 'INVALID_SECTION' } }
        wrapper = mount(StudentProjectTrajectoriesContainer, {
          global: { stubs }
        })
        await nextTick()
      })

      BddTest().then('it should display default build project section', () => {
        const buildProjectSection = wrapper.findComponent({ name: 'StudentProjectTrajectoriesBuildProjectSection' })
        expect(buildProjectSection.exists()).toBe(true)
      })

      BddTest().then('it should keep selectedItem as BUILD_PROJECT', () => {
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        expect(sideNavigation.props('selectedItem')).toBe(ProjectTrajectoryItems.BUILD_PROJECT)
      })
    })

    BddTest().and('section query param is empty string', () => {
      beforeEach(async () => {
        mockRoute.value = { query: { section: '' } }
        wrapper = mount(StudentProjectTrajectoriesContainer, {
          global: { stubs }
        })
        await nextTick()
      })

      BddTest().then('it should keep selectedItem as BUILD_PROJECT', () => {
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        expect(sideNavigation.props('selectedItem')).toBe(ProjectTrajectoryItems.BUILD_PROJECT)
      })
    })
  })

  BddTest().when('route query section changes dynamically', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      mockRoute.value = { query: {} }
      wrapper = mount(StudentProjectTrajectoriesContainer, {
        global: { stubs }
      })
      await nextTick()
    })

    BddTest().and('section changes to SELF_KNOWLEDGE', () => {
      beforeEach(async () => {
        mockRoute.value.query = { section: ProjectTrajectoryItems.SELF_KNOWLEDGE }
        await nextTick()
      })

      BddTest().then('it should update to display self knowledge section', () => {
        const selfKnowledgeSection = wrapper.findComponent({ name: 'SelfKnowledgeMainSection' })
        expect(selfKnowledgeSection.exists()).toBe(true)
      })

      BddTest().then('it should update selectedItem', () => {
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        expect(sideNavigation.props('selectedItem')).toBe(ProjectTrajectoryItems.SELF_KNOWLEDGE)
      })
    })

    BddTest().and('section changes to invalid value', () => {
      beforeEach(async () => {
        mockRoute.value.query = { section: 'INVALID' }
        await nextTick()
      })

      BddTest().then('it should not change selectedItem', () => {
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        expect(sideNavigation.props('selectedItem')).toBe(ProjectTrajectoryItems.BUILD_PROJECT)
      })
    })
  })
})
