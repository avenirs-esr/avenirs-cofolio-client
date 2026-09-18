import type { SectionNavigationItem } from '@/common/components/SectionNavigationLayout/SectionNavigationLayout.types'
import { SectionNavigationLayoutStub } from '@/common/components/SectionNavigationLayout/SectionNavigationLayout.stub'
import { ICONS } from '@/common/constants/icons'
import StudentProjectBuildProjectContainer
  from '@/features/student/global/views/StudentBuildProjectView/components/StudentProjectBuildProjectContainer/StudentProjectBuildProjectContainer.vue'
import { StudentProjectMindMapSectionStub } from '@/features/student/global/views/StudentBuildProjectView/components/StudentProjectMindMapSection/StudentProjectMindMapSection.stub'
import StudentProjectMindMapSection
  from '@/features/student/global/views/StudentBuildProjectView/components/StudentProjectMindMapSection/StudentProjectMindMapSection.vue'
import { BuildProjectItems } from '@/features/student/global/views/StudentBuildProjectView/types'
import { SelfKnowledgeMainSection } from '@/features/student/selfKnowledge'
import { SelfKnowledgeMainSectionStub } from '@/features/student/selfKnowledge/components/SelfKnowledgeMainSection/SelfKnowledgeMainSection.stub'
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

BddTest().given('a project build project container component', () => {
  let wrapper: VueWrapper

  const stubs = {
    SectionNavigationLayout: SectionNavigationLayoutStub,
    StudentProjectMindMapSection: StudentProjectMindMapSectionStub,
    SelfKnowledgeMainSection: SelfKnowledgeMainSectionStub,
  }

  beforeEach(() => {
    vi.unstubAllGlobals()
    routeMock.name = 'student-build-project'
    routeMock.fullPath = '/student/project/build-project'
    routeMock.query = {}
    replaceMock.mockReset()

    wrapper = mount(StudentProjectBuildProjectContainer, {
      global: { stubs },
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the main container with correct class', () => {
      expect(wrapper.find('.student-project-build-project-container').exists()).toBe(true)
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

      expect(sectionNavigationLayout.props('defaultSection')).toBe(BuildProjectItems.MIND_MAP)
    })

    BddTest().then('it should pass the expected navigation items', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)
      const items = sectionNavigationLayout.props('items') as SectionNavigationItem[]

      expect(items).toEqual([
        {
          id: BuildProjectItems.MIND_MAP,
          label: 'Ma carte mentale',
          icon: ICONS.MIND_MAP,
        },
        {
          id: BuildProjectItems.SELF_KNOWLEDGE,
          label: 'Me connaître',
          icon: ICONS.SELF_KNOWLEDGE,
        },
      ])
    })

    BddTest().then('it should pass the expected section components map', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)
      const componentBySection = sectionNavigationLayout.props('componentBySection') as Record<string, unknown>

      expect(componentBySection[BuildProjectItems.MIND_MAP]).toBe(StudentProjectMindMapSection)
      expect(componentBySection[BuildProjectItems.SELF_KNOWLEDGE]).toBe(SelfKnowledgeMainSection)
    })

    BddTest().then('it should not pass propsBySection', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)

      expect(sectionNavigationLayout.props('propsBySection')).toBeUndefined()
    })
  })

  BddTest().when('current route is self knowledge', () => {
    beforeEach(() => {
      routeMock.query = { section: BuildProjectItems.SELF_KNOWLEDGE }

      wrapper = mount(StudentProjectBuildProjectContainer, {
        global: { stubs },
      })
    })

    BddTest().then('it should use self knowledge as default section', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)

      expect(sectionNavigationLayout.props('defaultSection')).toBe(BuildProjectItems.SELF_KNOWLEDGE)
    })
  })

  BddTest().when('a section is selected from navigation', () => {
    beforeEach(() => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)
      sectionNavigationLayout.vm.$emit('selectedItem', { itemId: BuildProjectItems.MIND_MAP })
    })

    BddTest().then('it should navigate using the section query param', () => {
      expect(replaceMock).toHaveBeenCalledWith({ query: { section: BuildProjectItems.MIND_MAP } })
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
