import type { ScopeNodeResponseType } from '@avenirs-esr/shared/api/avenir-esr'

export interface ActivityTarget {
  id: string
  title: string
  type: ScopeNodeResponseType
  isInstitution: boolean
  path: string[]
}
