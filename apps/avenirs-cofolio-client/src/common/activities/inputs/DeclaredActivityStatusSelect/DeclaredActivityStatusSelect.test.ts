import type { AvSelectOption } from '@avenirs-esr/avenirs-dsav'
import type { VueWrapper } from '@vue/test-utils'
import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { EDeclaredActivityStatus } from '@/api/avenir-esr'
import DeclaredActivityStatusSelect from '@/common/activities/inputs/DeclaredActivityStatusSelect/DeclaredActivityStatusSelect.vue'

const LABEL = 'Statut'
const PLACEHOLDER = 'Sélectionner un/des statut(s)'
const SUBMITTED_FOR_FEEDBACK_LABEL = 'Soumis pour feedback'

type MountProps = InstanceType<typeof DeclaredActivityStatusSelect>['$props']

const SELECTION_CASES: Array<{ description: string, modelValue: EDeclaredActivityStatus[] }> = [
  {
    description: 'a single status',
    modelValue: [EDeclaredActivityStatus.SUBSCRIBED],
  },
  {
    description: 'several statuses',
    modelValue: [EDeclaredActivityStatus.SUBSCRIBED, EDeclaredActivityStatus.IN_PROGRESS],
  },
]

BddTest().given('a declared activity status select component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredActivityStatusSelect>>

  const stubs = {
    AvSelect: AvSelectStub
  }

  const mountWith = (props: MountProps = {}) => {
    wrapper = mount(DeclaredActivityStatusSelect, {
      props,
      global: { stubs }
    })
  }

  const getSelect = () => wrapper.findComponent(AvSelectStub)
  const getOptionValues = () => (getSelect().props('options') as AvSelectOption[]).map(option => option.value)

  const toAvSelectModelValue = (statuses: EDeclaredActivityStatus[]) => statuses.map(value => ({ value }))

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should configure AvSelect in multiple mode', () => {
      expect(getSelect().props()).toMatchObject({
        label: LABEL,
        placeholder: PLACEHOLDER,
        multiple: true,
      })
    })

    BddTest().then('it should not select any status', () => {
      expect(getSelect().props('modelValue')).toEqual([])
    })

    BddTest().then('it should display every status, in the EDeclaredActivityStatus order', () => {
      expect(getOptionValues()).toEqual(Object.values(EDeclaredActivityStatus))
    })

    BddTest().then('it should translate the status labels', () => {
      expect(getSelect().props('options')).toContainEqual({
        value: EDeclaredActivityStatus.SUBMITTED_FOR_FEEDBACK,
        label: SUBMITTED_FOR_FEEDBACK_LABEL,
      })
    })
  })

  BddTest().when('the component is mounted with a subset of statuses', () => {
    beforeEach(() => {
      mountWith({
        statuses: [EDeclaredActivityStatus.SUBMITTED_FOR_FEEDBACK, EDeclaredActivityStatus.SUBSCRIBED],
        modelValue: [EDeclaredActivityStatus.UNSUBSCRIBED],
      })
    })

    BddTest().then('it should only display the given statuses, in the EDeclaredActivityStatus order', () => {
      expect(getOptionValues()).toEqual([EDeclaredActivityStatus.SUBSCRIBED, EDeclaredActivityStatus.SUBMITTED_FOR_FEEDBACK])
    })

    BddTest().then('it should not select a status that is not displayed', () => {
      expect(getSelect().props('modelValue')).toEqual([])
    })
  })

  BddTest().when('the component is mounted with an empty statuses list', () => {
    beforeEach(() => {
      mountWith({
        statuses: []
      })
    })

    BddTest().then('it should display every status', () => {
      expect(getOptionValues()).toEqual(Object.values(EDeclaredActivityStatus))
    })
  })

  SELECTION_CASES.forEach(({ description, modelValue }) => {
    BddTest().when(`the model value is ${description}`, () => {
      beforeEach(() => {
        mountWith({ modelValue })
      })

      BddTest().then('it should select the matching options in AvSelect', () => {
        expect(getSelect().props('modelValue')).toMatchObject(toAvSelectModelValue(modelValue))
      })
    })

    BddTest().when(`AvSelect emits ${description}`, () => {
      beforeEach(async () => {
        mountWith()
        getSelect().vm.$emit('update:modelValue', toAvSelectModelValue(modelValue))
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should emit the matching statuses', () => {
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([modelValue])
      })
    })
  })

  BddTest().when('AvSelect clears the selection', () => {
    beforeEach(async () => {
      mountWith({
        modelValue: [EDeclaredActivityStatus.SUBSCRIBED]
      })
      getSelect().vm.$emit('update:modelValue', null)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit an empty list of statuses', () => {
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[]])
    })
  })
})
