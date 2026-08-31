import { mockedDeclaredActivityDetails } from '@/__mocks__/fixtures/student/activities.fixtures'
import { useUpdateActivityForm } from '@/features/buildProject/components/overlays/UpdateActivityDrawer/use-update-activity-form/use-update-activity-form'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('the useUpdateActivityForm composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the form is initialized with null dates', () => {
    let result: ReturnType<typeof useUpdateActivityForm>

    beforeEach(() => {
      const { result: composableResult } = mountComposable(
        () => useUpdateActivityForm({ ...mockedDeclaredActivityDetails, startDate: undefined, endDate: undefined }),
        { useTanstack: true, useI18n: true, usePinia: true }
      )
      result = composableResult
    })

    BddTest().then('it should expose the form instance', () => {
      expect(result.form).toBeDefined()
    })

    BddTest().then('it should have isFormValid as false (not dirty)', () => {
      expect(result.isFormValid.value).toBe(false)
    })

    BddTest().then('it should expose isSubmitting', () => {
      expect(result.isSubmitting).toBeDefined()
    })
  })

  BddTest().when('the form is initialized with pre-filled dates from the activity', () => {
    let result: ReturnType<typeof useUpdateActivityForm>

    beforeEach(() => {
      const { result: composableResult } = mountComposable(
        () => useUpdateActivityForm(mockedDeclaredActivityDetails),
        { useTanstack: true, useI18n: true, usePinia: true }
      )
      result = composableResult
    })

    BddTest().then('it should pre-fill startDate from the activity', () => {
      expect(result.form.getFieldValue('startDate')).toBe(mockedDeclaredActivityDetails.startDate)
    })

    BddTest().then('it should pre-fill endDate from the activity', () => {
      expect(result.form.getFieldValue('endDate')).toBe(mockedDeclaredActivityDetails.endDate)
    })

    BddTest().then('it should have isFormValid as false (not dirty)', () => {
      expect(result.isFormValid.value).toBe(false)
    })
  })

  BddTest().when('the form is initialized from a valorized activity', () => {
    let result: ReturnType<typeof useUpdateActivityForm>

    beforeEach(() => {
      const { result: composableResult } = mountComposable(
        () => useUpdateActivityForm({ ...mockedDeclaredActivityDetails, valorized: true }),
        { useTanstack: true, useI18n: true, usePinia: true }
      )
      result = composableResult
    })

    BddTest().then('it should pre-fill valorized from the activity', () => {
      expect(result.form.getFieldValue('valorized')).toBe(true)
    })
  })

  BddTest().when('the valorization is toggled from the initial value', () => {
    let result: ReturnType<typeof useUpdateActivityForm>

    beforeEach(async () => {
      const { result: composableResult } = mountComposable(
        () => useUpdateActivityForm(mockedDeclaredActivityDetails),
        { useTanstack: true, useI18n: true, usePinia: true }
      )
      result = composableResult
      result.form.setFieldValue('valorized', true)
      await flushPromises()
    })

    BddTest().then('it should be dirty', async () => {
      await vi.waitFor(() => {
        const state = result.form.useStore(s => s)
        expect(state.value.isDirty).toBe(true)
      })
    })
  })

  BddTest().when('a date is changed from the initial value', () => {
    let result: ReturnType<typeof useUpdateActivityForm>

    beforeEach(async () => {
      const { result: composableResult } = mountComposable(
        () => useUpdateActivityForm(mockedDeclaredActivityDetails),
        { useTanstack: true, useI18n: true, usePinia: true }
      )
      result = composableResult
      result.form.setFieldValue('startDate', '2024-02-01')
      await flushPromises()
    })

    BddTest().then('it should be dirty', async () => {
      await vi.waitFor(() => {
        const state = result.form.useStore(s => s)
        expect(state.value.isDirty).toBe(true)
      })
    })
  })

  BddTest().when('the form is submitted with valid dates', () => {
    const mockOnUpdated = vi.fn()
    let result: ReturnType<typeof useUpdateActivityForm>

    beforeEach(async () => {
      const { result: composableResult } = mountComposable(
        () => useUpdateActivityForm(
          { ...mockedDeclaredActivityDetails, startDate: undefined, endDate: undefined },
          mockOnUpdated
        ),
        { useTanstack: true, useI18n: true, usePinia: true }
      )
      result = composableResult
      result.form.setFieldValue('startDate', '2024-03-01')
      result.form.setFieldValue('endDate', '2024-06-30')
      await result.form.handleSubmit()
      await flushPromises()
    })

    BddTest().then('it should call the onUpdated callback', async () => {
      await vi.waitFor(() => {
        expect(mockOnUpdated).toHaveBeenCalledTimes(1)
      })
    })
  })

  BddTest().when('the activity has a staff-defined period', () => {
    const mockOnUpdated = vi.fn()
    let result: ReturnType<typeof useUpdateActivityForm>

    beforeEach(async () => {
      const { result: composableResult } = mountComposable(
        () => useUpdateActivityForm(
          {
            ...mockedDeclaredActivityDetails,
            activity: {
              ...mockedDeclaredActivityDetails.activity,
              startDate: '2024-01-01',
              endDate: '2024-12-31'
            }
          },
          mockOnUpdated
        ),
        { useTanstack: true, useI18n: true, usePinia: true }
      )
      result = composableResult
      result.form.setFieldValue('startDate', '2024-03-01')
      result.form.setFieldValue('endDate', '2024-06-30')
      await result.form.handleSubmit()
      await flushPromises()
    })

    BddTest().then('it should still call the onUpdated callback', async () => {
      await vi.waitFor(() => {
        expect(mockOnUpdated).toHaveBeenCalledTimes(1)
      })
    })
  })

  BddTest().when('no callback is provided', () => {
    let result: ReturnType<typeof useUpdateActivityForm>

    beforeEach(() => {
      const { result: composableResult } = mountComposable(
        () => useUpdateActivityForm(mockedDeclaredActivityDetails),
        { useTanstack: true, useI18n: true, usePinia: true }
      )
      result = composableResult
    })

    BddTest().then('it should not throw on initialization', () => {
      expect(result.form).toBeDefined()
    })
  })
})
