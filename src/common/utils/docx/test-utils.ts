export interface MockTextRun {
  type: 'text-run'
  text: string
}

export interface MockImageRun {
  type: 'image-run'
  data: ArrayBuffer
  floating?: { horizontalPosition: { offset: number }, verticalPosition: { offset: number } }
}

export interface MockExternalHyperlink {
  type: 'external-hyperlink'
  children: MockTextRun[]
  link: string
}

export enum MockHeadingLevel {
  HEADING_1 = 'Heading1',
  HEADING_2 = 'Heading2'
}

export interface MockParagraph {
  type: 'paragraph'
  children: (MockTextRun | MockImageRun | MockExternalHyperlink)[]
  heading?: MockHeadingLevel
}
