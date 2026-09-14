import type { VueWrapper } from '@vue/test-utils'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import DeleteMyActivityConfirmModal, { type DeleteMyActivityConfirmModalProps } from '@/features/student/activities/views/ActivityView/components/modals/DeleteMyActivityConfirmModal/DeleteMyActivityConfirmModal.vue'
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

  const defaultProps: DeleteMyActivityConfirmModalProps = {
    opened: true,
    declaredActivityId: 'declared-activity-1',
    activityId: 'catalog-activity-1',
    activityTitle: 'Activité 1'
  }

  const mountWith = (props: Partial<DeleteMyActivityConfirmModalProps> = {}) => {
    wrapper = mountComponent(DeleteMyActivityConfirmModal, {
      props: {
        ...defaultProps,
        ...props
      },
      global: { stubs }
    })
  }

  const getConfirmationModal = () => wrapper.findComponent(ConfirmationModalStub)

  BddTest().when('the component is mounted with a deletable declared activity', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the confirmation modal with correct props', () => {
      const confirmationModal = getConfirmationModal()
      expect(confirmationModal.exists()).toBe(true)
      expect(confirmationModal.props('opened')).toBe(true)
      expect(confirmationModal.props('title')).toBe(defaultProps.activityTitle)
      expect(confirmationModal.props('description')).toBe(`Êtes-vous certain(e) de vouloir supprimer définitivement votre activité : ${defaultProps.activityTitle} ? Attention, le contenu de votre activité ne pourra pas être récupéré.`)
    })

    BddTest().and('the user cancels the deletion', () => {
      BddTest().then('it should emit the cancel event', () => {
        getConfirmationModal().vm.$emit('close')
        expect(wrapper.emitted('cancel')).toBeTruthy()
      })
    })

    BddTest().and('the user confirms the deletion', () => {
      BddTest().then('it should add a success message and emit the deleted event', async () => {
        getConfirmationModal().vm.$emit('confirm')
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).toHaveBeenCalledWith('Le contenu de votre activité a bien été supprimé')
          expect(wrapper.emitted('deleted')).toBeTruthy()
        })
      })
    })
  })

  BddTest().when('the component is mounted with an invalid declared activity id', () => {
    beforeEach(() => {
      mountWith({ declaredActivityId: 'INVALID_DECLARED_ACTIVITY_ID' })
    })

    BddTest().and('the user confirms the deletion', () => {
      BddTest().then('it should add an error message and not emit the deleted event', async () => {
        getConfirmationModal().vm.$emit('confirm')
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
    beforeEach(() => {
      mountWith({ declaredActivityId: 'NOT_UNSUBSCRIBED_DECLARED_ACTIVITY_ID' })
    })

    BddTest().and('the user confirms the deletion', () => {
      BddTest().then('it should add an error message and not emit the deleted event', async () => {
        getConfirmationModal().vm.$emit('confirm')
        await vi.waitFor(() => {
          expect(mockAddErrorMessage).toHaveBeenCalledWith({
            title: 'Une erreur est survenue. Veuillez réessayer ultérieurement.',
            description: 'Vous êtes toujours inscrit(e) à l\'activité'
          })
          expect(wrapper.emitted('deleted')).toBeFalsy()
        })
      })
    })
  })
})
