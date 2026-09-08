import ExportKitButton from '@/features/student/kit/views/StudentToolsKitView/components/interaction/ExportKitButton/ExportKitButton.vue'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

const mockGenerateKitDocx = vi.fn()
const mockIsLoading = ref(false)

vi.mock('@/features/student/kit/composables/use-export-kit/use-export-kit', () => ({
  useExportKit: () => ({
    generateKitDocx: mockGenerateKitDocx,
    isLoading: mockIsLoading,
  }),
}))

BddTest().given('an ExportKitButton component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ExportKitButton>>

  const stubs = { AvButton: AvButtonStub }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(ExportKitButton, { global: { stubs } })
    })

    BddTest().then('it should render an AvButton', () => {
      expect(wrapper.findComponent(AvButtonStub).exists()).toBe(true)
      expect(wrapper.findComponent(AvButtonStub).props().label).toBe('Exporter mon kit')
    })

    BddTest().and('the button is clicked', () => {
      beforeEach(() => {
        wrapper.findComponent(AvButtonStub).trigger('click')
      })

      BddTest().then('it should call generateKitDocx', () => {
        expect(mockGenerateKitDocx).toHaveBeenCalled()
      })
    })
  })

  BddTest().when('the useExportKit returns a loading state', () => {
    beforeEach(() => {
      mockIsLoading.value = true
      wrapper = mount(ExportKitButton, { global: { stubs } })
    })

    BddTest().then('the AvButton should be in loading state', () => {
      expect(wrapper.findComponent(AvButtonStub).props('isLoading')).toBe(true)
    })
  })
})
