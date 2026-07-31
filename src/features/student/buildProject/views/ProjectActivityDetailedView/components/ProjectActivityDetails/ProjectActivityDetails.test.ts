import type { VueWrapper } from '@vue/test-utils'
import { mockedDeclaredActivityDetails } from '@/__mocks__/fixtures/student/activities.fixtures'
import { ValorizedBadgeStub } from '@/common/components/badges/ValorizedBadge/ValorizedBadge.stub'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import { IconTitleCardContainerStub } from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import { ActivityResourcesListStub } from '@/common/components/lists/ActivityResourcesList/ActivityResourcesList.stub'
import ProjectActivityDetails, {
  type ProjectActivityDetailsProps,
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/ProjectActivityDetails/ProjectActivityDetails.vue'
import {
  AvIconTextStub,
  AvPeriodInputStub,
  BddTest,
} from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a project activity details component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ProjectActivityDetails>>

  const stubs = {
    Card: CardStub,
    AvIconText: AvIconTextStub,
    AvPeriodInput: AvPeriodInputStub,
    IconTitleCardContainer: IconTitleCardContainerStub,
    ActivityResourcesList: ActivityResourcesListStub,
    ValorizedBadge: ValorizedBadgeStub,
  }

  BddTest().when('the component is mounted with recommendedCompletionContexts containing "-" lines and startDate and endDate', () => {
    const props: ProjectActivityDetailsProps = {
      declaredActivityDetails: mockedDeclaredActivityDetails,
    }

    beforeEach(() => {
      wrapper = mountComponent(ProjectActivityDetails, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should render the main container', () => {
      const container = wrapper.find('[data-testid="project-activity-details"]')
      expect(container.exists()).toBe(true)
    })

    BddTest().then('it should render AvPeriodInput with the correct dates', () => {
      const periodInput = wrapper.findComponent(AvPeriodInputStub)
      expect(periodInput.exists()).toBe(true)
      expect(periodInput.props('startModelValue')).toBe(mockedDeclaredActivityDetails.startDate)
      expect(periodInput.props('endModelValue')).toBe(mockedDeclaredActivityDetails.endDate)
    })

    BddTest().then('it should render the activity title in AvIconText', () => {
      const title = wrapper.findComponent(AvIconTextStub)
      expect(title.exists()).toBe(true)
      expect(title.props('text')).toBe(mockedDeclaredActivityDetails.activity.title)
    })

    BddTest().then('it should render the activity description', () => {
      const description = wrapper.find('[data-testid="activity-description"]')
      expect(description.exists()).toBe(true)
    })

    BddTest().then('it should render the recommended completion contexts as a bullet list', () => {
      const list = wrapper.find('[data-testid="activity-recommended-completion-contexts-list"]')
      expect(list.exists()).toBe(true)

      const items = list.findAll('li')
      expect(items.length).toBe(2)

      expect(items[0].text()).toBe(
        'À réaliser en amont d\'un entretien avec un.e conseiller/conseillère ou chargé.e d\'orientation et/ou d\'insertion professionnelle',
      )
      expect(items[1].text()).toBe('avant une autre activité si parcours d\'activités Cofolio')
    })
  })

  BddTest().when('the activity has a staff-defined period, taking priority over the student period', () => {
    const props: ProjectActivityDetailsProps = {
      declaredActivityDetails: {
        ...mockedDeclaredActivityDetails,
        startDate: '2024-05-01',
        endDate: '2024-05-15',
        activity: {
          ...mockedDeclaredActivityDetails.activity,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
        },
      },
    }

    beforeEach(() => {
      wrapper = mountComponent(ProjectActivityDetails, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should render AvPeriodInput with the staff-defined dates', () => {
      const periodInput = wrapper.findComponent(AvPeriodInputStub)
      expect(periodInput.props('startModelValue')).toBe('2024-01-01')
      expect(periodInput.props('endModelValue')).toBe('2024-12-31')
    })
  })

  BddTest().when('the component is mounted with empty recommendedCompletionContexts', () => {
    const props: ProjectActivityDetailsProps = {
      declaredActivityDetails: {
        ...mockedDeclaredActivityDetails,
        activity: {
          ...mockedDeclaredActivityDetails.activity,
          recommendedCompletionContexts: '',
        },
      },
    }

    beforeEach(() => {
      wrapper = mountComponent(ProjectActivityDetails, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should render an empty list', () => {
      const list = wrapper.find('[data-testid="activity-recommended-completion-contexts-list"]')
      expect(list.exists()).toBe(true)

      const items = list.findAll('li')
      expect(items.length).toBe(0)
    })
  })

  BddTest().when('the activity is valorized', () => {
    const props: ProjectActivityDetailsProps = {
      declaredActivityDetails: {
        ...mockedDeclaredActivityDetails,
        valorized: true,
      },
    }

    beforeEach(() => {
      wrapper = mountComponent(ProjectActivityDetails, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should render ValorizedBadge with valorized true', () => {
      const badge = wrapper.findComponent(ValorizedBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('valorized')).toBe(true)
    })
  })

  BddTest().when('the activity is not valorized', () => {
    const props: ProjectActivityDetailsProps = {
      declaredActivityDetails: {
        ...mockedDeclaredActivityDetails,
        valorized: false,
      },
    }

    beforeEach(() => {
      wrapper = mountComponent(ProjectActivityDetails, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should render ValorizedBadge with valorized false', () => {
      const badge = wrapper.findComponent(ValorizedBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('valorized')).toBe(false)
    })
  })

  BddTest().when('the component is mounted without startDate and endDate', () => {
    const props: ProjectActivityDetailsProps = {
      declaredActivityDetails: {
        ...mockedDeclaredActivityDetails,
        startDate: undefined,
        endDate: undefined,
        activity: {
          ...mockedDeclaredActivityDetails.activity,
          startDate: undefined,
          endDate: undefined,
        },
      },
    }

    beforeEach(() => {
      wrapper = mountComponent(ProjectActivityDetails, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should not render AvPeriodInput', () => {
      const periodInput = wrapper.findComponent(AvPeriodInputStub)
      expect(periodInput.exists()).toBe(false)
    })
  })
})
