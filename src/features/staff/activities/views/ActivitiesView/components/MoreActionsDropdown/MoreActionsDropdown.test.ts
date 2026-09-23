import { EActivityStatus } from '@/api/avenir-esr'
import { ManageEntityDropdownStub } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.stub'
import MoreActionsDropdown from '@/features/staff/activities/views/ActivitiesView/components/MoreActionsDropdown/MoreActionsDropdown.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

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

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('mounted with DRAFT status', () => {
    beforeEach(() => {
      wrapper = mount(MoreActionsDropdown, {
        props: { activityStatus: EActivityStatus.DRAFT },
        global: { stubs }
      })
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

      BddTest().then('it should emit deleteSelected', () => {
        expect(wrapper.emitted('deleteSelected')).toHaveLength(1)
      })
    })

    BddTest().and('an unknown action is selected', () => {
      beforeEach(async () => {
        await getDropdown().vm.$emit('actionSelected', 'unknown')
      })

      BddTest().then('it should not emit deleteSelected', () => {
        expect(wrapper.emitted('deleteSelected')).toBeUndefined()
      })
    })
  })

  BddTest().when('mounted with PUBLISHED status', () => {
    beforeEach(() => {
      wrapper = mount(MoreActionsDropdown, {
        props: { activityStatus: EActivityStatus.PUBLISHED },
        global: { stubs }
      })
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

      BddTest().then('it should emit navigateToFeedbacksSelected', () => {
        expect(wrapper.emitted('navigateToFeedbacksSelected')).toHaveLength(1)
      })
    })

    BddTest().and('the unpublish action is selected', () => {
      beforeEach(async () => {
        await getDropdown().vm.$emit('actionSelected', 'unpublish')
      })

      BddTest().then('it should emit unpublishSelected', () => {
        expect(wrapper.emitted('unpublishSelected')).toHaveLength(1)
      })
    })

    BddTest().and('the clone action is selected', () => {
      beforeEach(async () => {
        await getDropdown().vm.$emit('actionSelected', 'clone')
      })

      BddTest().then('it should emit cloneSelected', () => {
        expect(wrapper.emitted('cloneSelected')).toHaveLength(1)
      })
    })
  })
})
