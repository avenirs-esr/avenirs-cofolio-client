import type { FileDTO } from '@avenirs-esr/shared/api/avenir-esr'

export enum ActivityResourceType {
  FILE = 'file',
  LINK = 'link',
}

export type ActivityResource = string | File | FileDTO
