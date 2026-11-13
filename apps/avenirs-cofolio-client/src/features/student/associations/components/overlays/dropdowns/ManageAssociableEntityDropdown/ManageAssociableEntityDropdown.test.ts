import type { AvInteractiveProps } from '@avenirs-esr/avenirs-dsav'
import type { VueWrapper } from '@vue/test-utils'
import type { ActionItem } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import type { ManageAssociableEntityDropdownProps } from '@/features/student/associations/components/overlays/dropdowns/ManageAssociableEntityDropdown/ManageAssociableEntityDropdown.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { nextTick } from 'vue'
import { EAssociationContextType } from '@/api/avenir-esr'
import { ManageEntityDropdownStub } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.stub'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageAssociableEntityDropdown from '@/features/student/associations/components/overlays/dropdowns/ManageAssociableEntityDropdown/ManageAssociableEntityDropdown.vue'
import { AssociateModalStub } from '@/features/student/associations/components/overlays/modals/AssociateModal/AssociateModal.stub'
import { DeleteAssociationsModalStub } from '@/features/student/associations/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.stub'

BddTest().given('a ManageAssociableEntityDropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof ManageAssociableEntityDropdown>>

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
    contextType: EAssociationContextType.DECLARED_ACTIVITY,
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
    wrapper = mount(ManageAssociableEntityDropdown, {
      props: { ...defaultProps, ...props },
      global: { stubs }
    })
  }

  const getDropdown = () => wrapper.findComponent(ManageEntityDropdownStub)
  const getAssociateModal = () => wrapper.findComponent(AssociateModalStub)
  const getDeleteAssociationsModal = () => wrapper.findComponent(DeleteAssociationsModalStub)

  const getDropdownActions = () => getDropdown().props('actions') as Array<Action | ActionItem>

  const getActionTypes = () => getDropdownActions().map(action =>
    typeof action === 'string' ? action : action.type
  )

  async function emitActionSelected (action: Action) {
    getDropdown().vm.$emit('actionSelected', action)
    await nextTick()
  }

  BddTest().when('the component is mounted without custom actions', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the ManageEntityDropdown', () => {
      expect(getDropdown().exists()).toBe(true)
    })

    BddTest().then('it should add the associate and dissociate actions', () => {
      expect(getDropdownActions()).toEqual([
        {
          type: Action.ASSOCIATE,
          ...associationInteractiveProps
        },
        {
          type: Action.DISSOCIATE,
          ...dissociationInteractiveProps
        }
      ])
    })

    BddTest().then('it should render both modals closed', () => {
      expect(getAssociateModal().props('opened')).toBe(false)
      expect(getDeleteAssociationsModal().props('opened')).toBe(false)
    })
  })

  BddTest().when('custom actions are provided', () => {
    const actions = [
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
      expect(getDropdownActions()).toEqual([
        ...actions,
        {
          type: Action.ASSOCIATE,
          ...associationInteractiveProps
        },
        {
          type: Action.DISSOCIATE,
          ...dissociationInteractiveProps
        }
      ])
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
      expect(getDropdownActions()[0]).toEqual({
        type: Action.ASSOCIATE,
        ...associationInteractiveProps
      })
    })

    BddTest().then('it should pass dissociation properties to the dissociate action', () => {
      expect(getDropdownActions()[1]).toEqual({
        type: Action.DISSOCIATE,
        ...dissociationInteractiveProps
      })
    })
  })

  BddTest().when('the component is mounted with association context properties', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should pass the context and element id to the associate modal', () => {
      expect(getAssociateModal().props('contextType')).toBe(defaultProps.contextType)
      expect(getAssociateModal().props('elementId')).toBe(defaultProps.elementId)
    })

    BddTest().then('it should pass the context and element id to the delete associations modal', () => {
      expect(getDeleteAssociationsModal().props('contextType')).toBe(defaultProps.contextType)
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
})
