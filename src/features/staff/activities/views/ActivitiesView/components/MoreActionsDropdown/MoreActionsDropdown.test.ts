import type { VueWrapper } from '@vue/test-utils'
import { EActivityStatus } from '@/api/avenir-esr'
import { ManageEntityDropdownStub } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.stub'
import MoreActionsDropdown from '@/features/staff/activities/views/ActivitiesView/components/MoreActionsDropdown/MoreActionsDropdown.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockIsSuperAdmin = vi.hoisted(() => ({ value: false }))
const mockIsAuthor = vi.hoisted(() => ({ value: false }))

vi.mock('@/features/auth/global/stores/auth.store', () => ({
  useAuthStore: () => ({
    get isSuperAdmin () {
      return mockIsSuperAdmin.value
    },
  })
}))

BddTest().given('a MoreActionsDropdown component', () => {
  let wrapper: VueWrapper<InstanceType<typeof MoreActionsDropdown>>

  const stubs = {
    ManageEntityDropdown: ManageEntityDropdownStub
  }

  function getDropdown () {
    return wrapper.findComponent(ManageEntityDropdownStub)
  }

  function getDeleteButton () {
    return getDropdown().find('[data-testid="delete"]')
  }

  function mountDropdown (activityStatus: EActivityStatus, isAuthor: boolean) {
    return mountComponent(MoreActionsDropdown, {
      props: { activityStatus, isAuthor },
      global: { stubs }
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockIsSuperAdmin.value = false
    mockIsAuthor.value = true
  })

  BddTest().when('mounted with DRAFT status', () => {
    beforeEach(() => {
      wrapper = mountDropdown(EActivityStatus.DRAFT, true)
    })

    BddTest().then('it should render the dropdown', () => {
      expect(getDropdown().exists()).toBe(true)
    })

    BddTest().then('it should set the correct entity name', () => {
      expect(getDropdown().props('entityName')).toBe('mon activité')
    })

    BddTest().then('the delete action should not be disabled and the navigate to feedback, unpublish and clone actions should be disabled', () => {
      expect(getDropdown().props('actions')).toEqual([
        expect.objectContaining({
          type: 'navigateToFeedbacks',
          disabled: true,
          disabledTooltip: 'Les demandes de feedback sont uniquement disponibles pour une activité publiée'
        }),
        expect.objectContaining({
          type: 'unpublish',
          disabled: true,
          disabledTooltip: 'Vous pouvez uniquement dépublier une activité publiée'
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
      wrapper = mountDropdown(EActivityStatus.PUBLISHED, true)
    })

    BddTest().then('the delete action should be disabled and the navigate to feedback, unpublish and clone actions should not be disabled', () => {
      expect(getDropdown().props('actions')).toEqual([
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
          disabledTooltip: 'Vous pouvez uniquement supprimer une activité en brouillon'
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
      mockIsSuperAdmin.value = true
      wrapper = mountDropdown(EActivityStatus.PUBLISHED, true)
    })

    BddTest().then('the delete action should not be disabled', () => {
      expect(getDropdown().props('actions')).toEqual([
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
      mockIsSuperAdmin.value = true
      wrapper = mountDropdown(EActivityStatus.UNPUBLISHED, true)
    })

    BddTest().then('the delete action should not be disabled', () => {
      expect(getDropdown().props('actions')).toEqual([
        expect.objectContaining({ type: 'navigateToFeedbacks', disabled: true }),
        expect.objectContaining({ type: 'unpublish', disabled: true }),
        expect.objectContaining({ type: 'delete', disabled: false }),
        expect.stringContaining('clone')
      ])
    })
  })

  BddTest().when('the user is not the activity author', () => {
    beforeEach(() => {
      wrapper = mountDropdown(EActivityStatus.UNPUBLISHED, false)
    })

    BddTest().then('the actions should be disabled', () => {
      expect(getDropdown().props('actions')).toEqual([
        expect.objectContaining({
          type: 'navigateToFeedbacks',
          disabled: true,
          disabledTooltip:
          'Vous devez être l\'auteur(rice) de l\'activité pour accéder à cette action',
        }),
        expect.objectContaining({
          type: 'unpublish',
          disabled: true,
          disabledTooltip:
          'Vous devez être l\'auteur(rice) de l\'activité pour accéder à cette action',
        }),
        expect.objectContaining({
          type: 'delete',
          disabled: true,
          disabledTooltip:
          'Vous devez être l\'auteur(rice) de l\'activité pour accéder à cette action',
        }),
        expect.stringContaining('clone')
      ])
    })
  })

  BddTest().when('the user is the activity author and the activity is a draft', () => {
    beforeEach(() => {
      mockIsSuperAdmin.value = false
      wrapper = mountDropdown(EActivityStatus.DRAFT, true)
    })

    BddTest().then('the delete action should be enabled', () => {
      expect(getDropdown().props('actions')).toEqual([
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

  BddTest().when('the user is the activity author but the activity is not a draft', () => {
    beforeEach(() => {
      mockIsSuperAdmin.value = false
      wrapper = mountDropdown(EActivityStatus.UNPUBLISHED, true)
    })

    BddTest().then('the delete action should be disabled', () => {
      expect(getDropdown().props('actions')).toEqual([
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
