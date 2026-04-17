import type { VueWrapper } from '@vue/test-utils'
import { mockedDeclaredActivityDetails } from '@/__mocks__/fixtures/student/activities.fixtures'
import ProjectActivityDetails, {
  type ProjectActivityDetailsProps,
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/ProjectActivityDetails/ProjectActivityDetails.vue'
import {
  AvCardStub,
  AvIconTextStub,
  AvPeriodInputStub,
  BddTest,
} from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a project activity details component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ProjectActivityDetails>>

  const stubs = {
    AvCard: AvCardStub,
    AvIconText: AvIconTextStub,
    AvPeriodInput: AvPeriodInputStub,
  }

  BddTest().when('the component is mounted with executionPeriodInfo containing "-" lines and startDate and endDate', () => {
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

    BddTest().then('it should render the execution period as a bullet list', () => {
      const list = wrapper.find('[data-testid="activity-execution-period"]')
      expect(list.exists()).toBe(true)

      const items = list.findAll('li')
      expect(items.length).toBe(2)

      expect(items[0].text()).toBe(
        'À réaliser en amont d’un entretien avec un.e conseiller/conseillère ou chargé.e d’orientation et/ou d’insertion professionnelle',
      )
      expect(items[1].text()).toBe('avant une autre activité si parcours d’activités Cofolio')
    })
  })

  BddTest().when('the component is mounted with empty executionPeriodInfo', () => {
    const props: ProjectActivityDetailsProps = {
      declaredActivityDetails: {
        ...mockedDeclaredActivityDetails,
        activity: {
          ...mockedDeclaredActivityDetails.activity,
          executionPeriodInfo: '',
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
      const list = wrapper.find('[data-testid="activity-execution-period"]')
      expect(list.exists()).toBe(true)

      const items = list.findAll('li')
      expect(items.length).toBe(0)
    })
  })

  BddTest().when('the component is mounted without startDate and endDate', () => {
    const props: ProjectActivityDetailsProps = {
      declaredActivityDetails: {
        ...mockedDeclaredActivityDetails,
        startDate: undefined,
        endDate: undefined,
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
