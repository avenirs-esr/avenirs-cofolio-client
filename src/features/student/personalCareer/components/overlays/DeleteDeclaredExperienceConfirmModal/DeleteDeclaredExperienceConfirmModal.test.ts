import type { VueWrapper } from '@vue/test-utils'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import DeleteDeclaredExperienceConfirmModal, { type DeleteDeclaredExperienceConfirmModalProps } from '@/features/student/personalCareer/components/overlays/DeleteDeclaredExperienceConfirmModal/DeleteDeclaredExperienceConfirmModal.vue'
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

BddTest().given('a DeleteDeclaredExperienceConfirmModal component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteDeclaredExperienceConfirmModal>>
  const stubs = { ConfirmationModal: ConfirmationModalStub }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted without declared experience ids', async () => {
    const props: DeleteDeclaredExperienceConfirmModalProps = {
      show: true,
      declaredExperienceIds: [],
    }

    beforeEach(() => {
      wrapper = mountComponent(DeleteDeclaredExperienceConfirmModal, { props, global: { stubs } })
    })

    BddTest().then('it should render the confirmation modal with correct title and message', () => {
      const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
      expect(confirmationModal.exists()).toBe(true)
      expect(confirmationModal.props('title')).toBe('Êtes-vous certain(e) de vouloir supprimer ces expériences ?')
      expect(confirmationModal.props('description')).toBe('Cette action entrainera la suppression des éventuelles associations.')
    })

    BddTest().and('the user cancels the deletion', async () => {
      beforeEach(() => {
        const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
        confirmationModal.vm.$emit('close')
      })

      BddTest().then('it should emit the close event', () => {
        expect(wrapper.emitted('close')).toBeTruthy()
      })
    })

    BddTest().and('the user confirms the deletion', async () => {
      beforeEach(() => {
        const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
        confirmationModal.vm.$emit('confirm')
      })

      BddTest().then('it should not add a success message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).not.toHaveBeenCalled()
        })
      })

      BddTest().then('it should add an error message', async () => {
        await vi.waitFor(() => {
          expect(mockAddErrorMessage).toHaveBeenCalledWith({
            title: 'Une erreur est survenue lors de la suppression des expériences.',
            description: expect.any(String)
          })
        })
      })
    })
  })

  BddTest().when('the component is mounted with one valid declared experience id', () => {
    const props: DeleteDeclaredExperienceConfirmModalProps = {
      show: true,
      declaredExperienceIds: ['valid-experience-id'],
    }

    beforeEach(() => {
      wrapper = mountComponent(DeleteDeclaredExperienceConfirmModal, { props, global: { stubs } })
    })

    BddTest().then('it should render the confirmation modal with correct title and message', () => {
      const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
      expect(confirmationModal.exists()).toBe(true)
      expect(confirmationModal.props('title')).toBe('Êtes-vous certain(e) de vouloir supprimer cette expérience ?')
      expect(confirmationModal.props('description')).toBe('Cette action entrainera la suppression des éventuelles associations.')
    })

    BddTest().and('the user confirms the deletion', async () => {
      beforeEach(() => {
        const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
        confirmationModal.vm.$emit('confirm')
      })

      BddTest().then('it should add a success message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).toHaveBeenCalledWith('Expérience supprimée avec succès.')
        })
      })

      BddTest().then('it should emit the deleted event', async () => {
        await vi.waitFor(() => {
          expect(wrapper.emitted('confirm')).toBeTruthy()
        })
      })
    })
  })

  BddTest().when('the component is mounted with an invalid declared experience id', () => {
    const props: DeleteDeclaredExperienceConfirmModalProps = {
      show: true,
      declaredExperienceIds: ['INVALID_PROGRAM_ID'],
    }

    beforeEach(() => {
      wrapper = mountComponent(DeleteDeclaredExperienceConfirmModal, { props, global: { stubs } })
    })

    BddTest().then('it should render the confirmation modal with correct title and message', () => {
      const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
      expect(confirmationModal.exists()).toBe(true)
      expect(confirmationModal.props('title')).toBe('Êtes-vous certain(e) de vouloir supprimer cette expérience ?')
      expect(confirmationModal.props('description')).toBe('Cette action entrainera la suppression des éventuelles associations.')
    })

    BddTest().and('the user confirms the deletion', async () => {
      beforeEach(() => {
        const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
        confirmationModal.vm.$emit('confirm')
      })

      BddTest().then('it should add an error message', async () => {
        await vi.waitFor(() => {
          expect(mockAddErrorMessage).toHaveBeenCalledWith({
            title: 'Une erreur est survenue lors de la suppression de l\'expérience.',
            description: expect.any(String)
          })
        })
      })

      BddTest().then('it should not add a success message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).not.toHaveBeenCalled()
        })
      })

      BddTest().then('it should not emit the deleted event', () => {
        expect(wrapper.emitted('confirm')).toBeFalsy()
      })
    })
  })

  BddTest().when('the component is mounted with multiple valid declared experience ids', () => {
    const props: DeleteDeclaredExperienceConfirmModalProps = {
      show: true,
      declaredExperienceIds: ['valid-experience-id-1', 'valid-experience-id-2'],
    }

    beforeEach(() => {
      wrapper = mountComponent(DeleteDeclaredExperienceConfirmModal, { props, global: { stubs } })
    })

    BddTest().then('it should render the confirmation modal with correct title and message', () => {
      const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
      expect(confirmationModal.exists()).toBe(true)
      expect(confirmationModal.props('title')).toBe('Êtes-vous certain(e) de vouloir supprimer ces expériences ?')
      expect(confirmationModal.props('description')).toBe('Cette action entrainera la suppression des éventuelles associations.')
    })

    BddTest().and('the user confirms the deletion', async () => {
      beforeEach(() => {
        const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
        confirmationModal.vm.$emit('confirm')
      })

      BddTest().then('it should add a success message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).toHaveBeenCalledWith('Expériences supprimées avec succès.')
        })
      })

      BddTest().then('it should not add an error message', async () => {
        await vi.waitFor(() => {
          expect(mockAddErrorMessage).not.toHaveBeenCalled()
        })
      })

      BddTest().then('it should emit the deleted event', async () => {
        await vi.waitFor(() => {
          expect(wrapper.emitted('confirm')).toBeTruthy()
        })
      })
    })
  })

  BddTest().when('the component is mounted with multiple declared experience ids including an invalid one', () => {
    const props: DeleteDeclaredExperienceConfirmModalProps = {
      show: true,
      declaredExperienceIds: ['valid-experience-id', 'INVALID_PROGRAM_ID'],
    }

    beforeEach(() => {
      wrapper = mountComponent(DeleteDeclaredExperienceConfirmModal, { props, global: { stubs } })
    })

    BddTest().then('it should render the confirmation modal with correct title and message', () => {
      const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
      expect(confirmationModal.exists()).toBe(true)
      expect(confirmationModal.props('title')).toBe('Êtes-vous certain(e) de vouloir supprimer ces expériences ?')
      expect(confirmationModal.props('description')).toBe('Cette action entrainera la suppression des éventuelles associations.')
    })

    BddTest().and('the user confirms the deletion', async () => {
      beforeEach(() => {
        const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
        confirmationModal.vm.$emit('confirm')
      })

      BddTest().then('it should add an error message', async () => {
        await vi.waitFor(() => {
          expect(mockAddErrorMessage).toHaveBeenCalledWith({
            title: 'Une erreur est survenue lors de la suppression des expériences.',
            description: expect.any(String)
          })
        })
      })

      BddTest().then('it should not add a success message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).not.toHaveBeenCalled()
        })
      })

      BddTest().then('it should not emit the deleted event', () => {
        expect(wrapper.emitted('confirm')).toBeFalsy()
      })
    })
  })
})
