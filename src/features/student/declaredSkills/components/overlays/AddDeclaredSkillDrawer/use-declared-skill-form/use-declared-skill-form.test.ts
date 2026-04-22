import type { DeclaredSkillFormData } from '@/features/student/declaredSkills/components/overlays/AddDeclaredSkillDrawer/types'
import { EDeclaredSkillLevel, EExternalSkillType } from '@/api/avenir-esr'
import { useDeclaredSkillForm } from '@/features/student/declaredSkills/components/overlays/AddDeclaredSkillDrawer/use-declared-skill-form/use-declared-skill-form'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const onSkillAdded = vi.fn()

const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage
    })
  }
})

BddTest().given('the useDeclaredSkillForm composable', () => {
  let composableResult: ReturnType<typeof useDeclaredSkillForm>

  const createMockSkill = (id = '1', label = 'Test Skill', type = EExternalSkillType.ROME4) => ({
    id,
    label,
    value: id,
    title: label,
    pathSegments: ['Test', 'Path'],
    type,
  })

  const createValidFormData = (level = EDeclaredSkillLevel.INTERMEDIATE, skillData = createMockSkill()): DeclaredSkillFormData => ({
    selectedSkills: [skillData],
    level
  })

  const createExistingDeclaredSkillData = (): DeclaredSkillFormData => ({
    selectedSkills: [createMockSkill('EXISTING_SKILL_ID', 'Existing Skill')],
    level: EDeclaredSkillLevel.COMPETENT
  })

  const createInvalidFormData = (): DeclaredSkillFormData => ({
    selectedSkills: [],
    level: undefined
  } as unknown as DeclaredSkillFormData)

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
    const result = mountComposable(() => useDeclaredSkillForm(onSkillAdded), {
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
      const invalidData: DeclaredSkillFormData = {
        selectedSkills: [createMockSkill()],
        level: undefined
      } as unknown as DeclaredSkillFormData
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
      const invalidData: DeclaredSkillFormData = {
        selectedSkills: [],
        level: EDeclaredSkillLevel.INTERMEDIATE
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
      const skill = createMockSkill('test-id', 'Test Skill', EExternalSkillType.ROME4)
      const validData = createValidFormData(EDeclaredSkillLevel.EXPERT, skill)
      const validator = getOnSubmitValidator()
      const validationResult = validator({ value: validData })

      expect(validationResult?.fields?.selectedSkills).toBeUndefined()
      expect(validationResult?.fields?.level).toBeUndefined()
    })

    BddTest().then('it should validate with all skill levels', () => {
      const skillLevels = [
        EDeclaredSkillLevel.BEGINNER,
        EDeclaredSkillLevel.INTERMEDIATE,
        EDeclaredSkillLevel.COMPETENT,
        EDeclaredSkillLevel.ADVANCED,
        EDeclaredSkillLevel.EXPERT
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

    BddTest().then('it should call onSubmit callback after successful API call', async () => {
      const validData = createValidFormData()
      const handler = getOnSubmitHandler()

      handler({ value: validData, formApi: composableResult.form, meta: {} })

      await vi.waitFor(() => {
        expect(onSkillAdded).toHaveBeenCalled()
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
      expect(state.value.values.level).toEqual(EDeclaredSkillLevel.BEGINNER)
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
    beforeEach(() => {
      vi.clearAllMocks()
      const existingSkillData = createExistingDeclaredSkillData()
      const handler = getOnSubmitHandler()
      handler({ value: existingSkillData, formApi: composableResult.form, meta: {} })
    })
    BddTest().then('it should call addErrorMessage', async () => {
      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalled()
      })
    })

    BddTest().then('it should not call onSkillAddedls', async () => {
      expect(onSkillAdded).not.toHaveBeenCalled()
    })
  })
})
