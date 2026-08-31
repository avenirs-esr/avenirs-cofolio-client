import type { VueWrapper } from '@vue/test-utils'
import ActivityRecommendedCompletionContextsList, {
  type ActivityRecommendedCompletionContextsListProps
} from '@/common/activities/components/ActivityRecommendedCompletionContextsList/ActivityRecommendedCompletionContextsList.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an activity recommended completion contexts list component', () => {
  let wrapper: VueWrapper<
    InstanceType<typeof ActivityRecommendedCompletionContextsList>
  >

  BddTest().when('the component is mounted with recommended completion contexts', () => {
    const props:
    ActivityRecommendedCompletionContextsListProps = {
      recommendedCompletionContexts:
            '- Première ligne\n- Deuxième ligne'
    }
    beforeEach(() => {
      wrapper = mountComponent(
        ActivityRecommendedCompletionContextsList,
        {
          props
        }
      )
    })

    BddTest().then('it should render recommended completion contexts list', () => {
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

  BddTest().when('the component is mounted without recommendedCompletionContexts', () => {
    const props:
    ActivityRecommendedCompletionContextsListProps = {
      recommendedCompletionContexts: ''
    }
    beforeEach(() => {
      wrapper = mountComponent(
        ActivityRecommendedCompletionContextsList,
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
