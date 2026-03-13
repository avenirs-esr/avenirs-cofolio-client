import { useSubscribeActivityForm } from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/overlays/SubscribeActivityModal/use-subscribe-activity-form/use-subscribe-activity-form'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const activity = { id: 'activity-1', title: 'Activité test' }

BddTest().given('the useSubscribeActivityForm composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the form is initialized', () => {
    let result: ReturnType<typeof useSubscribeActivityForm>

    beforeEach(() => {
      const { result: composableResult } = mountComposable(
        () => useSubscribeActivityForm(activity),
        { useTanstack: true, useI18n: true, usePinia: true }
      )
      result = composableResult
    })

    BddTest().then('it should have isFormValid as true initially (no required fields)', () => {
      expect(result.isFormValid.value).toBe(true)
    })

    BddTest().then('it should have isFormDirty as false initially', () => {
      expect(result.isFormDirty.value).toBe(false)
    })

    BddTest().then('it should expose the form instance', () => {
      expect(result.form).toBeDefined()
    })
  })

  BddTest().when('the form is filled with valid dates', () => {
    let result: ReturnType<typeof useSubscribeActivityForm>

    beforeEach(async () => {
      const { result: composableResult } = mountComposable(
        () => useSubscribeActivityForm(activity),
        { useTanstack: true, useI18n: true, usePinia: true }
      )
      result = composableResult
      result.form.setFieldValue('startDate', '2024-03-01')
      result.form.setFieldValue('endDate', '2024-06-30')
      await flushPromises()
    })

    BddTest().then('it should have isFormDirty as true', () => {
      expect(result.isFormDirty.value).toBe(true)
    })
  })

  BddTest().when('the form is filled with only startDate', () => {
    let result: ReturnType<typeof useSubscribeActivityForm>

    beforeEach(async () => {
      const { result: composableResult } = mountComposable(
        () => useSubscribeActivityForm(activity),
        { useTanstack: true, useI18n: true, usePinia: true }
      )
      result = composableResult
      result.form.setFieldValue('startDate', '2024-03-01')
      await flushPromises()
    })

    BddTest().then('it should have isFormDirty as true', () => {
      expect(result.isFormDirty.value).toBe(true)
    })
  })

  BddTest().when('a success callback is provided and the form is submitted successfully', () => {
    const mockOnSubscribed = vi.fn()
    let result: ReturnType<typeof useSubscribeActivityForm>

    beforeEach(async () => {
      const { result: composableResult } = mountComposable(
        () => useSubscribeActivityForm(activity, mockOnSubscribed),
        { useTanstack: true, useI18n: true, usePinia: true }
      )
      result = composableResult
      result.form.setFieldValue('startDate', '2024-03-01')
      result.form.setFieldValue('endDate', '2024-06-30')
      await result.form.handleSubmit()
      await flushPromises()
    })

    BddTest().then('it should call the onSubscribed callback', async () => {
      await vi.waitFor(() => {
        expect(mockOnSubscribed).toHaveBeenCalledTimes(1)
      })
    })
  })
})
