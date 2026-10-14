import type { AssociationLimitDTO, AssociationsDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { AssociationElementsDropdownVariant } from '@/features/student/associations/components/interactions/AssociationElementsDropdown/AssociationElementsDropdown.vue'
import { mockedDeclaredActivityDetails } from '@/__mocks__/fixtures/student/activities.fixtures'
import { createMockedAssociationLimits, createMockedAssociations, mockedDeclaredActivityAssociations, mockedEmptyAssociations } from '@/__mocks__/fixtures/student/associations.fixtures'
import { createGetAssociationLimitsHandler } from '@/__mocks__/msw/handlers/student/associations.handlers'
import { server } from '@/__mocks__/msw/server'
import { EAssociationContextType } from '@/api/avenir-esr'
import { QuerySuspenseStub } from '@/common/components/feedback/QuerySuspense/QuerySuspense.stub'
import { BaseApiErrorCode } from '@/common/exceptions'
import { AssociatedElementsCardStub } from '@/features/student/associations/components/cards/AssociatedElementsCard/AssociatedElementsCard.stub'
import ElementAssociations from '@/features/student/associations/components/composites/ElementAssociations/ElementAssociations.vue'
import { AssociationElementsDropdownStub } from '@/features/student/associations/components/interactions/AssociationElementsDropdown/AssociationElementsDropdown.stub'
import { AssociateModalStub } from '@/features/student/associations/components/overlays/modals/AssociateModal/AssociateModal.stub'
import { DeleteAssociationsModalStub } from '@/features/student/associations/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.stub'
import { ASSOCIATION_CONTEXT_CONFIGS } from '@/features/student/associations/constants/associations.constants'
import { getAssociableContextTypes, getContextTypeSlug } from '@/features/student/associations/utils/associations.utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { type ComponentMountingOptions, flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'

const ACTIONS_DISABLED_TOOLTIP = 'Actions indisponibles'
const CONTEXT_TYPES = Object.values(EAssociationContextType)
const DECLARED_ACTIVITY_EMPTY_ASSOCIATIONS = 'Aucune association pour cette activité.'
const DECLARED_ACTIVITY_FETCH_ERROR_TITLE = 'Une erreur est survenue lors de la récupération des éléments associés à l\'activité.'
const NOT_ALLOWED_TOOLTIP = 'Ce type d\'association n\'est pas autorisé.'
const TRACES_LIMIT_REACHED_TOOLTIP = 'Vous avez atteint le nombre maximal de traces pouvant être associées.'
const UNASSOCIATE_DISABLED_TOOLTIPS: Record<EAssociationContextType, string> = {
  [EAssociationContextType.TRACE]: 'Aucune trace associée ne peut être dissociée.',
  [EAssociationContextType.DECLARED_ACTIVITY]: 'Aucune activité associée ne peut être dissociée.',
  [EAssociationContextType.DECLARED_SKILL]: 'Aucune compétence associée ne peut être dissociée.',
  [EAssociationContextType.DECLARED_EXPERIENCE]: 'Aucune expérience associée ne peut être dissociée.',
  [EAssociationContextType.DECLARED_PROGRAM]: 'Aucune formation associée ne peut être dissociée.'
}

const INFINITE_LOADING_ID = 'INFINITE_LOADING_ID'

type MountingOptions = ComponentMountingOptions<typeof ElementAssociations>

const defaultProps: MountingOptions['props'] = {
  contextType: EAssociationContextType.DECLARED_ACTIVITY,
  elementId: mockedDeclaredActivityDetails.id,
  associations: mockedDeclaredActivityAssociations
}

const getTypesWithAssociations = (contextType: EAssociationContextType, associations: AssociationsDTO) => getAssociableContextTypes(contextType).filter(type => associations[ASSOCIATION_CONTEXT_CONFIGS[type].associationsKey].length > 0)

const [typeToAssociate, typeToDelete] = getTypesWithAssociations(defaultProps.contextType, defaultProps.associations!)

BddTest().given('an element associations component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ElementAssociations>>

  const limits = createMockedAssociationLimits(defaultProps.contextType)
  const limitReachedLimits = createMockedAssociationLimits(defaultProps.contextType, true)
  const notAllowedLimits = limits.map(limit => ({ ...limit, max: 0, remaining: 0 }))
  const traceLimit = limits.find(({ associatedContextType }) => associatedContextType === EAssociationContextType.TRACE)!

  const stubs = {
    QuerySuspense: QuerySuspenseStub,
    AssociationElementsDropdown: AssociationElementsDropdownStub,
    AssociatedElementsCard: AssociatedElementsCardStub,
    AssociateModal: AssociateModalStub,
    DeleteAssociationsModal: DeleteAssociationsModalStub
  }

  const limitsSlots = {
    header: `<template #header="{ getLimit }">
      <div data-testid="header-limit">{{ getLimit('${EAssociationContextType.TRACE}').isLoaded }}|{{ getLimit('${EAssociationContextType.TRACE}').max }}</div>
    </template>`
  }

  const mountWith = (
    props: Partial<typeof defaultProps> = {},
    slots: MountingOptions['slots'] = {}
  ) => {
    wrapper = mountComponent(ElementAssociations, {
      props: {
        ...defaultProps,
        ...props
      },
      slots,
      global: { stubs }
    })
  }

  const getAssociateModals = () => wrapper.findAllComponents(AssociateModalStub)
  const getCards = () => wrapper.findAllComponents(AssociatedElementsCardStub)
  const getDeleteModals = () => wrapper.findAllComponents(DeleteAssociationsModalStub)
  const getDropdowns = () => wrapper.findAllComponents(AssociationElementsDropdownStub)
  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)

  const getContainer = (slug: string) => wrapper.find(`[data-testid="${slug}-associations"]`)
  const getEmptyState = () => wrapper.find('[data-testid="query-suspense-empty"]')
  const getErrorState = () => wrapper.find('[data-testid="query-suspense-error"]')
  const getHeaderLimit = () => wrapper.find('[data-testid="header-limit"]')
  const getLoadingState = () => wrapper.find('[data-testid="query-suspense-loading"]')

  const getAssociableTypes = () => getAssociableContextTypes(wrapper.props('contextType'))
  const getAssociations = () => wrapper.props('associations') ?? mockedEmptyAssociations
  const getDropdown = (variant: AssociationElementsDropdownVariant) => getDropdowns().find(dropdown => dropdown.props('variant') === variant)!
  const getAssociateModal = (associatedContextType: EAssociationContextType) => getAssociateModals().find(modal => modal.props('associatedContextType') === associatedContextType)!
  const getDeleteModal = (associatedContextType: EAssociationContextType) => getDeleteModals().find(modal => modal.props('associatedContextType') === associatedContextType)!
  const getOpenedModals = () => [
    ...getAssociateModals()
      .filter(modal => modal.props('opened'))
      .map(modal => ({ modal: 'associate', ...modal.props() })),
    ...getDeleteModals()
      .filter(modal => modal.props('opened'))
      .map(modal => ({ modal: 'delete', ...modal.props() }))
  ]

  const expectAssociateItems = (disabledTooltips: Partial<Record<EAssociationContextType, string>> = {}) => {
    const items = getAssociableTypes().map((type) => {
      const disabledTooltip = disabledTooltips[type]
      return disabledTooltip ? { type, disabled: true, disabledTooltip } : { type, disabled: false }
    })

    expect(getDropdown('associate').props('items')).toEqual(items)
  }

  const expectDeleteItems = () => {
    const typesWithAssociations = getTypesWithAssociations(wrapper.props('contextType'), getAssociations())
    const items = getAssociableTypes().map((type) => {
      const disabled = !typesWithAssociations.includes(type)
      return { type, disabled, disabledTooltip: disabled ? UNASSOCIATE_DISABLED_TOOLTIPS[type] : undefined }
    })

    expect(getDropdown('delete').props('items')).toEqual(items)
  }

  const expectTestIds = () => {
    const slug = getContextTypeSlug(wrapper.props('contextType'))
    expect(getContainer(slug).exists()).toBe(true)
    expect(getDropdown('associate').attributes('data-testid')).toBe(`${slug}-associate-elements-dropdown`)
    expect(getDropdown('delete').attributes('data-testid')).toBe(`delete-${slug}-associated-elements-dropdown`)
  }

  const expectOpenedModal = (modal: AssociationElementsDropdownVariant, associatedContextType: EAssociationContextType) => {
    const { contextType, elementId } = wrapper.props()
    expect(getOpenedModals()).toEqual([expect.objectContaining({ modal, contextType, elementId, associatedContextType })])
  }

  const expectNoOpenedModal = () => {
    expect(getOpenedModals()).toEqual([])
  }

  const expectNoModal = () => {
    expect(getAssociateModals()).toHaveLength(0)
    expect(getDeleteModals()).toHaveLength(0)
  }

  const expectCards = (disabled = false) => {
    const cards = getCards()
    expect(cards.map(card => card.props('associatedContextType'))).toEqual(getAssociableTypes())
    cards.forEach((card) => {
      expect(card.props('associations')).toEqual(getAssociations())
      expect(card.props('disabled')).toBe(disabled)
    })
  }

  const expectCardLimits = (apiLimits: AssociationLimitDTO[] = []) => {
    const cards = getCards()
    expect(cards.map(card => card.props('limit'))).toEqual(cards.map(card => apiLimits.find(({ associatedContextType }) => associatedContextType === card.props('associatedContextType'))?.max))
  }

  const expectDropdownsDisabledTooltip = (disabledTooltip?: string) => {
    expect(getDropdown('associate').props('disabledTooltip')).toBe(disabledTooltip)
    expect(getDropdown('delete').props('disabledTooltip')).toBe(disabledTooltip)
  }

  const expectHeaderLimit = (isLoaded: boolean, max?: number) => {
    expect(getHeaderLimit().text()).toBe(`${isLoaded}|${max ?? ''}`)
  }

  const selectDropdownItem = async (variant: AssociationElementsDropdownVariant, associatedContextType: EAssociationContextType) => {
    getDropdown(variant).vm.$emit('select', associatedContextType)
    await nextTick()
  }

  const emitAssociateModalEvent = async (associatedContextType: EAssociationContextType, event: 'cancel' | 'associated') => {
    getAssociateModal(associatedContextType).vm.$emit(event)
    await nextTick()
  }

  const emitDeleteModalEvent = async (associatedContextType: EAssociationContextType, event: 'cancel' | 'deleted') => {
    getDeleteModal(associatedContextType).vm.$emit(event)
    await nextTick()
  }

  CONTEXT_TYPES.forEach((contextType) => {
    const associations = createMockedAssociations(contextType)

    BddTest().when(`the associations of an element of type ${contextType} are displayed`, () => {
      beforeEach(() => {
        mountWith({
          contextType,
          associations
        })
      })

      BddTest().then('it should render the component and its dropdowns with the test ids of the context type', () => {
        expectTestIds()
      })

      BddTest().then('it should enable both dropdowns', () => {
        expect(getDropdown('associate').props('disabled')).toBe(false)
        expect(getDropdown('delete').props('disabled')).toBe(false)
      })

      BddTest().then('it should propose to associate every associable context type', () => {
        expectAssociateItems()
      })

      BddTest().then('it should only enable the delete items of the context types having associations', () => {
        expectDeleteItems()
      })

      BddTest().then('it should render an enabled associated elements card per associable context type', () => {
        expectCards()
      })

      BddTest().then('it should not render any modal before an association action is chosen', () => {
        expectNoModal()
      })

      getAssociableContextTypes(contextType).forEach((associatedContextType) => {
        BddTest().and(`the user chooses to associate ${associatedContextType}`, () => {
          beforeEach(async () => {
            await selectDropdownItem('associate', associatedContextType)
          })

          BddTest().then('it should only open the associate modal of this context type', () => {
            expectOpenedModal('associate', associatedContextType)
          })
        })
      })

      getTypesWithAssociations(contextType, associations).forEach((associatedContextType) => {
        BddTest().and(`the user chooses to delete the ${associatedContextType} associations`, () => {
          beforeEach(async () => {
            await selectDropdownItem('delete', associatedContextType)
          })

          BddTest().then('it should only open the delete associations modal of this context type', () => {
            expectOpenedModal('delete', associatedContextType)
          })
        })
      })
    })
  })

  BddTest().when('the associations of a declared activity are displayed', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the query suspense with the texts of the context type', () => {
      const querySuspense = getQuerySuspense()
      expect(querySuspense.props('isLoading')).toBe(false)
      expect(querySuspense.props('isEmpty')).toBe(false)
      expect(querySuspense.props('error')).toBeNull()
      expect(querySuspense.props('errorTitle')).toBe(DECLARED_ACTIVITY_FETCH_ERROR_TITLE)
      expect(querySuspense.props('emptyStateMessage')).toBe(DECLARED_ACTIVITY_EMPTY_ASSOCIATIONS)
    })

    BddTest().and(`the user chooses to associate ${typeToAssociate}`, () => {
      beforeEach(async () => {
        await selectDropdownItem('associate', typeToAssociate)
      })

      BddTest().then('it should render a single associate modal and a single delete associations modal for the element', () => {
        expect(getAssociateModals()).toHaveLength(1)

        const deleteModals = getDeleteModals()
        expect(deleteModals).toHaveLength(1)
        expect(deleteModals[0].props()).toMatchObject(defaultProps)
      })

      BddTest().and('the user cancels the association', () => {
        beforeEach(async () => {
          await emitAssociateModalEvent(typeToAssociate, 'cancel')
        })

        BddTest().then('it should close the associate modal', () => {
          expectNoOpenedModal()
        })
      })

      BddTest().and('the elements get associated', () => {
        beforeEach(async () => {
          await emitAssociateModalEvent(typeToAssociate, 'associated')
        })

        BddTest().then('it should close the associate modal', () => {
          expectNoOpenedModal()
        })
      })

      BddTest().and(`the user cancels, then chooses to delete the ${typeToDelete} associations`, () => {
        beforeEach(async () => {
          await emitAssociateModalEvent(typeToAssociate, 'cancel')
          await selectDropdownItem('delete', typeToDelete)
        })

        BddTest().then('it should only open the delete associations modal of this context type', () => {
          expectOpenedModal('delete', typeToDelete)
        })

        BddTest().then('it should reuse the associate modal for the newly selected context type', () => {
          const associateModals = getAssociateModals()
          expect(associateModals).toHaveLength(1)
          expect(associateModals[0].props('associatedContextType')).toBe(typeToDelete)
        })
      })
    })

    BddTest().and(`the user chooses to delete the ${typeToDelete} associations`, () => {
      beforeEach(async () => {
        await selectDropdownItem('delete', typeToDelete)
      })

      BddTest().and('the user cancels the deletion', () => {
        beforeEach(async () => {
          await emitDeleteModalEvent(typeToDelete, 'cancel')
        })

        BddTest().then('it should close the delete associations modal', () => {
          expectNoOpenedModal()
        })
      })

      BddTest().and('the associations get deleted', () => {
        beforeEach(async () => {
          await emitDeleteModalEvent(typeToDelete, 'deleted')
        })

        BddTest().then('it should close the delete associations modal', () => {
          expectNoOpenedModal()
        })
      })
    })
  })

  BddTest().when('the declared activity can still receive traces', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should pass the limit of the traces to the traces card once the API answered', async () => {
      await vi.waitFor(() => expectCardLimits(limits))
    })

    BddTest().then('it should keep every associate item enabled', async () => {
      await vi.waitFor(() => expectCardLimits(limits))

      expectAssociateItems()
    })
  })

  BddTest().when('the limit of the traces of the declared activity is reached', () => {
    beforeEach(() => {
      mountWith({
        elementId: `${defaultProps.elementId}-WITH_LIMIT_REACHED`
      })
    })

    BddTest().then('it should disable the associate item of the traces only, with the reason', async () => {
      await vi.waitFor(() => expectAssociateItems({ [EAssociationContextType.TRACE]: TRACES_LIMIT_REACHED_TOOLTIP }))
    })

    BddTest().then('it should still let the student delete the associated traces', async () => {
      await vi.waitFor(() => expectAssociateItems({ [EAssociationContextType.TRACE]: TRACES_LIMIT_REACHED_TOOLTIP }))

      expect(getDropdown('delete').props('disabled')).toBe(false)
      expectDeleteItems()
    })

    BddTest().then('it should keep passing the limit to the traces card', async () => {
      await vi.waitFor(() => expectCardLimits(limitReachedLimits))
    })
  })

  BddTest().when('the traces are not allowed for the declared activity', () => {
    beforeEach(() => {
      server.use(createGetAssociationLimitsHandler(notAllowedLimits))
      mountWith()
    })

    BddTest().then('it should disable the associate item of the traces and explain that they are not allowed', async () => {
      await vi.waitFor(() => expectAssociateItems({ [EAssociationContextType.TRACE]: NOT_ALLOWED_TOOLTIP }))
    })

    BddTest().then('it should pass a limit of 0 to the traces card', async () => {
      await vi.waitFor(() => expectCardLimits(notAllowedLimits))
    })
  })

  BddTest().when('the limits of the declared activity are loading', () => {
    beforeEach(async () => {
      mountWith({
        elementId: INFINITE_LOADING_ID
      })
      await flushPromises()
    })

    BddTest().then('it should not limit anything while the API has not answered', () => {
      expectAssociateItems()
      expectCardLimits()
    })
  })

  BddTest().when('the header slot reads the limits of an element whose limits are loading', () => {
    beforeEach(async () => {
      mountWith({
        elementId: INFINITE_LOADING_ID
      }, limitsSlots)
      await flushPromises()
    })

    BddTest().then('it should not know the limit of the traces', () => {
      expectHeaderLimit(false)
    })
  })

  BddTest().when('the header slot reads the limits of an element whose limits are loaded', () => {
    beforeEach(() => {
      mountWith({}, limitsSlots)
    })

    BddTest().then('it should know the limit of the traces once the API answered', async () => {
      await vi.waitFor(() => expectHeaderLimit(true, traceLimit.max))
    })
  })

  BddTest().when('the component is readonly', () => {
    beforeEach(() => {
      mountWith({
        readonly: true
      }, limitsSlots)
    })

    BddTest().then('it should not render the association actions', () => {
      expect(getDropdowns()).toHaveLength(0)
    })

    BddTest().then('it should still render the header slot', () => {
      expect(getHeaderLimit().exists()).toBe(true)
    })

    BddTest().then('it should render disabled associated elements cards', () => {
      expectCards(true)
    })

    BddTest().then('it should not render any modal', () => {
      expectNoModal()
    })
  })

  BddTest().when('the association actions are disabled', () => {
    beforeEach(() => {
      mountWith({
        actionsDisabled: true
      })
    })

    BddTest().then('it should disable both dropdowns', () => {
      expect(getDropdown('associate').props('disabled')).toBe(true)
      expect(getDropdown('delete').props('disabled')).toBe(true)
    })

    BddTest().then('it should not pass any disabled tooltip to the dropdowns without explanation', () => {
      expectDropdownsDisabledTooltip()
    })
  })

  BddTest().when('the association actions are disabled with an explanation', () => {
    beforeEach(() => {
      mountWith({
        actionsDisabled: true,
        actionsDisabledTooltip: ACTIONS_DISABLED_TOOLTIP
      })
    })

    BddTest().then('it should pass the explanation as disabled tooltip to both dropdowns', () => {
      expectDropdownsDisabledTooltip(ACTIONS_DISABLED_TOOLTIP)
    })
  })

  BddTest().when('the association actions are enabled with an explanation for when they are disabled', () => {
    beforeEach(() => {
      mountWith({
        actionsDisabledTooltip: ACTIONS_DISABLED_TOOLTIP
      })
    })

    BddTest().then('it should not pass the explanation to the dropdowns', () => {
      expectDropdownsDisabledTooltip()
    })

    BddTest().then('it should keep the associated elements cards enabled', () => {
      expectCards()
    })
  })

  BddTest().when('the element has no association', () => {
    beforeEach(() => {
      mountWith({
        associations: mockedEmptyAssociations
      })
    })

    BddTest().then('it should display the empty state of the context type', () => {
      expect(getEmptyState().text()).toBe(DECLARED_ACTIVITY_EMPTY_ASSOCIATIONS)
      expect(getCards()).toHaveLength(0)
    })

    BddTest().then('it should disable the delete dropdown and its items', () => {
      expect(getDropdown('delete').props('disabled')).toBe(true)
      expectDeleteItems()
    })

    BddTest().then('it should keep the associate dropdown enabled', () => {
      expect(getDropdown('associate').props('disabled')).toBe(false)
    })
  })

  BddTest().when('the associations are loading', () => {
    beforeEach(() => {
      mountWith({
        associations: undefined,
        isLoading: true
      })
    })

    BddTest().then('it should display the loading state', () => {
      expect(getLoadingState().exists()).toBe(true)
    })

    BddTest().and(`the user chooses to delete the ${typeToDelete} associations`, () => {
      beforeEach(async () => {
        await selectDropdownItem('delete', typeToDelete)
      })

      BddTest().then('it should pass empty associations to the delete associations modal', () => {
        expect(getDeleteModal(typeToDelete).props('associations')).toEqual(mockedEmptyAssociations)
      })
    })
  })

  BddTest().when('the associations failed to load', () => {
    const error: BaseApiException = {
      name: 'mockError',
      message: 'error',
      status: 500,
      code: BaseApiErrorCode.SERVER
    }

    beforeEach(() => {
      mountWith({
        associations: undefined,
        error
      })
    })

    BddTest().then('it should display the error of the context type', () => {
      expect(getQuerySuspense().props('error')).toEqual(error)
      expect(getErrorState().text()).toContain(DECLARED_ACTIVITY_FETCH_ERROR_TITLE)
    })
  })
})
