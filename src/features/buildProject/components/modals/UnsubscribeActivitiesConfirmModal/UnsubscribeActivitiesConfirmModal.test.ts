import type { VueWrapper } from '@vue/test-utils'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import UnsubscribeActivitiesConfirmModal, { type UnsubscribeActivitiesConfirmModalProps } from '@/features/buildProject/components/modals/UnsubscribeActivitiesConfirmModal/UnsubscribeActivitiesConfirmModal.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockAddSuccessMessage = vi.fn()
const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage
    })
  }
})

BddTest().given('an unsubscribe activities confirmation modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof UnsubscribeActivitiesConfirmModal>>

  const stubs = {
    ConfirmationModal: ConfirmationModalStub
  }

  BddTest().when('the component is mounted with a valid activity id', () => {
    const props: UnsubscribeActivitiesConfirmModalProps = {
      show: true,
      activities: [{ id: 'activity-1', title: 'Activité 1' }]
    }

    beforeEach(() => {
      wrapper = mountComponent(UnsubscribeActivitiesConfirmModal, { props, global: { stubs } })
    })

    BddTest().then('it should render the confirmation modal with correct props', () => {
      const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
      expect(confirmationModal.exists()).toBe(true)
      expect(confirmationModal.props('show')).toBe(true)
      expect(confirmationModal.text()).toContain(`Êtes-vous certain(e) de vouloir vous désinscrire de cette activité ?`)
      expect(confirmationModal.text()).toContain(`Cette action entraînera la perte définitive de toutes les données et actions associées.`)
    })

    BddTest().and('the user cancels the unsubscribe action', () => {
      beforeEach(() => {
        const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
        confirmationModal.vm.$emit('close')
      })

      BddTest().then('it should emit the cancel event', () => {
        expect(wrapper.emitted('cancel')).toBeTruthy()
      })
    })

    BddTest().and('the user confirms the unsubscribe action', () => {
      beforeEach(() => {
        const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
        confirmationModal.vm.$emit('confirm')
      })

      BddTest().then('it should add a success message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).toHaveBeenCalledWith('Vous avez été désinscrit.e avec succès.')
        })
      })

      BddTest().then('it should emit the activity unsubscribed event', async () => {
        await vi.waitFor(() => {
          expect(wrapper.emitted('unsubscribed')).toBeTruthy()
        })
      })
    })
  })

  BddTest().when('the component is mounted with an invalid activity id', () => {
    const props: UnsubscribeActivitiesConfirmModalProps = {
      show: true,
      activities: [{ id: 'INVALID_ACTIVITY_ID', title: 'Activité 1' }]
    }

    beforeEach(() => {
      wrapper = mountComponent(UnsubscribeActivitiesConfirmModal, { props, global: { stubs } })
    })

    BddTest().and('the user confirms the unsubscribe action', () => {
      beforeEach(() => {
        const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
        confirmationModal.vm.$emit('confirm')
      })

      BddTest().then('it should add an error message', async () => {
        await vi.waitFor(() => {
          expect(mockAddErrorMessage).toHaveBeenCalledWith({
            title: `Une erreur est survenue lors de la désinscription de l'activité. Veuillez réessayer plus tard.`,
            description: expect.any(String)
          })
        })
      })

      BddTest().then('it should not emit the activity unsubscribed event', async () => {
        await vi.waitFor(() => {
          expect(wrapper.emitted('unsubscribed')).toBeFalsy()
        })
      })
    })
  })

  BddTest().when('the component is mounted with multiple activities ids', () => {
    const props: UnsubscribeActivitiesConfirmModalProps = {
      show: true,
      activities: [{ id: 'activity-1', title: 'Activité 1' }, { id: 'activity-2', title: 'Activité 2' }]
    }

    beforeEach(() => {
      wrapper = mountComponent(UnsubscribeActivitiesConfirmModal, { props, global: { stubs } })
    })

    BddTest().then('it should render the confirmation modal with correct props', () => {
      const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
      expect(confirmationModal.exists()).toBe(true)
      expect(confirmationModal.props('show')).toBe(true)
      expect(confirmationModal.text()).toContain(`Êtes-vous certain(e) de vouloir vous désinscrire de ces activités ?`)
      expect(confirmationModal.text()).toContain(`Cette action entraînera la perte définitive de toutes les données et actions associées.`)
    })

    BddTest().and('the user confirms the unsubscribe action', () => {
      beforeEach(() => {
        const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
        confirmationModal.vm.$emit('confirm')
      })

      BddTest().then('it should add a success message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).toHaveBeenCalledWith('Vous avez été désinscrit.e avec succès.')
        })
      })

      BddTest().then('it should emit the activity unsubscribed event', async () => {
        await vi.waitFor(() => {
          expect(wrapper.emitted('unsubscribed')).toBeTruthy()
        })
      })
    })
  })

  BddTest().when('the component is mounted with multiple activities ids including invalid ones', () => {
    const props: UnsubscribeActivitiesConfirmModalProps = {
      show: true,
      activities: [{ id: 'INVALID_ACTIVITY_ID', title: 'Activité 1' }, { id: 'activity-2', title: 'Activité 2' }]
    }

    beforeEach(() => {
      wrapper = mountComponent(UnsubscribeActivitiesConfirmModal, { props, global: { stubs } })
    })

    BddTest().and('the user confirms the unsubscribe action', () => {
      beforeEach(() => {
        const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
        confirmationModal.vm.$emit('confirm')
      })

      BddTest().then('it should add an error message', async () => {
        await vi.waitFor(() => {
          expect(mockAddErrorMessage).toHaveBeenCalledWith({
            title: `Une erreur est survenue lors de la désinscription des activités. Veuillez réessayer plus tard.`,
            description: expect.any(String)
          })
        })
      })

      BddTest().then('it should not emit the activity unsubscribed event', async () => {
        await vi.waitFor(() => {
          expect(wrapper.emitted('unsubscribed')).toBeFalsy()
        })
      })
    })
  })
})
