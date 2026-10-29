import type { AvSelectOption } from '@avenirs-esr/avenirs-dsav'
import type { VueWrapper } from '@vue/test-utils'
import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { EActivityThematic } from '@/api/avenir-esr'
import ActivityThematicSelect from '@/common/activities/inputs/ActivityThematicSelect/ActivityThematicSelect.vue'

const LABEL = 'Thématique'
const PLACEHOLDER_MULTIPLE = 'Sélectionner une/des thématique(s)'
const PLACEHOLDER_SINGLE = 'Sélectionner une thématique'
const TRANSVERSAL_LABEL = 'Transverse'

type MountProps = InstanceType<typeof ActivityThematicSelect>['$props']

const SELECTION_CASES: Array<{ description: string } & MountProps> = [
  {
    description: 'a single thematic',
    modelValue: EActivityThematic.SELF_KNOWLEDGE,
  },
  {
    description: 'several thematics in multiple mode',
    multiple: true,
    modelValue: [EActivityThematic.SELF_KNOWLEDGE, EActivityThematic.FUTURE_PLANS],
  },
]

BddTest().given('an activity thematic select component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityThematicSelect>>

  const stubs = {
    AvSelect: AvSelectStub
  }

  const mountWith = (props: MountProps = {}) => {
    wrapper = mount(ActivityThematicSelect, {
      props,
      global: { stubs }
    })
  }

  const getSelect = () => wrapper.findComponent(AvSelectStub)
  const getOptionValues = () => (getSelect().props('options') as AvSelectOption[]).map(option => option.value)

  const toAvSelectModelValue = (selection: MountProps['modelValue']) => Array.isArray(selection)
    ? selection.map(value => ({ value }))
    : { value: selection }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should configure AvSelect', () => {
      expect(getSelect().props()).toMatchObject({
        label: LABEL,
        placeholder: PLACEHOLDER_SINGLE,
      })
    })

    BddTest().then('it should display every thematic, in the EActivityThematic order', () => {
      expect(getOptionValues()).toEqual(Object.values(EActivityThematic))
    })

    BddTest().then('it should translate the thematic labels', () => {
      expect(getSelect().props('options')).toContainEqual({
        value: EActivityThematic.TRANSVERSAL,
        label: TRANSVERSAL_LABEL,
      })
    })
  })

  BddTest().when('the component is mounted in multiple mode', () => {
    beforeEach(() => {
      mountWith({
        multiple: true
      })
    })

    BddTest().then('it should display the multiple selection placeholder', () => {
      expect(getSelect().props('placeholder')).toBe(PLACEHOLDER_MULTIPLE)
    })
  })

  BddTest().when('the component is mounted with a subset of thematics', () => {
    beforeEach(() => {
      mountWith({
        thematics: [EActivityThematic.TRANSVERSAL, EActivityThematic.SELF_KNOWLEDGE],
        modelValue: EActivityThematic.FUTURE_PLANS,
      })
    })

    BddTest().then('it should only display the given thematics, in the EActivityThematic order', () => {
      expect(getOptionValues()).toEqual([EActivityThematic.SELF_KNOWLEDGE, EActivityThematic.TRANSVERSAL])
    })

    BddTest().then('it should not select a thematic that is not displayed', () => {
      expect(getSelect().props('modelValue')).toBeNull()
    })
  })

  BddTest().when('the component is mounted with an empty thematics list', () => {
    beforeEach(() => {
      mountWith({
        thematics: []
      })
    })

    BddTest().then('it should display every thematic', () => {
      expect(getOptionValues()).toEqual(Object.values(EActivityThematic))
    })
  })

  SELECTION_CASES.forEach(({ description, modelValue, ...props }) => {
    BddTest().when(`the model value is ${description}`, () => {
      beforeEach(() => {
        mountWith({
          ...props,
          modelValue
        })
      })

      BddTest().then('it should select the matching options in AvSelect', () => {
        expect(getSelect().props('modelValue')).toMatchObject(toAvSelectModelValue(modelValue))
      })
    })

    BddTest().when(`AvSelect emits ${description}`, () => {
      beforeEach(async () => {
        mountWith(props)
        getSelect().vm.$emit('update:modelValue', toAvSelectModelValue(modelValue))
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should emit the matching thematics', () => {
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([modelValue])
      })
    })
  })

  BddTest().when('AvSelect clears the selection', () => {
    beforeEach(async () => {
      mountWith({
        modelValue: EActivityThematic.SELF_KNOWLEDGE
      })
      getSelect().vm.$emit('update:modelValue', null)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit an undefined model value', () => {
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([undefined])
    })
  })
})
