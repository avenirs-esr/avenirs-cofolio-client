import type { VueWrapper } from '@vue/test-utils'
import { declaredProgramsQueryEmptyHandler, declaredProgramsQueryErrorHandler, declaredProgramsQueryHandler } from '@/__mocks__/msw/handlers/student/declaredPrograms.handlers'
import { server } from '@/__mocks__/msw/server'
import { LoaderStub } from '@/common/components/Loader/Loader.stub'
import { DeleteDeclaredProgramConfirmModalStub } from '@/features/student/personalCareer/components/overlays/DeleteDeclaredProgramConfirmModal/DeleteDeclaredProgramConfirmModal.stub'
import { DeclaredProgramSelectorStub } from '@/features/student/personalCareer/views/PersonalCareerView/sections/ProgramsSection/components/DeclaredProgramSelector/DeclaredProgramSelector.stub'
import DeleteDeclaredProgramsModal from '@/features/student/personalCareer/views/PersonalCareerView/sections/ProgramsSection/components/DeleteDeclaredProgramsModal/DeleteDeclaredProgramsModal.vue'
import { AvModalStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockShowModal = ref(false)
const mockDisplayModal = vi.fn()
const mockHideModal = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useModal: () => ({
      showModal: mockShowModal,
      displayModal: mockDisplayModal,
      hideModal: mockHideModal
    }),
  }
})

BddTest().given('a delete declared programs modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteDeclaredProgramsModal>>

  const stubs = {
    AvModal: AvModalStub,
    Loader: LoaderStub,
    DeclaredProgramSelector: DeclaredProgramSelectorStub,
    DeleteDeclaredProgramConfirmModal: DeleteDeclaredProgramConfirmModalStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountComponent(DeleteDeclaredProgramsModal, { props: { show: true }, global: { stubs } })
    })

    BddTest().then('it should render the loader initially', () => {
      const loader = wrapper.find('[data-testid="loader-stub"]')
      expect(loader.exists()).toBe(true)
    })

    BddTest().and('the user closes the main modal', () => {
      beforeEach(async () => {
        const modal = wrapper.findComponent(AvModalStub)
        await modal.vm.$emit('close')
      })

      BddTest().then('it should emit close', () => {
        expect(wrapper.emitted('close')).toBeTruthy()
      })
    })
  })

  BddTest().when('the component is mounted and the query returns no declared programs', () => {
    beforeEach(() => {
      server.use(declaredProgramsQueryEmptyHandler)
      wrapper = mountComponent(DeleteDeclaredProgramsModal, { props: { show: true }, global: { stubs } })
    })

    BddTest().then('it should render the loader initially and then show no programs', async () => {
      const loader = wrapper.find('[data-testid="loader-stub"]')
      expect(loader.exists()).toBe(true)

      await vi.waitFor(() => {
        const noProgramsMessage = wrapper.find('[data-testid="no-declared-programs-message"]')
        expect(noProgramsMessage.exists()).toBe(true)
      })
    })
  })

  BddTest().when('the component is mounted and the query returns an error', () => {
    beforeEach(() => {
      server.use(declaredProgramsQueryErrorHandler)
      wrapper = mountComponent(DeleteDeclaredProgramsModal, { props: { show: true }, global: { stubs } })
    })

    BddTest().then('it should render the loader initially and then show no programs', async () => {
      const loader = wrapper.find('[data-testid="loader-stub"]')
      expect(loader.exists()).toBe(true)

      await vi.waitFor(() => {
        const noProgramsMessage = wrapper.find('[data-testid="no-declared-programs-message"]')
        expect(noProgramsMessage.exists()).toBe(true)
      })
    })
  })

  BddTest().when('the component is mounted and the query returns declared programs', () => {
    beforeEach(() => {
      server.use(declaredProgramsQueryHandler)
      wrapper = mountComponent(DeleteDeclaredProgramsModal, { props: { show: true }, global: { stubs } })
    })

    BddTest().then('it should render the loader initially and then show the declared program selector', async () => {
      const loader = wrapper.find('[data-testid="loader-stub"]')
      expect(loader.exists()).toBe(true)
    })

    BddTest().and('the user selects declared programs', () => {
      beforeEach(async () => {
        await vi.waitFor(() => {
          const declaredProgramSelector = wrapper.findComponent(DeclaredProgramSelectorStub)
          expect(declaredProgramSelector.exists()).toBe(true)
          declaredProgramSelector.vm.$emit('update:modelValue', [1, 2])
        })
      })

      BddTest().and('the user confirms deletion', () => {
        beforeEach(() => {
          const deleteConfirmModal = wrapper.findComponent(DeleteDeclaredProgramConfirmModalStub)
          deleteConfirmModal.vm.$emit('confirm')
        })

        BddTest().then('it should emit confirm with the selected ids', () => {
          expect(wrapper.emitted('confirm')).toBeTruthy()
        })
      })
    })
  })
})
