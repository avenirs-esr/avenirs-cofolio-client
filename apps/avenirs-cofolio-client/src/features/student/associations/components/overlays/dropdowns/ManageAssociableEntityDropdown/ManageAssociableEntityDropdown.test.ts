import type { AvInteractiveProps } from '@avenirs-esr/avenirs-dsav'
import type { VueWrapper } from '@vue/test-utils'
import type { ActionItem } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import type { ManageAssociableEntityDropdownProps } from '@/features/student/associations/components/overlays/dropdowns/ManageAssociableEntityDropdown/ManageAssociableEntityDropdown.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { afterEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { mockedDeclaredActivityAssociations, mockedEmptyAssociations } from '@/__mocks__/fixtures/student/associations.fixtures'
import {
  createGetAssociationLimitsHandler,
  createGetAssociationsHandler,
  getAssociationsErrorHandler,
  getAssociationsLoadingHandler
} from '@/__mocks__/msw/handlers/student/associations.handlers'
import { server } from '@/__mocks__/msw/server'
import { ManageEntityDropdownStub } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.stub'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageAssociableEntityDropdown from '@/features/student/associations/components/overlays/dropdowns/ManageAssociableEntityDropdown/ManageAssociableEntityDropdown.vue'
import { AssociateModalStub } from '@/features/student/associations/components/overlays/modals/AssociateModal/AssociateModal.stub'
import { DeleteAssociationsModalStub } from '@/features/student/associations/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.stub'
import { getAssociableContextTypes } from '@/features/student/associations/utils/associations.utils'

BddTest().given('a ManageAssociableEntityDropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof ManageAssociableEntityDropdown>>

  const contextType = EAssociationContextType.DECLARED_ACTIVITY

  const associationInteractiveProps: AvInteractiveProps = {
    disabled: true,
    disabledTooltip: 'Association indisponible'
  }

  const dissociationInteractiveProps: AvInteractiveProps = {
    disabled: false,
    disabledTooltip: 'Dissociation indisponible'
  }

  const defaultProps: ManageAssociableEntityDropdownProps = {
    entityName: 'Activity',
    contextType,
    elementId: 'declared-activity-1',
    actions: [],
    associationInteractiveProps,
    dissociationInteractiveProps
  }

  const stubs = {
    ManageEntityDropdown: ManageEntityDropdownStub,
    AssociateModal: AssociateModalStub,
    DeleteAssociationsModal: DeleteAssociationsModalStub
  }

  const mountWith = (props: Partial<ManageAssociableEntityDropdownProps> = {}) => {
    wrapper = mountComponent(ManageAssociableEntityDropdown, {
      props: { ...defaultProps, ...props },
      global: { stubs }
    })
  }

  afterEach(() => wrapper?.unmount())

  const getDropdown = () => wrapper.findComponent(ManageEntityDropdownStub)
  const getAssociateModal = () => wrapper.findComponent(AssociateModalStub)
  const getDeleteAssociationsModal = () => wrapper.findComponent(DeleteAssociationsModalStub)

  const getDropdownActions = () =>
    getDropdown().props('actions') as Array<Action | ActionItem>

  const getActionTypes = () =>
    getDropdownActions().map(action =>
      typeof action === 'string' ? action : action.type
    )

  const getAction = (type: Action) =>
    getDropdownActions().find(action =>
      typeof action !== 'string' && action.type === type
    ) as ActionItem

  async function emitActionSelected (action: Action) {
    getDropdown().vm.$emit('actionSelected', action)
    await nextTick()
  }

  const getAssociableTypes = () =>
    getAssociableContextTypes(contextType).filter(type => type !== contextType)

  const getReachedLimits = () =>
    getAssociableTypes().map(associatedContextType => ({
      associatedContextType,
      max: 1,
      remaining: 0
    }))

  const getFullAssociationsTooltip = () =>
    'Vous ne pouvez plus associer d\'éléments à cette activité'

  const getEmptyAssociationsTooltip = () =>
    'Vous n\'avez pas d\'éléments associés à cette activité'

  BddTest().when('the component is mounted without custom actions', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the ManageEntityDropdown', () => {
      expect(getDropdown().exists()).toBe(true)
    })

    BddTest().then('it should add the associate and dissociate actions', () => {
      expect(getActionTypes()).toEqual([
        Action.ASSOCIATE,
        Action.DISSOCIATE
      ])
    })

    BddTest().then('it should render both modals closed', () => {
      expect(getAssociateModal().props('opened')).toBe(false)
      expect(getDeleteAssociationsModal().props('opened')).toBe(false)
    })

    BddTest().then('it should pass the entity name to the dropdown', () => {
      expect(getDropdown().props('entityName')).toBe(defaultProps.entityName)
    })
  })

  BddTest().when('custom actions are provided', () => {
    const actions: Array<Action | ActionItem> = [
      Action.UPDATE,
      {
        type: Action.DELETE,
        disabled: true,
        disabledTooltip: 'Suppression indisponible'
      }
    ]

    beforeEach(() => {
      mountWith({ actions })
    })

    BddTest().then('it should preserve the custom actions', () => {
      expect(getDropdownActions().slice(0, actions.length)).toEqual(actions)
    })

    BddTest().then('it should append association actions after custom actions', () => {
      expect(getActionTypes()).toEqual([
        Action.UPDATE,
        Action.DELETE,
        Action.ASSOCIATE,
        Action.DISSOCIATE
      ])
    })

    BddTest().then('it should preserve custom action interactive properties', () => {
      expect(getDropdownActions()[1]).toMatchObject({
        type: Action.DELETE,
        disabled: true,
        disabledTooltip: 'Suppression indisponible'
      })
    })
  })

  BddTest().when('association and dissociation interactive properties are provided', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should pass association properties to the associate action', () => {
      expect(getAction(Action.ASSOCIATE)).toMatchObject(associationInteractiveProps)
    })

    BddTest().then('it should pass dissociation properties to the dissociate action', () => {
      expect(getAction(Action.DISSOCIATE)).toMatchObject(dissociationInteractiveProps)
    })

    BddTest().then('it should preserve the caller disabled state', () => {
      expect(getAction(Action.ASSOCIATE).disabled).toBe(true)
      expect(getAction(Action.DISSOCIATE).disabled).toBe(false)
    })
  })

  BddTest().when('the component is mounted with association context properties', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should pass the context and element id to the associate modal', () => {
      expect(getAssociateModal().props('contextType')).toBe(contextType)
      expect(getAssociateModal().props('elementId')).toBe(defaultProps.elementId)
    })

    BddTest().then('it should pass the context and element id to the delete associations modal', () => {
      expect(getDeleteAssociationsModal().props('contextType')).toBe(contextType)
      expect(getDeleteAssociationsModal().props('elementId')).toBe(defaultProps.elementId)
    })
  })

  BddTest().when('the associate action is selected', () => {
    beforeEach(async () => {
      mountWith()
      await emitActionSelected(Action.ASSOCIATE)
    })

    BddTest().then('it should open the associate modal', () => {
      expect(getAssociateModal().props('opened')).toBe(true)
    })

    BddTest().then('it should keep the delete associations modal closed', () => {
      expect(getDeleteAssociationsModal().props('opened')).toBe(false)
    })

    BddTest().and('the user cancels the association', () => {
      beforeEach(async () => {
        getAssociateModal().vm.$emit('cancel')
        await nextTick()
      })

      BddTest().then('it should close the associate modal', () => {
        expect(getAssociateModal().props('opened')).toBe(false)
      })
    })

    BddTest().and('the association is completed', () => {
      beforeEach(async () => {
        getAssociateModal().vm.$emit('associated')
        await nextTick()
      })

      BddTest().then('it should close the associate modal', () => {
        expect(getAssociateModal().props('opened')).toBe(false)
      })
    })
  })

  BddTest().when('the dissociate action is selected', () => {
    beforeEach(async () => {
      mountWith()
      await emitActionSelected(Action.DISSOCIATE)
    })

    BddTest().then('it should open the delete associations modal', () => {
      expect(getDeleteAssociationsModal().props('opened')).toBe(true)
    })

    BddTest().then('it should keep the associate modal closed', () => {
      expect(getAssociateModal().props('opened')).toBe(false)
    })

    BddTest().and('the user cancels the dissociation', () => {
      beforeEach(async () => {
        getDeleteAssociationsModal().vm.$emit('cancel')
        await nextTick()
      })

      BddTest().then('it should close the delete associations modal', () => {
        expect(getDeleteAssociationsModal().props('opened')).toBe(false)
      })
    })

    BddTest().and('the associations are deleted', () => {
      beforeEach(async () => {
        getDeleteAssociationsModal().vm.$emit('deleted')
        await nextTick()
      })

      BddTest().then('it should close the delete associations modal', () => {
        expect(getDeleteAssociationsModal().props('opened')).toBe(false)
      })
    })
  })

  BddTest().when('a standard action is selected', () => {
    beforeEach(async () => {
      mountWith({ actions: [Action.UPDATE] })
      await emitActionSelected(Action.UPDATE)
    })

    BddTest().then('it should emit the corresponding action', () => {
      expect(wrapper.emitted(Action.UPDATE)).toEqual([[]])
    })

    BddTest().then('it should keep both modals closed', () => {
      expect(getAssociateModal().props('opened')).toBe(false)
      expect(getDeleteAssociationsModal().props('opened')).toBe(false)
    })
  })

  BddTest().when('all associable context types have reached their limits', () => {
    beforeEach(async () => {
      server.use(
        createGetAssociationLimitsHandler(getReachedLimits()),
        createGetAssociationsHandler(mockedEmptyAssociations)
      )

      mountWith({
        associationInteractiveProps: { disabled: false },
        dissociationInteractiveProps: { disabled: false }
      })

      await vi.waitFor(() => {
        expect(getAction(Action.ASSOCIATE).disabled).toBe(true)
      })
    })

    BddTest().then('it should disable the associate action', () => {
      expect(getAction(Action.ASSOCIATE)).toMatchObject({
        disabled: true,
        disabledTooltip: getFullAssociationsTooltip()
      })
    })

    BddTest().then('it should disable the dissociate action when there are no associations', () => {
      expect(getAction(Action.DISSOCIATE)).toMatchObject({
        disabled: true,
        disabledTooltip: getEmptyAssociationsTooltip()
      })
    })
  })

  BddTest().when('at least one associable context type has not reached its limit', () => {
    beforeEach(async () => {
      server.use(
        createGetAssociationLimitsHandler(
          getReachedLimits().slice(1)
        ),
        createGetAssociationsHandler(mockedDeclaredActivityAssociations)
      )

      mountWith({
        associationInteractiveProps: { disabled: false },
        dissociationInteractiveProps: { disabled: false }
      })

      await vi.waitFor(() => {
        expect(getAction(Action.DISSOCIATE).disabled).toBe(false)
      })
    })

    BddTest().then('it should keep the associate action enabled', () => {
      expect(getAction(Action.ASSOCIATE).disabled).toBe(false)
    })

    BddTest().then('it should enable the dissociate action when associations exist', () => {
      expect(getAction(Action.DISSOCIATE).disabled).toBe(false)
    })
  })

  BddTest().when('caller disabled properties are provided', () => {
    beforeEach(async () => {
      server.use(
        createGetAssociationLimitsHandler(getReachedLimits()),
        createGetAssociationsHandler(mockedEmptyAssociations)
      )

      mountWith({
        associationInteractiveProps: {
          disabled: true,
          disabledTooltip: 'Association interdite'
        },
        dissociationInteractiveProps: {
          disabled: true,
          disabledTooltip: 'Dissociation interdite'
        }
      })

      await vi.waitFor(() => {
        expect(getAction(Action.ASSOCIATE).disabled).toBe(true)
      })
    })

    BddTest().then('it should preserve the caller association disabled reason', () => {
      expect(getAction(Action.ASSOCIATE).disabledTooltip).toBe('Association interdite')
    })

    BddTest().then('it should preserve the caller dissociation disabled reason', () => {
      expect(getAction(Action.DISSOCIATE).disabledTooltip).toBe('Dissociation interdite')
    })
  })

  BddTest().when('association data is still loading', () => {
    beforeEach(async () => {
      server.use(getAssociationsLoadingHandler)

      mountWith({
        elementId: 'INFINITE_LOADING_ID',
        associationInteractiveProps: { disabled: false },
        dissociationInteractiveProps: { disabled: false }
      })

      await nextTick()
    })

    BddTest().then('it should not disable the associate action based on unavailable limits', () => {
      expect(getAction(Action.ASSOCIATE).disabled).toBe(false)
    })

    BddTest().then('it should not consider the absence of association data as an empty result', () => {
      expect(getAction(Action.DISSOCIATE).disabled).toBe(false)
    })
  })

  BddTest().when('association requests fail', () => {
    beforeEach(async () => {
      server.use(getAssociationsErrorHandler)

      mountWith({
        elementId: 'INTERNAL_ERROR_ID',
        associationInteractiveProps: { disabled: false },
        dissociationInteractiveProps: { disabled: false }
      })

      await vi.waitFor(() => {
        expect(getAction(Action.DISSOCIATE).disabled).toBe(false)
      })
    })

    BddTest().then('it should not consider the absence of association data as an empty result', () => {
      expect(getAction(Action.DISSOCIATE).disabled).toBe(false)
    })

    BddTest().then('it should keep the associate action enabled when no limit has been reached', () => {
      expect(getAction(Action.ASSOCIATE).disabled).toBe(false)
    })
  })

  BddTest().when('the element id changes', () => {
    beforeEach(async () => {
      server.use(
        createGetAssociationLimitsHandler(getReachedLimits()),
        createGetAssociationsHandler(mockedEmptyAssociations)
      )

      mountWith({
        associationInteractiveProps: { disabled: false },
        dissociationInteractiveProps: { disabled: false }
      })

      await vi.waitFor(() => {
        expect(getAction(Action.ASSOCIATE).disabled).toBe(true)
        expect(getAction(Action.DISSOCIATE).disabled).toBe(true)
      })
    })

    BddTest().and('the new element has available association limits and existing associations', () => {
      beforeEach(async () => {
        server.use(
          createGetAssociationLimitsHandler([]),
          createGetAssociationsHandler(mockedDeclaredActivityAssociations)
        )

        await wrapper.setProps({ elementId: 'declared-activity-2' })

        await vi.waitFor(() => {
          expect(getAction(Action.ASSOCIATE).disabled).toBe(false)
          expect(getAction(Action.DISSOCIATE).disabled).toBe(false)
        })
      })

      BddTest().then('it should update the associate action availability', () => {
        expect(getAction(Action.ASSOCIATE).disabled).toBe(false)
      })

      BddTest().then('it should update the dissociate action availability', () => {
        expect(getAction(Action.DISSOCIATE).disabled).toBe(false)
      })

      BddTest().then('it should pass the new element id to both modals', () => {
        expect(getAssociateModal().props('elementId')).toBe('declared-activity-2')
        expect(getDeleteAssociationsModal().props('elementId')).toBe('declared-activity-2')
      })
    })
  })

  BddTest().when('the component receives a different context type', () => {
    const contextTypes = [
      {
        contextType: EAssociationContextType.DECLARED_EXPERIENCE,
        expectedTooltip: 'Vous ne pouvez plus associer d\'éléments à cette expérience'
      },
      {
        contextType: EAssociationContextType.DECLARED_PROGRAM,
        expectedTooltip: 'Vous ne pouvez plus associer d\'éléments à cette formation'
      },
      {
        contextType: EAssociationContextType.DECLARED_SKILL,
        expectedTooltip: 'Vous ne pouvez plus associer d\'éléments à cette compétence'
      },
      {
        contextType: EAssociationContextType.TRACE,
        expectedTooltip: 'Vous ne pouvez plus associer d\'éléments à cette trace'
      }
    ]

    contextTypes.forEach(({ contextType: otherContextType, expectedTooltip }) => {
      BddTest().and(`the context is ${otherContextType}`, () => {
        beforeEach(async () => {
          const associableTypes = getAssociableContextTypes(otherContextType)
            .filter(type => type !== otherContextType)

          server.use(
            createGetAssociationLimitsHandler(
              associableTypes.map(associatedContextType => ({
                associatedContextType,
                max: 1,
                remaining: 0
              }))
            )
          )

          mountWith({
            contextType: otherContextType,
            associationInteractiveProps: { disabled: false }
          })

          await vi.waitFor(() => {
            expect(getAction(Action.ASSOCIATE).disabled).toBe(true)
          })
        })

        BddTest().then('it should translate the entity name in the disabled tooltip', () => {
          expect(getAction(Action.ASSOCIATE).disabledTooltip).toBe(expectedTooltip)
        })
      })
    })
  })
})
