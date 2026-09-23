import { ManageEntityDropdownStub } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.stub'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ActivityLibraryDropdown from '@/features/student/activities/views/ActivitiesView/components/overlays/ActivityLibraryDropdown/ActivityLibraryDropdown.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an activity library dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityLibraryDropdown>>

  const stubs = {
    ManageEntityDropdown: ManageEntityDropdownStub
  }

  const getDropdown = () => wrapper.findComponent(ManageEntityDropdownStub)
  const getUnsubscribeButton = () => wrapper.find(`[data-testid="${Action.UNSUBSCRIBE}"]`)

  beforeEach(() => {
    wrapper = mount(ActivityLibraryDropdown, { global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the dropdown with one action', () => {
      const dropdown = getDropdown()
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props('actions')).toHaveLength(1)
    })
  })

  BddTest().when('the unsubscribe button is clicked', () => {
    BddTest().then('it should emit the unsubscribeSelected event', async () => {
      const unsubscribeButton = getUnsubscribeButton()
      await unsubscribeButton.trigger('click')
      expect(wrapper.emitted('unsubscribe')).toHaveLength(1)
    })
  })

  BddTest().when('unsubscribe is disabled', () => {
    beforeEach(() => {
      wrapper = mount(ActivityLibraryDropdown, {
        props: { unsubscribeDisabled: true },
        global: { stubs }
      })
    })

    BddTest().then('it should pass a disabled tooltip to the unsubscribe item', () => {
      expect(getDropdown().props('actions')).toEqual([
        expect.objectContaining({
          type: Action.UNSUBSCRIBE,
          disabled: true,
          disabledTooltip: 'Vous ne pouvez pas vous désinscrire car vous n\'êtes inscrit(e) à aucune activité'
        })
      ])
    })
  })
})
