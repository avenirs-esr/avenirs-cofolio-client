import type { WriteAssessmentFormData } from '@/features/staff/assessments/types/forms.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { ASSESSMENT_DRAFT_STORAGE_KEY_PREFIX } from '@/features/staff/assessments/config'
import { useAssessmentDraft } from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/composables/use-assessment-draft/use-assessment-draft'

const DECLARED_ACTIVITY_ID = 'declared-activity-1'
const STORAGE_KEY = `${ASSESSMENT_DRAFT_STORAGE_KEY_PREFIX}-${DECLARED_ACTIVITY_ID}`

const draft: WriteAssessmentFormData = {
  grade: 15,
  validation: null,
  comment: 'Bon travail'
}

BddTest().given('an assessment draft', () => {
  let assessmentDraft: ReturnType<typeof useAssessmentDraft>

  beforeEach(() => {
    localStorage.clear()
    assessmentDraft = useAssessmentDraft(DECLARED_ACTIVITY_ID)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  BddTest().when('no draft has been saved', () => {
    BddTest().then('it should load nothing', () => {
      expect(assessmentDraft.loadDraft()).toBeUndefined()
    })
  })

  BddTest().when('a draft is saved', () => {
    let isSaved: boolean

    beforeEach(() => {
      isSaved = assessmentDraft.saveDraft(draft)
    })

    BddTest().then('it should report the save as successful', () => {
      expect(isSaved).toBe(true)
    })

    BddTest().then('it should store the draft under a key scoped to the declared activity', () => {
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '')).toEqual(draft)
    })

    BddTest().then('it should load the saved draft', () => {
      expect(assessmentDraft.loadDraft()).toEqual(draft)
    })

    BddTest().then('it should not load it for another declared activity', () => {
      expect(useAssessmentDraft('declared-activity-2').loadDraft()).toBeUndefined()
    })

    BddTest().and('the draft is cleared', () => {
      beforeEach(() => {
        assessmentDraft.clearDraft()
      })

      BddTest().then('it should remove the draft from the storage', () => {
        expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
        expect(assessmentDraft.loadDraft()).toBeUndefined()
      })
    })
  })

  BddTest().when('the stored draft has values of unexpected types', () => {
    beforeEach(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ grade: '12', validation: 'yes', comment: 3 }))
    })

    BddTest().then('it should load empty values instead', () => {
      expect(assessmentDraft.loadDraft()).toEqual({ grade: null, validation: null, comment: '' })
    })
  })

  BddTest().when('the stored draft is not a JSON object', () => {
    BddTest().then('it should load nothing for an invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, '{not json')
      expect(assessmentDraft.loadDraft()).toBeUndefined()
    })

    BddTest().then('it should load nothing for a JSON primitive', () => {
      localStorage.setItem(STORAGE_KEY, '42')
      expect(assessmentDraft.loadDraft()).toBeUndefined()
    })
  })

  BddTest().when('the browser storage is unavailable', () => {
    beforeEach(() => {
      const throwStorageError = () => {
        throw new Error('Storage unavailable')
      }
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(throwStorageError)
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(throwStorageError)
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(throwStorageError)
    })

    BddTest().then('it should report the save as failed', () => {
      expect(assessmentDraft.saveDraft(draft)).toBe(false)
    })

    BddTest().then('it should load nothing', () => {
      expect(assessmentDraft.loadDraft()).toBeUndefined()
    })

    BddTest().then('it should clear without throwing', () => {
      expect(() => assessmentDraft.clearDraft()).not.toThrow()
    })
  })
})
