import { EFileType } from '@/api/avenir-esr'

export function getFileTypeFromFileName (fileName: string): EFileType {
  const extension = fileName.split('.').pop()?.toLowerCase()
  switch (extension) {
    case 'pdf': return EFileType.PDF
    case 'doc': return EFileType.DOC
    case 'docx': return EFileType.DOCX
    case 'jpg':
    case 'jpeg': return EFileType.JPEG
    case 'png': return EFileType.PNG
    default: return EFileType.PDF
  }
}
