import type { AlertConfigurationDTO } from '@/api/avenir-esr'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { mockedAlertConfigurationDTO } from '@/__mocks__/fixtures/global-alert.fixtures'
import { createPutAlertConfigHandler, putAlertErrorHandler } from '@/__mocks__/msw/handlers/global-alert.handlers'
import { server } from '@/__mocks__/msw/server'
import { useUpdateAlertForm } from '@/features/global-alert/views/AlertUpdateView/composables/use-update-alert-form/use-update-alert-form'
import { mountComposable } from '@/tests/utils'

const ERROR_TITLE = 'Une erreur est survenue lors de la mise à jour de l\'alerte globale.'
const SUCCESS_MESSAGE = 'L\'alerte globale a été mise à jour.'

const mockAddErrorMessage = vi.fn()
const mockAddSuccessMessage = vi.fn()

vi.mock('@avenirs-esr/shared', async importOriginal => ({
  ...await importOriginal<typeof import('@avenirs-esr/shared')>(),
  useToasterStore: () => ({
    addErrorMessage: mockAddErrorMessage,
    addSuccessMessage: mockAddSuccessMessage,
  }),
}))

const SENT_VALUES_CASES = [
  {
    description: 'an active alert',
    values: {
      active: true
    },
  },
  {
    description: 'a scheduled alert',
    values: {
      startDate: '2026-11-05',
      endDate: '2026-11-08'
    },
  },
]

const OMITTED_VALUES_CASES = [
  {
    description: 'an inactive alert',
    values: {
      active: false
    },
  },
  {
    description: 'an alert with emptied dates',
    values: {
      startDate: '',
      endDate: ''
    },
  },
]

const INVALID_CASES = [
  {
    description: 'an empty message',
    values: {
      message: ''
    },
    invalidField: 'message',
  },
  {
    description: 'a start date without end date',
    values: {
      startDate: '2026-11-05'
    },
    invalidField: 'endDate',
  },
  {
    description: 'an end date without start date',
    values: {
      endDate: '2026-11-08'
    },
    invalidField: 'startDate',
  },
]

BddTest().given('an alert update form composable', () => {
  let result: ReturnType<typeof useUpdateAlertForm>
  const onAlertUpdated = vi.fn()
  const onPutAlertConfig = vi.fn()

  const mountWith = (values: Partial<AlertConfigurationDTO> = {}) => {
    const alert = { ...mockedAlertConfigurationDTO, ...values }
    result = mountComposable(() => useUpdateAlertForm(alert, onAlertUpdated), {
      useI18n: true,
      usePinia: true,
      useTanstack: true,
    }).result
  }

  const submitWith = async (values: Partial<AlertConfigurationDTO> = {}) => {
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
    server.use(createPutAlertConfigHandler(onPutAlertConfig))
  })

  BddTest().when('the form is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should not be valid until a value changes', () => {
      expect(result.isFormValid.value).toBe(false)
    })
  })

  BddTest().when('the message changes', () => {
    beforeEach(() => {
      mountWith()
      result.form.setFieldValue('message', 'Nouveau message')
    })

    BddTest().then('it should be valid', () => {
      expect(result.isFormValid.value).toBe(true)
    })
  })

  BddTest().when('the alert is activated while a period is set', () => {
    beforeEach(async () => {
      mountWith({ startDate: '2026-11-05', endDate: '2026-11-08' })
      result.form.setFieldValue('active', true)
      await flushPromises()
    })

    BddTest().then('it should clear the period', () => {
      expect(result.form.state.values).toMatchObject({ startDate: undefined, endDate: undefined })
    })
  })

  SENT_VALUES_CASES.forEach(({ description, values }) => {
    BddTest().when(`submitting ${description}`, () => {
      beforeEach(() => submitWith(values))

      BddTest().then('it should send these values along with the message', async () => {
        await vi.waitFor(() => {
          expect(onPutAlertConfig).toHaveBeenCalledWith({ message: mockedAlertConfigurationDTO.message, ...values })
        })
      })
    })
  })

  OMITTED_VALUES_CASES.forEach(({ description, values }) => {
    BddTest().when(`submitting ${description}`, () => {
      beforeEach(() => submitWith(values))

      BddTest().then('it should only send the message', async () => {
        await vi.waitFor(() => {
          expect(onPutAlertConfig).toHaveBeenCalledWith({ message: mockedAlertConfigurationDTO.message })
        })
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
    beforeEach(() => submitWith())

    BddTest().then('it should display a success message', async () => {
      await vi.waitFor(() => {
        expect(mockAddSuccessMessage).toHaveBeenCalledWith(expect.objectContaining({ description: SUCCESS_MESSAGE }))
      })
    })

    BddTest().then('it should notify the caller', async () => {
      await vi.waitFor(() => {
        expect(onAlertUpdated).toHaveBeenCalledTimes(1)
      })
    })
  })

  BddTest().when('the update fails', () => {
    beforeEach(async () => {
      server.use(putAlertErrorHandler)
      await submitWith()
    })

    BddTest().then('it should display an error message', async () => {
      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalledWith(expect.objectContaining({ title: ERROR_TITLE }))
      })
    })

    BddTest().then('it should not notify the caller', async () => {
      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalled()
      })
      expect(onAlertUpdated).not.toHaveBeenCalled()
    })
  })
})
