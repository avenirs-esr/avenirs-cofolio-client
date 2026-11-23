import type { ToolFormData, UseAddToolFormOptions } from '#shared/composables/use-add-tool-form/use-add-tool-form'
import { CREATED_TOOL_ID, createMockedCreatedNationalToolDTO } from '#shared/__mocks__/fixtures/tools.fixtures'
import { createNationalToolErrorHandler, INTERNAL_ERROR_TOOL_ID } from '#shared/__mocks__/msw/handlers/tools.handlers'
import { server } from '#shared/__mocks__/msw/server'
import {
  getCreateLocalToolUrl,
  getCreateNationalToolUrl,
  getUploadLocalToolBannerUrl,
  getUploadNationalToolBannerUrl,
} from '#shared/api/avenir-esr'
import { useAddToolForm } from '#shared/composables/use-add-tool-form/use-add-tool-form'
import { mountComposable } from '#shared/test-utils/mount-composable'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { successJsonResponse } from '@avenirs-esr/shared/test-utils/msw'
import { http } from 'msw'
import { afterEach, beforeEach, expect, vi } from 'vitest'

const { mockAddErrorMessage, mockAddSuccessMessage, mockAddWarningMessage } = vi.hoisted(() => ({
  mockAddErrorMessage: vi.fn(),
  mockAddSuccessMessage: vi.fn(),
  mockAddWarningMessage: vi.fn(),
}))

vi.mock('#shared/stores/toaster/toaster', () => ({
  useToasterStore: () => ({
    addErrorMessage: mockAddErrorMessage,
    addSuccessMessage: mockAddSuccessMessage,
    addWarningMessage: mockAddWarningMessage,
  }),
}))

const FIELD_NAMES = ['name', 'banner', 'description', 'url'] as const
const REQUIRED_ERROR = 'Ce champ est requis.'
const SUCCESS_MESSAGE = 'L\'outil a été ajouté.'
const CREATE_ERROR_TITLE = 'Erreur lors de l\'ajout de l\'outil'
const PARTIAL_SUCCESS_TITLE = 'L\'outil a été ajouté sans sa bannière'
const PARTIAL_SUCCESS_DESCRIPTION = 'La bannière n\'a pas pu être enregistrée.'

const VALID_VALUES: ToolFormData = {
  name: '  Outil  ',
  banner: null,
  description: ' Une description ',
  url: ' https://www.example.com ',
}

const BANNER = new File(['banner'], 'banner.png', { type: 'image/png' })

interface RecordedRequest {
  method: string
  pathname: string
  body?: unknown
}

const unmounts: Array<() => void> = []
let requests: RecordedRequest[] = []

afterEach(() => {
  unmounts.splice(0).forEach(unmount => unmount())
  server.events.removeAllListeners()
})

function mountUseAddToolForm (options: Partial<UseAddToolFormOptions> = {}) {
  const onToolAdded = vi.fn()
  const { result, unmount } = mountComposable(() => {
    const addToolForm = useAddToolForm({
      isNational: true,
      onToolAdded,
      ...options,
    })
    FIELD_NAMES.forEach(name => addToolForm.form.useField({ name }))

    return addToolForm
  }, { useTanstack: true, useI18n: true })
  unmounts.push(unmount)

  return { ...result, onToolAdded }
}

async function submit (form: ReturnType<typeof mountUseAddToolForm>['form'], values: ToolFormData) {
  form.setFieldValue('name', values.name)
  form.setFieldValue('banner', values.banner)
  form.setFieldValue('description', values.description)
  form.setFieldValue('url', values.url)
  await form.handleSubmit()
}

function findRequest (method: string, pathname: string) {
  return requests.find(request => request.method === method && request.pathname === pathname)
}

BddTest().given('a useAddToolForm composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requests = []
    server.events.on('request:start', async ({ request }) => {
      const { pathname } = new URL(request.url)
      const isJson = request.headers.get('content-type')?.includes('application/json')
      requests.push({
        method: request.method,
        pathname,
        body: isJson ? await request.clone().json() : undefined,
      })
    })
  })

  BddTest().when('the composable is mounted', () => {
    BddTest().then('it should start with an empty, pristine and not submittable form', () => {
      const { form, isFormValid, isSubmitting } = mountUseAddToolForm()

      expect(form.state.values).toEqual({ name: '', banner: null, description: '', url: '' })
      expect(isFormValid.value).toBe(false)
      expect(isSubmitting.value).toBe(false)
    })
  })

  BddTest().when('a required field is filled in', () => {
    BddTest().then('it should consider the form as submittable', () => {
      const { form, isFormValid } = mountUseAddToolForm()

      form.setFieldValue('name', 'Outil')

      expect(isFormValid.value).toBe(true)
    })
  })

  BddTest().when('the form is submitted empty', () => {
    BddTest().then('it should flag every required field and not call the API', async () => {
      const { form, onToolAdded } = mountUseAddToolForm()

      await form.handleSubmit()

      expect(form.getFieldMeta('name')?.errors).toEqual([REQUIRED_ERROR])
      expect(form.getFieldMeta('description')?.errors).toEqual([REQUIRED_ERROR])
      expect(form.getFieldMeta('url')?.errors).toEqual([REQUIRED_ERROR])
      expect(form.getFieldMeta('banner')?.errors).toEqual([])
      expect(requests).toEqual([])
      expect(onToolAdded).not.toHaveBeenCalled()
    })
  })

  BddTest().when('a valid national tool without banner is submitted', () => {
    let mounted: ReturnType<typeof mountUseAddToolForm>

    beforeEach(async () => {
      mounted = mountUseAddToolForm()
      await submit(mounted.form, VALID_VALUES)
    })

    BddTest().then('it should create the national tool with the trimmed values', () => {
      expect(findRequest('POST', getCreateNationalToolUrl())?.body).toEqual({
        name: 'Outil',
        description: 'Une description',
        url: 'https://www.example.com',
      })
    })

    BddTest().then('it should not upload any banner', () => {
      expect(requests.some(request => request.pathname.endsWith('/banner'))).toBe(false)
    })

    BddTest().then('it should notify the success and call onToolAdded', () => {
      expect(mockAddSuccessMessage).toHaveBeenCalledWith(expect.objectContaining({ description: SUCCESS_MESSAGE }))
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
      expect(mounted.onToolAdded).toHaveBeenCalledOnce()
    })
  })

  BddTest().when('a valid national tool with a banner is submitted', () => {
    let mounted: ReturnType<typeof mountUseAddToolForm>

    beforeEach(async () => {
      mounted = mountUseAddToolForm()
      await submit(mounted.form, { ...VALID_VALUES, banner: BANNER })
    })

    BddTest().then('it should upload the banner of the created tool', () => {
      expect(findRequest('POST', getCreateNationalToolUrl())).toBeDefined()
      expect(findRequest('POST', getUploadNationalToolBannerUrl(CREATED_TOOL_ID))).toBeDefined()
    })

    BddTest().then('it should notify the full success and call onToolAdded', () => {
      expect(mockAddSuccessMessage).toHaveBeenCalledWith(expect.objectContaining({ description: SUCCESS_MESSAGE }))
      expect(mockAddWarningMessage).not.toHaveBeenCalled()
      expect(mounted.onToolAdded).toHaveBeenCalledOnce()
    })
  })

  BddTest().when('the creation of the tool fails', () => {
    let mounted: ReturnType<typeof mountUseAddToolForm>

    beforeEach(async () => {
      server.use(createNationalToolErrorHandler)
      mounted = mountUseAddToolForm()
      await submit(mounted.form, { ...VALID_VALUES, banner: BANNER })
    })

    BddTest().then('it should notify the creation error', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledWith(expect.objectContaining({ title: CREATE_ERROR_TITLE }))
      expect(mockAddSuccessMessage).not.toHaveBeenCalled()
    })

    BddTest().then('it should neither upload the banner nor call onToolAdded', () => {
      expect(requests.some(request => request.pathname.endsWith('/banner'))).toBe(false)
      expect(mounted.onToolAdded).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the upload of the banner fails', () => {
    let mounted: ReturnType<typeof mountUseAddToolForm>

    beforeEach(async () => {
      server.use(http.post(`*${getCreateNationalToolUrl()}`, () => successJsonResponse(
        createMockedCreatedNationalToolDTO({ name: 'Outil', description: 'Une description', url: 'https://www.example.com' }, { id: INTERNAL_ERROR_TOOL_ID })
      )))
      mounted = mountUseAddToolForm()
      await submit(mounted.form, { ...VALID_VALUES, banner: BANNER })
    })

    BddTest().then('it should notify a partial success instead of a success', () => {
      expect(findRequest('POST', getUploadNationalToolBannerUrl(INTERNAL_ERROR_TOOL_ID))).toBeDefined()
      expect(mockAddWarningMessage).toHaveBeenCalledWith({
        title: PARTIAL_SUCCESS_TITLE,
        description: PARTIAL_SUCCESS_DESCRIPTION,
      })
      expect(mockAddSuccessMessage).not.toHaveBeenCalled()
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })

    BddTest().then('it should still call onToolAdded as the tool was created', () => {
      expect(mounted.onToolAdded).toHaveBeenCalledOnce()
    })
  })

  BddTest().when('a valid local tool with a banner is submitted', () => {
    beforeEach(async () => {
      const { form } = mountUseAddToolForm({ isNational: false })
      await submit(form, { ...VALID_VALUES, banner: BANNER })
    })

    BddTest().then('it should use the local tool endpoints', () => {
      expect(findRequest('POST', getCreateLocalToolUrl())).toBeDefined()
      expect(findRequest('POST', getUploadLocalToolBannerUrl(CREATED_TOOL_ID))).toBeDefined()
      expect(findRequest('POST', getCreateNationalToolUrl())).toBeUndefined()
    })
  })
})
