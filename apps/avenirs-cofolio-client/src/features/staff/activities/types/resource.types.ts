import type { FileDTO } from '@/api/avenir-esr'

export enum ActivityResourceType {
  FILE = 'file',
  LINK = 'link',
}

export type ActivityResource = string | File | FileDTO
