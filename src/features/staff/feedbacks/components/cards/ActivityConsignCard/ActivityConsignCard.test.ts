import type { ActivityConsignCardProps } from '@/features/staff/feedbacks/components/cards/ActivityConsignCard/ActivityConsignCard.vue'
import type { VueWrapper } from '@vue/test-utils'
import { IconTitleCardContainerStub } from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import ActivityConsignCard from '@/features/staff/feedbacks/components/cards/ActivityConsignCard/ActivityConsignCard.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an activity consign card', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityConsignCard>>

  const stubs = {
    IconTitleCardContainer: IconTitleCardContainerStub
  }

  const getContent = () =>
    wrapper.find('[data-testid="activity-consign-card-content"]')

  BddTest().when('the component is mounted with a description', () => {
    const props: ActivityConsignCardProps = {
      description: '<p>This is the activity consign</p>'
    }

    beforeEach(() => {
      wrapper = mountComponent(ActivityConsignCard, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should render IconTitleCardContainer with the expected icon', () => {
      const container = wrapper.findComponent(IconTitleCardContainerStub)

      expect(container.exists()).toBe(true)
      expect(container.props('title')).toBe('Consigne')
      expect(container.props('titleIcon')).toBe(MDI_ICONS.FILE_DOCUMENT_BOX_MULTIPLE_OUTLINE)
      expect(container.props('collapsed')).toBe(true)
    })

    BddTest().then('it should render the description content', () => {
      const content = getContent()

      expect(content.exists()).toBe(true)
      expect(content.html()).toContain('This is the activity consign')
    })
  })

  BddTest().when('the component is mounted without a description', () => {
    beforeEach(() => {
      wrapper = mountComponent(ActivityConsignCard, {
        global: { stubs }
      })
    })

    BddTest().then('it should render an empty content', () => {
      const content = getContent()

      expect(content.exists()).toBe(true)
      expect(content.text()).toBe('')
    })
  })
})
