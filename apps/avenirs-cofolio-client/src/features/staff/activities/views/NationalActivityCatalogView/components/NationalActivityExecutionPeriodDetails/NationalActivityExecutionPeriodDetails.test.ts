import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { DatePeriodPickerStub, ICONS } from '@avenirs-esr/shared'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { IconTitleCardContainerStub } from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import NationalActivityExecutionPeriodDetails from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivityExecutionPeriodDetails/NationalActivityExecutionPeriodDetails.vue'

const START_DATE = '2026-03-01'
const END_DATE = '2026-03-31'

BddTest().given('a national activity execution period details component', () => {
  let wrapper: VueWrapper<InstanceType<typeof NationalActivityExecutionPeriodDetails>>

  const stubs = {
    IconTitleCardContainer: IconTitleCardContainerStub,
    DatePeriodPicker: DatePeriodPickerStub,
  }

  const getCard = () => wrapper.findComponent(IconTitleCardContainerStub)
  const getDatePeriodPicker = () => wrapper.findComponent(DatePeriodPickerStub)

  BddTest().when('it is mounted with a period', () => {
    beforeEach(() => {
      wrapper = mount(NationalActivityExecutionPeriodDetails, {
        props: { startDate: START_DATE, endDate: END_DATE },
        global: { stubs },
      })
    })

    BddTest().then('it should render the card with the period title and icon', () => {
      expect(getCard().props('title')).toBe('Période de réalisation définie')
      expect(getCard().props('titleIcon')).toBe(ICONS.PERIOD)
    })

    BddTest().then('it should render the card on the base background', () => {
      expect(getCard().props('backgroundColor')).toBe('var(--other-background-base)')
    })

    BddTest().then('it should pass the period to the date period picker', () => {
      expect(getDatePeriodPicker().props('startDate')).toBe(START_DATE)
      expect(getDatePeriodPicker().props('endDate')).toBe(END_DATE)
    })

    BddTest().then('it should render a read-only date picker without the ongoing option', () => {
      expect(getDatePeriodPicker().props('type')).toBe('date')
      expect(getDatePeriodPicker().props('disabled')).toBe(true)
      expect(getDatePeriodPicker().props('showOngoing')).toBe(false)
    })
  })
})
