import { AddSelfKnowledgeCategoriesModalStub } from '@/features/student/selfKnowledge/components/modals/AddSelfKnowledgeCategoriesModal/AddSelfKnowledgeCategoriesModal.stub'
import SelfKnowledgeMainSection from '@/features/student/selfKnowledge/components/SelfKnowledgeMainSection/SelfKnowledgeMainSection.vue'
import { AvButtonStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a self knowledge section component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeMainSection>>

  const stubs = {
    AvButton: AvButtonStub,
    AvIconText: AvIconTextStub,
    AddSelfKnowledgeCategoriesModal: AddSelfKnowledgeCategoriesModalStub
  }

  const getAddButton = () => {
    return wrapper.findAllComponents(AvButtonStub)
      .find(button => button.props('label') === 'Ajouter une catégorie')
  }

  beforeEach(() => {
    wrapper = mount(SelfKnowledgeMainSection, { global: { stubs } })
  })

  BddTest().when('the self knowledge section is mounted', () => {
    BddTest().then('it should render the self knowledge title', () => {
      const avIconText = wrapper.findComponent(AvIconTextStub)
      expect(avIconText.exists()).toBe(true)
      expect(avIconText.props('text')).toBe('Qui je suis ?')
      expect(avIconText.props('icon')).toBe('mdi:account-circle-outline')
    })

    BddTest().then('it should render the add self knowledge categories button', () => {
      const addButton = getAddButton()
      expect(addButton).toBeDefined()
      expect(addButton?.props('icon')).toBe('mdi:plus-circle-outline')
    })

    BddTest().then('it should render the add self knowledge categories modal in hidden state', () => {
      const addModal = wrapper.findComponent(AddSelfKnowledgeCategoriesModalStub)
      expect(addModal.exists()).toBe(true)
      expect(addModal.props('show')).toBe(false)
    })

    BddTest().and('the add button is clicked', () => {
      beforeEach(async () => {
        const addButton = getAddButton()
        await addButton?.trigger('click')
      })

      BddTest().then('it should show the add self knowledge categories modal', () => {
        const addModal = wrapper.findComponent(AddSelfKnowledgeCategoriesModalStub)
        expect(addModal.props('show')).toBe(true)
      })

      BddTest().and('the add self knowledge categories modal emits a cancel event', () => {
        beforeEach(() => {
          const addModal = wrapper.findComponent(AddSelfKnowledgeCategoriesModalStub)
          addModal.vm.$emit('cancel')
        })

        BddTest().then('it should hide the add self knowledge categories modal', () => {
          const addModal = wrapper.findComponent(AddSelfKnowledgeCategoriesModalStub)
          expect(addModal.props('show')).toBe(false)
        })
      })

      BddTest().and('the add self knowledge categories modal emits a confirm event', () => {
        beforeEach(() => {
          const addModal = wrapper.findComponent(AddSelfKnowledgeCategoriesModalStub)
          addModal.vm.$emit('confirm')
        })

        BddTest().then('it should hide the add self knowledge categories modal', () => {
          const addModal = wrapper.findComponent(AddSelfKnowledgeCategoriesModalStub)
          expect(addModal.props('show')).toBe(false)
        })
      })
    })
  })
})
