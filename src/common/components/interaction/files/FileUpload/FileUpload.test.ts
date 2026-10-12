import FileUpload from '@/common/components/interaction/files/FileUpload/FileUpload.vue'
import { AvIconStub, AvModalStub, AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'

const existingFile = new File(['content'], 'existing.pdf', { type: 'application/pdf' })

BddTest().given('a file upload with an existing file', () => {
  let wrapper: ReturnType<typeof mountComponent>
  const formSubmit = vi.fn()

  const stubs = {
    AvIcon: AvIconStub,
    AvModal: AvModalStub,
    AvTooltip: AvTooltipStub,
  }

  const TestHost = defineComponent({
    components: { FileUpload },
    setup: () => ({ existingFile, formSubmit, files: ref([existingFile]) }),
    template: `
      <form @submit="formSubmit">
        <FileUpload
          v-model="files"
          title="Files"
          description="Upload files"
          confirm-delete
        />
      </form>
    `,
  })

  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', class {
      observe () {}
      unobserve () {}
      disconnect () {}
    })
    vi.clearAllMocks()
    wrapper = mountComponent(TestHost, { global: { stubs } })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  BddTest().when('the delete button requests confirmation', () => {
    BddTest().then('it should open confirmation without submitting the enclosing form', async () => {
      const deleteButton = wrapper.find('button.av-button')
      await deleteButton.trigger('click')
      await nextTick()

      const fileUpload = wrapper.findComponent(FileUpload)
      expect(fileUpload.props('modelValue')).toEqual([existingFile])
      expect(deleteButton.attributes('type')).toBe('button')
      expect(wrapper.findComponent(AvModalStub).props('opened')).toBe(true)
      expect(formSubmit).not.toHaveBeenCalled()
    })
  })

  BddTest().when('files are selected', () => {
    BddTest().then('it should update the model', async () => {
      const newFile = new File(['new'], 'new.pdf', { type: 'application/pdf' })
      const fileUploadComponent = wrapper.findComponent(FileUpload)

      await wrapper.findComponent({ name: 'AvFileUpload' }).vm.$emit('update:modelValue', [newFile])

      expect(fileUploadComponent.emitted('update:modelValue')).toEqual([[[newFile]]])
    })

    BddTest().then('it should display the total loaded file size in the valid message', async () => {
      const file = new File([new Uint8Array(1572864)], 'large.pdf', { type: 'application/pdf' })
      const fileUpload = wrapper.findComponent({ name: 'AvFileUpload' })

      await fileUpload.vm.$emit('update:modelValue', [file])
      await nextTick()

      expect(fileUpload.props('validMessage')).toMatch(/1[,.]5 (MB|Mo)/)
    })
  })
})
