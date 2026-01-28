import {
  useDeclaredExperienceFormValidators
} from '@/features/student/personalCareer/composables/use-declared-experience-form-validators/use-declared-experience-form-validators'
import {
  DECLARED_EXPERIENCE_ACTIVITY_SECTOR_MAX_LENGTH,
  DECLARED_EXPERIENCE_DESCRIPTION_MAX_LENGTH,
  DECLARED_EXPERIENCE_LOCATION_MAX_LENGTH,
  DECLARED_EXPERIENCE_ORGANIZATION_MAX_LENGTH,
  DECLARED_EXPERIENCE_SOURCE_OF_INFORMATION_MAX_LENGTH,
  DECLARED_EXPERIENCE_SUMMARY_MAX_LENGTH,
  DECLARED_EXPERIENCE_TITLE_MAX_LENGTH
} from '@/features/student/personalCareer/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a declared experience form validators composable', () => {
  let composableResult: ReturnType<typeof useDeclaredExperienceFormValidators>

  beforeEach(() => {
    vi.clearAllMocks()
    const result = mountComposable(() => useDeclaredExperienceFormValidators(), {
      useI18n: true
    })
    composableResult = result.result
  })

  BddTest().when('the composable is initialized', () => {
    BddTest().then('it should return all validation functions', () => {
      expect(composableResult.validateTitle).toBeDefined()
      expect(composableResult.validateType).toBeDefined()
      expect(composableResult.validateOrganization).toBeDefined()
      expect(composableResult.validateActivitySector).toBeDefined()
      expect(composableResult.validateLocation).toBeDefined()
      expect(composableResult.validateSourceOfInformation).toBeDefined()
      expect(composableResult.validateDescription).toBeDefined()
      expect(composableResult.validateSummary).toBeDefined()
      expect(composableResult.validateStartDate).toBeDefined()
      expect(composableResult.validateEndDate).toBeDefined()
    })
  })

  BddTest().when('validating title', () => {
    BddTest().and('the title is empty', () => {
      BddTest().then('it should return required error', () => {
        const error = composableResult.validateTitle('')
        expect(error).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('the title exceeds max length', () => {
      BddTest().then('it should return max length error', () => {
        const longTitle = 'a'.repeat(DECLARED_EXPERIENCE_TITLE_MAX_LENGTH + 1)
        const error = composableResult.validateTitle(longTitle)
        expect(error).toBe(`Veuillez limiter votre saisie à ${DECLARED_EXPERIENCE_TITLE_MAX_LENGTH} caractères`)
      })
    })

    BddTest().and('the title is valid', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateTitle('Valid title')
        expect(error).toBeUndefined()
      })
    })
  })

  BddTest().when('validating type', () => {
    BddTest().and('the type is empty', () => {
      BddTest().then('it should return required error', () => {
        const error = composableResult.validateType('')
        expect(error).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('the type is valid', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateType('PROFESSIONAL')
        expect(error).toBeUndefined()
      })
    })
  })

  BddTest().when('validating organization', () => {
    BddTest().and('the organization is empty', () => {
      BddTest().then('it should return required error', () => {
        const error = composableResult.validateOrganization('')
        expect(error).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('the organization exceeds max length', () => {
      BddTest().then('it should return max length error', () => {
        const longOrg = 'a'.repeat(DECLARED_EXPERIENCE_ORGANIZATION_MAX_LENGTH + 1)
        const error = composableResult.validateOrganization(longOrg)
        expect(error).toBe(`Veuillez limiter votre saisie à ${DECLARED_EXPERIENCE_ORGANIZATION_MAX_LENGTH} caractères`)
      })
    })

    BddTest().and('the organization is valid', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateOrganization('Valid organization')
        expect(error).toBeUndefined()
      })
    })
  })

  BddTest().when('validating activity sector', () => {
    BddTest().and('the activity sector is empty', () => {
      BddTest().then('it should return undefined because it is optional', () => {
        const error = composableResult.validateActivitySector('')
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the activity sector exceeds max length', () => {
      BddTest().then('it should return max length error', () => {
        const longSector = 'a'.repeat(DECLARED_EXPERIENCE_ACTIVITY_SECTOR_MAX_LENGTH + 1)
        const error = composableResult.validateActivitySector(longSector)
        expect(error).toBe(`Veuillez limiter votre saisie à ${DECLARED_EXPERIENCE_ACTIVITY_SECTOR_MAX_LENGTH} caractères`)
      })
    })

    BddTest().and('the activity sector is valid', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateActivitySector('Technology')
        expect(error).toBeUndefined()
      })
    })
  })

  BddTest().when('validating location', () => {
    BddTest().and('the location is empty', () => {
      BddTest().then('it should return undefined because it is optional', () => {
        const error = composableResult.validateLocation('')
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the location exceeds max length', () => {
      BddTest().then('it should return max length error', () => {
        const longLocation = 'a'.repeat(DECLARED_EXPERIENCE_LOCATION_MAX_LENGTH + 1)
        const error = composableResult.validateLocation(longLocation)
        expect(error).toBe(`Veuillez limiter votre saisie à ${DECLARED_EXPERIENCE_LOCATION_MAX_LENGTH} caractères`)
      })
    })

    BddTest().and('the location is valid', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateLocation('Paris, France')
        expect(error).toBeUndefined()
      })
    })
  })

  BddTest().when('validating source of information', () => {
    BddTest().and('the source of information is empty', () => {
      BddTest().then('it should return undefined because it is optional', () => {
        const error = composableResult.validateSourceOfInformation('')
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the source of information exceeds max length', () => {
      BddTest().then('it should return max length error', () => {
        const longSource = 'a'.repeat(DECLARED_EXPERIENCE_SOURCE_OF_INFORMATION_MAX_LENGTH + 1)
        const error = composableResult.validateSourceOfInformation(longSource)
        expect(error).toBe(`Veuillez limiter votre saisie à ${DECLARED_EXPERIENCE_SOURCE_OF_INFORMATION_MAX_LENGTH} caractères`)
      })
    })

    BddTest().and('the source of information is valid', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateSourceOfInformation('LinkedIn')
        expect(error).toBeUndefined()
      })
    })
  })

  BddTest().when('validating description', () => {
    BddTest().and('the description is empty', () => {
      BddTest().then('it should return undefined because it is optional', () => {
        const error = composableResult.validateDescription('')
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the description exceeds max length', () => {
      BddTest().then('it should return max length error', () => {
        const longDescription = 'a'.repeat(DECLARED_EXPERIENCE_DESCRIPTION_MAX_LENGTH + 1)
        const error = composableResult.validateDescription(longDescription)
        expect(error).toBe(`Veuillez limiter votre saisie à ${DECLARED_EXPERIENCE_DESCRIPTION_MAX_LENGTH} caractères`)
      })
    })

    BddTest().and('the description is valid', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateDescription('A valid description of the experience')
        expect(error).toBeUndefined()
      })
    })
  })

  BddTest().when('validating summary', () => {
    BddTest().and('the summary is empty', () => {
      BddTest().then('it should return undefined because it is optional', () => {
        const error = composableResult.validateSummary('')
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the summary exceeds max length', () => {
      BddTest().then('it should return max length error', () => {
        const longSummary = 'a'.repeat(DECLARED_EXPERIENCE_SUMMARY_MAX_LENGTH + 1)
        const error = composableResult.validateSummary(longSummary)
        expect(error).toBe(`Veuillez limiter votre saisie à ${DECLARED_EXPERIENCE_SUMMARY_MAX_LENGTH} caractères`)
      })
    })

    BddTest().and('the summary is valid', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateSummary('A positive summary')
        expect(error).toBeUndefined()
      })
    })
  })

  BddTest().when('validating start date', () => {
    BddTest().and('the start date is empty', () => {
      BddTest().then('it should return required error', () => {
        const error = composableResult.validateStartDate('')
        expect(error).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('the start date is valid', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateStartDate('2024-01')
        expect(error).toBeUndefined()
      })
    })
  })

  BddTest().when('validating end date', () => {
    BddTest().and('the end date is empty and not required (ongoing)', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateEndDate('', '2024-01', { isRequired: false })
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the end date is empty and required', () => {
      BddTest().then('it should return required error', () => {
        const error = composableResult.validateEndDate('', '2024-01', { isRequired: true })
        expect(error).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('the end date is before start date', () => {
      BddTest().then('it should return chronological error', () => {
        const error = composableResult.validateEndDate('2023-06', '2024-01', { isRequired: true })
        expect(error).toBe('La date de fin doit être postérieure à la date de début')
      })
    })

    BddTest().and('the end date is after start date', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateEndDate('2024-06', '2024-01', { isRequired: true })
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the end date equals start date', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateEndDate('2024-01', '2024-01', { isRequired: true })
        expect(error).toBeUndefined()
      })
    })
  })
})
