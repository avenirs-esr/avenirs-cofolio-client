import type { ActivityTarget } from '@/features/staff/activities/types/activity-targets.types'
import { type ScopeNodeResponse, ScopeNodeResponseType, type StaffScopeResponse } from '@/api/avenir-esr'

const TARGET_TYPES_ORDER: ScopeNodeResponseType[] = [
  ScopeNodeResponseType.PRIMARY,
  ScopeNodeResponseType.SECONDARY,
  ScopeNodeResponseType.PROGRAM,
  ScopeNodeResponseType.PROGRAM_OPTION,
  ScopeNodeResponseType.STUDENT_GROUP,
]

export function isInstitutionTargetType (type: ScopeNodeResponseType): boolean {
  return type === ScopeNodeResponseType.PRIMARY || type === ScopeNodeResponseType.SECONDARY
}

function flattenScopeNodes (nodes: ScopeNodeResponse[], path: string[] = []): ActivityTarget[] {
  return nodes.flatMap(({ id, title, type, children }) => [
    { id, title, type, isInstitution: isInstitutionTargetType(type), path },
    ...flattenScopeNodes(children, [...path, title]),
  ])
}

export function scopeToActivityTargets (scope?: StaffScopeResponse): ActivityTarget[] {
  return flattenScopeNodes([...(scope?.institutions ?? []), ...(scope?.groups ?? [])])
    .sort((a, b) => TARGET_TYPES_ORDER.indexOf(a.type) - TARGET_TYPES_ORDER.indexOf(b.type))
}
