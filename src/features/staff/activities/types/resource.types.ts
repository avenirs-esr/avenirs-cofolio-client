export enum ActivityResourceType {
  FILE = 'file',
  LINK = 'link',
}

export interface ActivityResourceBase {
  title: string
}

export interface ActivityResourceFile extends ActivityResourceBase {
  type: ActivityResourceType.FILE
  fileId: string
}

export interface ActivityResourceLink extends ActivityResourceBase {
  type: ActivityResourceType.LINK
  url: string
}

export type ActivityResource = | ActivityResourceFile | ActivityResourceLink
