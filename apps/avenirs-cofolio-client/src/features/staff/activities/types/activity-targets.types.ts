import type { ScopeNodeResponseType } from '@/api/avenir-esr'

export interface ActivityTarget {
  id: string
  title: string
  type: ScopeNodeResponseType
  isInstitution: boolean
  path: string[]
}
