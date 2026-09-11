import { canExportKit } from '@/features/student/kit/rules/export-kit.rules'
import { ExportKitOptions } from '@/features/student/kit/views/StudentToolsKitView/composables/use-export-kit-form/use-export-kit-form'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'

/*
export function canExportKit (values: UseExportKitFormData) {
  return values.kitName.trim().length > 0 && values.exportOptions.length > 0
}
  */

BddTest().given('a can export kit function', () => {
  let result: ReturnType<typeof canExportKit>

  BddTest().when('the function is called with valid values', () => {
    beforeEach(() => {
      result = canExportKit({ kitName: 'Kit 1', exportOptions: [ExportKitOptions.MEDIA_CONTENT] })
    })

    BddTest().then('the result should be true', () => {
      expect(result).toBe(true)
    })
  })

  BddTest().when('the function is called with all valid values', () => {
    beforeEach(() => {
      result = canExportKit({ kitName: 'Kit 1', exportOptions: [
        ExportKitOptions.TEXT_CONTENT,
        ExportKitOptions.MEDIA_CONTENT
      ] })
    })

    BddTest().then('the result should be true', () => {
      expect(result).toBe(true)
    })
  })

  BddTest().when('the function is called with invalid values', () => {
    beforeEach(() => {
      result = canExportKit({ kitName: '', exportOptions: [] })
    })

    BddTest().then('the result should be false', () => {
      expect(result).toBe(false)
    })
  })

  BddTest().when('the function is called with a kit name but no export options', () => {
    beforeEach(() => {
      result = canExportKit({ kitName: 'Kit 1', exportOptions: [] })
    })

    BddTest().then('the result should be false', () => {
      expect(result).toBe(false)
    })
  })

  BddTest().when('the function is called with export options but no kit name', () => {
    beforeEach(() => {
      result = canExportKit({ kitName: '', exportOptions: [ExportKitOptions.MEDIA_CONTENT] })
    })

    BddTest().then('the result should be false', () => {
      expect(result).toBe(false)
    })
  })
})
