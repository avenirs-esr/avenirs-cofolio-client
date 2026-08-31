import type { EActivityStatus, EActivityThematic } from '@/api/avenir-esr'

export interface ActivityTableRow {
  id: string
  owner: string
  status: EActivityStatus
  thematic: EActivityThematic
  title: string
  updatedAt: string
  actions?: string
}
