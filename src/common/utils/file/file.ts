import { EFileType, type FileDTO } from '@/api/avenir-esr'
import { AvIsoLocaleMap, type AvLocale } from '@/types'

export function bytesToMegabytes (bytes: number): number {
  return Math.round((bytes / 1024 / 1024) * 100) / 100
}

export function formatFileSizeInMegabytes (bytes: number, localeCode: AvLocale): string {
  const megabytes = bytesToMegabytes(bytes)
  return new Intl.NumberFormat(AvIsoLocaleMap[localeCode], { maximumFractionDigits: 1 }).format(megabytes)
}

export function getFileExtension (fileName: string): string {
  const dot = fileName.lastIndexOf('.')
  return dot > 0 ? fileName.slice(dot) : ''
}

export function stripExtension (fileName: string): string {
  const dot = fileName.lastIndexOf('.')
  return dot > 0 ? fileName.slice(0, dot) : fileName
}

export function dtoToFile (dto: FileDTO): File {
  const blob = new Blob([], { type: dto.fileType })
  return new File([blob], dto.fileName, {
    type: dto.fileType,
    lastModified: new Date(dto.uploadedAt).getTime(),
  })
}

export function renameFile (file: File, newName: string): File {
  return new File([file], newName, {
    type: file.type,
    lastModified: file.lastModified
  })
}

const EXTENSION_TO_FILE_TYPE: Record<string, EFileType> = {
  'png': EFileType.PNG,
  'jpg': EFileType.JPEG,
  'jpeg': EFileType.JPEG,
  'gif': EFileType.GIF,
  'webp': EFileType.WEBP,
  'ogg': EFileType.OGG,
  'oga': EFileType.OGG,
  'ogx': EFileType.OGG_APP,
  'weba': EFileType.WEBM_AUDIO,
  'm4a': EFileType.MP4_AUDIO,
  'mp3': EFileType.MP3,
  'avi': EFileType.AVI,
  'ogv': EFileType.OGG_VIDEO,
  'mp4': EFileType.MP4,
  'mpeg': EFileType.MPEG,
  'mpg': EFileType.MPEG,
  'webm': EFileType.WEBM_VIDEO,
  '3gp': EFileType._3GPP_VIDEO,
  '3g2': EFileType._3GPP2_VIDEO,
  'txt': EFileType.TXT,
  'csv': EFileType.CSV,
  'ics': EFileType.ICS,
  'rtx': EFileType.RICHTEXT,
  'pdf': EFileType.PDF,
  'ps': EFileType.POSTSCRIPT,
  'eps': EFileType.POSTSCRIPT,
  'ai': EFileType.POSTSCRIPT,
  'doc': EFileType.DOC,
  'docx': EFileType.DOCX,
  'odt': EFileType.ODT,
  'rtf': EFileType.RTF,
  'vsd': EFileType.VSD,
  'ppt': EFileType.PPT,
  'pptx': EFileType.PPTX,
  'ppsx': EFileType.PPTX_SLIDESHOW,
  'odp': EFileType.ODP,
  'xls': EFileType.XLS,
  'xlsx': EFileType.XLSX,
  'ods': EFileType.ODS
}

export function getFileTypeFromFileName (fileName: string): EFileType {
  const extension = fileName.split('.').pop()?.toLowerCase() ?? ''
  return EXTENSION_TO_FILE_TYPE[extension] ?? EFileType.PDF
}

export function isDifferentFile (first: FileDTO | File, second: FileDTO | File): boolean {
  const firstIsFile = first instanceof File
  const secondIsFile = second instanceof File

  if (firstIsFile && secondIsFile) {
    return first.type !== second.type
      || first.name !== second.name
      || first.size !== second.size
      || first.lastModified !== second.lastModified
  }

  if (!firstIsFile && !secondIsFile) {
    return first.id !== second.id
  }

  return true
}
