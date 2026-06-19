import { EActivityStatus } from '@/api/avenir-esr'
import MoreActionsDropdown from '@/features/staff/activities/views/ActivitiesView/components/MoreActionsDropdown/MoreActionsDropdown.vue'
import { AvDropdownStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a MoreActionsDropdown component', () => {
  let wrapper: VueWrapper<InstanceType<typeof MoreActionsDropdown>>

  const stubs = {
    AvDropdown: AvDropdownStub
  }

  function getDropdown () {
    return wrapper.findComponent(AvDropdownStub)
  }

  function getDeleteButton () {
    return getDropdown().find('[data-name="delete"]')
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

    BddTest().then('it should set the correct trigger aria label', () => {
      expect(getDropdown().props('triggerAriaLabel')).toBe('Plus d\'actions')
    })

    BddTest().then('the delete item should not be disabled', () => {
      expect(getDropdown().props('items')).toEqual([
        expect.objectContaining({
          name: 'delete',
          label: 'Supprimer',
          disabled: false
        })
      ])
    })

    BddTest().and('the delete item is selected', () => {
      beforeEach(async () => {
        await getDeleteButton().trigger('click')
      })

      BddTest().then('it should emit deleteSelected', () => {
        expect(wrapper.emitted('deleteSelected')).toHaveLength(1)
      })
    })

    BddTest().and('an unknown item is selected', () => {
      beforeEach(async () => {
        await getDropdown().vm.$emit('itemSelected', 'unknown')
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

    BddTest().then('the delete item should be disabled', () => {
      expect(getDropdown().props('items')).toEqual([
        expect.objectContaining({
          name: 'delete',
          disabled: true
        })
      ])
    })
  })
})
