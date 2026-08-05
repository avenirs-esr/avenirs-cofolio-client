import { mockedSelfKnowledgeCategoriesAvailable } from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import { createSelfKnowledgeCategoriesAvailableHandler } from '@/__mocks__/msw/handlers/student/self-knowledge.handlers'
import { server } from '@/__mocks__/msw/server'
import AddSelfKnowledgeCategoriesModal from '@/features/student/selfKnowledge/components/modals/AddSelfKnowledgeCategoriesModal/AddSelfKnowledgeCategoriesModal.vue'
import { AvCheckboxStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mockAddErrorMessage, mockAddSuccessMessage } from 'tests/mocks'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage
    })
  }
})

const AvModalStub = defineComponent({
  name: 'AvModal',
  template: `
    <div class="av-modal-stub">
      <slot name="header" />
      <slot />
    </div>
  `,
  props: ['opened', 'id', 'closeButtonLabel', 'confirmButtonLabel'],
  emits: ['close', 'confirm']
})

const AvCheckboxesGroupStub = defineComponent({
  name: 'AvCheckboxesGroup',
  props: ['modelValue', 'options'],
  emits: ['update:modelValue'],
  template: `
    <fieldset class="av-checkboxes-group-stub">
      <slot />
    </fieldset>
  `
})

BddTest().given('an add self knowledge categories modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof AddSelfKnowledgeCategoriesModal>>

  const stubs = {
    AvModal: AvModalStub,
    AvCheckboxesGroup: AvCheckboxesGroupStub,
    AvCheckbox: AvCheckboxStub
  }

  BddTest().when('the component is mounted without categories available', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      const handler = createSelfKnowledgeCategoriesAvailableHandler([])
      server.use(handler)

      wrapper = mountComponent(AddSelfKnowledgeCategoriesModal, {
        props: { show: true },
        global: { stubs }
      })

      await flushPromises()
      await vi.waitFor(() => {
        expect(wrapper.findComponent(AvModalStub).exists()).toBe(true)
      })
    })

    BddTest().then('it should render the modal without available categories', () => {
      const modal = wrapper.findComponent(AvModalStub)
      expect(modal.exists()).toBe(true)

      const checkboxesGroup = wrapper.findComponent(AvCheckboxesGroupStub)
      expect(checkboxesGroup.exists()).toBe(false)

      const modalText = wrapper.text()
      expect(modalText).toContain('Vous avez ajouté toutes les catégories actuellement disponible sur COFOLIO.')
    })

    BddTest().and('the user closes the modal', () => {
      beforeEach(async () => {
        wrapper.findComponent(AvModalStub).vm.$emit('close')
      })

      BddTest().then('it should not call the mutation and not show any message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).not.toHaveBeenCalled()
          expect(mockAddErrorMessage).not.toHaveBeenCalled()
        })
      })

      BddTest().then('it should emit the cancel event', () => {
        expect(wrapper.emitted('cancel')).toBeTruthy()
      })
    })
  })

  BddTest().when('the component is mounted with categories available', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      const handler = createSelfKnowledgeCategoriesAvailableHandler(mockedSelfKnowledgeCategoriesAvailable)
      server.use(handler)

      wrapper = mountComponent(AddSelfKnowledgeCategoriesModal, {
        props: { show: true },
        global: { stubs }
      })

      await vi.waitFor(() => {
        expect(wrapper.findComponent(AvCheckboxesGroupStub).exists()).toBe(true)
      })
    })

    BddTest().then('it should render the modal with available categories', () => {
      const modal = wrapper.findComponent({ name: 'AvModal' })
      expect(modal.exists()).toBe(true)

      const checkboxes = wrapper.findAllComponents(AvCheckboxStub)
      expect(checkboxes.length).toBe(mockedSelfKnowledgeCategoriesAvailable.length)

      const modalText = wrapper.text()
      expect(modalText).toContain('Quelles catégories souhaitez-vous ajouter ?')
    })

    BddTest().and('the user closes the modal', () => {
      beforeEach(async () => {
        wrapper.findComponent(AvModalStub).vm.$emit('close')
      })

      BddTest().then('it should not call the mutation and not show any message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).not.toHaveBeenCalled()
          expect(mockAddErrorMessage).not.toHaveBeenCalled()
        })
      })

      BddTest().then('it should emit the cancel event', () => {
        expect(wrapper.emitted('cancel')).toBeTruthy()
      })
    })

    BddTest().and('the user selects categories and confirms', () => {
      beforeEach(async () => {
        const checkboxes = wrapper.findAllComponents(AvCheckboxStub)
        for (const checkbox of checkboxes) {
          await checkbox.find('input').setValue(true)
          await flushPromises()
        }
        wrapper.findComponent(AvModalStub).vm.$emit('confirm')
      })

      BddTest().then('it should call the mutation and show a success message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).toHaveBeenCalledWith(`${mockedSelfKnowledgeCategoriesAvailable.length} catégories ajoutées avec succès`)
          expect(mockAddErrorMessage).not.toHaveBeenCalled()
        })
      })
    })

    BddTest().and('the user does not select categories but confirms anyway', () => {
      beforeEach(async () => {
        wrapper.findComponent(AvModalStub).vm.$emit('confirm')
      })

      BddTest().then('it should call the mutation and show a success message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).not.toHaveBeenCalled()
          expect(mockAddErrorMessage).toHaveBeenCalled()
        })
      })
    })
  })
})
