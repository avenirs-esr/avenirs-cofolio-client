import type { DeclaredActivityDetailsDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import type {
  SectionNavigationItem,
} from '@/common/components/layout/SectionNavigationLayout/SectionNavigationLayout.types'
import { MS_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ICONS } from '@avenirs-esr/shared'
import {
  EActivityStatus,
  EActivityThematic,
  EDeclaredActivityStatus,
} from '@avenirs-esr/shared/api/avenir-esr'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import {
  SectionNavigationLayoutStub,
} from '@/common/components/layout/SectionNavigationLayout/SectionNavigationLayout.stub'
import { ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DEFAULT, ACTIVITY_TRACE_SETTING_INFINITY_VALUE } from '@/features/staff/activities'
import {
  ActivityDetailsStub,
} from '@/features/student/activities/views/ActivityView/components/ActivityDetails/ActivityDetails.stub'
import ActivityDetails
  from '@/features/student/activities/views/ActivityView/components/ActivityDetails/ActivityDetails.vue'
import ActivityLayout
  from '@/features/student/activities/views/ActivityView/components/ActivityLayout/ActivityLayout.vue'
import {
  MyPerspectiveSectionStub,
} from '@/features/student/activities/views/ActivityView/components/MyPerspectiveSection/MyPerspectiveSection.stub'
import MyPerspectiveSection
  from '@/features/student/activities/views/ActivityView/components/MyPerspectiveSection/MyPerspectiveSection.vue'
import {
  SubActivityDetailsStub,
} from '@/features/student/activities/views/ActivityView/components/SubActivityDetails/SubActivityDetails.stub'
import SubActivityDetails
  from '@/features/student/activities/views/ActivityView/components/SubActivityDetails/SubActivityDetails.vue'
import { ActivitySections } from '@/features/student/activities/views/ActivityView/types'

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

BddTest().given('a project activity layout component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityLayout>>

  const declaredActivityDetails: DeclaredActivityDetailsDTO = {
    id: 'declared-activity-id',
    status: EDeclaredActivityStatus.IN_PROGRESS,
    reflection: 'Ma réflexion',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    finishedAt: undefined,
    valorized: false,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-02T10:00:00Z',
    activity: {
      id: 'activity-id',
      activityStatus: EActivityStatus.PUBLISHED,
      title: 'Mon activité',
      thematic: EActivityThematic.SELF_KNOWLEDGE,
      summary: 'Résumé activité',
      description: '<h3>Description activité</h3>',
      recommendedCompletionContexts: '- Première période\n- Deuxième période',
      rights: [],
      subActivities: [],
      createdAt: '2025-01-01T10:00:00Z',
      updatedAt: '2025-01-02T10:00:00Z',
      national: false,
      enableReflection: true,
      traceAllowedAssociations: ACTIVITY_TRACE_SETTING_INFINITY_VALUE,
      feedbackAllowedIterations: ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DEFAULT,
    },
    subActivities: [],
  }

  const stubs = {
    SectionNavigationLayout: SectionNavigationLayoutStub,
    ActivityDetails: ActivityDetailsStub,
    MyPerspectiveSection: MyPerspectiveSectionStub,
    SubActivityDetails: SubActivityDetailsStub,
  }

  const subActivities = [
    { id: 'sub-activity-1', title: 'Première sous-activité' },
    { id: 'sub-activity-2', title: 'Deuxième sous-activité' },
  ]

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      routeMock.name = 'student-activity'
      routeMock.fullPath = '/student/activity'
      routeMock.query = {}
      replaceMock.mockReset()

      wrapper = mountComponent(ActivityLayout, {
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
        ActivitySections.DETAIL,
      )
    })

    BddTest().then('it should fit the side navigation width to its content when there is no sub-activity', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)

      expect(sectionNavigationLayout.props('sideNavigationWidth')).toBe('fit-content')
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
          id: ActivitySections.DETAIL,
          label: 'Détail',
          icon: ICONS.ACTIVITY,
        },
        {
          id: ActivitySections.MY_PERSPECTIVE,
          label: 'Ma réflexion',
          icon: MS_ICONS.FEATURED_PLAY_LIST_OUTLINE,
        },
      ])
    })

    BddTest().then('it should pass the expected components by section', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)
      const componentBySection = sectionNavigationLayout.props('componentBySection') as Record<string, unknown>

      expect(sectionNavigationLayout.exists()).toBe(true)
      expect(componentBySection[ActivitySections.DETAIL]).toBe(ActivityDetails)
      expect(componentBySection[ActivitySections.MY_PERSPECTIVE]).toBe(MyPerspectiveSection)
    })

    BddTest().then('it should pass the declared activity details in props by section', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)
      const propsBySection = sectionNavigationLayout.props('propsBySection')

      expect(sectionNavigationLayout.exists()).toBe(true)
      expect(propsBySection).toEqual({
        [ActivitySections.DETAIL]: {
          declaredActivityDetails,
        },
        [ActivitySections.MY_PERSPECTIVE]: {
          declaredActivityDetails,
        },
      })
    })
  })

  BddTest().when('the section query param targets my perspective', () => {
    beforeEach(async () => {
      routeMock.query = { section: ActivitySections.MY_PERSPECTIVE }

      wrapper = mountComponent(ActivityLayout, {
        props: {
          declaredActivityDetails,
        },
        global: {
          stubs,
        },
      })

      await flushPromises()
    })

    BddTest().then('it should use my perspective as default section', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)

      expect(sectionNavigationLayout.props('defaultSection')).toBe(ActivitySections.MY_PERSPECTIVE)
    })
  })

  BddTest().when('a section is selected from navigation', () => {
    beforeEach(async () => {
      routeMock.query = {}

      wrapper = mountComponent(ActivityLayout, {
        props: {
          declaredActivityDetails,
        },
        global: {
          stubs,
        },
      })

      await flushPromises()

      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)
      sectionNavigationLayout.vm.$emit('selectedItem', { itemId: ActivitySections.MY_PERSPECTIVE })
    })

    BddTest().then('it should navigate using the section query param', () => {
      expect(replaceMock).toHaveBeenCalledWith({ query: { section: ActivitySections.MY_PERSPECTIVE } })
    })
  })

  BddTest().when('the declared activity has sub-activities', () => {
    beforeEach(async () => {
      routeMock.query = {}

      wrapper = mountComponent(ActivityLayout, {
        props: {
          declaredActivityDetails: {
            ...declaredActivityDetails,
            subActivities,
          },
        },
        global: {
          stubs,
        },
      })

      await flushPromises()
    })

    BddTest().then('it should insert one indexed item per sub-activity between detail and my perspective', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)

      expect(sectionNavigationLayout.props('items')).toEqual([
        {
          id: ActivitySections.DETAIL,
          label: 'Détail',
          icon: ICONS.ACTIVITY,
        },
        {
          id: 'sub-activity-1',
          label: 'Première sous-activité',
          index: 1,
        },
        {
          id: 'sub-activity-2',
          label: 'Deuxième sous-activité',
          index: 2,
        },
        {
          id: ActivitySections.MY_PERSPECTIVE,
          label: 'Ma réflexion',
          icon: MS_ICONS.FEATURED_PLAY_LIST_OUTLINE,
        },
      ])
    })

    BddTest().then('it should keep the default side navigation width', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)

      expect(sectionNavigationLayout.props('sideNavigationWidth')).toBeUndefined()
    })

    BddTest().then('it should associate the sub-activity details section to each sub-activity item', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)
      const componentBySection = sectionNavigationLayout.props('componentBySection') as Record<string, unknown>

      expect(componentBySection['sub-activity-1']).toBe(SubActivityDetails)
      expect(componentBySection['sub-activity-2']).toBe(SubActivityDetails)
    })

    BddTest().then('it should pass each sub-activity in props by section', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)

      expect(sectionNavigationLayout.props('propsBySection')).toEqual({
        [ActivitySections.DETAIL]: {
          declaredActivityDetails: {
            ...declaredActivityDetails,
            subActivities,
          },
        },
        'sub-activity-1': {
          subActivity: subActivities[0],
        },
        'sub-activity-2': {
          subActivity: subActivities[1],
        },
        [ActivitySections.MY_PERSPECTIVE]: {
          declaredActivityDetails: {
            ...declaredActivityDetails,
            subActivities,
          },
        },
      })
    })
  })

  BddTest().when('the section query param targets a sub-activity', () => {
    beforeEach(async () => {
      routeMock.query = { section: 'sub-activity-2' }

      wrapper = mountComponent(ActivityLayout, {
        props: {
          declaredActivityDetails: {
            ...declaredActivityDetails,
            subActivities,
          },
        },
        global: {
          stubs,
        },
      })

      await flushPromises()
    })

    BddTest().then('it should use the sub-activity as default section', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)

      expect(sectionNavigationLayout.props('defaultSection')).toBe('sub-activity-2')
    })
  })

  BddTest().when('the activity title is empty', () => {
    beforeEach(async () => {
      wrapper = mountComponent(ActivityLayout, {
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

    BddTest().then('it should use the global detail label for the activity item', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)
      const items = sectionNavigationLayout.props('items') as SectionNavigationItem[]

      expect(sectionNavigationLayout.exists()).toBe(true)
      expect(items[0]).toEqual({
        id: ActivitySections.DETAIL,
        label: 'Détail',
        icon: ICONS.ACTIVITY,
      })
    })
  })

  BddTest().when('reflection is disabled', () => {
    beforeEach(async () => {
      wrapper = mountComponent(ActivityLayout, {
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
      expect(items[0].id).toBe(ActivitySections.DETAIL)
      expect(items.some(item => item.id === ActivitySections.MY_PERSPECTIVE)).toBe(false)
    })
  })

  BddTest().when('the declared activity is unsubscribed', () => {
    beforeEach(async () => {
      wrapper = mountComponent(ActivityLayout, {
        props: {
          declaredActivityDetails: {
            ...declaredActivityDetails,
            status: EDeclaredActivityStatus.UNSUBSCRIBED,
          },
        },
        global: {
          stubs,
        },
      })

      await flushPromises()
    })

    BddTest().then('it should still include the my perspective section in navigation items', () => {
      const sectionNavigationLayout = wrapper.findComponent(SectionNavigationLayoutStub)
      const items = sectionNavigationLayout.props('items')

      expect(sectionNavigationLayout.exists()).toBe(true)
      expect(items).toHaveLength(2)
      expect(items.some(item => item.id === ActivitySections.MY_PERSPECTIVE)).toBe(true)
    })
  })
})
