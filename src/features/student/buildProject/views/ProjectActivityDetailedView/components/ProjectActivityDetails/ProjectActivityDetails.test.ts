import { mockedDeclaredActivityDetails } from '@/__mocks__/fixtures/student/activities.fixtures'
import ProjectActivityDetails, { type ProjectActivityDetailsProps } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/ProjectActivityDetails/ProjectActivityDetails.vue'
import { AvCardStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a project activity details component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ProjectActivityDetails>>

  const stubs = {
    AvCard: AvCardStub,
    AvIconText: AvIconTextStub,
  }

  BddTest().when('the component is mounted with executionPeriodInfo containing "-" lines', () => {
    const props: ProjectActivityDetailsProps = {
      declaredActivityDetails: mockedDeclaredActivityDetails,
    }

    beforeEach(() => {
      wrapper = mount(ProjectActivityDetails, { props, global: { stubs } })
    })

    BddTest().then('it should render the main container', () => {
      const container = wrapper.find('[data-testid="project-activity-details"]')
      expect(container.exists()).toBe(true)
    })

    BddTest().then('it should render the activity title in AvIconText', () => {
      const title = wrapper.findComponent(AvIconTextStub)
      expect(title.exists()).toBe(true)
      expect(title.props('text')).toBe(mockedDeclaredActivityDetails.activity.title)
    })

    BddTest().then('it should render the activity summary', () => {
      const summary = wrapper.find('[data-testid="activity-summary"]')
      expect(summary.exists()).toBe(true)
      expect(summary.text()).toBe(mockedDeclaredActivityDetails.activity.summary)
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
      wrapper = mount(ProjectActivityDetails, { props, global: { stubs } })
    })

    BddTest().then('it should render an empty list', () => {
      const list = wrapper.find('[data-testid="activity-execution-period"]')
      expect(list.exists()).toBe(true)

      const items = list.findAll('li')
      expect(items.length).toBe(0)
    })
  })
})
