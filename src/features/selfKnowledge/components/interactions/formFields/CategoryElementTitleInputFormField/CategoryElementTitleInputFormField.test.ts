import type { AddSelfKnowledgeCategoryElementForm } from '@/features/selfKnowledge/types/forms.types'
import CategoryElementTitleInputFormField
  from '@/features/selfKnowledge/components/interactions/formFields/CategoryElementTitleInputFormField/CategoryElementTitleInputFormField.vue'
import { CategoryElementTitleInputStub } from '@/features/selfKnowledge/components/interactions/inputs/CategoryElementTitleInput/CategoryElementTitleInput.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = defineComponent({
  components: {
    CategoryElementTitleInputFormField
  },
  setup () {
    const form = useForm({
      defaultValues: { title: '', description: '', rating: null },
      validators: {
        onSubmit ({ value }) {
          if (!value.title || value.title.trim() === '') {
            return {
              fields: {
                title: 'Le titre est requis'
              }
            }
          }
          return { fields: { title: undefined } }
        }
      }
    }) as unknown as AddSelfKnowledgeCategoryElementForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <CategoryElementTitleInputFormField :form="form" />
    </form>
  `
})

BddTest().given('a self knowledge category element title input form field component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    CategoryElementTitleInput: CategoryElementTitleInputStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
    })

    BddTest().then('it should render the title input', () => {
      const input = wrapper.findComponent({ name: 'CategoryElementTitleInput' })
      expect(input.exists()).toBe(true)
      const textInput = input.find('input')
      expect(textInput.exists()).toBe(true)
    })

    BddTest().then('it should have the correct id', () => {
      const input = wrapper.findComponent({ name: 'CategoryElementTitleInput' })
      expect(input.props('id')).toBe('element-title')
    })

    BddTest().then('it should be required', () => {
      const input = wrapper.findComponent({ name: 'CategoryElementTitleInput' })
      expect(input.props('required')).toBe(true)
    })

    BddTest().then('it should have empty initial value', () => {
      const input = wrapper.findComponent({ name: 'CategoryElementTitleInput' })
      expect(input.props('modelValue')).toBe('')
    })
  })

  BddTest().and('the user types in the input', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const input = wrapper.findComponent({ name: 'CategoryElementTitleInput' })
      const textInput = input.find('input')
      await textInput.setValue('My element title')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the form field value', async () => {
      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'CategoryElementTitleInput' })
        expect(updated.props('modelValue')).toBe('My element title')
      })
    })
  })

  BddTest().and('the user blurs the input', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const input = wrapper.findComponent({ name: 'CategoryElementTitleInput' })
      const textInput = input.find('input')
      await textInput.trigger('blur')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should trigger blur handler', () => {
      const input = wrapper.findComponent({ name: 'CategoryElementTitleInput' })
      expect(input.emitted('blur')).toBeTruthy()
    })
  })

  BddTest().and('the form is submitted with empty title', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should show validation error', async () => {
      await vi.waitFor(() => {
        const input = wrapper.findComponent({ name: 'CategoryElementTitleInput' })
        expect(input.props('errorMessage')).toBe('Le titre est requis')
      })
    })
  })

  BddTest().and('the form is submitted with valid title', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const input = wrapper.findComponent({ name: 'CategoryElementTitleInput' })
      const textInput = input.find('input')
      await textInput.setValue('Valid title')
      await wrapper.vm.$nextTick()
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should not show validation error', async () => {
      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'CategoryElementTitleInput' })
        expect(updated.props('errorMessage')).toBeFalsy()
      })
    })
  })

  BddTest().and('the user provides a valid string value', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const input = wrapper.findComponent({ name: 'CategoryElementTitleInput' })
      const textInput = input.find('input')
      await textInput.setValue('Valid title')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the form state', async () => {
      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'CategoryElementTitleInput' })
        expect(updated.props('modelValue')).toBe('Valid title')
      })
    })
  })

  BddTest().and('the user types and then clears the title', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const input = wrapper.findComponent({ name: 'CategoryElementTitleInput' })
      const textInput = input.find('input')
      await textInput.setValue('Some title')
      await wrapper.vm.$nextTick()
      await textInput.setValue('')
      await wrapper.vm.$nextTick()
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should show validation error on submit', async () => {
      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'CategoryElementTitleInput' })
        expect(updated.props('errorMessage')).toBe('Le titre est requis')
      })
    })
  })
})
