import type { VueWrapper } from '@vue/test-utils'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import { CancelSubscribeActivityConfirmModalStub } from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/overlays/CancelSubscribeActivityConfirmModal/CancelSubscribeActivityConfirmModal.stub'
import SubscribeActivityModal, { type SubscribeActivityModalProps } from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/overlays/SubscribeActivityModal/SubscribeActivityModal.vue'
import { AvPeriodInputStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockAddErrorMessage = vi.fn()
const mockAddSuccessMessage = vi.fn()

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage,
      addSuccessMessage: mockAddSuccessMessage
    })
  }
})

BddTest().given('a subscribe activity modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof SubscribeActivityModal>>

  const stubs = {
    ConfirmationModal: ConfirmationModalStub,
    CancelSubscribeActivityConfirmModal: CancelSubscribeActivityConfirmModalStub,
    AvPeriodInput: AvPeriodInputStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with a valid activity', () => {
    const props: SubscribeActivityModalProps = {
      show: true,
      activity: { id: 'activity-id', title: 'Activity Title', }
    }
    beforeEach(() => {
      wrapper = mountComponent(SubscribeActivityModal, { props, global: { stubs } })
    })

    BddTest().then('it should render the confirmation modal', () => {
      const modal = wrapper.findComponent(ConfirmationModalStub)
      expect(modal.exists()).toBe(true)
      expect(modal.props('show')).toBe(true)
    })

    BddTest().then('it should render the title', () => {
      const title = wrapper.find('[data-testid="subscribe-activity-modal__header"]')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe(`Inscription à l\'activité ${props.activity.title}`)
    })

    BddTest().then('it should render the cancel subscribe activity confirm modal', () => {
      const modal = wrapper.findComponent(CancelSubscribeActivityConfirmModalStub)
      expect(modal.exists()).toBe(true)
    })

    BddTest().then('it should render the period input', () => {
      const periodInput = wrapper.findComponent(AvPeriodInputStub)
      expect(periodInput.exists()).toBe(true)
    })

    BddTest().and('the user sets a start date and end date', () => {
      const startDate = '2026-03-11'
      const endDate = '2026-03-20'

      beforeEach(async () => {
        const periodInput = wrapper.findComponent(AvPeriodInputStub)
        await periodInput.vm.$emit('update:startModelValue', startDate)
        await periodInput.vm.$emit('update:endModelValue', endDate)
      })

      BddTest().then('it should update the period input start date value', async () => {
        await flushPromises()
        const periodInput = wrapper.findComponent(AvPeriodInputStub)
        expect(periodInput.props('startModelValue')).toBe(startDate)
      })

      BddTest().then('it should update the period input end date value', async () => {
        await flushPromises()
        const periodInput = wrapper.findComponent(AvPeriodInputStub)
        expect(periodInput.props('endModelValue')).toBe(endDate)
      })

      BddTest().and('the user confirms the subscription', () => {
        beforeEach(() => {
          const modal = wrapper.findComponent(ConfirmationModalStub)
          modal.vm.$emit('confirm')
        })

        BddTest().then('it should add a success message', async () => {
          await vi.waitFor(() => {
            expect(mockAddSuccessMessage).toHaveBeenCalled()
          })
        })

        BddTest().then('it should emit the subscribed event', async () => {
          await vi.waitFor(() => {
            expect(wrapper.emitted('subscribed')).toBeTruthy()
          })
        })
      })
    })

    BddTest().and('the user sets an end date before the start date', () => {
      beforeEach(async () => {
        const periodInput = wrapper.findComponent(AvPeriodInputStub)
        await periodInput.vm.$emit('update:startModelValue', '2026-03-20')
        await periodInput.vm.$emit('update:endModelValue', '2026-03-10')
      })

      BddTest().and('the user confirms the subscription', () => {
        beforeEach(async () => {
          const modal = wrapper.findComponent(ConfirmationModalStub)
          modal.vm.$emit('confirm')
          await flushPromises()
        })

        BddTest().then('it should show an error on the end date field', () => {
          const periodInput = wrapper.findComponent(AvPeriodInputStub)
          expect(periodInput.props('endErrorMessage')).toBeTruthy()
        })

        BddTest().then('it should not add a success message', () => {
          expect(mockAddSuccessMessage).not.toHaveBeenCalled()
        })

        BddTest().then('it should not emit the subscribed event', () => {
          expect(wrapper.emitted('subscribed')).toBeFalsy()
        })
      })
    })

    BddTest().and('the user cancels the action without any date entered', () => {
      beforeEach(() => {
        const modal = wrapper.findComponent(ConfirmationModalStub)
        modal.vm.$emit('close')
      })

      BddTest().then('it should not show the cancel subscribe activity confirm modal', () => {
        const modal = wrapper.findComponent(CancelSubscribeActivityConfirmModalStub)
        expect(modal.props('show')).toBe(false)
      })

      BddTest().then('it should emit the cancel event directly', () => {
        expect(wrapper.emitted('cancel')).toBeTruthy()
      })
    })

    BddTest().and('the user enters a start date and then cancels the action', () => {
      beforeEach(async () => {
        const periodInput = wrapper.findComponent(AvPeriodInputStub)
        await periodInput.vm.$emit('update:startModelValue', '2026-03-11')
        const modal = wrapper.findComponent(ConfirmationModalStub)
        modal.vm.$emit('close')
      })

      BddTest().then('it should show the cancel subscribe activity confirm modal', () => {
        const modal = wrapper.findComponent(CancelSubscribeActivityConfirmModalStub)
        expect(modal.props('show')).toBe(true)
      })

      BddTest().and('the user cancels the cancellation', () => {
        beforeEach(() => {
          const modal = wrapper.findComponent(CancelSubscribeActivityConfirmModalStub)
          modal.vm.$emit('cancel')
        })

        BddTest().then('it should hide the cancel subscribe activity confirm modal', () => {
          const modal = wrapper.findComponent(CancelSubscribeActivityConfirmModalStub)
          expect(modal.props('show')).toBe(false)
        })
      })

      BddTest().and('the user confirms the cancellation', () => {
        beforeEach(() => {
          const modal = wrapper.findComponent(CancelSubscribeActivityConfirmModalStub)
          modal.vm.$emit('confirm')
        })

        BddTest().then('it should emit the cancel event', async () => {
          await vi.waitFor(() => {
            expect(wrapper.emitted('cancel')).toBeTruthy()
          })
        })
      })
    })

    BddTest().and('the user confirms the subscription', () => {
      beforeEach(() => {
        const modal = wrapper.findComponent(ConfirmationModalStub)
        modal.vm.$emit('confirm')
      })

      BddTest().then('it should not add an error message', () => {
        expect(mockAddErrorMessage).not.toHaveBeenCalled()
      })

      BddTest().then('it should add a success message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).toHaveBeenCalledWith('Vous êtes inscrit.e avec succès. Retrouvez cette activité dans votre bibliothèque d\'activités.')
        })
      })

      BddTest().then('it should emit the subscribed event', async () => {
        await vi.waitFor(() => {
          expect(wrapper.emitted('subscribed')).toBeTruthy()
        })
      })
    })
  })

  BddTest().when('the component is mounted with an invalid activity', () => {
    const props: SubscribeActivityModalProps = {
      show: true,
      activity: { id: 'INVALID_ACTIVITY_ID', title: 'Activity Title', }
    }
    beforeEach(() => {
      wrapper = mountComponent(SubscribeActivityModal, { props, global: { stubs } })
    })

    BddTest().and('the user confirms the subscription', () => {
      beforeEach(() => {
        const modal = wrapper.findComponent(ConfirmationModalStub)
        modal.vm.$emit('confirm')
      })

      BddTest().then('it should add an error message', async () => {
        await vi.waitFor(() => {
          expect(mockAddErrorMessage).toHaveBeenCalledWith({
            title: 'Une erreur est survenue lors de l\'inscription à l\'activité. Veuillez réessayer plus tard.',
            description: expect.any(String)
          })
        })
      })

      BddTest().then('it should not add a success message', async () => {
        expect(mockAddSuccessMessage).not.toHaveBeenCalled()
      })

      BddTest().then('it should not emit the subscribed event', async () => {
        expect(wrapper.emitted('subscribed')).toBeFalsy()
      })
    })
  })
})
