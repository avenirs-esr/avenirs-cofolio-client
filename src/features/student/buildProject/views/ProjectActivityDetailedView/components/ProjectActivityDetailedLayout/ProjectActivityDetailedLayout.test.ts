import type { DeclaredActivityDetailsDTO } from '@/api/avenir-esr'
import type {
  SectionNavigationItem,
} from '@/common/components/SectionNavigationLayout/SectionNavigationLayout.types'
import {
  EActivityThematic,
  EDeclaredActivityStatus,
} from '@/api/avenir-esr'
import {
  SectionNavigationLayoutStub,
} from '@/common/components/SectionNavigationLayout/SectionNavigationLayout.stub'
import { ICONS } from '@/common/constants'
import {
  MyPerspectiveSectionStub,
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/MyPerspectiveSection/MyPerspectiveSection.stub'
import MyPerspectiveSection
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/MyPerspectiveSection/MyPerspectiveSection.vue'
import ProjectActivityDetailedLayout
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/ProjectActivityDetailedLayout/ProjectActivityDetailedLayout.vue'
import {
  ProjectActivityDetailsStub,
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/ProjectActivityDetails/ProjectActivityDetails.stub'
import ProjectActivityDetails
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/ProjectActivityDetails/ProjectActivityDetails.vue'
import {
  ACTIVITY_DETAILED_SECTIONS,
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/ProjectActivityDetailedView.constants'
import { MS_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a project activity detailed layout component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ProjectActivityDetailedLayout>>

  const declaredActivityDetails: DeclaredActivityDetailsDTO = {
    id: 'declared-activity-id',
    status: EDeclaredActivityStatus.IN_PROGRESS,
    reflection: 'Ma réflexion',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    finishedAt: undefined,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-02T10:00:00Z',
    activity: {
      id: 'activity-id',
      title: 'Mon activité',
      thematic: EActivityThematic.SELF_KNOWLEDGE,
      summary: 'Résumé activité',
      description: '<h3>Description activité</h3>',
      executionPeriodInfo: '- Première période\n- Deuxième période',
      createdAt: '2025-01-01T10:00:00Z',
      updatedAt: '2025-01-02T10:00:00Z',
      enableReflection: true,
    },
  }

  const stubs = {
    SectionNavigationLayout: SectionNavigationLayoutStub,
    ProjectActivityDetails: ProjectActivityDetailsStub,
    MyPerspectiveSection: MyPerspectiveSectionStub,
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      wrapper = mountComponent(ProjectActivityDetailedLayout, {
        props: {
          declaredActivityDetails,
        },
        global: {
          stubs,
        },
      })

      await flushPromises()
    })

    BddTest().then('it should render the section navigation layout', () => {
      expect(wrapper.find('[data-testid="section-navigation-layout"]').exists()).toBe(true)
    })

    BddTest().then('it should pass the default section', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)

      expect(sectionNavigationLayout.exists()).toBe(true)
      expect(sectionNavigationLayout.props('defaultSection')).toBe(
        ACTIVITY_DETAILED_SECTIONS.ACTIVITY_DETAILED,
      )
    })

    BddTest().then('it should pass the select placeholder', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)

      expect(sectionNavigationLayout.exists()).toBe(true)
      expect(sectionNavigationLayout.props('selectPlaceholder')).toBe(
        'Accéder à',
      )
    })

    BddTest().then('it should pass the expected navigation items', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)

      expect(sectionNavigationLayout.exists()).toBe(true)
      expect(sectionNavigationLayout.props('items')).toEqual([
        {
          id: ACTIVITY_DETAILED_SECTIONS.ACTIVITY_DETAILED,
          label: 'Mon activité',
          icon: ICONS.ACTIVITY,
        },
        {
          id: ACTIVITY_DETAILED_SECTIONS.MY_PERSPECTIVE,
          label: 'Ma prise de recul',
          icon: MS_ICONS.FEATURED_PLAY_LIST_OUTLINE,
        },
      ])
    })

    BddTest().then('it should pass the expected components by section', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)
      const componentBySection = sectionNavigationLayout.props('componentBySection') as Record<string, unknown>

      expect(sectionNavigationLayout.exists()).toBe(true)
      expect(componentBySection[ACTIVITY_DETAILED_SECTIONS.ACTIVITY_DETAILED]).toBe(ProjectActivityDetails)
      expect(componentBySection[ACTIVITY_DETAILED_SECTIONS.MY_PERSPECTIVE]).toBe(MyPerspectiveSection)
    })

    BddTest().then('it should pass the declared activity details in props by section', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)
      const propsBySection = sectionNavigationLayout.props('propsBySection')

      expect(sectionNavigationLayout.exists()).toBe(true)
      expect(propsBySection).toEqual({
        [ACTIVITY_DETAILED_SECTIONS.ACTIVITY_DETAILED]: {
          declaredActivityDetails,
        },
        [ACTIVITY_DETAILED_SECTIONS.MY_PERSPECTIVE]: {
          declaredActivityDetails,
        },
      })
    })
  })

  BddTest().when('the activity title is empty', () => {
    beforeEach(async () => {
      wrapper = mountComponent(ProjectActivityDetailedLayout, {
        props: {
          declaredActivityDetails: {
            ...declaredActivityDetails,
            activity: {
              ...declaredActivityDetails.activity,
              title: '',
            },
          },
        },
        global: {
          stubs,
        },
      })

      await flushPromises()
    })

    BddTest().then('it should use the global detail label for the activity detailed item', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)
      const items = sectionNavigationLayout.props('items') as SectionNavigationItem[]

      expect(sectionNavigationLayout.exists()).toBe(true)
      expect(items[0]).toEqual({
        id: ACTIVITY_DETAILED_SECTIONS.ACTIVITY_DETAILED,
        label: 'Détail',
        icon: ICONS.ACTIVITY,
      })
    })
  })

  BddTest().when('reflection is disabled', () => {
    beforeEach(async () => {
      wrapper = mountComponent(ProjectActivityDetailedLayout, {
        props: {
          declaredActivityDetails: {
            ...declaredActivityDetails,
            activity: {
              ...declaredActivityDetails.activity,
              enableReflection: false,
            },
          },
        },
        global: {
          stubs,
        },
      })

      await flushPromises()
    })

    BddTest().then('it should not include the my perspective section in navigation items', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)
      const items = sectionNavigationLayout.props('items')

      expect(sectionNavigationLayout.exists()).toBe(true)
      expect(items).toHaveLength(1)
      expect(items[0].id).toBe(ACTIVITY_DETAILED_SECTIONS.ACTIVITY_DETAILED)
      expect(items.some(item => item.id === ACTIVITY_DETAILED_SECTIONS.MY_PERSPECTIVE)).toBe(false)
    })
  })
})
