import type { VueWrapper } from '@vue/test-utils/dist/src'
import type { ManageAssociableEntityDropdownProps } from '@/common/components/interaction/dropdowns/ManageAssociableEntityDropdown/ManageAssociableEntityDropdown.vue'
import type { ActionItem } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { EAssociationContextType } from '@/api/avenir-esr'
import ManageAssociableEntityDropdown from '@/common/components/interaction/dropdowns/ManageAssociableEntityDropdown/ManageAssociableEntityDropdown.vue'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { AssociateModalStub } from '@/features/student/associations/components/overlays/modals/AssociateModal/AssociateModal.stub'
import { DeleteAssociationsModalStub } from '@/features/student/associations/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.stub'
import { useAssociationLimits } from '@/features/student/associations/composables/use-association-limit/use-association-limit'

vi.mock('@/features/student/associations/composables/use-association-limit/use-association-limit', () => ({
  useAssociationLimits: vi.fn()
}))

interface DisabledState { disabled: boolean, disabledTooltip?: string }
type AssociableProps = ManageAssociableEntityDropdownProps

BddTest().given('a manage associable entity dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof ManageAssociableEntityDropdown>>

  const stubs = {
    AssociateModal: AssociateModalStub,
    DeleteAssociationsModal: DeleteAssociationsModalStub
  }

  const getAssociateModal = () => wrapper.findComponent(AssociateModalStub)
  const getDissociateModal = () => wrapper.findComponent(DeleteAssociationsModalStub)

  const mockAssociate = (getAssociateState: (type: EAssociationContextType) => DisabledState) => {
    vi.mocked(useAssociationLimits).mockReturnValue({
      getAssociateState
    } as unknown as ReturnType<typeof useAssociationLimits>)
  }
  const allEnabled = () => mockAssociate(() => ({ disabled: false }))
  const allDisabled = (tooltip = 'limit reached') =>
    mockAssociate(() => ({ disabled: true, disabledTooltip: tooltip }))

  let slotProps: {
    associateAction: ActionItem
    dissociateAction: ActionItem
    handleAction: (a: Action) => void
  }

  const mountWith = (props: Partial<AssociableProps> = {}) => {
    wrapper = mount(ManageAssociableEntityDropdown, {
      props: {
        contextType: EAssociationContextType.DECLARED_ACTIVITY,
        elementId: 'declared-activity-1',
        entityName: 'mon activité',
        hasAssociations: true,
        ...props
      },
      slots: {
        default: (scope) => {
          slotProps = scope
          return h('div')
        }
      },
      global: { stubs }
    })
  }

  const assocDisabled = () => slotProps.associateAction.disabled
  const assocTooltip = () => slotProps.associateAction.disabledTooltip
  const dissocDisabled = () => slotProps.dissociateAction.disabled
  const dissocTooltip = () => slotProps.dissociateAction.disabledTooltip

  beforeEach(() => {
    vi.clearAllMocks()
    allEnabled()
  })

  BddTest().when('at least one associable type has room', () => {
    beforeEach(() => {
      allEnabled()
      mountWith()
    })

    BddTest().then('it should expose associate enabled without tooltip', () => {
      expect(assocDisabled()).toBe(false)
      expect(assocTooltip()).toBeUndefined()
    })
  })

  BddTest().when('every associable type is full', () => {
    beforeEach(() => {
      allDisabled()
      mountWith()
    })

    BddTest().then('it should expose associate disabled with a tooltip', () => {
      expect(assocDisabled()).toBe(true)
      expect(assocTooltip()).toBeTruthy()
    })
  })

  BddTest().when('an associate override disables the action', () => {
    beforeEach(() => {
      allEnabled()
      mountWith({ associateOverride: { disabled: true, disabledTooltip: 'activité terminée' } })
    })

    BddTest().then('it should let the override win over the limit state', () => {
      expect(assocDisabled()).toBe(true)
      expect(assocTooltip()).toBe('activité terminée')
    })
  })

  BddTest().when('an associate override does not disable the action', () => {
    beforeEach(() => {
      allEnabled()
      mountWith({ associateOverride: { disabled: false } })
    })

    BddTest().then('it should fall back to the enabled limit state', () => {
      expect(assocDisabled()).toBe(false)
    })
  })

  BddTest().when('the entity has no association', () => {
    beforeEach(() => {
      mountWith({ hasAssociations: false })
    })

    BddTest().then('it should expose dissociate disabled with a tooltip', () => {
      expect(dissocDisabled()).toBe(true)
      expect(dissocTooltip()).toBeTruthy()
    })
  })

  BddTest().when('the entity has associations', () => {
    beforeEach(() => {
      mountWith({ hasAssociations: true })
    })

    BddTest().then('it should expose dissociate enabled', () => {
      expect(dissocDisabled()).toBe(false)
    })
  })

  BddTest().when('the dropdown is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should not render any modal initially', () => {
      expect(getAssociateModal().exists()).toBe(false)
      expect(getDissociateModal().exists()).toBe(false)
    })

    BddTest().when('the associate action is handled', () => {
      BddTest().then('it should open the associate modal', async () => {
        slotProps.handleAction(Action.ASSOCIATE)
        await nextTick()
        expect(getAssociateModal().exists()).toBe(true)
        expect(getDissociateModal().exists()).toBe(false)
      })

      BddTest().then('it should pass context type and element id to the associate modal', async () => {
        slotProps.handleAction(Action.ASSOCIATE)
        await nextTick()
        expect(getAssociateModal().props('contextType')).toBe(EAssociationContextType.DECLARED_ACTIVITY)
        expect(getAssociateModal().props('elementId')).toBe('declared-activity-1')
      })
    })

    BddTest().when('the dissociate action is handled', () => {
      BddTest().then('it should open the dissociate modal', async () => {
        slotProps.handleAction(Action.DISSOCIATE)
        await nextTick()
        expect(getDissociateModal().exists()).toBe(true)
        expect(getAssociateModal().exists()).toBe(false)
      })
    })
  })
})
