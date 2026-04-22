import { createMockedDeclaredSkillProgressDetailsDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import { EDeclaredSkillLevel } from '@/api/avenir-esr'
import { DECLARED_SKILL_REFLECTION_MAX_LENGTH } from '@/features/student/declaredSkills/config'
import { useUpdateDeclaredSkillForm } from '@/features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/components/use-update-declared-skill-form/use-update-declared-skill-form'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const onSkillUpdated = vi.fn()
const addSuccessMessage = vi.fn()
const addErrorMessage = vi.fn()

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addSuccessMessage,
      addErrorMessage
    })
  }
})

BddTest().given('the useUpdateDeclaredSkillForm composable', () => {
  let result: ReturnType<typeof useUpdateDeclaredSkillForm>

  const mockedDeclaredSkillProgressDetails = createMockedDeclaredSkillProgressDetailsDTO('1234')
  const mountForm = (id?: string) =>
    mountComposable(
      () => useUpdateDeclaredSkillForm({
        ...mockedDeclaredSkillProgressDetails,
        id: id ?? mockedDeclaredSkillProgressDetails.id
      }, onSkillUpdated),
      { useI18n: true, usePinia: true, useTanstack: true }
    ).result

  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()

    result = mountForm()
  })

  BddTest().when('the form is initialized', () => {
    BddTest().then('it should expose form, isFormValid and isSubmitting', () => {
      expect(result.form).toBeDefined()
      expect(result.isFormValid).toBeDefined()
      expect(result.isSubmitting).toBeDefined()
    })

    BddTest().then('it should initialize default values from the DTO', () => {
      const values = result.form.state.values
      expect(values.id).toBe(mockedDeclaredSkillProgressDetails.id)
      expect(values.title).toBe(mockedDeclaredSkillProgressDetails.title)
      expect(values.type).toBe(mockedDeclaredSkillProgressDetails.type)
      expect(values.level).toBe(mockedDeclaredSkillProgressDetails.level)
      expect(values.pathSegments).toEqual(mockedDeclaredSkillProgressDetails.pathSegments)
      expect(values.reflection).toBe((mockedDeclaredSkillProgressDetails.reflection ?? '').slice(0, DECLARED_SKILL_REFLECTION_MAX_LENGTH))
    })

    BddTest().then('it should have submit validators configured', async () => {
      const validation = await result.form.validate('submit')
      expect(validation).toBeDefined()
    })
  })

  BddTest().when('the form is submitted with valid data', () => {
    beforeEach(async () => {
      result.form.setFieldValue('level', EDeclaredSkillLevel.COMPETENT)
      result.form.setFieldValue('reflection', 'This is my reflection')
      await result.form.handleSubmit()
    })

    BddTest().then('it should call the success methods', async () => {
      await vi.waitFor(() => {
        expect(onSkillUpdated).toHaveBeenCalled()
        expect(addSuccessMessage).toHaveBeenCalled()
      })
    })

    BddTest().then('it should not call the error method', () => {
      expect(addErrorMessage).not.toHaveBeenCalled()
    })

    BddTest().when('the form is submitted with invalid data', () => {
      BddTest().then('it should set validation errors for level and reflection', async () => {
        result.form.setFieldValue('level', undefined as unknown as EDeclaredSkillLevel)
        result.form.setFieldValue('reflection', 'a'.repeat(DECLARED_SKILL_REFLECTION_MAX_LENGTH + 1))

        const validation = await result.form.validate('submit')

        expect(validation.level?.onSubmit).toBeDefined()
        expect(validation.reflection?.onSubmit).toBeDefined()
      })
    })

    BddTest().when('form validity is computed', () => {
      BddTest().then('it should be false after a failing submit', async () => {
        result.form.setFieldValue('level', undefined as unknown as EDeclaredSkillLevel)
        await result.form.validate('submit')
        expect(result.isFormValid.value).toBe(false)
      })

      BddTest().then('it should be true with valid values', () => {
        expect(result.isFormValid.value).toBe(true)
      })
    })
  })

  BddTest().and('an invalid declaredSkillProgressId is used', () => {
    beforeEach(() => {
      vi.resetModules()
      vi.clearAllMocks()

      result = mountForm('INVALID_DECLARED_SKILL_ID')
    })

    BddTest().when('the form is submitted with valid data', () => {
      beforeEach(async () => {
        result.form.setFieldValue('level', EDeclaredSkillLevel.COMPETENT)
        result.form.setFieldValue('reflection', 'This is my reflection')
        await result.form.handleSubmit()
      })

      BddTest().then('it should not call the success methods', async () => {
        expect(onSkillUpdated).not.toHaveBeenCalled()
        expect(addSuccessMessage).not.toHaveBeenCalled()
      })

      BddTest().then('it should call the error method', async () => {
        await vi.waitFor(() => expect(addErrorMessage).toHaveBeenCalled())
      })
    })
  })
})
