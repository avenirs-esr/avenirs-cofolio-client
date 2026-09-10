import type { VueWrapper } from '@vue/test-utils'
import { getMockedActivitiesWithFeedbacks } from '@/__mocks__/fixtures/staffs/activities-with-feedbacks.fixtures'
import { IconTitleCardContainerStub } from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import FeedbackActivityConsignCard from '@/features/staff/feedbacks/views/FeedbacksView/components/cards/FeedbackActivityConsignCard/FeedbackActivityConsignCard.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import DOMPurify from 'dompurify'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an activity consign card', () => {
  let wrapper: VueWrapper<InstanceType<typeof FeedbackActivityConsignCard>>

  const stubs = {
    IconTitleCardContainer: IconTitleCardContainerStub,
  }

  const getContainer = () => wrapper.findComponent(IconTitleCardContainerStub)

  BddTest().when('a description is provided', () => {
    const description = getMockedActivitiesWithFeedbacks().find(activity => !!activity.description)!.description!

    beforeEach(() => {
      wrapper = mountComponent(FeedbackActivityConsignCard, {
        props: { description },
        global: { stubs }
      })
    })

    BddTest().then('it should display the consign card', () => {
      expect(getContainer().exists()).toBe(true)
    })

    BddTest().then('it should display the expected title', () => {
      expect(getContainer().props('title')).toBe('Consigne')
    })

    BddTest().then('it should display the expected icon', () => {
      expect(getContainer().props('titleIcon')).toBe(MDI_ICONS.FILE_DOCUMENT_BOX_MULTIPLE_OUTLINE)
    })

    BddTest().then('it should be collapsed by default', () => {
      expect(getContainer().props('collapsed')).toBe(true)
    })

    BddTest().then('it should display the sanitized description', () => {
      const content = DOMPurify.sanitize(description)
      expect(getContainer().text()).toBe(content)
    })
  })

  BddTest().when('no description is provided', () => {
    beforeEach(() => {
      wrapper = mountComponent(FeedbackActivityConsignCard, {
        global: { stubs }
      })
    })

    BddTest().then('it should not display the consign card', () => {
      expect(getContainer().exists()).toBe(false)
    })
  })
})
