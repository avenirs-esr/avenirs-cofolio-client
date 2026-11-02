import type { VueWrapper } from '@vue/test-utils'
import type { MoreActionsDropdownProps } from '@/features/staff/activities/views/ActivitiesView/components/MoreActionsDropdown/MoreActionsDropdown.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { beforeEach, expect, vi } from 'vitest'
import { EActivityStatus, ERole } from '@/api/avenir-esr'
import { ManageEntityDropdownStub } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.stub'
import MoreActionsDropdown from '@/features/staff/activities/views/ActivitiesView/components/MoreActionsDropdown/MoreActionsDropdown.vue'

const DELETE_DISABLED_TOOLTIP = 'Vous pouvez uniquement supprimer une activité en brouillon'
const ENTITY_NAME = 'mon activité'
const FEEDBACKS_DISABLED_TOOLTIP = 'Les demandes de feedback sont uniquement disponibles pour une activité publiée'
const LEADER_ONLY_TOOLTIP = 'Vous devez être responsable de l\'activité pour accéder à cette action'
const UNPUBLISH_DISABLED_TOOLTIP = 'Vous pouvez uniquement dépublier une activité publiée'

const defaultProps: MoreActionsDropdownProps = {
  activityStatus: EActivityStatus.DRAFT,
  isLeader: true
}

const STAFF_ROLES = [ERole.ROLE_STAFF]
const STAFF_ADMIN_ROLES = [ERole.ROLE_STAFF, ERole.ROLE_SUPER_ADMIN]

const mockRoles = ref<ERole[]>([])

vi.mock('@/features/auth/global/composables/use-current-user/use-current-user', () => ({
  useCurrentUser: () => ({
    roles: mockRoles
  })
}))

BddTest().given('a MoreActionsDropdown component', () => {
  let wrapper: VueWrapper<InstanceType<typeof MoreActionsDropdown>>

  const stubs = {
    ManageEntityDropdown: ManageEntityDropdownStub
  }

  const mountWith = (
    props: Partial<MoreActionsDropdownProps> = {},
    roles: ERole[] = STAFF_ROLES
  ) => {
    vi.clearAllMocks()
    mockRoles.value = roles

    wrapper = mountComponent(MoreActionsDropdown, {
      props: {
        ...defaultProps,
        ...props
      },
      global: { stubs }
    })
  }

  const getDropdown = () => wrapper.findComponent(ManageEntityDropdownStub)
  const getDeleteButton = () => getDropdown().find('[data-testid="delete"]')

  const getEntityName = () => getDropdown().props('entityName')
  const getActions = () => getDropdown().props('actions')

  BddTest().when('mounted with DRAFT status', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the dropdown', () => {
      expect(getDropdown().exists()).toBe(true)
    })

    BddTest().then('it should set the correct entity name', () => {
      expect(getEntityName()).toBe(ENTITY_NAME)
    })

    BddTest().then('the delete action should not be disabled and the navigate to feedback, unpublish and clone actions should be disabled', () => {
      expect(getActions()).toEqual([
        expect.objectContaining({
          type: 'navigateToFeedbacks',
          disabled: true,
          disabledTooltip: FEEDBACKS_DISABLED_TOOLTIP
        }),
        expect.objectContaining({
          type: 'unpublish',
          disabled: true,
          disabledTooltip: UNPUBLISH_DISABLED_TOOLTIP
        }),
        expect.objectContaining({
          type: 'delete',
          disabled: false
        }),
        expect.stringContaining('clone')
      ])
    })

    BddTest().and('the delete action is selected', () => {
      beforeEach(async () => {
        await getDeleteButton().trigger('click')
      })

      BddTest().then('it should emit delete', () => {
        expect(wrapper.emitted('delete')).toHaveLength(1)
      })
    })

    BddTest().and('an unknown action is selected', () => {
      beforeEach(async () => {
        await getDropdown().vm.$emit('actionSelected', 'unknown')
      })

      BddTest().then('it should not emit delete', () => {
        expect(wrapper.emitted('delete')).toBeUndefined()
      })
    })
  })

  BddTest().when('mounted with PUBLISHED status', () => {
    beforeEach(() => {
      mountWith({
        activityStatus: EActivityStatus.PUBLISHED
      })
    })

    BddTest().then('the delete action should be disabled and the navigate to feedback, unpublish and clone actions should not be disabled', () => {
      expect(getActions()).toEqual([
        expect.objectContaining({
          type: 'navigateToFeedbacks',
          disabled: false
        }),
        expect.objectContaining({
          type: 'unpublish',
          disabled: false
        }),
        expect.objectContaining({
          type: 'delete',
          disabled: true,
          disabledTooltip: DELETE_DISABLED_TOOLTIP
        }),
        expect.stringContaining('clone')
      ])
    })

    BddTest().and('the navigate to feedback action is selected', () => {
      beforeEach(async () => {
        await getDropdown().vm.$emit('actionSelected', 'navigateToFeedbacks')
      })

      BddTest().then('it should emit navigateToFeedbacks', () => {
        expect(wrapper.emitted('navigateToFeedbacks')).toHaveLength(1)
      })
    })

    BddTest().and('the unpublish action is selected', () => {
      beforeEach(async () => {
        await getDropdown().vm.$emit('actionSelected', 'unpublish')
      })

      BddTest().then('it should emit unpublish', () => {
        expect(wrapper.emitted('unpublish')).toHaveLength(1)
      })
    })

    BddTest().and('the clone action is selected', () => {
      beforeEach(async () => {
        await getDropdown().vm.$emit('actionSelected', 'clone')
      })

      BddTest().then('it should emit clone', () => {
        expect(wrapper.emitted('clone')).toHaveLength(1)
      })
    })
  })

  BddTest().when('mounted with PUBLISHED status while the user is a super admin', () => {
    beforeEach(() => {
      mountWith({
        activityStatus: EActivityStatus.PUBLISHED
      }, STAFF_ADMIN_ROLES)
    })

    BddTest().then('the delete action should not be disabled', () => {
      expect(getActions()).toEqual([
        expect.objectContaining({ type: 'navigateToFeedbacks', disabled: false }),
        expect.objectContaining({ type: 'unpublish', disabled: false }),
        expect.objectContaining({ type: 'delete', disabled: false }),
        expect.stringContaining('clone')
      ])
    })

    BddTest().and('the delete action is selected', () => {
      beforeEach(async () => {
        await getDeleteButton().trigger('click')
      })

      BddTest().then('it should emit delete', () => {
        expect(wrapper.emitted('delete')).toHaveLength(1)
      })
    })
  })

  BddTest().when('mounted with UNPUBLISHED status while the user is a super admin', () => {
    beforeEach(() => {
      mountWith({
        activityStatus: EActivityStatus.UNPUBLISHED
      }, STAFF_ADMIN_ROLES)
    })

    BddTest().then('the delete action should not be disabled', () => {
      expect(getActions()).toEqual([
        expect.objectContaining({ type: 'navigateToFeedbacks', disabled: true }),
        expect.objectContaining({ type: 'unpublish', disabled: true }),
        expect.objectContaining({ type: 'delete', disabled: false }),
        expect.stringContaining('clone')
      ])
    })
  })

  BddTest().when('the user is not a leader of the activity', () => {
    beforeEach(() => {
      mountWith({
        activityStatus: EActivityStatus.UNPUBLISHED,
        isLeader: false
      })
    })

    BddTest().then('the actions should be disabled', () => {
      expect(getActions()).toEqual([
        expect.objectContaining({
          type: 'navigateToFeedbacks',
          disabled: true,
          disabledTooltip: LEADER_ONLY_TOOLTIP
        }),
        expect.objectContaining({
          type: 'unpublish',
          disabled: true,
          disabledTooltip: LEADER_ONLY_TOOLTIP
        }),
        expect.objectContaining({
          type: 'delete',
          disabled: true,
          disabledTooltip: LEADER_ONLY_TOOLTIP
        }),
        expect.stringContaining('clone')
      ])
    })
  })

  BddTest().when('the user is a leader of the activity and the activity is a draft', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('the delete action should be enabled', () => {
      expect(getActions()).toEqual([
        expect.objectContaining({
          type: 'navigateToFeedbacks',
          disabled: true,
        }),
        expect.objectContaining({
          type: 'unpublish',
          disabled: true,
        }),
        expect.objectContaining({
          type: 'delete',
          disabled: false,
        }),
        expect.stringContaining('clone')
      ])
    })
  })

  BddTest().when('the user is a leader of the activity but the activity is not a draft', () => {
    beforeEach(() => {
      mountWith({
        activityStatus: EActivityStatus.UNPUBLISHED
      })
    })

    BddTest().then('the delete action should be disabled', () => {
      expect(getActions()).toEqual([
        expect.objectContaining({
          type: 'navigateToFeedbacks',
          disabled: true,
        }),
        expect.objectContaining({
          type: 'unpublish',
          disabled: true,
        }),
        expect.objectContaining({
          type: 'delete',
          disabled: true,
        }),
        expect.stringContaining('clone')
      ])
    })
  })
})
