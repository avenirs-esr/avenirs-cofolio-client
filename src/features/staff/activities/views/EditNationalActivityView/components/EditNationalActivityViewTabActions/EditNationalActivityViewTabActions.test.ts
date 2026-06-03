import EditNationalActivityViewTabActions from '@/features/staff/activities/views/EditNationalActivityView/components/EditNationalActivityViewTabActions/EditNationalActivityViewTabActions.vue'
import { EditNationalActivityViewFormWrapper, EditNationalActivityViewFormWrapperDirty, mockCancel, mockHandleSubmit } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityView.stub'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
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

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the form is pristine', () => {
    let actions: VueWrapper<InstanceType<typeof EditNationalActivityViewTabActions>>

    beforeEach(() => {
      actions = mountWith(EditNationalActivityViewFormWrapper)
    })

    BddTest().then('it should render the cancel button', () => {
      expect(actions.find('[data-testid="cancel-button"]').exists()).toBe(true)
    })

    BddTest().then('it should render the save button', () => {
      expect(actions.find('[data-testid="save-button"]').exists()).toBe(true)
    })

    BddTest().then('the cancel button should be disabled', () => {
      expect(actions.find('[data-testid="cancel-button"]').attributes()).toHaveProperty('disabled')
    })

    BddTest().then('the save button should be disabled', () => {
      expect(actions.find('[data-testid="save-button"]').attributes()).toHaveProperty('disabled')
    })
  })

  BddTest().when('the form is dirty', () => {
    let actions: VueWrapper<InstanceType<typeof EditNationalActivityViewTabActions>>

    beforeEach(() => {
      actions = mountWith(EditNationalActivityViewFormWrapperDirty)
    })

    BddTest().then('the cancel button should be enabled', async () => {
      await vi.waitFor(() => {
        expect(actions.find('[data-testid="cancel-button"]').attributes()).not.toHaveProperty('disabled')
      })
    })

    BddTest().and('the cancel button is clicked', () => {
      beforeEach(async () => {
        await vi.waitFor(() => {
          expect(actions.find('[data-testid="cancel-button"]').attributes()).not.toHaveProperty('disabled')
        })
        await actions.find('[data-testid="cancel-button"]').trigger('click')
      })

      BddTest().then('it should call cancel', () => {
        expect(mockCancel).toHaveBeenCalledTimes(1)
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
      actions = mountWith(EditNationalActivityViewFormWrapper)
      await actions.find('[data-testid="save-button"]').trigger('click')
    })

    BddTest().then('it should not handleSubmit save', () => {
      expect(mockHandleSubmit).not.toHaveBeenCalled()
    })
  })
})
