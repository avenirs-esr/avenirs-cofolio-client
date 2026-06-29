import { mockedActivityDetail } from '@/__mocks__/fixtures/student/activities.fixtures'
import ActivityCatalogPreviewCard from '@/common/activities/components/ActivityCatalogPreviewCard/ActivityCatalogPreviewCard.vue'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an activity catalog preview card', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityCatalogPreviewCard>>

  const stubs = {
    Card: CardStub,
  }

  BddTest().when('the component is mounted with summary and executionPeriodInfo', () => {
    beforeEach(() => {
      wrapper = mount(ActivityCatalogPreviewCard, {
        props: {
          summary: mockedActivityDetail.summary,
          executionPeriodInfo: mockedActivityDetail.executionPeriodInfo,
        },
        global: { stubs },
      })
    })

    BddTest().then('it should render the preview title label', () => {
      expect(wrapper.text()).toContain('Extrait de l\'activité')
    })

    BddTest().then('it should render the period title label', () => {
      expect(wrapper.text()).toContain('Période de réalisation')
    })

    BddTest().then('it should render the activity summary', () => {
      const summary = wrapper.find('[data-testid="activity-summary"]')
      expect(summary.exists()).toBe(true)
      expect(summary.text()).toBe(mockedActivityDetail.summary)
    })

    BddTest().then('it should render the execution period info', () => {
      const periodInfo = wrapper.find('[data-testid="activity-execution-period-info"]')
      expect(periodInfo.exists()).toBe(true)
      expect(periodInfo.text()).toBe(mockedActivityDetail.executionPeriodInfo)
    })

    BddTest().then('it should not render the actions container when no actions slot is provided', () => {
      expect(wrapper.find('.av-justify-end').exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with an actions slot', () => {
    beforeEach(() => {
      wrapper = mount(ActivityCatalogPreviewCard, {
        props: {
          summary: mockedActivityDetail.summary,
        },
        slots: {
          actions: '<button data-testid="slot-action-button">Action</button>',
        },
        global: { stubs },
      })
    })

    BddTest().then('it should render the actions slot content', () => {
      expect(wrapper.find('[data-testid="slot-action-button"]').exists()).toBe(true)
    })
  })
})
