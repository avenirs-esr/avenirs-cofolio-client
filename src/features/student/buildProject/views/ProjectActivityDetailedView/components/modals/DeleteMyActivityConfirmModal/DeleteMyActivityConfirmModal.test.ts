import type { VueWrapper } from '@vue/test-utils'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import DeleteMyActivityConfirmModal, { type DeleteMyActivityConfirmModalProps } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/modals/DeleteMyActivityConfirmModal/DeleteMyActivityConfirmModal.vue'
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

BddTest().given('a delete my activity confirmation modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteMyActivityConfirmModal>>

  const stubs = {
    ConfirmationModal: ConfirmationModalStub
  }

  BddTest().when('the component is mounted with a deletable declared activity', () => {
    const props: DeleteMyActivityConfirmModalProps = {
      opened: true,
      declaredActivityId: 'declared-activity-1',
      activityId: 'catalog-activity-1',
      activityTitle: 'Activité 1'
    }

    beforeEach(() => {
      wrapper = mountComponent(DeleteMyActivityConfirmModal, { props, global: { stubs } })
    })

    BddTest().then('it should render the confirmation modal with correct props', () => {
      const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
      expect(confirmationModal.exists()).toBe(true)
      expect(confirmationModal.props('opened')).toBe(true)
      expect(confirmationModal.props('title')).toBe('')
      expect(confirmationModal.props('description')).toBe(`Êtes-vous certain(e) de vouloir supprimer définitivement votre activité : ${props.activityTitle} ? Attention, le contenu de votre activité ne pourra pas être récupéré.`)
    })

    BddTest().and('the user cancels the deletion', () => {
      BddTest().then('it should emit the cancel event', () => {
        wrapper.findComponent(ConfirmationModalStub).vm.$emit('close')
        expect(wrapper.emitted('cancel')).toBeTruthy()
      })
    })

    BddTest().and('the user confirms the deletion', () => {
      BddTest().then('it should add a success message and emit the deleted event', async () => {
        wrapper.findComponent(ConfirmationModalStub).vm.$emit('confirm')
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).toHaveBeenCalledWith('Le contenu de votre activité a bien été supprimé')
          expect(wrapper.emitted('deleted')).toBeTruthy()
        })
      })
    })
  })

  BddTest().when('the component is mounted with an invalid declared activity id', () => {
    const props: DeleteMyActivityConfirmModalProps = {
      opened: true,
      declaredActivityId: 'INVALID_DECLARED_ACTIVITY_ID',
      activityId: 'catalog-activity-1',
      activityTitle: 'Activité 1'
    }

    beforeEach(() => {
      wrapper = mountComponent(DeleteMyActivityConfirmModal, { props, global: { stubs } })
    })

    BddTest().and('the user confirms the deletion', () => {
      BddTest().then('it should add an error message and not emit the deleted event', async () => {
        wrapper.findComponent(ConfirmationModalStub).vm.$emit('confirm')
        await vi.waitFor(() => {
          expect(mockAddErrorMessage).toHaveBeenCalledWith({
            title: 'Une erreur est survenue. Veuillez réessayer ultérieurement.',
            description: 'Activité introuvable'
          })
          expect(wrapper.emitted('deleted')).toBeFalsy()
        })
      })
    })
  })

  BddTest().when('the component is mounted with a declared activity not yet unsubscribed', () => {
    const props: DeleteMyActivityConfirmModalProps = {
      opened: true,
      declaredActivityId: 'NOT_UNSUBSCRIBED_DECLARED_ACTIVITY_ID',
      activityId: 'catalog-activity-1',
      activityTitle: 'Activité 1'
    }

    beforeEach(() => {
      wrapper = mountComponent(DeleteMyActivityConfirmModal, { props, global: { stubs } })
    })

    BddTest().and('the user confirms the deletion', () => {
      BddTest().then('it should add an error message and not emit the deleted event', async () => {
        wrapper.findComponent(ConfirmationModalStub).vm.$emit('confirm')
        await vi.waitFor(() => {
          expect(mockAddErrorMessage).toHaveBeenCalledWith({
            title: 'Une erreur est survenue. Veuillez réessayer ultérieurement.',
            description: 'L\'activité déclarée est toujours souscrite'
          })
          expect(wrapper.emitted('deleted')).toBeFalsy()
        })
      })
    })
  })
})
