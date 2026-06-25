import type { VueWrapper } from '@vue/test-utils'
import { ROUTES } from '@/common/constants'
import EditNationalActivityViewTabActions from '@/features/staff/activities/views/EditNationalActivityView/components/EditNationalActivityViewTabActions/EditNationalActivityViewTabActions.vue'
import { EditNationalActivityViewFormWrapper, EditNationalActivityViewFormWrapperDirty, mockHandleSubmit } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityView.stub'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountWithRouter } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { h } from 'vue'

const mockRouterBack = vi.fn()
const mockRouterPush = vi.fn()

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      back: mockRouterBack,
      push: mockRouterPush,
    })),
  }
})

BddTest().given('an EditNationalActivityViewTabActions component', () => {
  const stubs = { AvButton: AvButtonStub }

  const mountWith = async (FormWrapper: typeof EditNationalActivityViewFormWrapper): Promise<VueWrapper<InstanceType<typeof EditNationalActivityViewTabActions>>> => {
    const wrapper = await mountWithRouter(FormWrapper, {
      slots: { default: h(EditNationalActivityViewTabActions) },
      global: { stubs },
    })
    return wrapper.findComponent(EditNationalActivityViewTabActions)
  }

  beforeEach(() => {
    vi.clearAllMocks()
    window.history.replaceState({}, '', '/')
  })

  BddTest().when('the form is pristine', () => {
    let actions: VueWrapper<InstanceType<typeof EditNationalActivityViewTabActions>>

    beforeEach(async () => {
      actions = await mountWith(EditNationalActivityViewFormWrapper)
    })

    BddTest().then('it should render the exit button', () => {
      expect(actions.find('[data-testid="exit-button"]').exists()).toBe(true)
    })

    BddTest().then('it should render the save button', () => {
      expect(actions.find('[data-testid="save-button"]').exists()).toBe(true)
    })

    BddTest().then('the exit button should not be loading', () => {
      expect((actions.findComponent('[data-testid="exit-button"]') as VueWrapper<InstanceType<typeof AvButtonStub>>)
        .props('isLoading')).toBe(false)
    })

    BddTest().then('the save button should be disabled', () => {
      expect(actions.find('[data-testid="save-button"]').attributes()).toHaveProperty('disabled')
    })
  })

  BddTest().when('the form is dirty', () => {
    let actions: VueWrapper<InstanceType<typeof EditNationalActivityViewTabActions>>

    beforeEach(async () => {
      actions = await mountWith(EditNationalActivityViewFormWrapperDirty)
    })

    BddTest().then('the exit button should be loading', async () => {
      await vi.waitFor(() => {
        expect((actions.findComponent('[data-testid="exit-button"]') as VueWrapper<InstanceType<typeof AvButtonStub>>)
          .props('isLoading')).toBe(true)
      })
    })

    BddTest().and('the exit button is clicked with a previous history entry', () => {
      beforeEach(async () => {
        window.history.replaceState({ back: '/staff/activities' }, '', '/staff/activities/edit')
        await actions.find('[data-testid="exit-button"]').trigger('click')
      })

      BddTest().then('it should navigate back', () => {
        expect(mockRouterBack).toHaveBeenCalledTimes(1)
        expect(mockRouterPush).not.toHaveBeenCalled()
      })
    })

    BddTest().and('the exit button is clicked without previous history entry', () => {
      beforeEach(async () => {
        window.history.replaceState({}, '', '/staff/activities/edit')
        await actions.find('[data-testid="exit-button"]').trigger('click')
      })

      BddTest().then('it should navigate to staff activities', () => {
        expect(mockRouterBack).not.toHaveBeenCalled()
        expect(mockRouterPush).toHaveBeenCalledWith(ROUTES.STAFF.ACTIVITIES)
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
