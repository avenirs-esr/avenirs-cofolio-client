import ExportKitButton from '@/features/student/kit/views/StudentToolsKitView/components/interaction/ExportKitButton/ExportKitButton.vue'
import { ExportKitModalStub } from '@/features/student/kit/views/StudentToolsKitView/components/overlay/ExportKitModal/ExportKitModal.stub'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const mockModalOpened = ref(false)
const mockOpenModal = vi.fn()
const mockCloseModal = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useModal: () => ({
      modalOpened: mockModalOpened,
      openModal: mockOpenModal,
      closeModal: mockCloseModal
    })
  }
})

BddTest().given('an ExportKitButton component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ExportKitButton>>

  const stubs = { AvButton: AvButtonStub, ExportKitModal: ExportKitModalStub }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(ExportKitButton, { global: { stubs } })
    })

    BddTest().then('it should render an AvButton', () => {
      expect(wrapper.findComponent(AvButtonStub).exists()).toBe(true)
      expect(wrapper.findComponent(AvButtonStub).props().label).toBe('Exporter mon kit')
    })

    BddTest().then('it should render an hidden ExportKitModal', () => {
      expect(wrapper.findComponent(ExportKitModalStub).exists()).toBe(true)
      expect(wrapper.findComponent(ExportKitModalStub).props().opened).toBe(false)
    })

    BddTest().and('the button is clicked', () => {
      beforeEach(() => {
        wrapper.findComponent(AvButtonStub).trigger('click')
      })

      BddTest().then('it should call openModal', () => {
        expect(mockOpenModal).toHaveBeenCalled()
      })
    })

    BddTest().and('the ExportKitModal emits close', () => {
      beforeEach(() => {
        wrapper.findComponent(ExportKitModalStub).vm.$emit('close')
      })

      BddTest().then('it should call closeModal', () => {
        expect(mockCloseModal).toHaveBeenCalled()
      })
    })
  })
})
