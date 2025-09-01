import type { AdditionalSkillFormData } from '@/features/student/views/StudentProjectSkillsView/components/AddAdditionalSkillDrawer/types'
import { AddAdditionalSkillDTOLevel } from '@/api/avenir-esr'
import { mountComposable } from '@/ui/tests/utils'
import { vi } from 'vitest'
import { useAdditionalSkillForm } from './use-additional-skill-form'

describe('useAdditionalSkillForm', () => {
  describe('given the useAdditionalSkillForm composable', () => {
    let composableResult: ReturnType<typeof useAdditionalSkillForm>
    let mockOnSubmit: ReturnType<typeof vi.fn>

    beforeEach(() => {
      mockOnSubmit = vi.fn()

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

    describe('when the composable is initialized', () => {
      it('then it should return a form instance', () => {
        expect(composableResult.form).toBeDefined()
        expect(typeof composableResult.form.useStore).toBe('function')
      })

      it('then it should return isFormValid computed property', () => {
        expect(composableResult.isFormValid).toBeDefined()
        expect(composableResult.isFormValid.value).toBe(true)
      })
    })

    describe('when form is validated with invalid data', () => {
      it('then it should return validation errors for missing selectedSkills', () => {
        const invalidData: AdditionalSkillFormData = {
          selectedSkills: [],
          level: undefined
        }

        const onSubmitValidator = composableResult.form.options.validators?.onSubmit
        expect(onSubmitValidator).toBeDefined()

        const validationResult = onSubmitValidator!({ value: invalidData })

        expect(validationResult?.fields?.selectedSkills).toEqual('Une compétence doit être sélectionnée')
      })
    })

    describe('when form is validated with valid data', () => {
      it('then it should return no validation errors', () => {
        const validData: AdditionalSkillFormData = {
          selectedSkills: [{
            id: '1',
            label: 'Test Skill',
            value: '1',
            title: 'Test Skill',
            pathSegments: ['Test', 'Path'],
            type: 'ROME 4.0',
          }],
          level: AddAdditionalSkillDTOLevel.INTERMEDIATE
        }

        const onSubmitValidator = composableResult.form.options.validators?.onSubmit
        expect(onSubmitValidator).toBeDefined()

        const validationResult = onSubmitValidator!({ value: validData })

        expect(validationResult?.fields?.selectedSkills).toBeUndefined()
      })
    })

    describe('when form is submitted', () => {
      it('then it should have onSubmit function defined', () => {
        expect(composableResult.form.options.onSubmit).toBeDefined()
        expect(typeof composableResult.form.options.onSubmit).toBe('function')
      })

      it('then it should call the provided onSubmit callback', () => {
        const validData: AdditionalSkillFormData = {
          selectedSkills: [{
            id: '1',
            label: 'Test Skill',
            value: '1',
            title: 'Test Skill',
            pathSegments: ['Test', 'Path'],
            type: 'ROME 4.0',
          }],
          level: AddAdditionalSkillDTOLevel.INTERMEDIATE
        }

        const onSubmit = composableResult.form.options.onSubmit
        expect(onSubmit).toBeDefined()
        onSubmit!({ value: validData, formApi: composableResult.form, meta: {} })

        expect(mockOnSubmit).toHaveBeenCalled()
      })
    })

    describe('when isFormValid is computed', () => {
      it('then it should return true initially when form is valid', () => {
        expect(composableResult.isFormValid.value).toBe(true)
      })
    })
  })
})
