import type { VueWrapper } from '@vue/test-utils'
import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { EActivityThematic } from '@/api/avenir-esr'
import { ActivityThematicSelectStub } from '@/common/activities/inputs/ActivityThematicSelect/ActivityThematicSelect.stub'
import ThematicSelectFormField from '@/features/staff/activities/views/ActivitiesView/components/tabs/NationalActivityContentTab/interactions/formFields/ThematicSelectFormField/ThematicSelectFormField.vue'

const TestWrapper = createFormFieldTestWrapper<EditActivityFormData, 'thematic'>({
  formFieldComponent: ThematicSelectFormField,
  fieldName: 'thematic',
  defaultValue: EActivityThematic.TRANSVERSAL,
  useValidator: () => vi.fn(),
})

BddTest().given('a thematic select form field', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    ActivityThematicSelect: ActivityThematicSelectStub,
  }

  const mountWith = () => {
    wrapper = mount(TestWrapper, {
      global: { stubs },
    })
  }

  const getFormField = () => wrapper.findComponent(ThematicSelectFormField)
  const getSelect = () => wrapper.findComponent(ActivityThematicSelectStub)

  const getAutosaves = () => getFormField().emitted('autosave')

  const emitFromSelect = async (event: 'update:modelValue' | 'blur', ...args: unknown[]) => {
    getSelect().vm.$emit(event, ...args)
    await wrapper.vm.$nextTick()
  }

  const expectSelectedThematic = async (thematic: EActivityThematic) => {
    await vi.waitFor(() => {
      expect(getSelect().props('modelValue')).toBe(thematic)
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should configure the thematic select as required, with its icon', () => {
      const select = getSelect()
      expect(select.exists()).toBe(true)
      expect(select.props('prefixIcon')).toBe(MDI_ICONS.BOOK_OPEN_VARIANT)
      expect(select.props('required')).toBe(true)
    })

    BddTest().then('it should select the initial thematic', async () => {
      await expectSelectedThematic(EActivityThematic.TRANSVERSAL)
    })

    BddTest().and('the user selects a thematic', () => {
      beforeEach(async () => {
        await emitFromSelect('update:modelValue', EActivityThematic.PROGRAMS)
      })

      BddTest().then('it should update the form field value', async () => {
        await expectSelectedThematic(EActivityThematic.PROGRAMS)
      })

      BddTest().then('it should autosave the selected thematic', () => {
        expect(getAutosaves()).toEqual([[{
          thematic: EActivityThematic.PROGRAMS
        }]])
      })
    })

    BddTest().and('the user clears the selection', () => {
      beforeEach(async () => {
        await emitFromSelect('update:modelValue', undefined)
      })

      BddTest().then('it should keep the current thematic', async () => {
        await expectSelectedThematic(EActivityThematic.TRANSVERSAL)
      })

      BddTest().then('it should not autosave', () => {
        expect(getAutosaves()).toBeUndefined()
      })
    })

    BddTest().and('the select emits blur', () => {
      beforeEach(async () => {
        await emitFromSelect('blur')
      })

      BddTest().then('it should not autosave', () => {
        expect(getAutosaves()).toBeUndefined()
      })
    })
  })
})
