import type { VueWrapper } from '@vue/test-utils'
import { EFeedbackStatus } from '@/api/avenir-esr'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import RequestFeedback from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/interactions/RequestFeedback/RequestFeedback.vue'
import { AvBadgeStub, AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a RequestFeedback component', () => {
  let wrapper: VueWrapper<InstanceType<typeof RequestFeedback>>

  const stubs = {
    AvButton: AvButtonStub,
    AvBadge: AvBadgeStub,
    ConfirmationModal: ConfirmationModalStub,
  }

  BddTest().when('the component is mounted without any props', () => {
    beforeEach(() => {
      wrapper = mountComponent(RequestFeedback, {
        props: { remainingFeedbacks: 2 },
        global: { stubs },
      })
    })

    BddTest().then('it should render the request feedback block', () => {
      expect(wrapper.find('[data-testid="request-feedback"]').exists()).toBe(true)
    })

    BddTest().then('it should render the feedback button', () => {
      expect(wrapper.findComponent(AvButtonStub).exists()).toBe(true)
      expect(wrapper.findComponent(AvBadgeStub).exists()).toBe(false)
    })

    BddTest().then('it should render the confirmation modal closed by default', () => {
      const modal = wrapper.findComponent(ConfirmationModalStub)
      expect(modal.exists()).toBe(true)
      expect(modal.props('show')).toBe(false)
    })

    BddTest().and('the user clicks on the feedback button', () => {
      beforeEach(async () => {
        wrapper.findComponent(AvButtonStub).vm.$emit('click')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should open the confirmation modal', () => {
        expect(wrapper.findComponent(ConfirmationModalStub).props('show')).toBe(true)
      })

      BddTest().and('the user confirms', () => {
        beforeEach(async () => {
          wrapper.findComponent(ConfirmationModalStub).vm.$emit('confirm')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should emit the requestFeedback event', () => {
          expect(wrapper.emitted('requestFeedback')).toBeTruthy()
        })

        BddTest().then('it should close the modal', () => {
          expect(wrapper.findComponent(ConfirmationModalStub).props('show')).toBe(false)
        })
      })

      BddTest().and('the user closes the modal', () => {
        beforeEach(async () => {
          wrapper.findComponent(ConfirmationModalStub).vm.$emit('close')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should close the modal', () => {
          expect(wrapper.findComponent(ConfirmationModalStub).props('show')).toBe(false)
        })
      })
    })
  })

  BddTest().when('the component is mounted with feedbackStatus NEW', () => {
    beforeEach(() => {
      wrapper = mountComponent(RequestFeedback, {
        props: { remainingFeedbacks: 2, feedbackStatus: EFeedbackStatus.NEW, feedbackCreatedAt: '2024-01-01T00:00:00Z' },
        global: { stubs },
      })
    })

    BddTest().then('it should render the button and not the badge', () => {
      expect(wrapper.findComponent(AvButtonStub).exists()).toBe(true)
      expect(wrapper.findComponent(AvBadgeStub).exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with feedbackStatus IN_PROCESS', () => {
    beforeEach(() => {
      wrapper = mountComponent(RequestFeedback, {
        props: { remainingFeedbacks: 2, feedbackStatus: EFeedbackStatus.IN_PROCESS },
        global: { stubs },
      })
    })

    BddTest().then('it should render the button as disabled', () => {
      expect(wrapper.findComponent(AvButtonStub).exists()).toBe(true)
      expect(wrapper.findComponent(AvBadgeStub).exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with remainingFeedbacks', () => {
    beforeEach(() => {
      wrapper = mountComponent(RequestFeedback, {
        props: { remainingFeedbacks: 2 },
        global: { stubs },
      })
    })

    BddTest().then('it should pass the remaining feedbacks count to the confirmation modal description', () => {
      const modal = wrapper.findComponent(ConfirmationModalStub)
      expect(modal.props('description')).toContain('2')
    })
  })

  BddTest().when('the component is mounted with disabled true', () => {
    beforeEach(() => {
      wrapper = mountComponent(RequestFeedback, {
        props: { disabled: true, remainingFeedbacks: 2 },
        global: { stubs },
      })
    })

    BddTest().then('it should render the button as disabled', () => {
      expect(wrapper.findComponent(AvButtonStub).props('disabled')).toBe(true)
    })
  })

  BddTest().when('the component is mounted with isLoading true', () => {
    beforeEach(() => {
      wrapper = mountComponent(RequestFeedback, {
        props: { isLoading: true, remainingFeedbacks: 2 },
        global: { stubs },
      })
    })

    BddTest().then('it should render the button as loading', () => {
      expect(wrapper.findComponent(AvButtonStub).props('isLoading')).toBe(true)
    })
  })
})
