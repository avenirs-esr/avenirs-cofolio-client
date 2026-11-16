import type { VueWrapper } from '@vue/test-utils'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { getAvButtonByTestId } from '@avenirs-esr/shared/test-utils/unit'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { h } from 'vue'
import { ROUTES } from '@/common/constants'
import EditNationalActivityViewTabActions from '@/features/staff/activities/views/EditNationalActivityView/components/EditNationalActivityViewTabActions/EditNationalActivityViewTabActions.vue'
import {
  EditNationalActivityViewFormWrapper,
  mockCanSave,
  mockIsBusy,
  mockIsSaving,
  mockSaveNow,
  resetMockSaveState,
} from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityView.stub'

BddTest().given('an EditNationalActivityViewTabActions component', () => {
  const stubs = { AvButton: AvButtonStub }

  const mountActions = (): VueWrapper<InstanceType<typeof EditNationalActivityViewTabActions>> => {
    const wrapper = mount(EditNationalActivityViewFormWrapper, {
      slots: { default: h(EditNationalActivityViewTabActions) },
      global: { stubs },
    })
    return wrapper.findComponent(EditNationalActivityViewTabActions)
  }

  const getExitButton = (actions: VueWrapper<InstanceType<typeof EditNationalActivityViewTabActions>>) => getAvButtonByTestId(actions, 'exit-button')
  const getSaveButton = (actions: VueWrapper<InstanceType<typeof EditNationalActivityViewTabActions>>) => getAvButtonByTestId(actions, 'save-button')

  beforeEach(() => {
    vi.clearAllMocks()
    resetMockSaveState()
  })

  BddTest().when('there is nothing to save', () => {
    let actions: VueWrapper<InstanceType<typeof EditNationalActivityViewTabActions>>

    beforeEach(() => {
      actions = mountActions()
    })

    BddTest().then('it should render the exit button', () => {
      expect(actions.find('[data-testid="exit-button"]').exists()).toBe(true)
    })

    BddTest().then('the exit button should be a link to staff activities', () => {
      expect(getExitButton(actions).props('to')).toBe(ROUTES.STAFF.ACTIVITIES)
    })

    BddTest().then('it should render the save button', () => {
      expect(actions.find('[data-testid="save-button"]').exists()).toBe(true)
    })

    BddTest().then('the exit button should not be loading', () => {
      expect(getExitButton(actions).props('isLoading')).toBe(false)
    })

    BddTest().then('the save button should be disabled', () => {
      expect(actions.find('[data-testid="save-button"]').attributes()).toHaveProperty('disabled')
    })

    BddTest().then('the save button should explain why it is disabled', () => {
      expect(getSaveButton(actions).props('disabledTooltip')).toBe('Modifiez un champ avant d\'enregistrer')
    })
  })

  BddTest().when('the view is busy', () => {
    let actions: VueWrapper<InstanceType<typeof EditNationalActivityViewTabActions>>

    beforeEach(() => {
      mockIsBusy.value = true
      actions = mountActions()
    })

    BddTest().then('the exit button should be loading', () => {
      expect(getExitButton(actions).props('isLoading')).toBe(true)
    })
  })

  BddTest().when('changes can be saved', () => {
    let actions: VueWrapper<InstanceType<typeof EditNationalActivityViewTabActions>>

    beforeEach(() => {
      mockCanSave.value = true
      actions = mountActions()
    })

    BddTest().then('the save button should be enabled', () => {
      expect(actions.find('[data-testid="save-button"]').attributes()).not.toHaveProperty('disabled')
    })

    BddTest().and('the save button is clicked', () => {
      beforeEach(async () => {
        await actions.find('[data-testid="save-button"]').trigger('click')
      })

      BddTest().then('it should save the changes right away', () => {
        expect(mockSaveNow).toHaveBeenCalledOnce()
      })
    })
  })

  BddTest().when('a save is in flight', () => {
    let actions: VueWrapper<InstanceType<typeof EditNationalActivityViewTabActions>>

    beforeEach(() => {
      mockIsSaving.value = true
      actions = mountActions()
    })

    BddTest().then('the save button should be loading', () => {
      expect(getSaveButton(actions).props('isLoading')).toBe(true)
    })
  })

  BddTest().when('the save button is clicked while disabled', () => {
    let actions: VueWrapper<InstanceType<typeof EditNationalActivityViewTabActions>>

    beforeEach(async () => {
      actions = mountActions()
      await actions.find('[data-testid="save-button"]').trigger('click')
    })

    BddTest().then('it should not save', () => {
      expect(mockSaveNow).not.toHaveBeenCalled()
    })
  })
})
