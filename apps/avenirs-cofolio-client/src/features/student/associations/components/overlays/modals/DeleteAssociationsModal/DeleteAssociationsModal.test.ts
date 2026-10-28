import type { AvSelectOption } from '@avenirs-esr/avenirs-dsav'
import type { VueWrapper, } from '@vue/test-utils'
import type { PathParams, } from 'msw'
import type { MockInstance } from 'vitest'
import type { AssociationsDeleteRequest, AssociationsDTO } from '@/api/avenir-esr'
import type { DeleteAssociationsModalProps } from '@/features/student/associations/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvModalStub, AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { QueryClient } from '@tanstack/vue-query'
import { flushPromises } from '@vue/test-utils'
import { http, HttpResponse } from 'msw'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import {
  createMockedDeclaredSkillAssociations,
  mockedDeclaredActivityAssociations,
  mockedEmptyAssociations
} from '@/__mocks__/fixtures/student/associations.fixtures'
import { createGetAssociationsHandler, unassociateErrorHandler } from '@/__mocks__/msw/handlers/student/associations.handlers'
import { server } from '@/__mocks__/msw/server'
import { anyAssociationContextType } from '@/__mocks__/msw/utils'
import { EAssociationContextType, getUnassociateUrl } from '@/api/avenir-esr'
import { AssociationsSelectorStub } from '@/features/student/associations/components/interactions/AssociationsSelector/AssociationsSelector.stub'
import {
  DeleteAssociationsConfirmModalStub
} from '@/features/student/associations/components/overlays/modals/DeleteAssociationsConfirmModal/DeleteAssociationsConfirmModal.stub'
import DeleteAssociationsModal from '@/features/student/associations/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.vue'

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

/**
 * Answers the unassociation requests like the default handler, while notifying them to check their payload.
 */
function createUnassociateHandler (onRequest: (params: PathParams, request: AssociationsDeleteRequest) => void) {
  return http.delete(`*${getUnassociateUrl(anyAssociationContextType, ':elementId')}`, async ({ params, request }) => {
    onRequest(params, await request.json() as AssociationsDeleteRequest)
    return new HttpResponse(null, { status: 204 })
  })
}

BddTest().given('a delete associations modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteAssociationsModal>>
  let invalidateQueriesSpy: MockInstance

  const stubs = {
    AvModal: AvModalStub,
    AssociationsSelector: AssociationsSelectorStub,
    DeleteAssociationsConfirmModal: DeleteAssociationsConfirmModalStub,
    AvSelect: AvSelectStub
  }

  const traceProps: DeleteAssociationsModalProps = {
    opened: true,
    contextType: EAssociationContextType.DECLARED_ACTIVITY,
    elementId: 'declared-activity-1',
  }
  const getSelect = () => wrapper.findComponent(AvSelectStub)
  const getModal = () => wrapper.findComponent(AvModalStub)
  const getHeader = () => wrapper.find('[data-testid="delete-associations-modal-header"]')
  const getSelector = () => wrapper.findComponent(AssociationsSelectorStub)
  const getConfirmModal = () => wrapper.findComponent(DeleteAssociationsConfirmModalStub)

  async function selectType (type: EAssociationContextType) {
    const option: AvSelectOption = { value: type, label: '', disabled: false }
    getSelect().vm.$emit('update:modelValue', option)
    await nextTick()
  }

  async function mountModal (props: DeleteAssociationsModalProps) {
    wrapper = mountComponent(DeleteAssociationsModal, { props, global: { stubs } })
    await flushPromises()
  }

  async function mountModalWithType (
    props: DeleteAssociationsModalProps,
    type: EAssociationContextType
  ) {
    await mountModal(props)
    await selectType(type)
  }

  async function selectAssociations (associationIds: string[]) {
    getSelector().vm.$emit('update:modelValue', associationIds)
    await nextTick()
  }

  async function confirmDeletion () {
    getModal().vm.$emit('confirm')
    await nextTick()
    getConfirmModal().vm.$emit('confirm')
    await nextTick()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    invalidateQueriesSpy = vi.spyOn(QueryClient.prototype, 'invalidateQueries')
  })

  afterEach(() => {
    invalidateQueriesSpy.mockRestore()
  })

  BddTest().when('the modal is opened to delete trace associations', () => {
    beforeEach(async () => {
      server.use(createGetAssociationsHandler(mockedDeclaredActivityAssociations))
      await mountModalWithType({
        ...traceProps
      }, EAssociationContextType.TRACE)
    })

    BddTest().then('it should render the opened modal with its test id', () => {
      expect(getModal().props('opened')).toBe(true)
      expect(wrapper.find('[data-testid="delete-associations-modal"]').exists()).toBe(true)
    })

    BddTest().then('it should display a pluralized title according to the associations count', () => {
      expect(getHeader().text()).toBe('Quelles associations souhaitez-vous supprimer\u00A0?')
    })

    BddTest().then('it should render the modal buttons', () => {
      expect(getModal().props('closeButtonLabel')).toBe('Annuler')
      expect(getModal().props('confirmButtonIcon')).toBe(MDI_ICONS.TRASH_CAN_OUTLINE)
      expect(getModal().props('isLoading')).toBe(false)
    })

    BddTest().then('it should disable the confirm button while nothing is selected', () => {
      expect(getModal().props('confirmButtonDisabled')).toBe(true)
      expect(getModal().props('confirmButtonLabel')).toBe('Supprimer les associations sélectionnées (0)')
    })

    BddTest().then('it should explain why the confirm button is disabled', () => {
      expect(getModal().props('confirmButtonDisabledTooltip')).toBe('Sélectionnez au moins une association à supprimer')
    })

    BddTest().then('it should render the associations selector for the associated context type', () => {
      expect(getSelector().props('associatedContextType')).toBe(EAssociationContextType.TRACE)
      expect(getSelector().props('associations')).toEqual(mockedDeclaredActivityAssociations)
      expect(getSelector().props('modelValue')).toEqual([])
    })

    BddTest().then('it should render the confirm modal closed', () => {
      expect(getConfirmModal().props('opened')).toBe(false)
      expect(getConfirmModal().props('associations')).toEqual([])
    })

    BddTest().and('the user closes the modal', () => {
      beforeEach(async () => {
        getModal().vm.$emit('close')
        await flushPromises()
        await nextTick()
      })

      BddTest().then('it should emit cancel', () => {
        expect(wrapper.emitted('cancel')).toHaveLength(1)
      })
    })

    BddTest().and('the user selects one association', () => {
      beforeEach(async () => {
        await selectAssociations(['association-2'])
        await nextTick()
      })

      BddTest().then('it should display a singular confirm button label', () => {
        expect(getModal().props('confirmButtonDisabled')).toBe(false)
        expect(getModal().props('confirmButtonLabel')).toBe('Supprimer l\'association sélectionnée (1)')
      })

      BddTest().and('the user confirms the deletion', () => {
        beforeEach(async () => {
          await confirmDeletion()
          await vi.waitFor(() => expect(wrapper.emitted('deleted')).toBeDefined())
        })

        BddTest().then('it should display a singular success message', () => {
          expect(mockAddSuccessMessage).toHaveBeenCalledWith({
            timeout: 2000,
            description: 'L\'association sélectionnée a été supprimée avec succès'
          })
        })
      })
    })

    BddTest().and('the user selects two associations', () => {
      const expectedSelectedAssociations = [
        { id: 'association-1', title: 'Trace #1 associée à l\'activité' },
        { id: 'association-3', title: 'Trace #3 associée à l\'activité' }
      ]

      beforeEach(async () => {
        await selectAssociations(['association-1', 'association-3'])
        await nextTick()
      })

      BddTest().then('it should update the associations selector selection', () => {
        expect(getSelector().props('modelValue')).toEqual(['association-1', 'association-3'])
      })

      BddTest().then('it should enable the confirm button with a pluralized label', () => {
        expect(getModal().props('confirmButtonDisabled')).toBe(false)
        expect(getModal().props('confirmButtonLabel')).toBe('Supprimer les associations sélectionnées (2)')
      })

      BddTest().then('it should pass the selected associations to the confirm modal', () => {
        expect(getConfirmModal().props('associations')).toEqual(expectedSelectedAssociations)
      })

      BddTest().and('the user closes the modal', () => {
        beforeEach(async () => {
          getModal().vm.$emit('close')
          await nextTick()
          await flushPromises()
        })

        BddTest().then('it should reset the selection', () => {
          expect(getSelector().props('modelValue')).toEqual([])
        })

        BddTest().then('it should emit cancel', () => {
          expect(wrapper.emitted('cancel')).toHaveLength(1)
        })
      })

      BddTest().and('the user confirms the selection', () => {
        beforeEach(async () => {
          getModal().vm.$emit('confirm')
          await nextTick()
          await flushPromises()
        })

        BddTest().then('it should open the confirm modal', () => {
          expect(getConfirmModal().props('opened')).toBe(true)
        })

        BddTest().and('the user cancels the deletion', () => {
          beforeEach(async () => {
            getConfirmModal().vm.$emit('cancel')
            await nextTick()
          })

          BddTest().then('it should close the confirm modal', () => {
            expect(getConfirmModal().props('opened')).toBe(false)
          })

          BddTest().then('it should keep the selection without emitting deleted', () => {
            expect(getSelector().props('modelValue')).toEqual(['association-1', 'association-3'])
            expect(wrapper.emitted('deleted')).toBeUndefined()
          })
        })

        BddTest().and('the modal is closed by its parent', () => {
          beforeEach(async () => {
            await wrapper.setProps({ opened: false })
          })

          BddTest().then('it should close the confirm modal', () => {
            expect(getConfirmModal().props('opened')).toBe(false)
          })

          BddTest().then('it should reset the selection', () => {
            expect(getSelector().props('modelValue')).toEqual([])
            expect(getConfirmModal().props('associations')).toEqual([])
          })
        })
      })

      BddTest().and('the user confirms the deletion', () => {
        const onUnassociateRequest = vi.fn()

        beforeEach(async () => {
          server.use(createUnassociateHandler(onUnassociateRequest))
          await confirmDeletion()
          await vi.waitFor(() => expect(wrapper.emitted('deleted')).toBeDefined())
          await flushPromises()
        })

        BddTest().then('it should close the confirm modal', () => {
          expect(getConfirmModal().props('opened')).toBe(false)
        })

        BddTest().then('it should unassociate the selected associations from the element', () => {
          expect(onUnassociateRequest).toHaveBeenCalledTimes(1)
          expect(onUnassociateRequest).toHaveBeenCalledWith(
            expect.objectContaining({
              contextType: EAssociationContextType.DECLARED_ACTIVITY,
              elementId: 'declared-activity-1'
            }),
            { idsToDelete: ['association-1', 'association-3'] }
          )
        })

        BddTest().then('it should invalidate the queries impacted by the deletion', () => {
          expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['me', 'associations'] })
          expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['me', 'activity-progress'] })
          expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['me', 'traces'] })
        })

        BddTest().then('it should display a pluralized success message', () => {
          expect(mockAddSuccessMessage).toHaveBeenCalledWith({
            timeout: 2000,
            description: 'Les associations sélectionnées ont été supprimées avec succès'
          })
          expect(mockAddErrorMessage).not.toHaveBeenCalled()
        })

        BddTest().then('it should reset the selection', () => {
          expect(getSelector().props('modelValue')).toEqual([])
        })

        BddTest().then('it should emit deleted once', () => {
          expect(wrapper.emitted('deleted')).toHaveLength(1)
          expect(wrapper.emitted('cancel')).toBeUndefined()
        })
      })

      BddTest().and('the deletion fails', () => {
        beforeEach(async () => {
          server.use(unassociateErrorHandler)
          await confirmDeletion()
          await vi.waitFor(() => expect(mockAddErrorMessage).toHaveBeenCalled())
          await flushPromises()
        })

        BddTest().then('it should display an error message', () => {
          expect(mockAddErrorMessage).toHaveBeenCalledWith({
            title: 'Une erreur est survenue. Veuillez réessayer ultérieurement.',
            description: expect.any(String)
          })
        })

        BddTest().then('it should neither display a success message nor emit deleted', () => {
          expect(mockAddSuccessMessage).not.toHaveBeenCalled()
          expect(wrapper.emitted('deleted')).toBeUndefined()
        })

        BddTest().then('it should keep the selection to let the user retry', () => {
          expect(getConfirmModal().props('opened')).toBe(false)
          expect(getSelector().props('modelValue')).toEqual(['association-1', 'association-3'])
        })
      })
    })
  })

  BddTest().when('the modal is opened to delete the only declared skill association', () => {
    const associations: AssociationsDTO = {
      ...mockedEmptyAssociations,
      skillProgressAssociations: createMockedDeclaredSkillAssociations(1)
    }

    beforeEach(async () => {
      server.use(createGetAssociationsHandler(associations))
      await mountModalWithType({
        opened: true,
        contextType: EAssociationContextType.TRACE,
        elementId: 'trace-1',

      }, EAssociationContextType.DECLARED_SKILL)
      expect(getSelector().props('associatedContextType'))
        .toBe(EAssociationContextType.DECLARED_SKILL)
    })

    BddTest().then('it should display a singular title', () => {
      expect(getHeader().text()).toBe('Quelle association souhaitez-vous supprimer\u00A0?')
    })

    BddTest().then('it should render the associations selector for declared skills', () => {
      expect(getSelector().props('associatedContextType')).toBe(EAssociationContextType.DECLARED_SKILL)
      expect(getSelector().props('associations')).toEqual(associations)
    })

    BddTest().and('the user selects and deletes the declared skill association', () => {
      const onUnassociateRequest = vi.fn()

      beforeEach(async () => {
        server.use(createUnassociateHandler(onUnassociateRequest))
        await selectAssociations(['association-id-0'])
        await nextTick()
        await confirmDeletion()
        await vi.waitFor(() => expect(wrapper.emitted('deleted')).toBeDefined())
      })

      BddTest().then('it should unassociate the declared skill association from the element', () => {
        expect(onUnassociateRequest).toHaveBeenCalledWith(
          expect.objectContaining({ contextType: EAssociationContextType.TRACE, elementId: 'trace-1' }),
          { idsToDelete: ['association-id-0'] }
        )
      })

      BddTest().then('it should invalidate the declared skill queries', () => {
        expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['me', 'skill-progress'] })
      })
    })

    BddTest().and('the user selects the declared skill association', () => {
      beforeEach(async () => {
        await selectAssociations(['association-id-0'])
      })

      BddTest().then('it should pass the selected declared skill association to the confirm modal', () => {
        expect(getSelector().props('modelValue'))
          .toEqual(['association-id-0'])
        expect(getConfirmModal().props('associations')).toEqual([
          { id: 'association-id-0', title: 'Declared skill 1' }
        ])
      })
    })
  })

  BddTest().when('the modal is opened without any association of the associated context type', () => {
    beforeEach(async () => {
      server.use(createGetAssociationsHandler(mockedEmptyAssociations))
      await mountModalWithType({
        ...traceProps
      }, EAssociationContextType.TRACE)
    })

    BddTest().then('it should display the empty title', () => {
      expect(getHeader().text()).toBe('Aucune association à supprimer')
    })

    BddTest().then('it should disable the confirm button', () => {
      expect(getModal().props('confirmButtonDisabled')).toBe(true)
    })
  })
})
