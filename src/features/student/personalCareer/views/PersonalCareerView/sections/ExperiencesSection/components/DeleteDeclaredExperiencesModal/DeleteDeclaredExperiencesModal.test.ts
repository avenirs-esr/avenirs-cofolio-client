import type { VueWrapper } from '@vue/test-utils'
import { declaredExperiencesQueryEmptyHandler, declaredExperiencesQueryErrorHandler, declaredExperiencesQueryHandler } from '@/__mocks__/msw/handlers/student/declaredExperiences.handlers'
import { server } from '@/__mocks__/msw/server'
import { LoaderStub } from '@/common/components/Loader/Loader.stub'
import { DeleteDeclaredExperienceConfirmModalStub } from '@/features/student/personalCareer/components/overlays/DeleteDeclaredExperienceConfirmModal/DeleteDeclaredExperienceConfirmModal.stub'
import { DeclaredExperienceSelectorStub } from '@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/components/DeclaredExperienceSelector/DeclaredExperienceSelector.stub'
import DeleteDeclaredExperiencesModal from '@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/components/DeleteDeclaredExperiencesModal/DeleteDeclaredExperiencesModal.vue'
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

BddTest().given('a delete declared experiences modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteDeclaredExperiencesModal>>

  const stubs = {
    AvModal: AvModalStub,
    Loader: LoaderStub,
    DeclaredExperienceSelector: DeclaredExperienceSelectorStub,
    DeleteDeclaredExperienceConfirmModal: DeleteDeclaredExperienceConfirmModalStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountComponent(DeleteDeclaredExperiencesModal, { props: { show: true, totalCount: 10 }, global: { stubs } })
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

  BddTest().when('the component is mounted and the query returns no declared experiences', () => {
    beforeEach(() => {
      server.use(declaredExperiencesQueryEmptyHandler)
      wrapper = mountComponent(DeleteDeclaredExperiencesModal, { props: { show: true, totalCount: 10 }, global: { stubs } })
    })

    BddTest().then('it should render the loader initially and then show no experiences', async () => {
      const loader = wrapper.find('[data-testid="loader-stub"]')
      expect(loader.exists()).toBe(true)

      await vi.waitFor(() => {
        const noExperiencesMessage = wrapper.find('[data-testid="no-declared-experiences-message"]')
        expect(noExperiencesMessage.exists()).toBe(true)
      })
    })
  })

  BddTest().when('the component is mounted and the query returns an error', () => {
    beforeEach(() => {
      server.use(declaredExperiencesQueryErrorHandler)
      wrapper = mountComponent(DeleteDeclaredExperiencesModal, { props: { show: true, totalCount: 10 }, global: { stubs } })
    })

    BddTest().then('it should render the loader initially and then show no experiences', async () => {
      const loader = wrapper.find('[data-testid="loader-stub"]')
      expect(loader.exists()).toBe(true)

      await vi.waitFor(() => {
        const noExperiencesMessage = wrapper.find('[data-testid="no-declared-experiences-message"]')
        expect(noExperiencesMessage.exists()).toBe(true)
      })
    })
  })

  BddTest().when('the component is mounted and the query returns declared experiences', () => {
    beforeEach(() => {
      server.use(declaredExperiencesQueryHandler)
      wrapper = mountComponent(DeleteDeclaredExperiencesModal, { props: { show: true, totalCount: 10 }, global: { stubs } })
    })

    BddTest().then('it should render the loader initially and then show the declared experience selector', async () => {
      const loader = wrapper.find('[data-testid="loader-stub"]')
      expect(loader.exists()).toBe(true)
    })

    BddTest().and('the user selects declared experiences', () => {
      beforeEach(async () => {
        await vi.waitFor(() => {
          const declaredExperienceSelector = wrapper.findComponent(DeclaredExperienceSelectorStub)
          expect(declaredExperienceSelector.exists()).toBe(true)
          declaredExperienceSelector.vm.$emit('update:modelValue', [1, 2])
        })
      })

      BddTest().and('the user confirms deletion', () => {
        beforeEach(() => {
          const deleteConfirmModal = wrapper.findComponent(DeleteDeclaredExperienceConfirmModalStub)
          deleteConfirmModal.vm.$emit('confirm')
        })

        BddTest().then('it should emit confirm with the selected ids', () => {
          expect(wrapper.emitted('confirm')).toBeTruthy()
        })
      })
    })
  })
})
