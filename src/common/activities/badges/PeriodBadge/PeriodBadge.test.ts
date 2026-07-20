import PeriodBadge from '@/common/activities/badges/PeriodBadge/PeriodBadge.vue'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { expect } from 'vitest'

BddTest().given('a PeriodBadge component', () => {
  let wrapper: VueWrapper<InstanceType<typeof PeriodBadge>>

  const stubs = { AvBadge: AvBadgeStub }

  BddTest().when('the component is mounted with startDate and endDate props', () => {
    beforeEach(() => {
      wrapper = mount(PeriodBadge, {
        props: {
          startDate: '2023-01-01',
          endDate: '2023-12-31'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the formatted start and end dates', () => {
      expect(wrapper.text()).toContain('01/2023')
      expect(wrapper.text()).toContain('12/2023')
    })
  })

  BddTest().when('the component is mounted with only startDate prop', () => {
    BddTest().when('the component is mounted with only startDate prop', () => {
      beforeEach(() => {
        wrapper = mount(PeriodBadge, {
          props: {
            startDate: '2023-01-01'
          },
          global: { stubs }
        })
      })

      BddTest().then('it should display the formatted start date and "En cours"', () => {
        expect(wrapper.text()).toContain('01/2023')
        expect(wrapper.text()).toContain('En cours')
      })
    })
  })
})
