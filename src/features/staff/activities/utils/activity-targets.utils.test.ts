import {
  mockedDevProgramOptionNode,
  mockedDevStudentGroupNode,
  mockedPrimaryInstitutionNode,
  mockedProgramNode,
  mockedProgramStudentGroupNode,
  mockedSecondaryInstitutionNode,
  mockedStaffScope,
} from '@/__mocks__/fixtures/staffs/staff-scope.fixtures'
import { ScopeNodeResponseType } from '@/api/avenir-esr'
import { isInstitutionTargetType, scopeToActivityTargets } from '@/features/staff/activities/utils/activity-targets.utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'

BddTest().given('activity targets utils', () => {
  BddTest().when('the staff scope is converted to targets', () => {
    BddTest().then('scopeToActivityTargets should flatten both hierarchies sorted by type', () => {
      expect(scopeToActivityTargets(mockedStaffScope).map(({ id, type }) => ({ id, type }))).toEqual([
        { id: mockedPrimaryInstitutionNode.id, type: ScopeNodeResponseType.PRIMARY },
        { id: mockedSecondaryInstitutionNode.id, type: ScopeNodeResponseType.SECONDARY },
        { id: mockedProgramNode.id, type: ScopeNodeResponseType.PROGRAM },
        { id: mockedDevProgramOptionNode.id, type: ScopeNodeResponseType.PROGRAM_OPTION },
        { id: mockedDevStudentGroupNode.id, type: ScopeNodeResponseType.STUDENT_GROUP },
        { id: mockedProgramStudentGroupNode.id, type: ScopeNodeResponseType.STUDENT_GROUP },
      ])
    })

    BddTest().then('scopeToActivityTargets should keep the ancestors path of each target', () => {
      expect(scopeToActivityTargets(mockedStaffScope).map(({ path }) => path)).toEqual([
        [],
        ['Université de Nantes'],
        [],
        ['BUT Informatique'],
        ['BUT Informatique', 'Développement'],
        ['BUT Informatique'],
      ])
    })
  })

  BddTest().when('the staff scope is empty', () => {
    BddTest().then('scopeToActivityTargets should return no target', () => {
      expect(scopeToActivityTargets({ institutions: [], groups: [] })).toEqual([])
    })
  })

  BddTest().when('the staff scope is not available', () => {
    BddTest().then('scopeToActivityTargets should return no target', () => {
      expect(scopeToActivityTargets(undefined)).toEqual([])
    })
  })

  BddTest().when('the target type is PRIMARY or SECONDARY', () => {
    BddTest().then('isInstitutionTargetType should return true', () => {
      expect(isInstitutionTargetType(ScopeNodeResponseType.PRIMARY)).toBe(true)
      expect(isInstitutionTargetType(ScopeNodeResponseType.SECONDARY)).toBe(true)
    })
  })

  BddTest().when('the target type is PROGRAM, PROGRAM_OPTION or STUDENT_GROUP', () => {
    BddTest().then('isInstitutionTargetType should return false', () => {
      expect(isInstitutionTargetType(ScopeNodeResponseType.PROGRAM)).toBe(false)
      expect(isInstitutionTargetType(ScopeNodeResponseType.PROGRAM_OPTION)).toBe(false)
      expect(isInstitutionTargetType(ScopeNodeResponseType.STUDENT_GROUP)).toBe(false)
    })
  })
})
