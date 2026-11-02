import type { MaybeRefOrGetter } from 'vue'
import type { WriteAssessmentFormData } from '@/features/staff/assessments/types/forms.types'
import { toValue } from 'vue'
import { ASSESSMENT_DRAFT_STORAGE_KEY_PREFIX } from '@/features/staff/assessments/config'

function parseDraft (rawDraft: string | null): WriteAssessmentFormData | undefined {
  if (!rawDraft) {
    return undefined
  }

  const draft = JSON.parse(rawDraft)
  if (!draft || typeof draft !== 'object') {
    return undefined
  }

  return {
    grade: typeof draft.grade === 'number' ? draft.grade : null,
    validation: typeof draft.validation === 'boolean' ? draft.validation : null,
    comment: typeof draft.comment === 'string' ? draft.comment : '',
  }
}

/**
 * Keeps the assessment being written in the browser storage, so the staff gets it back
 * after leaving the page or closing the browser. The storage may be unavailable
 * (private browsing, quota exceeded): every access is guarded and reports its outcome.
 * @param declaredActivityId Id of the declared activity being assessed, used to scope the draft.
 * @returns Functions to load, save and clear the draft of this declared activity.
 */
export function useAssessmentDraft (declaredActivityId: MaybeRefOrGetter<string>) {
  const storageKey = computed(() => `${ASSESSMENT_DRAFT_STORAGE_KEY_PREFIX}-${toValue(declaredActivityId)}`)

  function loadDraft (): WriteAssessmentFormData | undefined {
    try {
      return parseDraft(localStorage.getItem(storageKey.value))
    }
    catch {
      return undefined
    }
  }

  function saveDraft (draft: WriteAssessmentFormData): boolean {
    try {
      localStorage.setItem(storageKey.value, JSON.stringify(draft))
      return true
    }
    catch {
      return false
    }
  }

  function clearDraft () {
    try {
      localStorage.removeItem(storageKey.value)
    }
    catch {
      // Nothing to clear when the storage is unavailable
    }
  }

  return {
    loadDraft,
    saveDraft,
    clearDraft
  }
}
