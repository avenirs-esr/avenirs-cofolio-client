import type { StoryFn } from '@storybook/vue3'
import AvSelect, { type AvSelectProps } from '@/ui/interaction/selects/AvSelect/AvSelect.vue'

/**
 * <h1 class="n1">Drop-down list - <code>AvSelect</code></h1>
 *
 * <h2 class="n2">🌟 Introduction</h2>
 *
 * <p>
 *   <span class="b2-regular">
 *     The <code>AvSelect</code> is a component implementing the VueDSFR <code>DsfrSelect</code>. It is a Vue component enabling a user to select an item from a given list.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     The drop-down list provides a list of options from which the user can choose. Only the visible part of the component is stylized:
 *     the drop-down list of options retains the browser style.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     🏅 Documentation on the <code>DsfrSelect</code> can be found at
 *     <a href="https://vue-ds.fr/composants/DsfrSelect" target="_blank" rel="noopener noreferrer">VueDSFR</a>
 *   </span>
 * </p>
 *
 * <h2 class="n2">📐 Structure</h2>
 *
 * <p><span class="b2-regular"><code>AvSelect</code> consists of a set of <code>&lt;option&gt;</code> within a <code>&lt;select&gt;</code>.</span></p>
 */
const meta = {
  title: 'Components/Interaction/Selects/AvSelect',
  component: AvSelect,
  tags: ['autodocs'],
  argTypes: {
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    selectId: { control: 'text' },
    name: { control: 'text' },
    hint: { control: 'text' },
    modelValue: { control: 'text' },
    label: { control: 'text' },
    options: {
      type: { name: '{value: string | number | null | undefined, text: string, disabled?: boolean}[]', required: true },
      control: false,
    },
    successMessage: { control: 'text' },
    errorMessage: { control: 'text' },
    defaultUnselectedText: { control: 'text', required: true },
  },
  args: {
    options: [
      { value: '1', text: 'Choice 1' },
      { value: '2', text: 'Choice 2' },
      { value: '3', text: 'Choice 3' },
      { value: '4', text: 'Choice 4' },
      { value: '5', text: 'Choice 5' },
    ],
    defaultUnselectedText: 'Placeholder',
    required: false,
    disabled: false,
    selectId: 'selectId',
    name: 'select',
    hint: '',
    modelValue: '',
    label: '',
    successMessage: '',
    errorMessage: '',
  },
}

export default meta

const Template: StoryFn<AvSelectProps> = args => ({
  components: { AvSelect },
  setup () {
    return { args }
  },
  template: `<AvSelect v-bind="args" v-model="args.modelValue" />`,
})

export const Default = Template.bind({})
Default.args = {}
