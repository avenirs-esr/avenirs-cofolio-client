import { useToolFormValidators } from '#shared/composables/use-tool-form-validators/use-tool-form-validators'
import { mountComposable } from '#shared/test-utils/mount-composable'
import { TOOL_DESCRIPTION_MAX_LENGTH, TOOL_NAME_MAX_LENGTH } from '#shared/utils/tool.config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect } from 'vitest'

const REQUIRED_ERROR = 'Ce champ est requis.'
const INVALID_LINK_ERROR = 'Veuillez renseigner une URL valide (ex. : http://www.exemple.com). N\'oubliez pas d\'inclure le protocole (http:// ou https://).'

function maxLengthError (maxLength: number) {
  return `Veuillez limiter votre saisie à ${maxLength} caractères`
}

BddTest().given('a useToolFormValidators composable', () => {
  let validators: ReturnType<typeof useToolFormValidators>

  beforeEach(() => {
    validators = mountComposable(useToolFormValidators, { useI18n: true }).result
  })

  BddTest().when('the name is validated', () => {
    BddTest().then('it should require a non blank name', () => {
      expect(validators.validateName('')).toBe(REQUIRED_ERROR)
      expect(validators.validateName('   ')).toBe(REQUIRED_ERROR)
    })

    BddTest().then(`it should limit the name to ${TOOL_NAME_MAX_LENGTH} characters`, () => {
      expect(validators.validateName('a'.repeat(TOOL_NAME_MAX_LENGTH))).toBeUndefined()
      expect(validators.validateName('a'.repeat(TOOL_NAME_MAX_LENGTH + 1))).toBe(maxLengthError(TOOL_NAME_MAX_LENGTH))
    })
  })

  BddTest().when('the description is validated', () => {
    BddTest().then('it should require a non blank description', () => {
      expect(validators.validateDescription('')).toBe(REQUIRED_ERROR)
      expect(validators.validateDescription('   ')).toBe(REQUIRED_ERROR)
    })

    BddTest().then(`it should limit the description to ${TOOL_DESCRIPTION_MAX_LENGTH} characters, spaces included`, () => {
      expect(validators.validateDescription(' '.repeat(TOOL_DESCRIPTION_MAX_LENGTH - 1).concat('a'))).toBeUndefined()
      expect(validators.validateDescription('a '.repeat(TOOL_DESCRIPTION_MAX_LENGTH / 2).concat('a'))).toBe(maxLengthError(TOOL_DESCRIPTION_MAX_LENGTH))
    })
  })

  BddTest().when('the url is validated', () => {
    BddTest().then('it should require an url', () => {
      expect(validators.validateUrl('')).toBe(REQUIRED_ERROR)
      expect(validators.validateUrl('   ')).toBe(REQUIRED_ERROR)
    })

    BddTest().then('it should reject an invalid url', () => {
      expect(validators.validateUrl('not an url')).toBe(INVALID_LINK_ERROR)
    })

    BddTest().then('it should accept a valid url', () => {
      expect(validators.validateUrl('https://www.example.com')).toBeUndefined()
    })
  })
})
