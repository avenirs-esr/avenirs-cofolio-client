import type { EditActivityFormData, } from '@/features/activities/types/forms.types'
import { EActivityThematic } from '@/api/avenir-esr'
import ThematicSelectFormField from '@/features/activities/views/ActivitiesView/components/tabs/NationalActivityContentTab/interactions/formFields/ThematicSelectFormField/ThematicSelectFormField.vue'
import { ThematicSelectStub, } from '@/features/activities/views/ActivitiesView/components/tabs/NationalActivityContentTab/interactions/inputs/ThematicSelect/ThematicSelect.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper, } from '@vue/test-utils'
import { createFormFieldTestWrapper, } from 'tests/utils'
import { beforeEach, expect, vi, } from 'vitest'

const TestWrapper = createFormFieldTestWrapper<EditActivityFormData, 'thematic'>({
  formFieldComponent: ThematicSelectFormField,
  fieldName: 'thematic',
  defaultValue: EActivityThematic.TRANSVERSAL,
  useValidator: () => vi.fn(),
})

BddTest().given('a thematic select form field', () => {
  let wrapper:
  VueWrapper<
    InstanceType<typeof TestWrapper>
  >
  const stubs = { ThematicSelect: ThematicSelectStub, }
  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, {
      global: {
        stubs,
      },
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the thematic select component', () => {
      const select = wrapper.findComponent({
        name: 'ThematicSelect',
      })
      expect(select.exists()).toBe(true)
    })

    BddTest().then('it should have initial thematic value', () => {
      const select = wrapper.findComponent({
        name: 'ThematicSelect',
      })
      expect(select.props('modelValue')).toEqual({
        itemId: EActivityThematic.TRANSVERSAL,
      })
    })

    BddTest().and('the user selects a thematic', () => {
      BddTest().then('it should update the form field value', async () => {
        const select = wrapper.findComponent({
          name: 'ThematicSelect',
        })
        await select.vm.$emit('update:modelValue', {
          itemId: EActivityThematic.TRANSVERSAL,
        })
        await wrapper.vm.$nextTick()
        await vi.waitFor(() => {
          const updated = wrapper.findComponent({
            name: 'ThematicSelect',
          })
          expect(updated.props('modelValue')).toEqual({
            itemId: EActivityThematic.TRANSVERSAL,
          })
        })
      })
    })

    BddTest().and('the input emits blur', () => {
      BddTest().then('it should trigger blur handler', async () => {
        const select = wrapper.findComponent({
          name: 'ThematicSelect',
        })
        await select.vm.$emit('blur')
        await wrapper.vm.$nextTick()
        expect(select.emitted('blur')).toBeTruthy()
      })
    })
  })
})
