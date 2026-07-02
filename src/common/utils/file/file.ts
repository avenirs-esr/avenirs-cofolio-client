import { EFileType } from '@/api/avenir-esr'

export function bytesToMegabytes (bytes: number): number {
  return Math.round((bytes / 1024 / 1024) * 100) / 100
}

export function getFileExtension (fileName: string): string {
  const dot = fileName.lastIndexOf('.')
  return dot > 0 ? fileName.slice(dot) : ''
}

export function stripExtension (fileName: string): string {
  const dot = fileName.lastIndexOf('.')
  return dot > 0 ? fileName.slice(0, dot) : fileName
}

export function renameFile (file: File, newName: string): File {
  return new File([file], newName, {
    type: file.type,
    lastModified: file.lastModified
  })
}

export function getFileTypeFromFileName (fileName: string): EFileType {
  const extension = fileName.split('.').pop()?.toLowerCase()
  switch (extension) {
    case 'pdf':
      return EFileType.PDF
    case 'doc':
      return EFileType.DOC
    case 'docx':
      return EFileType.DOCX
    case 'jpg':
    case 'jpeg':
      return EFileType.JPEG
    case 'png':
      return EFileType.PNG
    default:
      return EFileType.PDF
  }
}
