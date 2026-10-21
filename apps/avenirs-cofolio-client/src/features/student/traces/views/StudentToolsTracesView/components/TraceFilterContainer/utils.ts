import { TraceFilterFileTypesItem } from '@/api/avenir-esr'
import { FileGlobalType } from '@/common/components/interaction/selects/FileTypeMultiselect/FileTypeMultiselect.types'

export const FILE_GLOBAL_TYPE_MAPPING: Record<FileGlobalType, TraceFilterFileTypesItem[]> = {
  [FileGlobalType.PDF]: [
    TraceFilterFileTypesItem.PDF
  ],

  [FileGlobalType.TEXT]: [
    TraceFilterFileTypesItem.TXT,
    TraceFilterFileTypesItem.CSV,
    TraceFilterFileTypesItem.ICS,
    TraceFilterFileTypesItem.RICHTEXT,
    TraceFilterFileTypesItem.RTF,
    TraceFilterFileTypesItem.X_RTF,
    TraceFilterFileTypesItem.POSTSCRIPT,
    TraceFilterFileTypesItem.DOC,
    TraceFilterFileTypesItem.DOCX,
    TraceFilterFileTypesItem.ODT,
  ],

  [FileGlobalType.SHEET]: [
    TraceFilterFileTypesItem.XLS,
    TraceFilterFileTypesItem.X_XLS,
    TraceFilterFileTypesItem.X_MSEXCEL,
    TraceFilterFileTypesItem.XLS_VND,
    TraceFilterFileTypesItem.XLSX,
    TraceFilterFileTypesItem.ODS,
  ],

  [FileGlobalType.IMAGE]: [
    TraceFilterFileTypesItem.PNG,
    TraceFilterFileTypesItem.JPEG,
    TraceFilterFileTypesItem.PJPEG,
    TraceFilterFileTypesItem.GIF,
    TraceFilterFileTypesItem.WEBP,
  ],

  [FileGlobalType.VIDEO]: [
    TraceFilterFileTypesItem.MP4,
    TraceFilterFileTypesItem.MPEG,
    TraceFilterFileTypesItem.MPEG3_VIDEO,
    TraceFilterFileTypesItem.X_MPEG_VIDEO,
    TraceFilterFileTypesItem.WEBM_VIDEO,
    TraceFilterFileTypesItem.OGG_VIDEO,
    TraceFilterFileTypesItem.AVI,
    TraceFilterFileTypesItem.MSVIDEO,
    TraceFilterFileTypesItem.X_MSVIDEO,
    TraceFilterFileTypesItem._3GPP_VIDEO,
    TraceFilterFileTypesItem._3GPP2_VIDEO,
  ],

  [FileGlobalType.AUDIO]: [
    TraceFilterFileTypesItem.MP3,
    TraceFilterFileTypesItem.MPEG3,
    TraceFilterFileTypesItem.X_MPEG3,
    TraceFilterFileTypesItem.MPEG4_GENERIC,
    TraceFilterFileTypesItem.MP4_AUDIO,
    TraceFilterFileTypesItem.OGG,
    TraceFilterFileTypesItem.OGG_APP,
    TraceFilterFileTypesItem.WEBM_AUDIO,
    TraceFilterFileTypesItem._3GPP_AUDIO,
    TraceFilterFileTypesItem.VORBIS,
  ],

  [FileGlobalType.OTHERS]: [
    TraceFilterFileTypesItem.MSPPT,
    TraceFilterFileTypesItem.PPT,
    TraceFilterFileTypesItem.X_PPT,
    TraceFilterFileTypesItem.PPT_VND,
    TraceFilterFileTypesItem.PPTX,
    TraceFilterFileTypesItem.PPTX_SLIDESHOW,
    TraceFilterFileTypesItem.ODP,
    TraceFilterFileTypesItem.VSD,
  ],
}

export function computeTraceFilterFileTypesFromGlobals (
  selectedGlobalTypes: FileGlobalType[]
): TraceFilterFileTypesItem[] {
  return [
    ...new Set(
      selectedGlobalTypes.flatMap(
        type => FILE_GLOBAL_TYPE_MAPPING[type] ?? []
      )
    )
  ]
}
