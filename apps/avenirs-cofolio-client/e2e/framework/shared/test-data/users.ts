import process from 'node:process'

export enum DatasetType {
  FULL = '@dataset-full',
  NOMINAL = '@dataset-nominal',
  EMPTY = '@dataset-empty'
}

export interface UserDataset {
  token: string | null
  shouldIntercept: boolean
}

export const users: Record<DatasetType, UserDataset> = {
  [DatasetType.FULL]: {
    token: null,
    shouldIntercept: false
  },
  [DatasetType.NOMINAL]: {
    token: process.env.NOMINAL_DATASET_ACCESS_TOKEN ?? null,
    shouldIntercept: true
  },
  [DatasetType.EMPTY]: {
    token: process.env.EMPTY_DATASET_ACCESS_TOKEN ?? null,
    shouldIntercept: true
  }
}
