export enum PageSizes {
  FOUR = 4,
  EIGHT = 8,
  TWELVE = 12
}

export const pageSizeValues = [
  PageSizes.FOUR,
  PageSizes.EIGHT,
  PageSizes.TWELVE
] as const satisfies readonly PageSizes[]
