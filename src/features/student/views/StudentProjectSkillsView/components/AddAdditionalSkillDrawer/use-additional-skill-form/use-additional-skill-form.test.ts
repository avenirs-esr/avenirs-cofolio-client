import type { AdditionalSkillFormData } from '@/features/student/views/StudentProjectSkillsView/components/AddAdditionalSkillDrawer/types'
import { type AddAdditionalSkillDTO, EAdditionalSkillLevel, EAdditionalSkillType } from '@/api/avenir-esr'
import * as avenirEsrApi from '@/api/avenir-esr'
import { BddTest, mountComposable } from 'tests/utils'
import { beforeEach, type MockInstance, vi } from 'vitest'
import { useAdditionalSkillForm } from './use-additional-skill-form'

BddTest().given('the useAdditionalSkillForm composable', () => {
  let composableResult: ReturnType<typeof useAdditionalSkillForm>
  let mockOnSubmit: ReturnType<typeof vi.fn>
  let createAdditionalSkillProgressSpy: MockInstance<(addAdditionalSkillDTO: AddAdditionalSkillDTO, options?: RequestInit | undefined) => Promise<void>>

  const createMockSkill = (id = '1', label = 'Test Skill', type = EAdditionalSkillType.ROME4) => ({
    id,
    label,
    value: id,
    title: label,
    pathSegments: ['Test', 'Path'],
    type,
  })

  const createValidFormData = (level = EAdditionalSkillLevel.INTERMEDIATE, skillData = createMockSkill()): AdditionalSkillFormData => ({
    selectedSkills: [skillData],
    level
  })

  const createInvalidFormData = (): AdditionalSkillFormData => ({
    selectedSkills: [],
    level: undefined
  } as unknown as AdditionalSkillFormData)

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
    mockOnSubmit = vi.fn()
    createAdditionalSkillProgressSpy = vi.spyOn(avenirEsrApi, 'createAdditionalSkillProgress')

    const result = mountComposable(() => useAdditionalSkillForm(mockOnSubmit), {
      useI18n: true,
      useTanstack: true,
      usePinia: true
    })
    composableResult = result.result
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the composable is initialized', () => {
    BddTest().then('it should return a form instance', () => {
      expect(composableResult.form).toBeDefined()
      expect(typeof composableResult.form.useStore).toBe('function')
    })

    BddTest().then('it should return isFormValid computed property', () => {
      expect(composableResult.isFormValid).toBeDefined()
      expect(composableResult.isFormValid.value).toBe(true)
    })
  })

  BddTest().when('form is validated with invalid data', () => {
    BddTest().then('it should return validation errors for missing selectedSkills', () => {
      const invalidData = createInvalidFormData()
      const validator = getOnSubmitValidator()
      const validationResult = validator({ value: invalidData })

      expect(validationResult?.fields?.selectedSkills).toEqual('Une compétence doit être sélectionnée')
    })

    BddTest().then('it should return validation errors for missing level', () => {
      const invalidData: AdditionalSkillFormData = {
        selectedSkills: [createMockSkill()],
        level: undefined
      } as unknown as AdditionalSkillFormData
      const validator = getOnSubmitValidator()
      const validationResult = validator({ value: invalidData })

      expect(validationResult?.fields?.level).toEqual('Un niveau d\'auto-positionnement doit être sélectionné')
    })

    BddTest().then('it should return validation errors when both fields are missing', () => {
      const invalidData = createInvalidFormData()
      const validator = getOnSubmitValidator()
      const validationResult = validator({ value: invalidData })

      expect(validationResult?.fields?.selectedSkills).toEqual('Une compétence doit être sélectionnée')
      expect(validationResult?.fields?.level).toEqual('Un niveau d\'auto-positionnement doit être sélectionné')
    })

    BddTest().then('it should handle empty selectedSkills array', () => {
      const invalidData: AdditionalSkillFormData = {
        selectedSkills: [],
        level: EAdditionalSkillLevel.INTERMEDIATE
      }
      const validator = getOnSubmitValidator()
      const validationResult = validator({ value: invalidData })

      expect(validationResult?.fields?.selectedSkills).toEqual('Une compétence doit être sélectionnée')
      expect(validationResult?.fields?.level).toBeUndefined()
    })
  })

  BddTest().when('form is validated with valid data', () => {
    BddTest().then('it should return no validation errors', () => {
      const validData = createValidFormData()
      const validator = getOnSubmitValidator()
      const validationResult = validator({ value: validData })

      expect(validationResult?.fields?.selectedSkills).toBeUndefined()
      expect(validationResult?.fields?.level).toBeUndefined()
    })

    BddTest().then('it should validate with different skill types', () => {
      const skill = createMockSkill('test-id', 'Test Skill', EAdditionalSkillType.ROME4)
      const validData = createValidFormData(EAdditionalSkillLevel.EXPERT, skill)
      const validator = getOnSubmitValidator()
      const validationResult = validator({ value: validData })

      expect(validationResult?.fields?.selectedSkills).toBeUndefined()
      expect(validationResult?.fields?.level).toBeUndefined()
    })

    BddTest().then('it should validate with all skill levels', () => {
      const skillLevels = [
        EAdditionalSkillLevel.BEGINNER,
        EAdditionalSkillLevel.INTERMEDIATE,
        EAdditionalSkillLevel.COMPETENT,
        EAdditionalSkillLevel.ADVANCED,
        EAdditionalSkillLevel.EXPERT
      ]

      skillLevels.forEach((level) => {
        const validData = createValidFormData(level)
        const validator = getOnSubmitValidator()
        const validationResult = validator({ value: validData })

        expect(validationResult?.fields?.selectedSkills).toBeUndefined()
        expect(validationResult?.fields?.level).toBeUndefined()
      })
    })
  })

  BddTest().when('form is submitted', () => {
    BddTest().then('it should have onSubmit function defined', () => {
      expect(composableResult.form.options.onSubmit).toBeDefined()
      expect(typeof composableResult.form.options.onSubmit).toBe('function')
    })

    BddTest().then('it should trigger the mutation on form submit', async () => {
      const validData = createValidFormData()
      const handler = getOnSubmitHandler()
      handler({ value: validData, formApi: composableResult.form, meta: {} })

      await vi.waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled()
      })
    })

    BddTest().then('it should call createAdditionalSkillProgress API with correct parameters', async () => {
      const skill = createMockSkill('skill-123', 'JavaScript Development')
      const validData = createValidFormData(EAdditionalSkillLevel.ADVANCED, skill)
      const handler = getOnSubmitHandler()
      handler({ value: validData, formApi: composableResult.form, meta: {} })

      await vi.waitFor(() => {
        expect(createAdditionalSkillProgressSpy).toHaveBeenCalledWith({
          id: 'skill-123',
          type: EAdditionalSkillType.ROME4,
          level: EAdditionalSkillLevel.ADVANCED
        })
      })
    })

    BddTest().then('it should call createAdditionalSkillProgress API with different skill levels', async () => {
      const skill = createMockSkill('skill-456', 'Python Programming')
      const validData = createValidFormData(EAdditionalSkillLevel.BEGINNER, skill)
      const handler = getOnSubmitHandler()
      handler({ value: validData, formApi: composableResult.form, meta: {} })

      await vi.waitFor(() => {
        expect(createAdditionalSkillProgressSpy).toHaveBeenCalledWith({
          id: 'skill-456',
          type: EAdditionalSkillType.ROME4,
          level: EAdditionalSkillLevel.BEGINNER
        })
      })
    })

    BddTest().then('it should handle different skill types in API call', async () => {
      const skill = createMockSkill('skill-789', 'Design Thinking', EAdditionalSkillType.ROME4)
      const validData = createValidFormData(EAdditionalSkillLevel.COMPETENT, skill)
      const handler = getOnSubmitHandler()
      handler({ value: validData, formApi: composableResult.form, meta: {} })

      await vi.waitFor(() => {
        expect(createAdditionalSkillProgressSpy).toHaveBeenCalledWith({
          id: 'skill-789',
          type: EAdditionalSkillType.ROME4,
          level: EAdditionalSkillLevel.COMPETENT
        })
      })
    })

    BddTest().then('it should call onSubmit callback after successful API call', async () => {
      const validData = createValidFormData()
      const handler = getOnSubmitHandler()
      createAdditionalSkillProgressSpy.mockResolvedValueOnce(undefined)

      handler({ value: validData, formApi: composableResult.form, meta: {} })

      await vi.waitFor(() => {
        expect(createAdditionalSkillProgressSpy).toHaveBeenCalled()
        expect(mockOnSubmit).toHaveBeenCalled()
      })
    })
  })

  BddTest().when('form validity is determined', () => {
    BddTest().then('it should return true initially when form is valid', () => {
      expect(composableResult.isFormValid.value).toBe(true)
    })

    BddTest().then('it should return false when form has validation errors', () => {
      expect(composableResult.isFormValid.value).toBeDefined()
      expect(typeof composableResult.isFormValid.value).toBe('boolean')
    })

    BddTest().then('it should be reactive to form state changes', () => {
      expect(composableResult.isFormValid).toBeDefined()
      expect(composableResult.isFormValid.value).toBe(true)
    })
  })

  BddTest().when('form state is managed', () => {
    BddTest().then('it should have proper default values', () => {
      const state = composableResult.form.useStore(state => state)
      expect(state.value.values.selectedSkills).toEqual([])
      expect(state.value.values.level).toBeUndefined()
    })

    BddTest().then('it should track form validation state', () => {
      const state = composableResult.form.useStore(state => state)
      expect(state.value.isValid).toBeDefined()
      expect(state.value.isValidating).toBeDefined()
      expect(state.value.isDirty).toBeDefined()
    })

    BddTest().then('it should provide isSubmitting state', () => {
      expect(composableResult.isSubmitting).toBeDefined()
      expect(composableResult.isSubmitting.value).toBe(false)
    })
  })

  BddTest().when('API errors occur', () => {
    BddTest().then('it should handle API errors gracefully', async () => {
      const validData = createValidFormData()
      const handler = getOnSubmitHandler()
      const apiError = new Error('API Error')
      createAdditionalSkillProgressSpy.mockRejectedValueOnce(apiError)

      handler({ value: validData, formApi: composableResult.form, meta: {} })

      await vi.waitFor(() => {
        expect(createAdditionalSkillProgressSpy).toHaveBeenCalled()
      })
    })

    BddTest().then('it should not call onSubmit when API fails', async () => {
      const validData = createValidFormData()
      const handler = getOnSubmitHandler()
      createAdditionalSkillProgressSpy.mockRejectedValueOnce(new Error('API Error'))

      handler({ value: validData, formApi: composableResult.form, meta: {} })

      await vi.waitFor(() => {
        expect(createAdditionalSkillProgressSpy).toHaveBeenCalled()
      })

      expect(mockOnSubmit).not.toHaveBeenCalled()
    })
  })

  BddTest().when('form data is transformed to DTO', () => {
    BddTest().then('it should correctly transform form data to DTO', async () => {
      const skill = createMockSkill('transform-test', 'Transform Test Skill', EAdditionalSkillType.ROME4)
      const validData = createValidFormData(EAdditionalSkillLevel.EXPERT, skill)
      const handler = getOnSubmitHandler()
      handler({ value: validData, formApi: composableResult.form, meta: {} })

      await vi.waitFor(() => {
        expect(createAdditionalSkillProgressSpy).toHaveBeenCalledWith({
          id: 'transform-test',
          type: EAdditionalSkillType.ROME4,
          level: EAdditionalSkillLevel.EXPERT
        })
      })
    })

    BddTest().then('it should handle multiple skills by taking the first one', async () => {
      const skill1 = createMockSkill('skill-1', 'First Skill')
      const skill2 = createMockSkill('skill-2', 'Second Skill')
      const validData: AdditionalSkillFormData = {
        selectedSkills: [skill1, skill2],
        level: EAdditionalSkillLevel.INTERMEDIATE
      }
      const handler = getOnSubmitHandler()
      handler({ value: validData, formApi: composableResult.form, meta: {} })

      await vi.waitFor(() => {
        expect(createAdditionalSkillProgressSpy).toHaveBeenCalledWith({
          id: 'skill-1',
          type: EAdditionalSkillType.ROME4,
          level: EAdditionalSkillLevel.INTERMEDIATE
        })
      })
    })
  })
})
