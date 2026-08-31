import type { FeedbackAssociatedElement } from '@/features/feedbacks/types/feedback.types'
import { createMockedDeclaredSkillAssociations } from '@/__mocks__/fixtures/student/declaredSkills.fixtures'
import { mockedTraceDetailedWithFile, mockedTraceDetailedWithLink } from '@/__mocks__/fixtures/student/traces.fixtures'
import { EAssociationContextType } from '@/api/avenir-esr'
import { isFeedbackTraceWithFile, isFeedbackTraceWithLink } from '@/features/activities/utils/feedback.types-guard'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'

const mockedFeedbackTraceWithFile: FeedbackAssociatedElement = {
  type: EAssociationContextType.TRACE,
  data: mockedTraceDetailedWithFile,
}

const mockedFeedbackTraceWithLink: FeedbackAssociatedElement = {
  type: EAssociationContextType.TRACE,
  data: mockedTraceDetailedWithLink,
}

const mockedFeedbackDeclaredSkill: FeedbackAssociatedElement = {
  type: EAssociationContextType.DECLARED_SKILL,
  data: createMockedDeclaredSkillAssociations(1)[0].declaredSkill,
}

BddTest().given('feedback associated element type guards', () => {
  BddTest().when('the element is a TRACE with a file attachment', () => {
    BddTest().then('isFeedbackTraceWithFile should return true', () => {
      expect(isFeedbackTraceWithFile(mockedFeedbackTraceWithFile)).toBe(true)
    })
    BddTest().then('isFeedbackTraceWithLink should return false', () => {
      expect(isFeedbackTraceWithLink(mockedFeedbackTraceWithFile)).toBe(false)
    })
  })
  BddTest().when('the element is a TRACE with a link', () => {
    BddTest().then('isFeedbackTraceWithFile should return false', () => {
      expect(isFeedbackTraceWithFile(mockedFeedbackTraceWithLink)).toBe(false)
    })
    BddTest().then('isFeedbackTraceWithLink should return true', () => {
      expect(isFeedbackTraceWithLink(mockedFeedbackTraceWithLink)).toBe(true)
    })
  })
  BddTest().when('the element is a DECLARED_SKILL', () => {
    BddTest().then('isFeedbackTraceWithFile should return false', () => {
      expect(isFeedbackTraceWithFile(mockedFeedbackDeclaredSkill)).toBe(false)
    })
    BddTest().then('isFeedbackTraceWithLink should return false', () => {
      expect(isFeedbackTraceWithLink(mockedFeedbackDeclaredSkill)).toBe(false)
    })
  })
})
