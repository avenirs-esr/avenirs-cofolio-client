import type { EDeclaredSkillLevel } from '@/api/avenir-esr'
import { createMockedDeclaredSkillProgressDetailsDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import * as queries from '@/features/student/declaredSkills/queries/use-declared-skills.query/use-declared-skills.query'
import { useUpdateDeclaredSkillForm } from '@/features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/components/use-update-declared-skill-form/use-update-declared-skill-form'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('the useUpdateDeclaredSkillForm composable', () => {
  let result: ReturnType<typeof useUpdateDeclaredSkillForm>
  let onSkillUpdated: ReturnType<typeof vi.fn>
  let useMutationSpy = vi.spyOn(queries, 'useUpdateDeclaredSkillMutation')

  const mockedDeclaredSkillProgressDetails = createMockedDeclaredSkillProgressDetailsDTO('1234')
  const mountForm = () =>
    mountComposable(
      () => useUpdateDeclaredSkillForm(mockedDeclaredSkillProgressDetails, onSkillUpdated),
      { useI18n: true, usePinia: true, useTanstack: true }
    ).result

  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()

    useMutationSpy = vi
      .spyOn(queries, 'useUpdateDeclaredSkillMutation')
      .mockReturnValue({
        mutate: vi.fn(),
        isPending: ref(false),
      } as unknown as ReturnType<typeof queries.useUpdateDeclaredSkillMutation>)
    onSkillUpdated = vi.fn()
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
      expect(values.description).toBe((mockedDeclaredSkillProgressDetails.description ?? '').slice(0, 400))
    })

    BddTest().then('it should have submit validators configured', async () => {
      const validation = await result.form.validate('submit')
      expect(validation).toBeDefined()
    })
  })

  BddTest().when('the form is submitted with valid data', () => {
    BddTest().then('it should call the update mutation with the full DTO payload', async () => {
      const mutate = vi.fn()

      useMutationSpy.mockReturnValue({
        mutate,
        isPending: ref(false),
      } as unknown as ReturnType<typeof queries.useUpdateDeclaredSkillMutation>)

      result = mountForm()
      await result.form.handleSubmit()

      expect(mutate).toHaveBeenCalledTimes(1)
      const payload = (mutate.mock.calls[0] as [unknown])[0]
      expect(payload).toEqual({
        ...mockedDeclaredSkillProgressDetails,
        description: (mockedDeclaredSkillProgressDetails.description ?? '').slice(0, 400),
      })
    })
  })

  BddTest().when('the form is submitted with invalid data', () => {
    BddTest().then('it should set validation errors for level and description', async () => {
      result.form.setFieldValue('level', undefined as unknown as EDeclaredSkillLevel)
      result.form.setFieldValue('description', 'a'.repeat(500))

      const validation = await result.form.validate('submit')

      expect(validation.level?.onSubmit).toBeDefined()
      expect(validation.description?.onSubmit).toBeDefined()
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
