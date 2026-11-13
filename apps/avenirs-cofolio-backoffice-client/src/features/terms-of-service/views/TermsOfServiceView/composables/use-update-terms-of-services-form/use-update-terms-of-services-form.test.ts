import type { CguDTO } from '@avenirs-esr/shared/api/avenir-esr'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { mockedCguDTO } from '@/__mocks__/fixtures/cgu.fixtures'
import { createUploadCguHandler, uploadCguErrorHandler } from '@/__mocks__/msw/handlers/cgu.handlers'
import { server } from '@/__mocks__/msw/server'
import { useUpdateTermsOfServicesForm } from '@/features/terms-of-service/views/TermsOfServiceView/composables/use-update-terms-of-services-form/use-update-terms-of-services-form'
import { mountComposable } from '@/tests/utils'

const ERROR_TITLE = 'Les conditions générales d\'utilisation n\'ont pas pu être mises à jour'
const SUCCESS_MESSAGE = 'Les conditions générales d\'utilisation ont été mises à jour'

const mockAddErrorMessage = vi.fn()
const mockAddSuccessMessage = vi.fn()

vi.mock('@avenirs-esr/shared', async importOriginal => ({
  ...await importOriginal<typeof import('@avenirs-esr/shared')>(),
  useToasterStore: () => ({
    addErrorMessage: mockAddErrorMessage,
    addSuccessMessage: mockAddSuccessMessage,
  }),
}))

const INVALID_CASES = [
  {
    description: 'an empty description',
    values: {
      content: '',
    },
    invalidField: 'description',
  },
]

BddTest().given('a terms of service update form composable', () => {
  let result: ReturnType<typeof useUpdateTermsOfServicesForm>
  const onUploadCgu = vi.fn()

  const mountWith = (values: Partial<CguDTO> = {}) => {
    const cgu = { ...mockedCguDTO, ...values }
    result = mountComposable(() => useUpdateTermsOfServicesForm(cgu), {
      useI18n: true,
      usePinia: true,
      useTanstack: true,
    }).result
  }

  const submitWith = async (values: Partial<CguDTO> = {}) => {
    mountWith(values)
    await result.form.handleSubmit()
  }

  const getOnSubmitValidator = () => {
    const validator = result.form.options.validators?.onSubmit
    expect(validator).toBeDefined()
    return validator!
  }

  beforeEach(() => {
    vi.clearAllMocks()
    server.use(createUploadCguHandler(onUploadCgu))
  })

  BddTest().when('the form is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should not be valid until a value changes', () => {
      expect(result.isFormValid.value).toBe(false)
    })
  })

  BddTest().when('the description changes', () => {
    beforeEach(() => {
      mountWith()
      result.form.setFieldValue('description', '<p>Nouvelles conditions</p>')
    })

    BddTest().then('it should be valid', () => {
      expect(result.isFormValid.value).toBe(true)
    })
  })

  BddTest().when('submitting the form', () => {
    beforeEach(async () => {
      await submitWith()
    })

    BddTest().then('it should upload the new terms of service file', async () => {
      await vi.waitFor(() => {
        expect(onUploadCgu).toHaveBeenCalledTimes(1)
      })
    })
  })
  INVALID_CASES.forEach(({ description, values, invalidField }) => {
    BddTest().when(`validating ${description} on submit`, () => {
      beforeEach(() => {
        mountWith(values)
      })

      BddTest().then(`it should only flag the ${invalidField} field`, () => {
        const validate = getOnSubmitValidator()
        const { fields } = validate({ value: result.form.state.values, formApi: result.form })
        expect(fields).toEqual({ [invalidField]: expect.any(String) })
      })
    })
  })

  BddTest().when('the update succeeds', () => {
    beforeEach(async () => {
      await submitWith()
    })

    BddTest().then('it should display a success message', async () => {
      await vi.waitFor(() => {
        expect(mockAddSuccessMessage).toHaveBeenCalledWith(expect.objectContaining({ description: SUCCESS_MESSAGE }))
      })
    })
  })

  BddTest().when('the update fails', () => {
    beforeEach(async () => {
      server.use(uploadCguErrorHandler)
      await submitWith()
    })

    BddTest().then('it should display an error message', async () => {
      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalledWith(expect.objectContaining({ title: ERROR_TITLE }))
      })
    })
  })
})
