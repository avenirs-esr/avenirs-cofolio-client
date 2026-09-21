import { ROUTES } from '@/common/constants'
import EditNationalActivityViewTabActions from '@/features/staff/activities/views/EditNationalActivityView/components/EditNationalActivityViewTabActions/EditNationalActivityViewTabActions.vue'
import { EditNationalActivityViewFormWrapper, EditNationalActivityViewFormWrapperDirty, mockHandleSubmit } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityView.stub'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { getAvButtonByTestId } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { h } from 'vue'

BddTest().given('an EditNationalActivityViewTabActions component', () => {
  const stubs = { AvButton: AvButtonStub }

  const mountWith = (FormWrapper: typeof EditNationalActivityViewFormWrapper): VueWrapper<InstanceType<typeof EditNationalActivityViewTabActions>> => {
    const wrapper = mount(FormWrapper, {
      slots: { default: h(EditNationalActivityViewTabActions) },
      global: { stubs },
    })
    return wrapper.findComponent(EditNationalActivityViewTabActions)
  }

  const getExitButton = (actions: VueWrapper<InstanceType<typeof EditNationalActivityViewTabActions>>) => getAvButtonByTestId(actions, 'exit-button')
  const getSaveButton = (actions: VueWrapper<InstanceType<typeof EditNationalActivityViewTabActions>>) => getAvButtonByTestId(actions, 'save-button')

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the form is pristine', () => {
    let actions: VueWrapper<InstanceType<typeof EditNationalActivityViewTabActions>>

    beforeEach(() => {
      actions = mountWith(EditNationalActivityViewFormWrapper)
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

  BddTest().when('the form is dirty', () => {
    let actions: VueWrapper<InstanceType<typeof EditNationalActivityViewTabActions>>

    beforeEach(() => {
      actions = mountWith(EditNationalActivityViewFormWrapperDirty)
    })

    BddTest().then('the exit button should be loading', async () => {
      await vi.waitFor(() => {
        expect(getExitButton(actions).props('isLoading')).toBe(true)
      })
    })

    BddTest().and('the save button is clicked', () => {
      beforeEach(async () => {
        await vi.waitFor(() => {
          expect(actions.find('[data-testid="save-button"]').attributes()).not.toHaveProperty('disabled')
        })
        await actions.find('[data-testid="save-button"]').trigger('click')
      })

      BddTest().then('it should call handleSubmit', () => {
        expect(mockHandleSubmit).toHaveBeenCalledTimes(1)
      })
    })
  })

  BddTest().when('the save button is clicked while disabled', () => {
    let actions: VueWrapper<InstanceType<typeof EditNationalActivityViewTabActions>>

    beforeEach(async () => {
      actions = await mountWith(EditNationalActivityViewFormWrapper)
      await actions.find('[data-testid="save-button"]').trigger('click')
    })

    BddTest().then('it should not handleSubmit save', () => {
      expect(mockHandleSubmit).not.toHaveBeenCalled()
    })
  })
})
