import { useDeclaredProgramFormValidators } from '@/features/student/personalCareer/composables/use-declared-program-form-validators/use-declared-program-form-validators'
import {
  DECLARED_PROGRAM_DESCRIPTION_MAX_LENGTH,
  DECLARED_PROGRAM_ORGANIZATION_MAX_LENGTH,
  DECLARED_PROGRAM_RESULT_MAX_LENGTH,
  DECLARED_PROGRAM_SOURCE_OF_INFORMATION_MAX_LENGTH,
  DECLARED_PROGRAM_TITLE_MAX_LENGTH
} from '@/features/student/personalCareer/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a declared program form validator composable', () => {
  let composableResult: ReturnType<typeof useDeclaredProgramFormValidators>

  beforeEach(() => {
    const result = mountComposable(() => useDeclaredProgramFormValidators(), {
      useI18n: true
    })
    composableResult = result.result
  })

  BddTest().when('the composable is initialized', () => {
    BddTest().then('it should return all validation functions', () => {
      expect(composableResult.validateTitle).toBeDefined()
      expect(composableResult.validateDescription).toBeDefined()
      expect(composableResult.validateOrganization).toBeDefined()
      expect(composableResult.validateResult).toBeDefined()
      expect(composableResult.validateSourceOfInformation).toBeDefined()
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

    BddTest().and('the title is undefined', () => {
      BddTest().then('it should return required error', () => {
        const error = composableResult.validateTitle(undefined as unknown as string)
        expect(error).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('the title is null', () => {
      BddTest().then('it should return required error', () => {
        const error = composableResult.validateTitle(null as unknown as string)
        expect(error).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('the title exceeds max length', () => {
      BddTest().then('it should return max length error', () => {
        const longTitle = 'a'.repeat(DECLARED_PROGRAM_TITLE_MAX_LENGTH + 1)
        const error = composableResult.validateTitle(longTitle)
        expect(error).toBe(`Veuillez limiter votre saisie à ${DECLARED_PROGRAM_TITLE_MAX_LENGTH} caractères`)
      })
    })

    BddTest().and('the title is valid', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateTitle('Valid Title')
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the title is at max length', () => {
      BddTest().then('it should return undefined', () => {
        const titleAtMaxLength = 'a'.repeat(DECLARED_PROGRAM_TITLE_MAX_LENGTH)
        const error = composableResult.validateTitle(titleAtMaxLength)
        expect(error).toBeUndefined()
      })
    })
  })

  BddTest().when('validating description', () => {
    BddTest().and('the description is empty', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateDescription('')
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the description is undefined', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateDescription(undefined as unknown as string)
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the description exceeds max length', () => {
      BddTest().then('it should return max length error', () => {
        const longDescription = 'a'.repeat(DECLARED_PROGRAM_DESCRIPTION_MAX_LENGTH + 1)
        const error = composableResult.validateDescription(longDescription)
        expect(error).toBe(`Veuillez limiter votre saisie à ${DECLARED_PROGRAM_DESCRIPTION_MAX_LENGTH} caractères`)
      })
    })

    BddTest().and('the description is valid', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateDescription('Valid description')
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the description is at max length', () => {
      BddTest().then('it should return undefined', () => {
        const descriptionAtMaxLength = 'a'.repeat(DECLARED_PROGRAM_DESCRIPTION_MAX_LENGTH)
        const error = composableResult.validateDescription(descriptionAtMaxLength)
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

    BddTest().and('the organization is undefined', () => {
      BddTest().then('it should return required error', () => {
        const error = composableResult.validateOrganization(undefined as unknown as string)
        expect(error).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('the organization is null', () => {
      BddTest().then('it should return required error', () => {
        const error = composableResult.validateOrganization(null as unknown as string)
        expect(error).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('the organization exceeds max length', () => {
      BddTest().then('it should return max length error', () => {
        const longOrganization = 'a'.repeat(DECLARED_PROGRAM_ORGANIZATION_MAX_LENGTH + 1)
        const error = composableResult.validateOrganization(longOrganization)
        expect(error).toBe(`Veuillez limiter votre saisie à ${DECLARED_PROGRAM_ORGANIZATION_MAX_LENGTH} caractères`)
      })
    })

    BddTest().and('the organization is valid', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateOrganization('Valid Organization')
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the organization is at max length', () => {
      BddTest().then('it should return undefined', () => {
        const organizationAtMaxLength = 'a'.repeat(DECLARED_PROGRAM_ORGANIZATION_MAX_LENGTH)
        const error = composableResult.validateOrganization(organizationAtMaxLength)
        expect(error).toBeUndefined()
      })
    })
  })

  BddTest().when('validating result', () => {
    BddTest().and('the result is empty', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateResult('')
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the result is undefined', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateResult(undefined as unknown as string)
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the result exceeds max length', () => {
      BddTest().then('it should return max length error', () => {
        const longResult = 'a'.repeat(DECLARED_PROGRAM_RESULT_MAX_LENGTH + 1)
        const error = composableResult.validateResult(longResult)
        expect(error).toBe(`Veuillez limiter votre saisie à ${DECLARED_PROGRAM_RESULT_MAX_LENGTH} caractères`)
      })
    })

    BddTest().and('the result is valid', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateResult('Valid result')
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the result is at max length', () => {
      BddTest().then('it should return undefined', () => {
        const resultAtMaxLength = 'a'.repeat(DECLARED_PROGRAM_RESULT_MAX_LENGTH)
        const error = composableResult.validateResult(resultAtMaxLength)
        expect(error).toBeUndefined()
      })
    })
  })

  BddTest().when('validating source of information', () => {
    BddTest().and('the source is empty', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateSourceOfInformation('')
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the source is undefined', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateSourceOfInformation(undefined as unknown as string)
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the source exceeds max length', () => {
      BddTest().then('it should return max length error', () => {
        const longSource = 'a'.repeat(DECLARED_PROGRAM_SOURCE_OF_INFORMATION_MAX_LENGTH + 1)
        const error = composableResult.validateSourceOfInformation(longSource)
        expect(error).toBe(`Veuillez limiter votre saisie à ${DECLARED_PROGRAM_SOURCE_OF_INFORMATION_MAX_LENGTH} caractères`)
      })
    })

    BddTest().and('the source is valid', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateSourceOfInformation('Valid source')
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the source is at max length', () => {
      BddTest().then('it should return undefined', () => {
        const sourceAtMaxLength = 'a'.repeat(DECLARED_PROGRAM_SOURCE_OF_INFORMATION_MAX_LENGTH)
        const error = composableResult.validateSourceOfInformation(sourceAtMaxLength)
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

    BddTest().and('the start date is undefined', () => {
      BddTest().then('it should return required error', () => {
        const error = composableResult.validateStartDate(undefined as unknown as string)
        expect(error).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('the start date is null', () => {
      BddTest().then('it should return required error', () => {
        const error = composableResult.validateStartDate(null as unknown as string)
        expect(error).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('the start date is valid', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateStartDate('2024-01-01')
        expect(error).toBeUndefined()
      })
    })
  })

  BddTest().when('validating end date', () => {
    BddTest().and('the end date is empty and not required', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateEndDate('', '')
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the end date is undefined and not required', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateEndDate(undefined as unknown as string, '')
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the end date is empty and required', () => {
      BddTest().then('it should return required error', () => {
        const error = composableResult.validateEndDate('', '', { isRequired: true })
        expect(error).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('the end date is undefined and required', () => {
      BddTest().then('it should return required error', () => {
        const error = composableResult.validateEndDate(undefined as unknown as string, '', { isRequired: true })
        expect(error).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('the end date is null and required', () => {
      BddTest().then('it should return required error', () => {
        const error = composableResult.validateEndDate(null as unknown as string, '', { isRequired: true })
        expect(error).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('the end date is valid and not required', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateEndDate('2024-12', '2024-01')
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the end date is valid and required', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateEndDate('2024-12', '2024-01', { isRequired: true })
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the end date is before start date', () => {
      BddTest().then('it should return end date before start date error', () => {
        const error = composableResult.validateEndDate('2024-01', '2024-06')
        expect(error).toBe('La date de fin doit être postérieure à la date de début')
      })
    })

    BddTest().and('the end date is same as start date', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateEndDate('2024-06', '2024-06')
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the end date is after start date', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateEndDate('2024-12', '2024-06')
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the end date is empty and start date is provided', () => {
      BddTest().then('it should return undefined when not required', () => {
        const error = composableResult.validateEndDate('', '2024-06')
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the end date is before start date and required', () => {
      BddTest().then('it should return end date before start date error', () => {
        const error = composableResult.validateEndDate('2024-01', '2024-06', { isRequired: true })
        expect(error).toBe('La date de fin doit être postérieure à la date de début')
      })
    })
  })
})
