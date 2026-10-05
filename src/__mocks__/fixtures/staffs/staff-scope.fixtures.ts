import { type ScopeNodeResponse, ScopeNodeResponseType, type StaffScopeResponse } from '@/api/avenir-esr'

export const mockedSecondaryInstitutionNode: ScopeNodeResponse = {
  id: 'secondary-institution-id',
  title: 'IUT de Nantes',
  type: ScopeNodeResponseType.SECONDARY,
  children: [],
}

export const mockedPrimaryInstitutionNode: ScopeNodeResponse = {
  id: 'primary-institution-id',
  title: 'Université de Nantes',
  type: ScopeNodeResponseType.PRIMARY,
  children: [mockedSecondaryInstitutionNode],
}

export const mockedDevStudentGroupNode: ScopeNodeResponse = {
  id: 'dev-student-group-id',
  title: 'Groupe DEV-A',
  type: ScopeNodeResponseType.STUDENT_GROUP,
  children: [],
}

export const mockedDevProgramOptionNode: ScopeNodeResponse = {
  id: 'dev-program-option-id',
  title: 'Développement',
  type: ScopeNodeResponseType.PROGRAM_OPTION,
  children: [mockedDevStudentGroupNode],
}

export const mockedProgramStudentGroupNode: ScopeNodeResponse = {
  id: 'program-student-group-id',
  title: 'Groupe BUT-ALL',
  type: ScopeNodeResponseType.STUDENT_GROUP,
  children: [],
}

export const mockedProgramNode: ScopeNodeResponse = {
  id: 'program-id',
  title: 'BUT Informatique',
  type: ScopeNodeResponseType.PROGRAM,
  children: [mockedDevProgramOptionNode, mockedProgramStudentGroupNode],
}

export const mockedStaffScope: StaffScopeResponse = {
  institutions: [mockedPrimaryInstitutionNode],
  groups: [mockedProgramNode],
}

export const mockedOutOfScopeTargetId = 'out-of-scope-target-id'
