import type { DeclaredActivityDetailsDTO } from '@/api/avenir-esr'
import {
  EActivityThematic,
  EDeclaredActivityStatus,
} from '@/api/avenir-esr'
import {
  MyPerspectiveSectionStub,
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/MyPerspectiveSection/MyPerspectiveSection.stub'
import {
  ActivityDetailedSelectNavigationStub,
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/navigation/ActivityDetailedSelectNavigation/ActivityDetailedSelectNavigation.stub'
import {
  ActivityDetailedSideNavigationStub,
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/navigation/ActivityDetailedSideNavigation/ActivityDetailedSideNavigation.stub'
import ProjectActivityDetailedLayout
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/ProjectActivityDetailedLayout/ProjectActivityDetailedLayout.vue'
import {
  ProjectActivityDetailsStub,
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/ProjectActivityDetails/ProjectActivityDetails.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const useAvBreakpointsMock = vi.fn()

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    useAvBreakpoints: () => useAvBreakpointsMock(),
  }
})

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
      executionPeriodInfo: '- Première période\n- Deuxième période',
      createdAt: '2025-01-01T10:00:00Z',
      updatedAt: '2025-01-02T10:00:00Z',
    },
  }

  const stubs = {
    ActivityDetailedSideNavigation: ActivityDetailedSideNavigationStub,
    ActivityDetailedSelectNavigation: ActivityDetailedSelectNavigationStub,
    ProjectActivityDetails: ProjectActivityDetailsStub,
    MyPerspectiveSection: MyPerspectiveSectionStub,
  }

  BddTest().when('the component is mounted on desktop', () => {
    beforeEach(async () => {
      useAvBreakpointsMock.mockReturnValue({
        isMobile: false,
      })

      wrapper = mountComponent(ProjectActivityDetailedLayout, {
        props: {
          declaredActivityDetails,
        },
        global: { stubs },
      })

      await flushPromises()
    })

    BddTest().then('it should render the layout container', () => {
      expect(wrapper.find('[data-testid="activity-detailed-layout"]').exists()).toBe(true)
    })

    BddTest().then('it should render the desktop side navigation', () => {
      expect(wrapper.find('[data-testid="activity-detailed-side-navigation"]').exists()).toBe(true)
    })

    BddTest().then('it should not render the mobile select navigation', () => {
      expect(wrapper.find('[data-testid="activity-detailed-select-navigation"]').exists()).toBe(false)
    })

    BddTest().then('it should render project activity details by default', () => {
      expect(wrapper.find('[data-testid="project-activity-details"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="my-perspective-section"]').exists()).toBe(false)
    })

    BddTest().then('it should pass the declared activity detail to project activity details', () => {
      const projectActivityDetails = wrapper.findComponent(ProjectActivityDetailsStub)

      expect(projectActivityDetails.exists()).toBe(true)
      expect(projectActivityDetails.props('declaredActivityDetails')).toEqual(declaredActivityDetails)
    })

    BddTest().then('it should pass the activity title to side navigation', () => {
      const sideNavigation = wrapper.findComponent(ActivityDetailedSideNavigationStub)

      expect(sideNavigation.exists()).toBe(true)
      expect(sideNavigation.props('activityTitle')).toBe('Mon activité')
    })

    BddTest().then('it should pass the default selected item to side navigation', () => {
      const sideNavigation = wrapper.findComponent(ActivityDetailedSideNavigationStub)

      expect(sideNavigation.props('selectedItem')).toEqual({
        itemId: 'activity-detailed',
      })
    })

    BddTest().and('the side navigation selects my perspective', () => {
      beforeEach(async () => {
        const sideNavigation = wrapper.findComponent(ActivityDetailedSideNavigationStub)
        await sideNavigation.vm.$emit('update:selectedItem', { itemId: 'my-perspective' })
        await flushPromises()
      })

      BddTest().then('it should render my perspective section', () => {
        expect(wrapper.find('[data-testid="my-perspective-section"]').exists()).toBe(true)
      })

      BddTest().then('it should no longer render project activity details', () => {
        expect(wrapper.find('[data-testid="project-activity-details"]').exists()).toBe(false)
      })
    })

    BddTest().and('the side navigation emits an invalid selected item', () => {
      beforeEach(async () => {
        const sideNavigation = wrapper.findComponent(ActivityDetailedSideNavigationStub)
        await sideNavigation.vm.$emit('update:selectedItem', { itemId: 'invalid-value' })
        await flushPromises()
      })

      BddTest().then('it should keep project activity details as default section', () => {
        expect(wrapper.find('[data-testid="project-activity-details"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="my-perspective-section"]').exists()).toBe(false)
      })
    })
  })

  BddTest().when('the component is mounted on mobile', () => {
    beforeEach(async () => {
      useAvBreakpointsMock.mockReturnValue({
        isMobile: true,
      })

      wrapper = mountComponent(ProjectActivityDetailedLayout, {
        props: {
          declaredActivityDetails,
        },
        global: { stubs },
      })

      await flushPromises()
    })

    BddTest().then('it should render the mobile select navigation', () => {
      expect(wrapper.find('[data-testid="activity-detailed-select-navigation"]').exists()).toBe(true)
    })

    BddTest().then('it should not render the desktop side navigation', () => {
      expect(wrapper.find('[data-testid="activity-detailed-side-navigation"]').exists()).toBe(false)
    })

    BddTest().then('it should render project activity details by default', () => {
      expect(wrapper.find('[data-testid="project-activity-details"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="my-perspective-section"]').exists()).toBe(false)
    })

    BddTest().then('it should pass the activity title to select navigation', () => {
      const selectNavigation = wrapper.findComponent(ActivityDetailedSelectNavigationStub)

      expect(selectNavigation.exists()).toBe(true)
      expect(selectNavigation.props('activityTitle')).toBe('Mon activité')
    })

    BddTest().then('it should pass the default selected item to select navigation', () => {
      const selectNavigation = wrapper.findComponent(ActivityDetailedSelectNavigationStub)

      expect(selectNavigation.props('selectedItem')).toEqual({
        itemId: 'activity-detailed',
      })
    })

    BddTest().and('the select navigation selects my perspective', () => {
      beforeEach(async () => {
        const selectNavigation = wrapper.findComponent(ActivityDetailedSelectNavigationStub)
        await selectNavigation.vm.$emit('update:selectedItem', { itemId: 'my-perspective' })
        await flushPromises()
      })

      BddTest().then('it should render my perspective section', () => {
        expect(wrapper.find('[data-testid="my-perspective-section"]').exists()).toBe(true)
      })

      BddTest().then('it should no longer render project activity details', () => {
        expect(wrapper.find('[data-testid="project-activity-details"]').exists()).toBe(false)
      })
    })

    BddTest().and('the select navigation emits an invalid selected item', () => {
      beforeEach(async () => {
        const selectNavigation = wrapper.findComponent(ActivityDetailedSelectNavigationStub)
        await selectNavigation.vm.$emit('update:selectedItem', { itemId: 'invalid-value' })
        await flushPromises()
      })

      BddTest().then('it should keep project activity details as default section', () => {
        expect(wrapper.find('[data-testid="project-activity-details"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="my-perspective-section"]').exists()).toBe(false)
      })
    })
  })
})
