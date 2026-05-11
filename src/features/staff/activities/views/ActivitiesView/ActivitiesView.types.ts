import type { EActivityThematic } from '@/api/avenir-esr'

export interface ActivityTableRow {
  id: string
  owner: string
  status: string
  thematic: EActivityThematic
  title: string
  updatedAt: string
}
