import type { Mock } from 'vitest'
import type { DeclaredActivityAssessmentDetailsDTO, DeclaredActivityAssessmentRequest } from '@/api/avenir-esr'
import type { WriteAssessmentFormData } from '@/features/staff/assessments/types/forms.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { http, HttpResponse } from 'msw'
import { mountComposable } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import {
  mockedAssessmentDetailsCommentOnly,
  mockedAssessmentDetailsSent,
  mockedAssessmentDetailsWithAssociations,
  mockedAssessmentDetailsWithoutAssociations
} from '@/__mocks__/fixtures/staffs/assessments.fixtures'
import { server } from '@/__mocks__/msw/server'
import { getSendAssessmentUrl } from '@/api/avenir-esr'
import { HttpStatusCode } from '@/common/utils/http/http-status'
import { ASSESSMENT_DRAFT_STORAGE_KEY_PREFIX } from '@/features/staff/assessments/config'
import { useWriteAssessmentForm } from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/composables/use-write-assessment-form/use-write-assessment-form'

const { addErrorMessageMock, addSuccessMessageMock } = vi.hoisted(() => ({
  addErrorMessageMock: vi.fn(),
  addSuccessMessageMock: vi.fn()
}))

vi.mock('@/store', async () => {
  const actual = await vi.importActual<typeof import('@/store')>('@/store')
  return {
    ...actual,
    useToasterStore: vi.fn(() => ({
      addErrorMessage: addErrorMessageMock,
      addSuccessMessage: addSuccessMessageMock
    }))
  }
})

const SEND_SUCCESS_MESSAGE = 'L\'appréciation a été envoyée avec succès'
const SEND_ERROR_TITLE = 'Une erreur est survenue lors de l\'envoi de l\'appréciation'

const gradedAssessment = mockedAssessmentDetailsWithAssociations
const validatedAssessment = mockedAssessmentDetailsWithoutAssociations
const commentOnlyAssessment = mockedAssessmentDetailsCommentOnly

function getStorageKey (assessment: DeclaredActivityAssessmentDetailsDTO) {
  return `${ASSESSMENT_DRAFT_STORAGE_KEY_PREFIX}-${assessment.declaredActivityId}`
}

function getStoredDraft (assessment: DeclaredActivityAssessmentDetailsDTO) {
  const draft = localStorage.getItem(getStorageKey(assessment))
  return draft ? JSON.parse(draft) : null
}

function storeDraft (assessment: DeclaredActivityAssessmentDetailsDTO, draft: WriteAssessmentFormData) {
  return localStorage.setItem(getStorageKey(assessment), JSON.stringify(draft))
}

BddTest().given('a write assessment form', () => {
  let composableResult: ReturnType<typeof useWriteAssessmentForm>
  let mockOnAssessmentSent: Mock<() => void>
  let sentRequests: DeclaredActivityAssessmentRequest[]

  const mountForm = async (assessment: DeclaredActivityAssessmentDetailsDTO) => {
    composableResult = mountComposable(
      () => useWriteAssessmentForm({ assessment: ref(assessment), onAssessmentSent: mockOnAssessmentSent }),
      { useI18n: true, useTanstack: true, usePinia: true }
    ).result
    await flushPromises()
  }

  const fillForm = async (values: Partial<WriteAssessmentFormData>) => {
    Object.entries(values).forEach(([field, value]) => {
      composableResult.form.setFieldValue(field as keyof WriteAssessmentFormData, value as never)
    })
    await flushPromises()
  }

  const submitForm = async () => {
    await composableResult.form.handleSubmit()
    await flushPromises()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    mockOnAssessmentSent = vi.fn()
    sentRequests = []
    server.use(
      http.put(`*${getSendAssessmentUrl(':declaredActivityId')}`, async ({ request }) => {
        sentRequests.push(await request.json() as DeclaredActivityAssessmentRequest)
        return new HttpResponse(null, { status: HttpStatusCode.NO_CONTENT })
      })
    )
  })

  afterEach(() => {
    localStorage.clear()
  })

  BddTest().when('the activity expects a grade and a comment, without any draft', () => {
    beforeEach(async () => {
      await mountForm(gradedAssessment)
    })

    BddTest().then('it should expose the enabled fields of the activity assessment setup', () => {
      expect(composableResult.maxGrade.value).toBe(20)
      expect(composableResult.isGradeEnabled.value).toBe(true)
      expect(composableResult.isValidationEnabled.value).toBe(false)
      expect(composableResult.isCommentEnabled.value).toBe(true)
    })

    BddTest().then('it should make the comment optional', () => {
      expect(composableResult.isCommentRequired.value).toBe(false)
    })

    BddTest().then('it should start with empty values and an incomplete, unsent assessment', () => {
      expect(composableResult.form.state.values).toEqual({ grade: null, validation: null, comment: '' })
      expect(composableResult.isComplete.value).toBe(false)
      expect(composableResult.isSent.value).toBe(false)
      expect(composableResult.isDraftSaved.value).toBeUndefined()
    })

    BddTest().and('the staff writes a grade', () => {
      beforeEach(async () => {
        await fillForm({ grade: 15 })
      })

      BddTest().then('it should save the draft in the browser storage', () => {
        expect(getStoredDraft(gradedAssessment)).toEqual({ grade: 15, validation: null, comment: '' })
        expect(composableResult.isDraftSaved.value).toBe(true)
      })

      BddTest().then('it should be complete without the optional comment', () => {
        expect(composableResult.isComplete.value).toBe(true)
      })

      BddTest().and('the assessment is submitted', () => {
        beforeEach(async () => {
          await submitForm()
        })

        BddTest().then('it should send the grade without any comment', () => {
          expect(sentRequests).toEqual([{ grade: 15 }])
        })
      })

      BddTest().and('then erases it', () => {
        beforeEach(async () => {
          await fillForm({ grade: null })
        })

        BddTest().then('it should remove the empty draft from the browser storage', () => {
          expect(getStoredDraft(gradedAssessment)).toBeNull()
          expect(composableResult.isDraftSaved.value).toBeUndefined()
        })
      })
    })

    BddTest().and('the staff writes a grade and a comment', () => {
      beforeEach(async () => {
        await fillForm({ grade: 15, comment: 'Bon travail' })
      })

      BddTest().then('it should be complete', () => {
        expect(composableResult.isComplete.value).toBe(true)
      })

      BddTest().and('the assessment is submitted', () => {
        beforeEach(async () => {
          await submitForm()
        })

        BddTest().then('it should send only the enabled fields', () => {
          expect(sentRequests).toEqual([{ grade: 15, comment: 'Bon travail' }])
        })

        BddTest().then('it should clear the draft from the browser storage', () => {
          expect(getStoredDraft(gradedAssessment)).toBeNull()
          expect(composableResult.isDraftSaved.value).toBeUndefined()
        })

        BddTest().then('it should show a success message and notify the assessment is sent', () => {
          expect(addSuccessMessageMock).toHaveBeenCalledWith(SEND_SUCCESS_MESSAGE)
          expect(mockOnAssessmentSent).toHaveBeenCalledTimes(1)
        })
      })
    })

    BddTest().and('the staff writes a grade out of the grading scale', () => {
      BddTest().then('it should be incomplete for a grade above the scale', async () => {
        await fillForm({ grade: 21, comment: 'Bon travail' })
        expect(composableResult.isComplete.value).toBe(false)
      })

      BddTest().then('it should be incomplete for a decimal grade', async () => {
        await fillForm({ grade: 12.5, comment: 'Bon travail' })
        expect(composableResult.isComplete.value).toBe(false)
      })
    })

    BddTest().and('an assessment without grade is submitted', () => {
      beforeEach(async () => {
        await fillForm({ comment: 'Bon travail' })
        await submitForm()
      })

      BddTest().then('it should not send it', () => {
        expect(sentRequests).toHaveLength(0)
        expect(mockOnAssessmentSent).not.toHaveBeenCalled()
      })

      BddTest().then('it should keep the draft', () => {
        expect(getStoredDraft(gradedAssessment)).toEqual({ grade: null, validation: null, comment: 'Bon travail' })
      })
    })
  })

  BddTest().when('the activity expects a validation and a comment', () => {
    beforeEach(async () => {
      await mountForm(validatedAssessment)
    })

    BddTest().then('it should make the comment optional', () => {
      expect(composableResult.isCommentRequired.value).toBe(false)
    })

    BddTest().and('the staff only chooses the validation', () => {
      beforeEach(async () => {
        await fillForm({ validation: false })
      })

      BddTest().then('it should be complete', () => {
        expect(composableResult.isComplete.value).toBe(true)
      })
    })

    BddTest().and('the staff chooses the validation and writes a comment', () => {
      beforeEach(async () => {
        await fillForm({ validation: false, comment: '  À retravailler  ' })
        await submitForm()
      })

      BddTest().then('it should send the validation and the trimmed comment', () => {
        expect(sentRequests).toEqual([{ validation: false, comment: 'À retravailler' }])
      })
    })
  })

  BddTest().when('the comment is the only option expected by the activity', () => {
    beforeEach(async () => {
      await mountForm(commentOnlyAssessment)
    })

    BddTest().then('it should make the comment required', () => {
      expect(composableResult.isCommentRequired.value).toBe(true)
    })

    BddTest().then('it should be incomplete without a comment', async () => {
      expect(composableResult.isComplete.value).toBe(false)

      await fillForm({ comment: '   ' })
      expect(composableResult.isComplete.value).toBe(false)
    })

    BddTest().and('an assessment without comment is submitted', () => {
      beforeEach(async () => {
        await submitForm()
      })

      BddTest().then('it should not send it', () => {
        expect(sentRequests).toHaveLength(0)
        expect(mockOnAssessmentSent).not.toHaveBeenCalled()
      })
    })

    BddTest().and('the staff writes a comment', () => {
      beforeEach(async () => {
        await fillForm({ comment: 'Bon travail' })
        await submitForm()
      })

      BddTest().then('it should send the comment only', () => {
        expect(sentRequests).toEqual([{ comment: 'Bon travail' }])
      })
    })
  })

  BddTest().when('a draft was saved before the form is mounted', () => {
    const draft: WriteAssessmentFormData = { grade: 12, validation: null, comment: 'Brouillon en cours' }

    beforeEach(async () => {
      storeDraft(gradedAssessment, draft)
      await mountForm(gradedAssessment)
    })

    BddTest().then('it should restore the draft', () => {
      expect(composableResult.form.state.values).toEqual(draft)
      expect(composableResult.isDraftSaved.value).toBe(true)
      expect(composableResult.isComplete.value).toBe(true)
    })
  })

  BddTest().when('the assessment has already been sent', () => {
    beforeEach(async () => {
      storeDraft(mockedAssessmentDetailsSent, { grade: 3, validation: null, comment: 'Ancien brouillon' })
      await mountForm(mockedAssessmentDetailsSent)
    })

    BddTest().then('it should show the sent values instead of any draft', () => {
      expect(composableResult.isSent.value).toBe(true)
      expect(composableResult.form.state.values).toEqual({
        grade: mockedAssessmentDetailsSent.assessment?.grade,
        validation: null,
        comment: mockedAssessmentDetailsSent.assessment?.comment
      })
      expect(composableResult.isDraftSaved.value).toBeUndefined()
    })

    BddTest().then('it should not save changes as a draft', async () => {
      localStorage.clear()
      await fillForm({ grade: 10 })
      expect(getStoredDraft(mockedAssessmentDetailsSent)).toBeNull()
    })
  })

  BddTest().when('the assessment cannot be sent', () => {
    const invalidAssessment: DeclaredActivityAssessmentDetailsDTO = {
      ...gradedAssessment,
      declaredActivityId: 'INVALID_DECLARED_ACTIVITY_ID'
    }

    beforeEach(async () => {
      server.use(
        http.put(`*${getSendAssessmentUrl(':declaredActivityId')}`, () => HttpResponse.json(
          { message: 'Activité déclarée non trouvée', code: 'DECLARED_ACTIVITY_NOT_FOUND' },
          { status: HttpStatusCode.NOT_FOUND }
        ))
      )
      await mountForm(invalidAssessment)
      await fillForm({ grade: 15, comment: 'Bon travail' })
      await submitForm()
    })

    BddTest().then('it should show an error message', () => {
      expect(addErrorMessageMock).toHaveBeenCalledWith(expect.objectContaining({ title: SEND_ERROR_TITLE }))
    })

    BddTest().then('it should keep the draft and not notify the assessment is sent', () => {
      expect(getStoredDraft(invalidAssessment)).toEqual({ grade: 15, validation: null, comment: 'Bon travail' })
      expect(mockOnAssessmentSent).not.toHaveBeenCalled()
      expect(addSuccessMessageMock).not.toHaveBeenCalled()
    })
  })
})
