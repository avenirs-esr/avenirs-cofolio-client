export interface TraceFormData {
  file: File | null
  traceName: string
  personalNote?: string
  isAuthentic: boolean
  isGroup: boolean
  useIA: boolean
  iaJustification?: string
}
