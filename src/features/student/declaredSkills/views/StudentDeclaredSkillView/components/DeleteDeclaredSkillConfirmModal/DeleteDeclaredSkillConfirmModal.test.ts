import type { VueWrapper } from '@vue/test-utils'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import DeleteDeclaredSkillConfirmModal, { type DeleteDeclaredSkillConfirmModalProps } from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/DeleteDeclaredSkillConfirmModal/DeleteDeclaredSkillConfirmModal.vue'
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

BddTest().given('a delete declared skill confirmation modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteDeclaredSkillConfirmModal>>

  const stubs = {
    ConfirmationModal: ConfirmationModalStub
  }

  BddTest().when('the component is mounted with valid skill id', () => {
    const props: DeleteDeclaredSkillConfirmModalProps = { show: true, skillTitle: 'Compétence Exemple', skillId: 'skill-id' }

    beforeEach(() => {
      wrapper = mountComponent(DeleteDeclaredSkillConfirmModal, { props, global: { stubs } })
    })

    BddTest().then('it should render the confirmation modal with correct props', () => {
      const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
      expect(confirmationModal.exists()).toBe(true)
      expect(confirmationModal.props('show')).toBe(true)
      expect(confirmationModal.props('title')).toBe(`Confirmez-vous la suppression de la compétence ${props.skillTitle} ?`)
      expect(confirmationModal.props('description')).toBe(`Cette action est définitive. Elle entraine la suppression des informations concernant la compétence ainsi que la suppression des liens d'association qu'elle comportait.`)
    })

    BddTest().and('the user cancels the deletion', () => {
      beforeEach(() => {
        const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
        confirmationModal.vm.$emit('close')
      })

      BddTest().then('it should emit the close event', () => {
        expect(wrapper.emitted('close')).toBeTruthy()
      })
    })

    BddTest().and('the user confirms the deletion', () => {
      beforeEach(() => {
        const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
        confirmationModal.vm.$emit('confirm')
      })

      BddTest().then('it should add a success message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).toHaveBeenCalledWith(`Compétence ${props.skillTitle} supprimée avec succès`)
        })
      })

      BddTest().then('it should emit the skill deleted event', async () => {
        await vi.waitFor(() => {
          expect(wrapper.emitted('skillDeleted')).toBeTruthy()
        })
      })
    })
  })

  BddTest().when('the component is mounted with an invalid skill id', () => {
    const props: DeleteDeclaredSkillConfirmModalProps = { show: true, skillTitle: 'Compétence Exemple', skillId: 'INVALID_SKILL_ID' }

    beforeEach(() => {
      wrapper = mountComponent(DeleteDeclaredSkillConfirmModal, { props, global: { stubs } })
    })

    BddTest().and('the user confirms the deletion', () => {
      beforeEach(() => {
        const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
        confirmationModal.vm.$emit('confirm')
      })

      BddTest().then('it should add an error message', async () => {
        await vi.waitFor(() => {
          expect(mockAddErrorMessage).toHaveBeenCalledWith({
            title: `Une erreur est survenue lors de la suppression de la compétence ${props.skillTitle}`,
            description: expect.any(String)
          })
        })
      })

      BddTest().then('it should not emit the close event', async () => {
        await vi.waitFor(() => {
          expect(wrapper.emitted('close')).toBeFalsy()
        })
      })
    })
  })
})
