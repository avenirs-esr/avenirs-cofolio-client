import type { VueWrapper } from '@vue/test-utils'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import RequestFeedback from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/interactions/RequestFeedback/RequestFeedback.vue'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a RequestFeedback component', () => {
  let wrapper: VueWrapper<InstanceType<typeof RequestFeedback>>

  const stubs = {
    AvButton: AvButtonStub,
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

    BddTest().then('it should render the feedback button with correct props', () => {
      const button = wrapper.findComponent(AvButtonStub)
      expect(button.exists()).toBe(true)
      expect(button.props('label')).toBe('Demander un feedback')
      expect(button.props('variant')).toBe('OUTLINED')
      expect(button.props('disabled')).toBe(false)
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

    BddTest().then('it should render the button as disabled', () => {
      expect(wrapper.findComponent(AvButtonStub).props('isLoading')).toBe(true)
    })
  })
})
