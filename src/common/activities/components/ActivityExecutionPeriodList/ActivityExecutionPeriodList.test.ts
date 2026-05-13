import type { VueWrapper } from '@vue/test-utils'
import ActivityExecutionPeriodList, {
  type ActivityExecutionPeriodListProps
} from '@/common/activities/components/ActivityExecutionPeriodList/ActivityExecutionPeriodList.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an activity execution period list component', () => {
  let wrapper: VueWrapper<
    InstanceType<typeof ActivityExecutionPeriodList>
  >

  BddTest().when('the component is mounted with execution periods', () => {
    const props:
    ActivityExecutionPeriodListProps = {
      executionPeriodInfo:
            '- Première ligne\n- Deuxième ligne'
    }
    beforeEach(() => {
      wrapper = mountComponent(
        ActivityExecutionPeriodList,
        {
          props
        }
      )
    })

    BddTest().then('it should render execution period list', () => {
      const items = wrapper.findAll('li')
      expect(items.length).toBe(2)
      expect(items[0].text()).toContain(
        'Première ligne'
      )
      expect(items[1].text()).toContain(
        'Deuxième ligne'
      )
    })
  })

  BddTest().when('the component is mounted without executionPeriodInfo', () => {
    const props:
    ActivityExecutionPeriodListProps = {
      executionPeriodInfo: ''
    }
    beforeEach(() => {
      wrapper = mountComponent(
        ActivityExecutionPeriodList,
        {
          props
        }
      )
    })

    BddTest().then('it should render empty list', () => {
      const items = wrapper.findAll('li')
      expect(items.length).toBe(0)
    })
  })
})
