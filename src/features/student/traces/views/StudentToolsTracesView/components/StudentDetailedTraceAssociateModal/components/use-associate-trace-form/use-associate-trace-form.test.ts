import type { TraceDetailDTO } from '@/api/avenir-esr'
import * as avenirEsrApi from '@/api/avenir-esr'
import {
  type AssociateTraceFormData,
  type TraceAssociationOption,
  useAssociateTraceForm
} from '@/features/student/traces/views/StudentToolsTracesView/components/StudentDetailedTraceAssociateModal/components/use-associate-trace-form/use-associate-trace-form'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { afterEach, beforeEach, expect, type MockInstance, vi } from 'vitest'

function makeOption (id = 'skillLevel-123', title = 'Physique', description = 'test'): TraceAssociationOption {
  return {
    id,
    title,
    label: title,
    value: id,
    description,
  }
}

BddTest().given('the useAssociateTraceForm composable', () => {
  let composableResult: ReturnType<typeof useAssociateTraceForm>
  let mockOnAssociated: ReturnType<typeof vi.fn>
  let associateSpy: MockInstance<(traceId: string, dto: any, options?: RequestInit) => Promise<string>>
  const trace: TraceDetailDTO = { id: 'trace-001', title: 'Ma trace' } as any

  const createAssociation = (id = 'skillLevel-123', title = 'Physique', description = 'Une description pour la physique') => makeOption(id, title, description)
  const createValidFormData = (assoc = createAssociation()): AssociateTraceFormData => ({
    selectedAssociation: [assoc],
  })
  const createInvalidFormData = (): AssociateTraceFormData => ({
    selectedAssociation: [],
  })

  const getOnSubmitValidator = () => {
    const validator = composableResult.form.options.validators?.onSubmit
    expect(validator).toBeDefined()
    return validator!
  }
  const getOnSubmitHandler = () => {
    const handler = composableResult.form.options.onSubmit
    expect(handler).toBeDefined()
    return handler!
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockOnAssociated = vi.fn()
    associateSpy = vi.spyOn(avenirEsrApi, 'associate').mockResolvedValue('OK')

    const result = mountComposable(
      () => useAssociateTraceForm({ trace, onAssociated: mockOnAssociated }),
      { useI18n: true, useTanstack: true, usePinia: true }
    )
    composableResult = result.result
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the composable is initialized', () => {
    BddTest().then('it should expose a TanStack form instance', () => {
      expect(composableResult.form).toBeDefined()
      expect(typeof composableResult.form.useStore).toBe('function')
    })

    BddTest().then('it should expose isFormValid computed', () => {
      expect(composableResult.isFormValid).toBeDefined()
      expect(typeof composableResult.isFormValid.value).toBe('boolean')
      expect(composableResult.isFormValid.value).toBe(true)
    })

    BddTest().then('it should expose isSubmitting flag', () => {
      expect(composableResult.isSubmitting).toBeDefined()
      expect(composableResult.isSubmitting.value).toBe(false)
    })

    BddTest().then('it should set default values', () => {
      const state = composableResult.form.useStore(s => s)
      expect(state.value.values.selectedAssociation).toEqual([])
    })
  })

  BddTest().when('form is validated with invalid data', () => {
    BddTest().then('it should return validation error for missing selectedAssociation', () => {
      const validator = getOnSubmitValidator()
      const invalidData = createInvalidFormData()
      const res = validator({ value: invalidData })
      expect(res?.fields?.selectedAssociation).toBeTruthy()
    })
  })

  BddTest().when('form is validated with valid data', () => {
    BddTest().then('it should return no validation errors', () => {
      const validator = getOnSubmitValidator()
      const validData = createValidFormData()
      const res = validator({ value: validData })
      expect(res?.fields?.selectedAssociation).toBeUndefined()
    })
  })

  BddTest().when('form is submitted with valid data', () => {
    BddTest().then('it should call the associate API with correct payload', async () => {
      const handler = getOnSubmitHandler()
      const assoc = createAssociation('lvl-999', 'Mathématiques', 'Niveau en mathématiques')

      handler({ value: createValidFormData(assoc), formApi: composableResult.form, meta: {} })

      await vi.waitFor(() => {
        expect(associateSpy).toHaveBeenCalledWith('trace-001', {
          amsIds: [],
          skillLevelIds: ['lvl-999'],
          additionalSkillProgressIds: [],
        })
      })
    })

    BddTest().then('it should call onAssociated callback on success', async () => {
      const handler = getOnSubmitHandler()
      handler({ value: createValidFormData(), formApi: composableResult.form, meta: {} })

      await vi.waitFor(() => {
        expect(associateSpy).toHaveBeenCalled()
        expect(mockOnAssociated).toHaveBeenCalled()
      })
    })
  })

  BddTest().when('API returns an error', () => {
    BddTest().then('it should not call onAssociated on failure', async () => {
      associateSpy.mockRejectedValueOnce(new Error('API Error'))

      const handler = getOnSubmitHandler()
      handler({ value: createValidFormData(), formApi: composableResult.form, meta: {} })

      await vi.waitFor(() => {
        expect(associateSpy).toHaveBeenCalled()
      })
      expect(mockOnAssociated).not.toHaveBeenCalled()
    })
  })

  BddTest().when('form state changes are observed', () => {
    BddTest().then('isFormValid should stay reactive', () => {
      expect(composableResult.isFormValid.value).toBeDefined()
      expect(typeof composableResult.isFormValid.value).toBe('boolean')
    })
  })
})
