import type { UseExportKitFormData } from '@/features/student/kit/views/StudentToolsKitView/composables/use-export-kit-form/use-export-kit-form'

export function canExportKit (values: UseExportKitFormData) {
  return values.kitName.trim().length > 0 && values.exportOptions.length > 0
}
