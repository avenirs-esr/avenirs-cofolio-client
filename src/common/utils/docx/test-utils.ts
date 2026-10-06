import type { Document } from 'docx'

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

export function createParagraphMock (options?: Partial<MockParagraph>): MockParagraph {
  return {
    type: 'paragraph',
    heading: undefined,
    children: [],
    ...options,
  }
}

export function createTextRunMock (options?: Partial<MockTextRun>): MockTextRun {
  return {
    type: 'text-run',
    text: '',
    ...(typeof options === 'string' ? { text: options } : options),
  }
}

export function createImageRunMock (options?: Partial<MockImageRun>): MockImageRun {
  return {
    type: 'image-run',
    data: new ArrayBuffer(0),
    ...options,
  }
}

export function createExternalHyperlinkMock (options?: Partial<MockExternalHyperlink>): MockExternalHyperlink {
  return {
    type: 'external-hyperlink',
    children: [],
    link: '',
    ...options,
  }
}

export function createDocumentMock () {
  return {} as Document
}
