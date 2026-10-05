import type { VueWrapper } from '@vue/test-utils'
import ActivityDescriptionContent, {
  type ActivityDescriptionContentProps
} from '@/common/activities/components/ActivityDescriptionContent/ActivityDescriptionContent.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an activity description content component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityDescriptionContent>>

  BddTest().when('the component is mounted with description', () => {
    const props: ActivityDescriptionContentProps = {
      description: '<p>Description activité</p>'
    }
    beforeEach(() => {
      wrapper = mountComponent(ActivityDescriptionContent, {
        props
      })
    })

    BddTest().then('it should render description', () => {
      const description = wrapper.find('[data-testid="activity-description"]')

      expect(description.exists()).toBe(true)
      expect(description.html()).toContain('Description activité')
    })
  })

  BddTest().when('the component is mounted without description', () => {
    const props: ActivityDescriptionContentProps = {
      description: ''
    }

    beforeEach(() => {
      wrapper = mountComponent(ActivityDescriptionContent, {
        props
      })
    })

    BddTest().then('it should render empty description', () => {
      const description = wrapper.find('[data-testid="activity-description"]')
      expect(description.exists()).toBe(true)
    })
  })

  BddTest().when('the description contains unsafe HTML', () => {
    beforeEach(() => {
      wrapper = mountComponent(ActivityDescriptionContent, {
        props: {
          description: '<p>Description sûre</p><script>alert("xss")</script><a href="javascript:alert(1)" onclick="alert(1)">Lien</a>'
        }
      })
    })

    BddTest().then('it should preserve safe content and remove executable markup', () => {
      const description = wrapper.find('[data-testid="activity-description"]')

      expect(description.text()).toContain('Description sûre')
      expect(description.text()).toContain('Lien')
      expect(description.html()).not.toContain('<script')
      expect(description.html()).not.toContain('javascript:')
      expect(description.html()).not.toContain('onclick')
    })
  })
})
