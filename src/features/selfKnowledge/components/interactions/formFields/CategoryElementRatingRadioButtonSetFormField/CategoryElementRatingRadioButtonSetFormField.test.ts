import type { AddSelfKnowledgeCategoryElementForm } from '@/features/selfKnowledge/types/forms.types'
import CategoryElementRatingRadioButtonSetFormField
  from '@/features/selfKnowledge/components/interactions/formFields/CategoryElementRatingRadioButtonSetFormField/CategoryElementRatingRadioButtonSetFormField.vue'
import { CategoryElementRatingRadioButtonSetStub } from '@/features/selfKnowledge/components/interactions/inputs/CategoryElementRatingRadioButtonSet/CategoryElementRatingRadioButtonSet.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = defineComponent({
  components: {
    CategoryElementRatingRadioButtonSetFormField
  },
  setup () {
    const form = useForm({
      defaultValues: { title: '', description: '', rating: null },
      validators: {
        onSubmit () {
          return { fields: { rating: undefined } }
        }
      }
    }) as unknown as AddSelfKnowledgeCategoryElementForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <CategoryElementRatingRadioButtonSetFormField :form="form" />
    </form>
  `
})

BddTest().given('a self knowledge category element rating input form field component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    CategoryElementRatingRadioButtonSet: CategoryElementRatingRadioButtonSetStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
    })

    BddTest().then('it should render the rating input', () => {
      const input = wrapper.findComponent({ name: 'CategoryElementRatingRadioButtonSet' })
      expect(input.exists()).toBe(true)
    })

    BddTest().then('it should have null initial value', () => {
      const input = wrapper.findComponent({ name: 'CategoryElementRatingRadioButtonSet' })
      expect(input.props('modelValue')).toBe(null)
    })

    BddTest().then('it should render rating options', () => {
      const buttons = wrapper.findAll('[data-rating]')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  BddTest().and('the user selects rating 5', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const button = wrapper.find('[data-rating="5"]')
      await button.trigger('click')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the form field value to 5', async () => {
      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'CategoryElementRatingRadioButtonSet' })
        expect(updated.props('modelValue')).toBe(5)
      })
    })
  })

  BddTest().and('the user selects rating 4', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const button = wrapper.find('[data-rating="4"]')
      await button.trigger('click')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the form field value to 4', async () => {
      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'CategoryElementRatingRadioButtonSet' })
        expect(updated.props('modelValue')).toBe(4)
      })
    })
  })

  BddTest().and('the user selects rating 3', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const button = wrapper.find('[data-rating="3"]')
      await button.trigger('click')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the form field value to 3', async () => {
      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'CategoryElementRatingRadioButtonSet' })
        expect(updated.props('modelValue')).toBe(3)
      })
    })
  })

  BddTest().and('the user selects rating 2', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const button = wrapper.find('[data-rating="2"]')
      await button.trigger('click')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the form field value to 2', async () => {
      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'CategoryElementRatingRadioButtonSet' })
        expect(updated.props('modelValue')).toBe(2)
      })
    })
  })

  BddTest().and('the user selects rating 1', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const button = wrapper.find('[data-rating="1"]')
      await button.trigger('click')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the form field value to 1', async () => {
      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'CategoryElementRatingRadioButtonSet' })
        expect(updated.props('modelValue')).toBe(1)
      })
    })
  })

  BddTest().and('the user selects rating 0', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const button = wrapper.find('[data-rating="0"]')
      await button.trigger('click')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the form field value to 0', async () => {
      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'CategoryElementRatingRadioButtonSet' })
        expect(updated.props('modelValue')).toBe(0)
      })
    })
  })

  BddTest().and('the rating input emits blur', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const input = wrapper.findComponent({ name: 'CategoryElementRatingRadioButtonSet' })
      await input.vm.$emit('blur')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should trigger blur handler', () => {
      const input = wrapper.findComponent({ name: 'CategoryElementRatingRadioButtonSet' })
      expect(input.emitted('blur')).toBeTruthy()
    })
  })

  BddTest().and('the form is submitted', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should not show validation error', async () => {
      await vi.waitFor(() => {
        const input = wrapper.findComponent({ name: 'CategoryElementRatingRadioButtonSet' })
        expect(input.props('errorMessage')).toBeFalsy()
      })
    })
  })

  BddTest().and('the user changes rating multiple times', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const button3 = wrapper.find('[data-rating="3"]')
      await button3.trigger('click')
      await wrapper.vm.$nextTick()
      const button5 = wrapper.find('[data-rating="5"]')
      await button5.trigger('click')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update to the latest value', async () => {
      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'CategoryElementRatingRadioButtonSet' })
        expect(updated.props('modelValue')).toBe(5)
      })
    })
  })
})
