import type { AddActivityResourceFileFormData } from '@/features/activities/types/forms.types'
import { InputStub } from '@/common/components/interaction/inputs/Input/Input.stub'
import { ActivityResourceType } from '@/features/activities/types/resource.types'
import AddActivityResourceModal from '@/features/activities/views/EditNationalActivityView/components/AddActivityResourceModal/AddActivityResourceModal.vue'
import { AvFileUploadStub, AvModalStub, AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('an AddActivityResourceModal component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AddActivityResourceModal>>

  const stubs = {
    AvModal: AvModalStub,
    AvSelect: AvSelectStub,
    Input: InputStub,
    AvFileUpload: AvFileUploadStub,
  }

  const getModal = () => wrapper.findComponent(AvModalStub) as VueWrapper<InstanceType<typeof AvModalStub>>
  const getSelect = () => wrapper.findComponent(AvSelectStub) as VueWrapper<InstanceType<typeof AvSelectStub>>
  const getFileUpload = () => wrapper.findComponent(AvFileUploadStub) as VueWrapper<InstanceType<typeof AvFileUploadStub>>
  const getInputByTestId = (testid: string) => {
    const inputs = wrapper.findAllComponents(InputStub) as VueWrapper<InstanceType<typeof InputStub>>[]
    return inputs.find(input => input.attributes('data-testid') === testid)
  }
  const getNameInput = () => getInputByTestId('add-activity-resource-name-input')
  const getLinkInput = () => getInputByTestId('add-activity-resource-link-input')

  const pdfFile = new File(['content'], 'document.pdf', { type: 'application/pdf' })

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(AddActivityResourceModal, {
      props: { opened: true },
      global: { stubs },
    })
  })

  BddTest().when('the modal is mounted with opened=true', () => {
    BddTest().then('it should render the AvModal', () => {
      expect(getModal().exists()).toBe(true)
    })

    BddTest().then('it should pass opened=true to AvModal', () => {
      expect(getModal().props('opened')).toBe(true)
    })

    BddTest().then('it should pass the localized close button label', () => {
      expect(getModal().props('closeButtonLabel')).toBe('Annuler')
    })

    BddTest().then('it should pass the localized confirm button label', () => {
      expect(getModal().props('confirmButtonLabel')).toBe('Ajouter')
    })

    BddTest().then('it should have the confirm button disabled initially', () => {
      expect(getModal().props('confirmButtonDisabled')).toBe(true)
    })

    BddTest().then('it should render the modal title', () => {
      expect(wrapper.text()).toContain('Ajouter un document ou un lien')
    })

    BddTest().then('it should render the type select', () => {
      expect(getSelect().exists()).toBe(true)
    })

    BddTest().then('it should render the file upload for the default FILE type', () => {
      expect(getFileUpload().exists()).toBe(true)
    })

    BddTest().then('it should render the name input for the default FILE type', () => {
      expect(getNameInput()).toBeDefined()
    })

    BddTest().then('it should not render the link input for the default FILE type', () => {
      expect(getLinkInput()).toBeUndefined()
    })
  })

  BddTest().when('mounted with opened=false', () => {
    beforeEach(() => {
      wrapper = mount(AddActivityResourceModal, {
        props: { opened: false },
        global: { stubs },
      })
    })

    BddTest().then('it should pass opened=false to AvModal', () => {
      expect(getModal().props('opened')).toBe(false)
    })
  })

  BddTest().when('the type is switched to LINK', () => {
    beforeEach(async () => {
      await getSelect().find('select').setValue(ActivityResourceType.LINK)
    })

    BddTest().then('it should render the link input', () => {
      expect(getLinkInput()).toBeDefined()
    })

    BddTest().then('it should not render the file upload', () => {
      expect(wrapper.findComponent(AvFileUploadStub).exists()).toBe(false)
    })

    BddTest().then('it should not render the name input', () => {
      expect(getNameInput()).toBeUndefined()
    })
  })

  BddTest().when('the type is switched from LINK back to FILE', () => {
    beforeEach(async () => {
      await getSelect().find('select').setValue(ActivityResourceType.LINK)
      await getSelect().find('select').setValue(ActivityResourceType.FILE)
    })

    BddTest().then('it should render the file upload', () => {
      expect(wrapper.findComponent(AvFileUploadStub).exists()).toBe(true)
    })

    BddTest().then('it should render the name input', () => {
      expect(getNameInput()).toBeDefined()
    })

    BddTest().then('it should not render the link input', () => {
      expect(getLinkInput()).toBeUndefined()
    })
  })

  BddTest().when('a file is selected via the file upload', () => {
    beforeEach(async () => {
      await getFileUpload().vm.$emit('change', [pdfFile])
    })

    BddTest().then('it should auto-fill the resource name with the file name without extension', async () => {
      await vi.waitFor(() => expect(getNameInput()?.props('modelValue')).toBe('document'))
    })
  })

  BddTest().when('a file is selected and the user has already typed a resource name', () => {
    beforeEach(async () => {
      await getNameInput()?.find('input').setValue('Mon nom')
      await getFileUpload().vm.$emit('change', [pdfFile])
    })

    BddTest().then('it should keep the user-typed name and not overwrite it', async () => {
      await vi.waitFor(() => expect(getNameInput()?.props('modelValue')).toBe('Mon nom'))
    })
  })

  BddTest().when('the previously selected file is removed', () => {
    beforeEach(async () => {
      await getFileUpload().vm.$emit('change', [pdfFile])
      await vi.waitFor(() => expect(getNameInput()?.props('modelValue')).toBe('document'))
      await getFileUpload().vm.$emit('update:modelValue', null)
    })

    BddTest().then('it should clear the auto-derived resource name', async () => {
      await vi.waitFor(() => expect(getNameInput()?.props('modelValue')).toBe(''))
    })
  })

  BddTest().when('the confirm button is clicked with a valid FILE payload', () => {
    beforeEach(async () => {
      await getNameInput()?.find('input').setValue('Mon document')
      await getFileUpload().vm.$emit('change', [pdfFile])
      await vi.waitFor(() => expect(getModal().props('confirmButtonDisabled')).toBe(false))
      await getModal().vm.$emit('confirm')
    })

    BddTest().then('it should emit added with the file payload', async () => {
      await vi.waitFor(() => expect(wrapper.emitted('added')).toBeTruthy())
      const payload = wrapper.emitted('added')![0][0]
      expect(payload).toMatchObject({
        resourceType: ActivityResourceType.FILE,
        resourceName: 'Mon document',
      })
    })

    BddTest().then('it should apply the custom resource name to the emitted file preserving the extension', async () => {
      await vi.waitFor(() => expect(wrapper.emitted('added')).toBeTruthy())
      const payload = wrapper.emitted('added')![0][0] as AddActivityResourceFileFormData
      expect(payload.file).toBeInstanceOf(File)
      expect(payload.file?.name).toBe('Mon document.pdf')
    })

    BddTest().then('it should emit close', async () => {
      await vi.waitFor(() => expect(wrapper.emitted('close')).toBeTruthy())
    })

    BddTest().then('it should reset the resource name after adding', async () => {
      await vi.waitFor(() => expect(getNameInput()?.props('modelValue')).toBe(''))
    })
  })

  BddTest().when('the confirm button is clicked and the resource name already matches the file base name', () => {
    beforeEach(async () => {
      await getNameInput()?.find('input').setValue('document')
      await getFileUpload().vm.$emit('change', [pdfFile])
      await vi.waitFor(() => expect(getModal().props('confirmButtonDisabled')).toBe(false))
      await getModal().vm.$emit('confirm')
    })

    BddTest().then('it should emit the original file unchanged', async () => {
      await vi.waitFor(() => expect(wrapper.emitted('added')).toBeTruthy())
      const payload = wrapper.emitted('added')![0][0] as AddActivityResourceFileFormData
      expect(payload.file).toBe(pdfFile)
      expect(payload.file?.name).toBe('document.pdf')
    })
  })

  BddTest().when('a file is selected and the resource name is cleared', () => {
    beforeEach(async () => {
      await getNameInput()?.find('input').setValue('Mon document')
      await getFileUpload().vm.$emit('change', [pdfFile])
      await vi.waitFor(() => expect(getModal().props('confirmButtonDisabled')).toBe(false))
      await getNameInput()?.find('input').setValue('')
    })

    BddTest().then('it should disable the confirm button', async () => {
      await vi.waitFor(() => expect(getModal().props('confirmButtonDisabled')).toBe(true))
    })

    BddTest().then('it should not emit added when confirm is triggered', async () => {
      await getModal().vm.$emit('confirm')
      expect(wrapper.emitted('added')).toBeFalsy()
    })
  })

  BddTest().when('the type is LINK and the link is invalid', () => {
    beforeEach(async () => {
      await getSelect().find('select').setValue(ActivityResourceType.LINK)
      await getLinkInput()?.find('input').setValue('not-a-valid-url')
    })

    BddTest().then('it should keep the confirm button disabled', async () => {
      await vi.waitFor(() => expect(getModal().props('confirmButtonDisabled')).toBe(true))
    })
  })

  BddTest().when('the confirm button is clicked with a valid LINK payload', () => {
    beforeEach(async () => {
      await getSelect().find('select').setValue(ActivityResourceType.LINK)
      await getLinkInput()?.find('input').setValue('https://example.com')
      await vi.waitFor(() => expect(getModal().props('confirmButtonDisabled')).toBe(false))
      await getModal().vm.$emit('confirm')
    })

    BddTest().then('it should emit added with the link payload', async () => {
      await vi.waitFor(() => expect(wrapper.emitted('added')).toBeTruthy())
      const payload = wrapper.emitted('added')![0][0]
      expect(payload).toMatchObject({
        resourceType: ActivityResourceType.LINK,
        link: 'https://example.com',
      })
    })

    BddTest().then('it should emit close', async () => {
      await vi.waitFor(() => expect(wrapper.emitted('close')).toBeTruthy())
    })
  })

  BddTest().when('the modal emits close', () => {
    beforeEach(async () => {
      await getModal().vm.$emit('close')
    })

    BddTest().then('it should re-emit the close event', () => {
      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })
})
