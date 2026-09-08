import type { VueWrapper } from '@vue/test-utils'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import { InputStub } from '@/common/components/interaction/inputs/Input/Input.stub'
import { KIT_NAME_MAX_LENGTH } from '@/features/student/kit/config'
import ExportKitModal from '@/features/student/kit/views/StudentToolsKitView/components/overlay/ExportKitModal/ExportKitModal.vue'
import { ExportKitOptions } from '@/features/student/kit/views/StudentToolsKitView/composables/use-export-kit-form/use-export-kit-form'
import { AvCheckboxesGroupStub, AvCheckboxStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockAddSuccessMessage = vi.fn()
const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async () => {
  const actual = await vi.importActual<typeof import('@/store')>('@/store')
  return {
    ...actual,
    useToasterStore: vi.fn(() => ({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage,
    })),
  }
})

const mockGenerateKitDocx = vi.fn()
const mockIsLoading = ref(false)

vi.mock('@/features/student/kit/composables/use-export-kit/use-export-kit', () => ({
  useExportKit: () => ({
    generateKitDocx: mockGenerateKitDocx,
    isLoading: mockIsLoading,
  }),
}))

BddTest().given('an ExportKitModal component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ExportKitModal>>

  const stubs = {
    AvCheckboxesGroup: AvCheckboxesGroupStub,
    AvCheckbox: AvCheckboxStub,
    ConfirmationModal: ConfirmationModalStub,
    Input: InputStub
  }

  function getTextContentCheckbox () {
    return wrapper.findAllComponents(AvCheckboxStub)
      .find(checkbox => checkbox.attributes('data-testid') === 'text-content-checkbox')
  }

  function getMediaContentCheckbox () {
    return wrapper.findAllComponents(AvCheckboxStub)
      .find(checkbox => checkbox.attributes('data-testid') === 'media-content-checkbox')
  }

  const optionSelectionScenarios = [
    {
      getters: [getTextContentCheckbox],
      exportOptions: [[ExportKitOptions.TEXT_CONTENT]],
      label: 'the user selects the text content export option'
    },
    {
      getters: [getMediaContentCheckbox],
      exportOptions: [[ExportKitOptions.MEDIA_CONTENT]],
      label: 'the user selects the media content export option'
    },
    {
      getters: [getTextContentCheckbox, getMediaContentCheckbox],
      exportOptions: [[ExportKitOptions.TEXT_CONTENT], [ExportKitOptions.MEDIA_CONTENT]],
      label: 'the user selects both export options'
    }
  ]

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountComponent(ExportKitModal, { props: { opened: true }, global: { stubs } })
    })

    BddTest().then('it should render a ConfirmationModal', () => {
      expect(wrapper.findComponent(ConfirmationModalStub).exists()).toBe(true)
    })

    BddTest().then('it should disable the confirm button by default', () => {
      expect(wrapper.findComponent(ConfirmationModalStub).props().confirmButtonDisabled).toBe(true)
    })

    BddTest().and('the user closes the modal', () => {
      beforeEach(() => {
        wrapper.findComponent(ConfirmationModalStub).vm.$emit('close')
      })

      BddTest().then('the component should emit close', () => {
        expect(wrapper.emitted('close')).toBeTruthy()
      })
    })

    optionSelectionScenarios.forEach(({ getters, exportOptions, label }) => {
      BddTest().and(label, () => {
        beforeEach(() => {
          getters.forEach((getCheckbox, index) => {
            expect(getCheckbox()?.exists()).toBe(true)
            getCheckbox()!.vm.$emit('update:modelValue', exportOptions[index])
          })
        })

        BddTest().then('the confirm button should still be disabled', () => {
          expect(wrapper.findComponent(ConfirmationModalStub).props().confirmButtonDisabled).toBe(true)
        })

        BddTest().and('the user enters a kit name', () => {
          beforeEach(() => {
            wrapper.findComponent(InputStub).vm.$emit('update:modelValue', 'My Kit Name')
          })

          BddTest().then('the confirm button should be enabled', () => {
            expect(wrapper.findComponent(ConfirmationModalStub).props().confirmButtonDisabled).toBe(false)
          })
        })

        BddTest().and('the user enters a kit name above the character limit', () => {
          beforeEach(() => {
            wrapper.findComponent(InputStub).vm.$emit('update:modelValue', 'A'.repeat(KIT_NAME_MAX_LENGTH + 1))
          })

          BddTest().then('the confirm button should still be disabled', () => {
            expect(wrapper.findComponent(ConfirmationModalStub).props().confirmButtonDisabled).toBe(true)
          })
        })
      })
    })

    BddTest().and('the user enters a kit name', () => {
      beforeEach(() => {
        wrapper.findComponent(InputStub).vm.$emit('update:modelValue', 'My Kit Name')
      })

      BddTest().then('the confirm button should still be disabled', () => {
        expect(wrapper.findComponent(ConfirmationModalStub).props().confirmButtonDisabled).toBe(true)
      })

      optionSelectionScenarios.forEach(({ getters, exportOptions, label }) => {
        BddTest().and(label, () => {
          beforeEach(() => {
            getters.forEach((getCheckbox, index) => {
              getCheckbox()!.vm.$emit('update:modelValue', exportOptions[index])
            })
          })

          BddTest().then('the confirm button should be enabled', () => {
            expect(wrapper.findComponent(ConfirmationModalStub).props().confirmButtonDisabled).toBe(false)
          })
        })
      })
    })

    BddTest().and('the user enters a kit name above the character limit', () => {
      beforeEach(() => {
        wrapper.findComponent(InputStub).vm.$emit('update:modelValue', 'A'.repeat(KIT_NAME_MAX_LENGTH + 1))
      })

      BddTest().then('the confirm button should still be disabled', () => {
        expect(wrapper.findComponent(ConfirmationModalStub).props().confirmButtonDisabled).toBe(true)
      })

      optionSelectionScenarios.forEach(({ getters, exportOptions, label }) => {
        BddTest().and(label, () => {
          beforeEach(() => {
            getters.forEach((getCheckbox, index) => {
              getCheckbox()!.vm.$emit('update:modelValue', exportOptions[index])
            })
          })

          BddTest().then('the confirm button should still be disabled', () => {
            expect(wrapper.findComponent(ConfirmationModalStub).props().confirmButtonDisabled).toBe(true)
          })
        })
      })
    })

    BddTest().and('the user selects the text content option and enters a valid kit name', () => {
      beforeEach(() => {
        wrapper.findComponent(AvCheckboxStub).vm.$emit('update:modelValue', [ExportKitOptions.TEXT_CONTENT])
        wrapper.findComponent(InputStub).vm.$emit('update:modelValue', 'My Kit Name')
      })

      BddTest().then('the confirm button should be enabled', () => {
        expect(wrapper.findComponent(ConfirmationModalStub).props().confirmButtonDisabled).toBe(false)
      })

      BddTest().and('the user clicks the confirm button', () => {
        beforeEach(() => {
          wrapper.findComponent(ConfirmationModalStub).vm.$emit('confirm')
        })

        BddTest().then('it should call generateKitDocx', async () => {
          await vi.waitFor(() => {
            expect(mockGenerateKitDocx).toHaveBeenCalled()
          })
        })
      })

      BddTest().and('the user triggers the form submit', () => {
        beforeEach(() => {
          wrapper.find('form').trigger('submit')
        })

        BddTest().then('it should call generateKitDocx', async () => {
          await vi.waitFor(() => {
            expect(mockGenerateKitDocx).toHaveBeenCalled()
          })
        })
      })
    })

    BddTest().when('the component is mounted with the useExportKit returning a loading state', () => {
      beforeEach(() => {
        mockIsLoading.value = true
        wrapper = mountComponent(ExportKitModal, { props: { opened: true }, global: { stubs } })
      })

      BddTest().and('the user selects the text content option and enters a valid kit name', () => {
        beforeEach(() => {
          wrapper.findComponent(AvCheckboxStub).vm.$emit('update:modelValue', [ExportKitOptions.TEXT_CONTENT])
          wrapper.findComponent(InputStub).vm.$emit('update:modelValue', 'My Kit Name')
        })

        BddTest().then('the confirm button should be in loading state', () => {
          expect(wrapper.findComponent(ConfirmationModalStub).props().isLoading).toBe(true)
        })
      })
    })
  })
})
