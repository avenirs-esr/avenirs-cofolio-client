import type { TraceFormData } from '@/features/student/traces/types/traces.types'
import { ETraceAuthorType } from '@/api/avenir-esr'
import { useTraceFormValidators } from '@/features/student/traces/composables/use-trace-form-validators/use-trace-form-validators'
import { TRACE_IA_JUSTIFICATION_MAX_LENGTH, TRACE_LINK_MAX_LENGTH, TRACE_NAME_MAX_LENGTH, TRACE_PERSONAL_NOTE_MAX_LENGTH } from '@/features/student/traces/config'
import { TraceType } from '@/features/student/traces/types/traces.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

function buildLinkTraceFormData (overrides: Partial<TraceFormData> = {}): TraceFormData {
  return {
    traceType: TraceType.LINK,
    link: 'https://example.com',
    traceName: 'Trace title',
    personalNote: 'Personal note',
    authorType: ETraceAuthorType.PERSONAL,
    useIA: false,
    iaJustification: '',
    ...overrides,
  } as TraceFormData
}

function buildFileTraceFormData (overrides: Partial<TraceFormData> = {}): TraceFormData {
  return {
    traceType: TraceType.FILE,
    file: new File(['content'], 'trace.txt', { type: 'text/plain' }),
    traceName: 'Trace title',
    personalNote: 'Personal note',
    authorType: ETraceAuthorType.PERSONAL,
    useIA: false,
    iaJustification: '',
    ...overrides,
  } as TraceFormData
}

BddTest().given('a trace form validators composable', () => {
  let composableResult: ReturnType<typeof useTraceFormValidators>

  beforeEach(() => {
    const result = mountComposable(() => useTraceFormValidators(), {
      useI18n: true
    })
    composableResult = result.result
  })

  BddTest().when('the composable is initialized', () => {
    BddTest().then('it should expose the validators builder', () => {
      expect(composableResult.buildValidators).toBeDefined()
    })
  })

  BddTest().when('validating a file trace', () => {
    BddTest().and('file is missing', () => {
      BddTest().then('it should return required error for file', () => {
        const result = composableResult.buildValidators(buildFileTraceFormData({ file: null }))
        expect(result.fields.file).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('all values are valid', () => {
      BddTest().then('it should not return file or link errors', () => {
        const result = composableResult.buildValidators(buildFileTraceFormData())
        expect(result.fields.file).toBeUndefined()
        expect(result.fields.link).toBeUndefined()
      })
    })
  })

  BddTest().when('validating a link trace', () => {
    BddTest().and('link is empty', () => {
      BddTest().then('it should return required error for link', () => {
        const result = composableResult.buildValidators(buildLinkTraceFormData({ link: '' }))
        expect(result.fields.link).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('link format is invalid', () => {
      BddTest().then('it should return invalid URL error', () => {
        const result = composableResult.buildValidators(buildLinkTraceFormData({ link: 'invalid-link' }))
        expect(result.fields.link).toBe('Veuillez renseigner une URL valide (ex. : http://www.exemple.com)')
      })
    })

    BddTest().and('link exceeds max length', () => {
      BddTest().then('it should return max length error for link', () => {
        const tooLongValidLink = `https://example.com/${'a'.repeat(TRACE_LINK_MAX_LENGTH)}`
        const result = composableResult.buildValidators(buildLinkTraceFormData({ link: tooLongValidLink }))
        expect(result.fields.link).toBe(`Veuillez limiter votre saisie à ${TRACE_LINK_MAX_LENGTH} caractères`)
      })
    })
  })

  BddTest().when('validating common fields', () => {
    BddTest().and('traceName is empty', () => {
      BddTest().then('it should return required error for traceName', () => {
        const result = composableResult.buildValidators(buildLinkTraceFormData({ traceName: '' }))
        expect(result.fields.traceName).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('traceName exceeds max length', () => {
      BddTest().then('it should return max length error for traceName', () => {
        const result = composableResult.buildValidators(buildLinkTraceFormData({ traceName: 'a'.repeat(TRACE_NAME_MAX_LENGTH + 1) }))
        expect(result.fields.traceName).toBe(`Veuillez limiter votre saisie à ${TRACE_NAME_MAX_LENGTH} caractères`)
      })
    })

    BddTest().and('authorType is null', () => {
      BddTest().then('it should return required error for authorType', () => {
        const result = composableResult.buildValidators(buildLinkTraceFormData({ authorType: null }))
        expect(result.fields.authorType).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('authorType is valid', () => {
      BddTest().then('it should not return error for authorType', () => {
        const result = composableResult.buildValidators(buildLinkTraceFormData({ authorType: ETraceAuthorType.THIRD_PARTY }))
        expect(result.fields.authorType).toBeUndefined()
      })
    })

    BddTest().and('useIA is true and iaJustification is empty', () => {
      BddTest().then('it should return required error for IA justification', () => {
        const result = composableResult.buildValidators(buildLinkTraceFormData({ useIA: true, iaJustification: '' }))
        expect(result.fields.iaJustification).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('useIA is true and iaJustification exceeds max length', () => {
      BddTest().then('it should return max length error for IA justification', () => {
        const result = composableResult.buildValidators(
          buildLinkTraceFormData({
            useIA: true,
            iaJustification: 'a'.repeat(TRACE_IA_JUSTIFICATION_MAX_LENGTH + 1)
          })
        )
        expect(result.fields.iaJustification).toBe(`Veuillez limiter votre saisie à ${TRACE_IA_JUSTIFICATION_MAX_LENGTH} caractères`)
      })
    })

    BddTest().and('personalNote exceeds max length', () => {
      BddTest().then('it should return max length error for personalNote', () => {
        const result = composableResult.buildValidators(
          buildLinkTraceFormData({ personalNote: 'a'.repeat(TRACE_PERSONAL_NOTE_MAX_LENGTH + 1) })
        )
        expect(result.fields.personalNote).toBe(`Veuillez limiter votre saisie à ${TRACE_PERSONAL_NOTE_MAX_LENGTH} caractères`)
      })
    })
  })
})
