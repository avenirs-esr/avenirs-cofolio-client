import { EActivityStatus } from '@/api/avenir-esr'
import MoreActionsDropdown from '@/features/staff/activities/views/ActivitiesView/components/MoreActionsDropdown/MoreActionsDropdown.vue'
import { AvDropdownStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a MoreActionsDropdown component', () => {
  let wrapper: VueWrapper

  const stubs = {
    AvDropdown: AvDropdownStub
  }

  function dropdown () {
    return wrapper.findComponent({ name: 'AvDropdown' })
  }

  function deleteButton () {
    return dropdown().find('[data-name="delete"]')
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
      expect(dropdown().exists()).toBe(true)
    })

    BddTest().then('it should set the correct trigger aria label', () => {
      expect(dropdown().props('triggerAriaLabel')).toBe('Plus d\'actions')
    })

    BddTest().then('the delete item should not be disabled', () => {
      expect(dropdown().props('items')).toEqual([
        expect.objectContaining({
          name: 'delete',
          label: 'Supprimer',
          disabled: false
        })
      ])
    })

    BddTest().and('the delete item is selected', () => {
      beforeEach(async () => {
        await deleteButton().trigger('click')
      })

      BddTest().then('it should emit deleteSelected', () => {
        expect(wrapper.emitted('deleteSelected')).toHaveLength(1)
      })
    })

    BddTest().and('an unknown item is selected', () => {
      beforeEach(async () => {
        await dropdown().vm.$emit('itemSelected', 'unknown')
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
      expect(dropdown().props('items')).toEqual([
        expect.objectContaining({
          name: 'delete',
          disabled: true
        })
      ])
    })
  })
})
